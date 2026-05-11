export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const formatTimestamp = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { limit = 50, saveToDb = true, importTracklists = true } = await req.json().catch(() => ({}));
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Fetch cloudcasts list
    const mixcloudUrl = `https://api.mixcloud.com/DJTerryGolden/cloudcasts/?limit=${limit}`;
    const response = await fetch(mixcloudUrl);
    
    if (!response.ok) {
      throw new Error(`Mixcloud API error: ${response.status}`);
    }
    
    const data = await response.json();
    const episodes = data.data || [];
    
    let savedCount = 0;
    let updatedCount = 0;
    let tracklistsImported = 0;
    let errors: string[] = [];
    
    for (const ep of episodes) {
      try {
        // Fetch detailed episode data with sections
        const detailUrl = `https://api.mixcloud.com${ep.key}`;
        const detailRes = await fetch(detailUrl);
        const detailData = detailRes.ok ? await detailRes.json() : ep;
        
        const episodeData = {
          mixcloud_key: ep.key,
          name: ep.name,
          slug: ep.slug,
          url: ep.url,
          created_time: ep.created_time,
          updated_time: ep.updated_time,
          play_count: ep.play_count || 0,
          favorite_count: ep.favorite_count || 0,
          comment_count: ep.comment_count || 0,
          audio_length: ep.audio_length || 0,
          cover_art_url: ep.pictures?.medium || ep.pictures?.large || '',
          cover_art_large_url: ep.pictures?.['640wx640h'] || ep.pictures?.large || '',
          description: detailData.description || ep.description || '',
          tracklist: JSON.stringify(detailData.sections || []),
          tags: JSON.stringify(ep.tags || [])
        };
        
        if (!saveToDb) continue;
        
        // Check if episode exists
        const checkRes = await fetch(
          `${supabaseUrl}/rest/v1/art_of_rave_episodes?mixcloud_key=eq.${encodeURIComponent(episodeData.mixcloud_key)}&select=id`,
          { headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` } }
        );
        
        const existing = await checkRes.json();
        let episodeId: string | null = null;
        
        if (existing && existing.length > 0) {
          episodeId = existing[0].id;
          await fetch(
            `${supabaseUrl}/rest/v1/art_of_rave_episodes?mixcloud_key=eq.${encodeURIComponent(episodeData.mixcloud_key)}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` },
              body: JSON.stringify(episodeData)
            }
          );
          updatedCount++;
        } else {
          const insertRes = await fetch(`${supabaseUrl}/rest/v1/art_of_rave_episodes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=representation' },
            body: JSON.stringify(episodeData)
          });
          
          if (insertRes.ok) {
            const inserted = await insertRes.json();
            episodeId = inserted[0]?.id;
            savedCount++;
          }
        }
        
        // Import tracklists if enabled and episode has sections
        if (importTracklists && episodeId && detailData.sections?.length > 0) {
          // Check for existing tracklist
          const tracklistCheck = await fetch(
            `${supabaseUrl}/rest/v1/episode_tracklists?episode_id=eq.${episodeId}&select=id&limit=1`,
            { headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` } }
          );
          const existingTracks = await tracklistCheck.json();
          
          // Only import if no existing tracklist
          if (!existingTracks || existingTracks.length === 0) {
            const tracks = detailData.sections
              .filter((s: any) => s.section_type === 'track' && s.track)
              .map((s: any, idx: number) => ({
                episode_id: episodeId,
                position: s.position || idx + 1,
                track_name: s.track?.name || 'Unknown Track',
                artist_name: s.track?.artist?.name || 'Unknown Artist',
                timestamp_seconds: s.start_time || 0,
                timestamp_display: formatTimestamp(s.start_time || 0),
                source: 'mixcloud'
              }));
            
            if (tracks.length > 0) {
              const insertTracksRes = await fetch(`${supabaseUrl}/rest/v1/episode_tracklists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` },
                body: JSON.stringify(tracks)
              });
              
              if (insertTracksRes.ok || insertTracksRes.status === 201) {
                tracklistsImported++;
              }
            }
          }
        }
      } catch (err) {
        errors.push(`${ep.name}: ${err.message}`);
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      count: episodes.length,
      savedCount,
      updatedCount,
      tracklistsImported,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
