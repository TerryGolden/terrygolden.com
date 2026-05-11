const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-cache, no-store, must-revalidate'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Spotify credentials not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const formBody = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token request failed',
        status: tokenResponse.status,
        details: data
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Access token obtained successfully!',
      token_type: data.token_type,
      expires_in: data.expires_in,
      access_token: data.access_token
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
