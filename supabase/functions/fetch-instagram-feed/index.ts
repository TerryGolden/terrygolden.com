export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { forceRefresh } = await req.json().catch(() => ({ forceRefresh: false }));
    
    const accessToken = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
    const businessAccountId = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!accessToken || !businessAccountId) {
      console.log("Instagram credentials not configured");
      return new Response(JSON.stringify({ 
        error: "Instagram not configured",
        configured: false,
        data: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log("Instagram credentials found, checking cache...");

    // Check cache metadata using REST API
    let cacheValid = false;
    let cacheAge = 999;
    
    try {
      const metadataResponse = await fetch(
        `${supabaseUrl}/rest/v1/instagram_cache_metadata?select=*&order=last_fetched_at.desc&limit=1`,
        {
          headers: {
            'apikey': supabaseKey!,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );
      
      if (metadataResponse.ok) {
        const metadataArray = await metadataResponse.json();
        const metadata = metadataArray && metadataArray.length > 0 ? metadataArray[0] : null;

        if (metadata) {
          const now = new Date();
          cacheAge = (now.getTime() - new Date(metadata.last_fetched_at).getTime()) / 1000 / 60;
          cacheValid = cacheAge < 30 && !forceRefresh;
          console.log(`Cache age: ${cacheAge} minutes, valid: ${cacheValid}`);
        }
      }
    } catch (cacheError) {
      console.log("Cache check failed:", cacheError);
    }

    // Return cached data if valid
    if (cacheValid) {
      try {
        const cachedResponse = await fetch(
          `${supabaseUrl}/rest/v1/instagram_posts_cache?select=*&order=timestamp.desc`,
          {
            headers: {
              'apikey': supabaseKey!,
              'Authorization': `Bearer ${supabaseKey}`
            }
          }
        );
        
        if (cachedResponse.ok) {
          const cachedPosts = await cachedResponse.json();
          
          if (cachedPosts && cachedPosts.length > 0) {
            console.log(`Returning ${cachedPosts.length} cached posts`);
            return new Response(JSON.stringify({ 
              data: cachedPosts,
              configured: true,
              cached: true,
              cacheAge: Math.round(cacheAge)
            }), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }
        }
      } catch (cacheError) {
        console.log("Cache fetch failed:", cacheError);
      }
    }

    console.log("Fetching from Instagram API...");

    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    let apiData = null;
    let apiError = null;

    // Try Facebook Graph API (for Business accounts)
    const facebookGraphUrl = `https://graph.facebook.com/v18.0/${businessAccountId}/media?fields=${fields}&access_token=${accessToken}&limit=12`;
    
    try {
      const fbResponse = await fetch(facebookGraphUrl);
      const fbData = await fbResponse.json();
      
      if (fbResponse.ok && fbData.data && fbData.data.length > 0) {
        console.log(`Facebook Graph API success: ${fbData.data.length} posts`);
        apiData = fbData;
      } else if (fbData.error) {
        console.log("Facebook Graph API error:", fbData.error.message);
        apiError = fbData.error;
      }
    } catch (fbErr) {
      console.log("Facebook Graph API fetch error:", fbErr);
    }

    // Fallback to Instagram Basic Display API
    if (!apiData) {
      const basicDisplayUrl = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${accessToken}&limit=12`;
      
      try {
        const basicResponse = await fetch(basicDisplayUrl);
        const basicData = await basicResponse.json();
        
        if (basicResponse.ok && basicData.data && basicData.data.length > 0) {
          console.log(`Basic Display API success: ${basicData.data.length} posts`);
          apiData = basicData;
        } else if (basicData.error) {
          console.log("Basic Display API error:", basicData.error.message);
          apiError = basicData.error;
        }
      } catch (basicErr) {
        console.log("Basic Display API fetch error:", basicErr);
      }
    }

    // Try with account ID directly
    if (!apiData) {
      const directUrl = `https://graph.instagram.com/${businessAccountId}/media?fields=${fields}&access_token=${accessToken}&limit=12`;
      
      try {
        const directResponse = await fetch(directUrl);
        const directData = await directResponse.json();
        
        if (directResponse.ok && directData.data && directData.data.length > 0) {
          console.log(`Direct API success: ${directData.data.length} posts`);
          apiData = directData;
        } else if (directData.error) {
          console.log("Direct API error:", directData.error.message);
          apiError = directData.error;
        }
      } catch (directErr) {
        console.log("Direct API fetch error:", directErr);
      }
    }

    if (!apiData || !apiData.data || apiData.data.length === 0) {
      console.log("All Instagram API attempts failed");
      
      const errorMessage = apiError?.message || "Unknown error";
      const isTokenError = errorMessage.toLowerCase().includes('token') || 
                          errorMessage.toLowerCase().includes('expired') ||
                          errorMessage.toLowerCase().includes('invalid') ||
                          apiError?.code === 190;
      
      return new Response(JSON.stringify({ 
        error: isTokenError ? "Instagram token may be expired" : "Instagram API unavailable",
        errorDetails: apiError?.message || "Could not fetch posts",
        configured: true,
        tokenExpired: isTokenError,
        data: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log(`Successfully fetched ${apiData.data.length} posts from Instagram`);

    // Update cache
    try {
      await fetch(
        `${supabaseUrl}/rest/v1/instagram_posts_cache?id=neq.`,
        {
          method: 'DELETE',
          headers: {
            'apikey': supabaseKey!,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      interface InstagramPost {
        id: string;
        caption?: string;
        media_type: string;
        media_url: string;
        permalink: string;
        thumbnail_url?: string;
        timestamp: string;
      }

      const postsToInsert = apiData.data.map((post: InstagramPost) => ({
        id: post.id,
        caption: post.caption || '',
        media_type: post.media_type,
        media_url: post.media_url,
        permalink: post.permalink,
        thumbnail_url: post.thumbnail_url,
        timestamp: post.timestamp
      }));

      await fetch(`${supabaseUrl}/rest/v1/instagram_posts_cache`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(postsToInsert)
      });

      const now = new Date();
      await fetch(`${supabaseUrl}/rest/v1/instagram_cache_metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: 1,
          last_fetched_at: now.toISOString(),
          post_count: apiData.data.length
        })
      });
      
      console.log("Cache updated successfully");
    } catch (cacheUpdateError) {
      console.log("Cache update failed:", cacheUpdateError);
    }

    return new Response(JSON.stringify({ 
      data: apiData.data,
      configured: true,
      cached: false,
      refreshed: true
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ 
      error: "Service temporarily unavailable",
      configured: false,
      data: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
