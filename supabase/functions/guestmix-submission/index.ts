import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const instagramHandle = formData.get('instagram_handle') as string;
    const bio = formData.get('bio') as string;
    const pressPhoto = formData.get('press_photo') as File | null;
    const mixFile = formData.get('mix') as File | null;
    const voiceoverFile = formData.get('voiceover') as File | null;
    const tracklistFile = formData.get('tracklist') as File | null;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Generate unique folder for this submission
    const submissionId = crypto.randomUUID();
    const folderPath = `submissions/${submissionId}`;

    let pressPhotoUrl = null;
    let mixUrl = null;
    let voiceoverUrl = null;
    let tracklistUrl = null;

    // Upload press photo
    if (pressPhoto && pressPhoto.size > 0) {
      const ext = pressPhoto.name.split('.').pop();
      const path = `${folderPath}/press_photo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('guestmix-submissions')
        .upload(path, pressPhoto, { contentType: pressPhoto.type });
      
      if (!uploadError) {
        pressPhotoUrl = path;
      }
    }

    // Upload mix MP3
    if (mixFile && mixFile.size > 0) {
      const ext = mixFile.name.split('.').pop();
      const path = `${folderPath}/mix.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('guestmix-submissions')
        .upload(path, mixFile, { contentType: mixFile.type });
      
      if (!uploadError) {
        mixUrl = path;
      }
    }

    // Upload voiceover
    if (voiceoverFile && voiceoverFile.size > 0) {
      const ext = voiceoverFile.name.split('.').pop();
      const path = `${folderPath}/voiceover.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('guestmix-submissions')
        .upload(path, voiceoverFile, { contentType: voiceoverFile.type });
      
      if (!uploadError) {
        voiceoverUrl = path;
      }
    }

    // Upload tracklist
    if (tracklistFile && tracklistFile.size > 0) {
      const ext = tracklistFile.name.split('.').pop();
      const path = `${folderPath}/tracklist.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('guestmix-submissions')
        .upload(path, tracklistFile, { contentType: tracklistFile.type });
      
      if (!uploadError) {
        tracklistUrl = path;
      }
    }

    // Insert submission record
    const { data, error } = await supabase
      .from('guestmix_submissions')
      .insert({
        id: submissionId,
        name,
        email,
        instagram_handle: instagramHandle,
        bio,
        press_photo_url: pressPhotoUrl,
        mix_url: mixUrl,
        voiceover_url: voiceoverUrl,
        tracklist_url: tracklistUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save submission' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Your guest mix submission has been received! We will review it and get back to you soon.',
        submissionId: data.id 
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
