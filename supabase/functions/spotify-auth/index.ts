const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Simple URL encoding helper
function buildQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const redirectUri = body.redirectUri || 'https://terrygolden.com/art-of-rave';
    
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    if (!clientId) {
      return new Response(
        JSON.stringify({ error: 'SPOTIFY_CLIENT_ID not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const scopes = 'playlist-modify-public playlist-modify-private user-read-email';

    // Build query string using helper function
    const queryString = buildQueryString({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopes,
      show_dialog: 'false'
    });

    const authUrl = `https://accounts.spotify.com/authorize?${queryString}`;

    return new Response(
      JSON.stringify({ authUrl }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
