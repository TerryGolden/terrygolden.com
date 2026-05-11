export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get("SPOTIFY_CLIENT_ID");
    const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");
    
    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ error: 'Spotify credentials not configured' }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    // Get Spotify token
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + globalThis.btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    });

    const { access_token } = await tokenRes.json();

    // Terry Golden's Spotify artist ID
    const artistId = '0yoxuOLsU1fPmUb1KIjGU9';
    
    // Fetch albums
    let allItems: any[] = [];
    let url: string | null = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=50`;
    
    while (url) {
      const res = await fetch(url, {
        headers: { 'Authorization': 'Bearer ' + access_token }
      });
      const data = await res.json();
      allItems = allItems.concat(data.items);
      url = data.next;
    }

    // Filter and format
    const releases = allItems
      .filter((item: any) => {
        const year = new Date(item.release_date).getFullYear();
        return year >= 2024;
      })
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        releaseDate: item.release_date,
        image: item.images[0]?.url || '',
        type: item.album_type,
        spotifyUrl: item.external_urls.spotify,
        totalTracks: item.total_tracks
      }))
      .sort((a: any, b: any) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

    return new Response(JSON.stringify({ releases }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
