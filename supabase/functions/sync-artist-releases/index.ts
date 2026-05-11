import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

async function getSpotifyToken(): Promise<string> {
  const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')!;
  const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')!;
  const credentials = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  const data = await response.json();
  return data.access_token;
}

async function getArtistAlbums(artistId: string, token: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  return response.json();
}

async function getArtistInfo(artistId: string, token: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  return response.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { artistId, syncAll } = await req.json();
    const token = await getSpotifyToken();
    
    let artists: any[] = [];
    
    if (artistId) {
      // Sync single artist or add new one
      const artistInfo = await getArtistInfo(artistId, token);
      if (artistInfo.error) {
        return new Response(JSON.stringify({ error: 'Artist not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Upsert artist
      const { data: upserted } = await supabase.from('monitored_artists').upsert({
        spotify_id: artistId,
        name: artistInfo.name,
        image_url: artistInfo.images?.[0]?.url,
        genres: artistInfo.genres,
        followers: artistInfo.followers?.total,
        updated_at: new Date().toISOString()
      }, { onConflict: 'spotify_id' }).select().single();
      
      artists = [{ spotify_id: artistId, name: artistInfo.name }];
    } else if (syncAll) {
      const { data } = await supabase.from('monitored_artists').select('*').eq('is_active', true);
      artists = data || [];
    }

    let newReleases = 0;
    const results: any[] = [];

    for (const artist of artists) {
      const albums = await getArtistAlbums(artist.spotify_id, token);
      
      for (const album of albums.items || []) {
        const { data: existing } = await supabase
          .from('releases')
          .select('id')
          .eq('spotify_id', album.id)
          .single();

        if (!existing) {
          await supabase.from('releases').insert({
            title: album.name,
            artist: album.artists.map((a: any) => a.name).join(', '),
            artwork_url: album.images?.[0]?.url,
            release_date: album.release_date,
            spotify_url: album.external_urls?.spotify,
            spotify_id: album.id,
            album_type: album.album_type,
            total_tracks: album.total_tracks
          });
          newReleases++;
        }
      }
      
      await supabase.from('monitored_artists')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('spotify_id', artist.spotify_id);
      
      results.push({ artist: artist.name, albumsChecked: albums.items?.length || 0 });
    }

    return new Response(JSON.stringify({
      success: true,
      artistsSynced: artists.length,
      newReleasesAdded: newReleases,
      results
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
