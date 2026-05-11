export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache'
};

// Track instance startup time to detect cold starts
const instanceStartTime = Date.now();
let requestCount = 0;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  while (i < bytes.length) {
    const a = bytes[i++];
    const b = i < bytes.length ? bytes[i++] : 0;
    const c = i < bytes.length ? bytes[i++] : 0;
    const bitmap = (a << 16) | (b << 8) | c;
    result += chars[(bitmap >> 18) & 63];
    result += chars[(bitmap >> 12) & 63];
    result += i - 2 < bytes.length ? chars[(bitmap >> 6) & 63] : '=';
    result += i - 1 < bytes.length ? chars[bitmap & 63] : '=';
  }
  return result;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  requestCount++;
  const isColdStart = requestCount === 1;
  const instanceAge = Math.round((Date.now() - instanceStartTime) / 1000);

  try {
    // Read credentials FRESH on every request
    const clientId = Deno.env.get("SPOTIFY_CLIENT_ID");
    const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");
    
    const diagnostics = {
      instanceStarted: new Date(instanceStartTime).toISOString(),
      instanceAgeSeconds: instanceAge,
      isColdStart,
      requestNumber: requestCount,
      timestamp: new Date().toISOString(),
      hasWhitespace: {
        clientId: clientId ? (clientId !== clientId.trim()) : false,
        clientSecret: clientSecret ? (clientSecret !== clientSecret.trim()) : false
      }
    };

    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'missing_credentials',
        message: 'Spotify credentials not configured in Edge Function secrets',
        details: { 
          hasClientId: !!clientId, 
          hasClientSecret: !!clientSecret,
          clientIdLength: clientId?.length || 0,
          clientSecretLength: clientSecret?.length || 0,
          expectedLength: 32
        },
        diagnostics,
        recommendations: [
          "1. Go to https://developer.spotify.com/dashboard",
          "2. Select your app or create a new one",
          "3. Copy the Client ID (should be 32 characters)",
          "4. Click 'Show client secret' and copy it (should be 32 characters)",
          "5. Make sure there are no extra spaces when pasting",
          "6. Update the secrets in Supabase Edge Functions settings"
        ]
      }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    if (clientId.includes('http') || clientId.includes('://')) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'invalid_client_id_format',
        message: 'SPOTIFY_CLIENT_ID is a URL instead of a valid Client ID. Update the secret and redeploy this function.',
        details: { clientIdPreview: clientId.substring(0, 30) + '...' },
        diagnostics
      }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    if (clientSecret.length < 10 || clientSecret === 'GET' || clientSecret === 'POST') {
      return new Response(JSON.stringify({
        valid: false,
        error: 'invalid_client_secret_format',
        message: 'SPOTIFY_CLIENT_SECRET appears invalid (too short or is an HTTP method)',
        details: { secretLength: clientSecret.length },
        diagnostics
      }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Attempt to authenticate with Spotify
    const authString = clientId.trim() + ':' + clientSecret.trim();
    const authBase64 = arrayBufferToBase64(new TextEncoder().encode(authString));
    
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authBase64
      },
      body: 'grant_type=client_credentials'
    });

    const responseText = await tokenResponse.text();
    
    if (!tokenResponse.ok) {
      let errorData;
      try { errorData = JSON.parse(responseText); } catch { errorData = { error: responseText }; }
      
      return new Response(JSON.stringify({
        valid: false,
        error: 'auth_failed',
        message: 'Spotify rejected credentials: ' + (errorData.error_description || errorData.error || 'Unknown error'),
        details: { 
          status: tokenResponse.status, 
          spotifyError: errorData.error,
          clientIdPreview: clientId.substring(0, 8) + '...'
        },
        diagnostics
      }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const tokenData = JSON.parse(responseText);
    
    return new Response(JSON.stringify({
      valid: true,
      message: 'Spotify credentials are valid and working!',
      details: {
        tokenType: tokenData.token_type,
        expiresIn: tokenData.expires_in,
        clientIdPreview: clientId.substring(0, 8) + '...',
        clientIdLength: clientId.length,
        clientSecretLength: clientSecret.length
      },
      diagnostics
    }), { headers: { "Content-Type": "application/json", ...corsHeaders } });

  } catch (error) {
    return new Response(JSON.stringify({
      valid: false,
      error: 'unexpected_error',
      message: error instanceof Error ? error.message : 'Unknown error',
      diagnostics: { 
        instanceAgeSeconds: instanceAge, 
        isColdStart, 
        requestNumber: requestCount 
      }
    }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
});
