const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { soundcloud_url } = await req.json();

    if (!soundcloud_url) {
      return new Response(
        JSON.stringify({ error: 'soundcloud_url is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Use SoundCloud oEmbed API to get track metadata including thumbnail
    const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(soundcloud_url)}`;
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MusicApp/1.0)'
      }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch SoundCloud data', status: response.status }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const data = await response.json();
    
    // Extract relevant fields from oEmbed response
    const result: {
      title: string | null;
      thumbnail_url: string | null;
      thumbnail_url_large?: string;
      author_name: string | null;
      description: string | null;
    } = {
      title: data.title || null,
      thumbnail_url: data.thumbnail_url || null,
      author_name: data.author_name || null,
      description: data.description || null,
    };

    // Try to get higher resolution image by modifying the thumbnail URL
    if (result.thumbnail_url) {
      result.thumbnail_url_large = result.thumbnail_url
        .replace('-large', '-t500x500')
        .replace('-badge', '-t500x500')
        .replace('large.jpg', 't500x500.jpg');
    }

    return new Response(
      JSON.stringify(result),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
