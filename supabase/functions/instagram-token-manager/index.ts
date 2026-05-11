export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, newToken } = await req.json().catch(() => ({ action: 'check', newToken: null }));
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const appSecret = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
    const envBusinessAccountId = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID");

    console.log("=== Instagram Token Manager ===");
    console.log("Action:", action);

    // Helper: get current stored token
    const getStoredToken = async () => {
      try {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/instagram_token_store?id=eq.1&select=*`,
          {
            headers: {
              'apikey': supabaseKey!,
              'Authorization': `Bearer ${supabaseKey}`
            }
          }
        );
        if (res.ok) {
          const data = await res.json();
          return data && data.length > 0 ? data[0] : null;
        }
      } catch (e) {
        console.log("Error fetching stored token:", e);
      }
      return null;
    };

    // Helper: save token to store
    const saveToken = async (token: string, expiresAt: string | null, accountId: string | null, username: string | null, tokenType: string) => {
      const body = {
        id: 1,
        access_token: token,
        token_type: tokenType,
        expires_at: expiresAt,
        last_refreshed_at: new Date().toISOString(),
        account_username: username || 'terrygoldenmusic',
        account_id: accountId || envBusinessAccountId || '',
        is_valid: true,
        updated_at: new Date().toISOString()
      };

      const res = await fetch(`${supabaseUrl}/rest/v1/instagram_token_store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(body)
      });

      return res.ok;
    };

    // Helper: validate a token against Instagram API
    const validateToken = async (token: string) => {
      try {
        const debugRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`);
        const debugData = await debugRes.json();
        
        if (debugData.data) {
          return {
            valid: debugData.data.is_valid !== false,
            expiresAt: debugData.data.expires_at ? new Date(debugData.data.expires_at * 1000).toISOString() : null,
            scopes: debugData.data.scopes || [],
            appId: debugData.data.app_id,
            type: debugData.data.type,
            error: null
          };
        }
        
        if (debugData.error) {
          return { valid: false, error: debugData.error.message, expiresAt: null, scopes: [], appId: null, type: null };
        }
      } catch (e) {
        console.log("Debug token check failed:", e);
      }

      // Fallback: try to fetch account info
      try {
        const accountId = envBusinessAccountId;
        if (accountId) {
          const res = await fetch(`https://graph.facebook.com/v18.0/${accountId}?fields=id,username&access_token=${token}`);
          const data = await res.json();
          if (data.username) {
            return { valid: true, expiresAt: null, scopes: [], appId: null, type: 'user', username: data.username, error: null };
          }
          if (data.error) {
            return { valid: false, error: data.error.message, expiresAt: null, scopes: [], appId: null, type: null };
          }
        }
      } catch (e) {
        console.log("Account fetch check failed:", e);
      }

      return { valid: false, error: 'Could not validate token', expiresAt: null, scopes: [], appId: null, type: null };
    };

    // Helper: get account info
    const getAccountInfo = async (token: string) => {
      const accountId = envBusinessAccountId;
      if (!accountId) return null;
      
      try {
        const res = await fetch(`https://graph.facebook.com/v18.0/${accountId}?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${token}`);
        const data = await res.json();
        if (!data.error) return data;
      } catch (e) {
        console.log("Account info fetch failed:", e);
      }
      return null;
    };

    // ACTION: check - Check current token status
    if (action === 'check') {
      const stored = await getStoredToken();
      const tokenToCheck = stored?.access_token || appSecret;
      
      if (!tokenToCheck) {
        return new Response(JSON.stringify({
          status: 'no_token',
          message: 'No Instagram access token configured',
          stored: null,
          envConfigured: !!appSecret
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const validation = await validateToken(tokenToCheck);
      const accountInfo = validation.valid ? await getAccountInfo(tokenToCheck) : null;

      let daysUntilExpiry = null;
      if (validation.expiresAt) {
        const expiresDate = new Date(validation.expiresAt);
        daysUntilExpiry = Math.floor((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      }

      return new Response(JSON.stringify({
        status: validation.valid ? 'valid' : 'expired',
        message: validation.valid 
          ? `Token is valid${daysUntilExpiry !== null ? ` (expires in ${daysUntilExpiry} days)` : ''}`
          : `Token is invalid: ${validation.error}`,
        tokenSource: stored?.access_token ? 'database' : 'environment',
        validation,
        accountInfo,
        daysUntilExpiry,
        stored: stored ? {
          lastRefreshed: stored.last_refreshed_at,
          expiresAt: stored.expires_at,
          username: stored.account_username,
          isValid: stored.is_valid
        } : null,
        envConfigured: !!appSecret
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // ACTION: refresh - Try to refresh the current long-lived token
    if (action === 'refresh') {
      const stored = await getStoredToken();
      const tokenToRefresh = stored?.access_token || appSecret;

      if (!tokenToRefresh) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No token available to refresh'
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      console.log("Attempting to refresh long-lived token...");

      const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${tokenToRefresh}`;
      
      try {
        const refreshRes = await fetch(refreshUrl);
        const refreshData = await refreshRes.json();

        if (refreshData.access_token) {
          console.log("Token refreshed successfully!");
          
          const expiresAt = refreshData.expires_in 
            ? new Date(Date.now() + refreshData.expires_in * 1000).toISOString()
            : null;

          await saveToken(refreshData.access_token, expiresAt, envBusinessAccountId || null, 'terrygoldenmusic', 'long_lived');

          const accountInfo = await getAccountInfo(refreshData.access_token);

          return new Response(JSON.stringify({
            success: true,
            message: 'Token refreshed successfully! New token saved to database.',
            newExpiresAt: expiresAt,
            expiresIn: refreshData.expires_in,
            daysUntilExpiry: refreshData.expires_in ? Math.floor(refreshData.expires_in / 86400) : null,
            accountInfo,
            tokenType: refreshData.token_type || 'bearer'
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        if (refreshData.error) {
          console.log("Refresh failed:", refreshData.error);
          return new Response(JSON.stringify({
            success: false,
            error: refreshData.error.message || 'Token refresh failed',
            errorType: refreshData.error.type,
            errorCode: refreshData.error.code,
            hint: 'The token may be too old to refresh. You need to generate a new token from the Meta Developer Portal.'
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
      } catch (e) {
        console.log("Refresh request failed:", e);
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'Could not refresh the token. It may have expired beyond the refresh window.',
        hint: 'Generate a new token from the Meta Developer Portal and use the "Update Token" action.'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // ACTION: update - Save a new token
    if (action === 'update' && newToken) {
      console.log("Validating and saving new token...");

      const validation = await validateToken(newToken);
      
      if (!validation.valid) {
        return new Response(JSON.stringify({
          success: false,
          error: `Token validation failed: ${validation.error}`,
          hint: 'Make sure you copied the complete token from the Meta Developer Portal.'
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      let finalToken = newToken;
      const tokenType = 'long_lived';
      const expiresAt = validation.expiresAt;

      const accountInfo = await getAccountInfo(finalToken);

      const saved = await saveToken(
        finalToken, 
        expiresAt, 
        accountInfo?.id || envBusinessAccountId || null,
        accountInfo?.username || 'terrygoldenmusic',
        tokenType
      );

      if (!saved) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to save token to database'
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const finalExpiresDate = expiresAt ? new Date(expiresAt) : null;
      const finalDaysUntilExpiry = finalExpiresDate ? Math.floor((finalExpiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

      return new Response(JSON.stringify({
        success: true,
        message: 'New token validated and saved successfully!',
        tokenType,
        expiresAt,
        daysUntilExpiry: finalDaysUntilExpiry,
        accountInfo: accountInfo ? {
          username: accountInfo.username,
          name: accountInfo.name,
          followers: accountInfo.followers_count,
          posts: accountInfo.media_count
        } : null,
        hint: 'The Instagram feed will now use this new token.'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      error: 'Invalid action. Use: check, refresh, or update',
      availableActions: ['check', 'refresh', 'update']
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error("=== UNEXPECTED ERROR ===", error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Unexpected error occurred',
      details: String(error)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
