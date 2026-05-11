import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const dropboxToken = Deno.env.get("DROPBOX_ACCESS_TOKEN");
    if (!dropboxToken) {
      throw new Error("DROPBOX_ACCESS_TOKEN not configured");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { sharedUrl } = await req.json();
    const url = sharedUrl || "https://www.dropbox.com/scl/fo/9mvcraiygd1jrx03e90dc/APq-pc8EfBnXlS3z5w2ku2M?rlkey=snxswbmg6aeb3rqobr7gfjvev&st=ypwxhzbk&dl=0";

    // List files
    const listResponse = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dropboxToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: "",
        recursive: true,
        shared_link: { url }
      })
    });

    if (!listResponse.ok) {
      const error = await listResponse.text();
      throw new Error(`Dropbox API error: ${error}`);
    }

    const listData = await listResponse.json();
    
    // Group files by episode folder
    const episodeFolders = new Map();
    
    for (const entry of listData.entries) {
      if (entry['.tag'] !== 'file') continue;
      
      const pathParts = entry.path_display.split('/').filter((p: string) => p);
      if (pathParts.length < 2) continue;
      
      const folder = pathParts[0];
      if (!episodeFolders.has(folder)) {
        episodeFolders.set(folder, { folder, files: [] });
      }
      
      episodeFolders.get(folder).files.push({
        name: entry.name.toLowerCase(),
        path: entry.path_display,
        size: entry.size
      });
    }

    const processed: string[] = [];
    const errors: string[] = [];

    // Process each episode
    for (const [folderName, episode] of episodeFolders) {
      try {
        // Find files
        const artworkFile = episode.files.find((f: any) => 
          f.name.includes('artwork') || f.name.includes('cover') || 
          f.name.match(/\.(jpg|jpeg|png|webp)$/i)
        );
        
        const tracklistFile = episode.files.find((f: any) => 
          f.name.includes('tracklist') || f.name.endsWith('.txt')
        );
        
        const audioFile = episode.files.find((f: any) => 
          f.name.match(/\.(mp3|wav|m4a)$/i)
        );

        if (!artworkFile && !audioFile) {
          errors.push(`${folderName}: No artwork or audio found`);
          continue;
        }

        // Extract episode number
        const epMatch = folderName.match(/(\d+)/);
        const episodeNum = epMatch ? parseInt(epMatch[1]) : Date.now();

        // Download and upload artwork
        let artworkUrl = '';
        if (artworkFile) {
          const artResponse = await fetch('https://content.dropboxapi.com/2/files/download', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${dropboxToken}`,
              'Dropbox-API-Arg': JSON.stringify({
                path: artworkFile.path,
                shared_link: { url }
              })
            }
          });

          if (artResponse.ok) {
            const artBlob = await artResponse.blob();
            const fileName = `radio-${episodeNum}-${Date.now()}.jpg`;
            const { data: uploadData } = await supabase.storage
              .from('radio-artwork')
              .upload(fileName, artBlob, { contentType: 'image/jpeg' });
            
            if (uploadData) {
              const { data: urlData } = supabase.storage
                .from('radio-artwork')
                .getPublicUrl(fileName);
              artworkUrl = urlData.publicUrl;
            }
          }
        }

        // Download tracklist
        let tracklist: string[] = [];
        if (tracklistFile) {
          const trackResponse = await fetch('https://content.dropboxapi.com/2/files/download', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${dropboxToken}`,
              'Dropbox-API-Arg': JSON.stringify({
                path: tracklistFile.path,
                shared_link: { url }
              })
            }
          });

          if (trackResponse.ok) {
            const trackText = await trackResponse.text();
            tracklist = trackText.split('\n')
              .map((line: string) => line.trim())
              .filter((line: string) => line && !line.startsWith('#'));
          }
        }

        // Create/update episode
        const episodeData = {
          title: folderName,
          episode_number: episodeNum,
          cover_image_url: artworkUrl,
          audio_url: audioFile ? audioFile.name : '',
          tracklist,
          air_date: new Date().toISOString().split('T')[0],
          description: `Radio show episode ${episodeNum}`,
          is_published: false,
          display_order: episodeNum
        };

        const { error: dbError } = await supabase
          .from('radio_episodes')
          .upsert(episodeData, { onConflict: 'episode_number' });

        if (dbError) {
          errors.push(`${folderName}: ${dbError.message}`);
        } else {
          processed.push(folderName);
        }

      } catch (err: any) {
        errors.push(`${folderName}: ${err.message}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: processed.length,
      errors: errors.length,
      processedEpisodes: processed,
      errorMessages: errors,
      message: `Processed ${processed.length} episodes, ${errors.length} errors`
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
