export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { artist, track } = await req.json();

    if (!artist || !track) {
      throw new Error('Artist and track name are required');
    }

    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    // Get access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const { access_token } = await tokenResponse.json();

    // Search for track
    const searchQuery = encodeURIComponent(`artist:${artist} track:${track}`);
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search Spotify');
    }

    const searchData = await searchResponse.json();
    const tracks = searchData.tracks?.items || [];

    if (tracks.length === 0) {
      return new Response(
        JSON.stringify({ found: false, message: 'No tracks found' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Return the best match (first result)
    const bestMatch = tracks[0];
    
    return new Response(
      JSON.stringify({
        found: true,
        trackId: bestMatch.id,
        trackUrl: bestMatch.external_urls.spotify,
        trackName: bestMatch.name,
        artistName: bestMatch.artists.map((a: { name: string }) => a.name).join(', '),
        albumName: bestMatch.album.name,
        previewUrl: bestMatch.preview_url,
        allMatches: tracks.map((t: { id: string; name: string; artists: { name: string }[]; external_urls: { spotify: string } }) => ({
          id: t.id,
          name: t.name,
          artist: t.artists.map((a) => a.name).join(', '),
          url: t.external_urls.spotify
        }))
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
