export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("DROPBOX_ACCESS_TOKEN");
    if (!accessToken) {
      throw new Error("DROPBOX_ACCESS_TOKEN not configured");
    }

    const { sharedUrl } = await req.json();
    const url = sharedUrl || "https://www.dropbox.com/scl/fo/9mvcraiygd1jrx03e90dc/APq-pc8EfBnXlS3z5w2ku2M?rlkey=snxswbmg6aeb3rqobr7gfjvev&st=ypwxhzbk&dl=0";

    // List files in the shared folder
    const listResponse = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: "",
        recursive: true,
        shared_link: {
          url: url
        }
      })
    });

    if (!listResponse.ok) {
      const error = await listResponse.text();
      throw new Error(`Dropbox API error: ${error}`);
    }

    const listData = await listResponse.json();
    
    // Group files by folder (episode)
    const episodes = new Map();
    
    for (const entry of listData.entries) {
      if (entry['.tag'] !== 'file') continue;
      
      const pathParts = entry.path_display.split('/').filter((p: string) => p);
      if (pathParts.length < 2) continue;
      
      const episodeFolder = pathParts[0];
      
      if (!episodes.has(episodeFolder)) {
        episodes.set(episodeFolder, {
          folder: episodeFolder,
          files: []
        });
      }
      
      episodes.get(episodeFolder).files.push({
        name: entry.name,
        path: entry.path_display,
        size: entry.size,
        id: entry.id
      });
    }

    const result = {
      success: true,
      totalFiles: listData.entries.length,
      episodes: Array.from(episodes.values()),
      message: `Found ${episodes.size} episode folders with ${listData.entries.length} total files`
    };

    return new Response(JSON.stringify(result), {
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
