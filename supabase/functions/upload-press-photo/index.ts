export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { file, title, description, category, photographer, date } = await req.json();

    // Decode base64 image
    const base64Data = file.split(',')[1];
    const imageData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const thumbnailFilename = `thumb-${filename}`;

    // Upload full image to Supabase Storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/press-photos/${filename}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'image/jpeg',
        },
        body: imageData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    // Create thumbnail (simple resize)
    const thumbnailData = imageData; // In production, resize the image
    await fetch(
      `${supabaseUrl}/storage/v1/object/press-photos/${thumbnailFilename}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'image/jpeg',
        },
        body: thumbnailData,
      }
    );

    // Get public URLs
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/press-photos/${filename}`;
    const thumbnailUrl = `${supabaseUrl}/storage/v1/object/public/press-photos/${thumbnailFilename}`;

    // Save to database
    const dbResponse = await fetch(
      `${supabaseUrl}/rest/v1/press_photos`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          title,
          description: description || '',
          category,
          image_url: imageUrl,
          thumbnail_url: thumbnailUrl,
          high_res_url: imageUrl,
          photographer: photographer || 'Unknown',
          date_taken: date || new Date().toISOString().split('T')[0],
          is_featured: false,
          download_count: 0,
        }),
      }
    );

    const photoData = await dbResponse.json();

    return new Response(JSON.stringify({ success: true, photo: photoData }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
