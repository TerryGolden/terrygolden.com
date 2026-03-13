-- Create storage bucket for press photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('press-photos', 'press-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to press photos
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'press-photos');

-- Allow authenticated users to upload press photos
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'press-photos');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'press-photos');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'press-photos');
