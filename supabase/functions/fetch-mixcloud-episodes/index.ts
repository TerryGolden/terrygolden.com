export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { limit = 50 } = await req.json().catch(() => ({}));
    
    // Fetch episodes from Mixcloud API
    const mixcloudUrl = `https://api.mixcloud.com/DJTerryGolden/cloudcasts/?limit=${limit}`;
    const response = await fetch(mixcloudUrl);
    
    if (!response.ok) {
      throw new Error(`Mixcloud API error: ${response.status}`);
    }
    
    const data = await response.json();
    const episodes = data.data || [];
    
    // Transform and prepare episodes for database
    const transformedEpisodes = episodes.map((episode: any) => ({
      mixcloud_key: episode.key,
      name: episode.name,
      slug: episode.slug,
      url: episode.url,
      created_time: episode.created_time,
      updated_time: episode.updated_time,
      play_count: episode.play_count || 0,
      favorite_count: episode.favorite_count || 0,
      comment_count: episode.comment_count || 0,
      audio_length: episode.audio_length || 0,
      cover_art_url: episode.pictures?.medium || episode.pictures?.large,
      cover_art_large_url: episode.pictures?.['640wx640h'] || episode.pictures?.large,
      description: episode.description || '',
      tracklist: episode.sections || [],
      tags: episode.tags || [],
      embed_html: `<iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(episode.key)}" frameborder="0"></iframe>`
    }));
    
    return new Response(JSON.stringify({ 
      success: true, 
      episodes: transformedEpisodes,
      count: transformedEpisodes.length 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
