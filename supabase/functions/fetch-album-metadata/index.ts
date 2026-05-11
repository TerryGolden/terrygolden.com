export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

function arrayBufferToBase64(buffer: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  while (i < buffer.length) {
    const a = buffer[i++];
    const b = i < buffer.length ? buffer[i++] : 0;
    const c = i < buffer.length ? buffer[i++] : 0;
    const bitmap = (a << 16) | (b << 8) | c;
    result += chars[(bitmap >> 18) & 63];
    result += chars[(bitmap >> 12) & 63];
    result += i - 2 < buffer.length ? chars[(bitmap >> 6) & 63] : '=';
    result += i - 1 < buffer.length ? chars[bitmap & 63] : '=';
  }
  return result;
}

function extractAlbumId(input: string): string | null {
  const urlMatch = input.match(/album\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];
  if (/^[a-zA-Z0-9]{22}$/.test(input)) return input;
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { spotifyUrl } = await req.json();
    
    if (!spotifyUrl) {
      throw new Error("Spotify URL is required");
    }

    const albumId = extractAlbumId(spotifyUrl);
    if (!albumId) {
      throw new Error("Invalid Spotify album URL");
    }

    const clientId = Deno.env.get("SPOTIFY_CLIENT_ID");
    const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");
    
    if (!clientId || !clientSecret) {
      throw new Error("Spotify credentials not configured");
    }

    const authBytes = new TextEncoder().encode(clientId + ':' + clientSecret);
    const authBase64 = arrayBufferToBase64(authBytes);
    
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authBase64
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to authenticate with Spotify');
    }

    const { access_token } = await tokenResponse.json();

    const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { 'Authorization': 'Bearer ' + access_token }
    });

    if (!albumResponse.ok) {
      throw new Error('Album not found');
    }

    const album = await albumResponse.json();
    
    const metadata = {
      title: album.name,
      artist: album.artists.map((a: { name: string }) => a.name).join(', '),
      release_date: album.release_date,
      artwork_url: album.images?.[0]?.url || '',
      spotify_url: album.external_urls.spotify,
      label: album.label || '',
      total_tracks: album.total_tracks,
      album_type: album.album_type
    };

    return new Response(JSON.stringify({ success: true, metadata }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
