export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    
    let fileBuffer: ArrayBuffer;
    let fileName: string;
    let mimeType: string;

    if (contentType.includes('application/json')) {
      // Handle JSON with base64 data
      const body = await req.json();
      const { base64Data, originalName, fileType } = body;

      if (!base64Data) {
        throw new Error('No file data provided');
      }

      // Decode base64
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      fileBuffer = bytes.buffer;

      const fileExt = originalName ? originalName.split('.').pop()?.toLowerCase() : 'jpg';
      fileName = `${crypto.randomUUID()}.${fileExt}`;
      mimeType = fileType || 'image/jpeg';
    } else {
      // Handle FormData (legacy support)
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        throw new Error('No file provided');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      fileName = `${crypto.randomUUID()}.${fileExt}`;
      fileBuffer = await file.arrayBuffer();
      mimeType = file.type || 'image/jpeg';
    }

    // Upload to Supabase storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Server configuration error');
    }

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/event-images/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': mimeType,
          'x-upsert': 'true',
        },
        body: fileBuffer,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Storage upload failed:', uploadResponse.status, errorText);
      throw new Error(`Storage upload failed (${uploadResponse.status}): ${errorText}`);
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/event-images/${fileName}`;

    return new Response(
      JSON.stringify({ url: publicUrl, fileName }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Upload error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
