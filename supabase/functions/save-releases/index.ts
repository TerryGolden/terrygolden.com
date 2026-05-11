export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { albums } = await req.json();
    
    console.log('Received albums to save:', JSON.stringify(albums, null, 2));
    
    if (!albums || !Array.isArray(albums) || albums.length === 0) {
      return new Response(JSON.stringify({ error: 'No albums provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const results = [];
    
    for (const album of albums) {
      // Map incoming fields to database column names
      // Handle multiple naming conventions (camelCase, snake_case, Spotify API format)
      const insertData = {
        spotify_id: album.spotify_id || album.spotifyId || album.id,
        title: album.name || album.title,
        artist: album.artist || album.artists?.[0]?.name || 'Terry Golden',
        album_type: album.album_type || album.albumType || album.type || 'album',
        release_date: album.release_date || album.releaseDate,
        artwork_url: album.image_url || album.artwork_url || album.imageUrl || album.images?.[0]?.url,
        spotify_url: album.spotify_url || album.spotifyUrl || album.external_urls?.spotify,
        label: album.label || null,
        total_tracks: album.total_tracks || album.totalTracks || 0,
        is_featured: album.is_featured || album.isFeatured || false,
        display_order: album.display_order || album.displayOrder || 0
      };

      console.log('Mapped insert data:', JSON.stringify(insertData, null, 2));

      // Check if album already exists by spotify_id
      const checkResponse = await fetch(
        `${supabaseUrl}/rest/v1/releases?spotify_id=eq.${insertData.spotify_id}&select=id`,
        {
          headers: {
            'apikey': supabaseKey!,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );
      
      const existing = await checkResponse.json();
      
      let response;
      if (existing && existing.length > 0) {
        // Update existing record
        response = await fetch(
          `${supabaseUrl}/rest/v1/releases?spotify_id=eq.${insertData.spotify_id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey!,
              'Authorization': `Bearer ${supabaseKey}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(insertData)
          }
        );
      } else {
        // Insert new record
        response = await fetch(`${supabaseUrl}/rest/v1/releases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey!,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(insertData)
        });
      }

      const data = await response.json();
      console.log('Save response:', response.ok, JSON.stringify(data));
      
      results.push({
        spotify_id: insertData.spotify_id,
        title: insertData.title,
        success: response.ok,
        error: response.ok ? null : JSON.stringify(data),
        data: response.ok ? data : null
      });
    }

    const savedCount = results.filter(r => r.success).length;

    return new Response(JSON.stringify({ 
      success: true,
      savedCount,
      totalCount: albums.length,
      results 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('Save releases error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
