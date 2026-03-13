-- Create storage bucket for radio artwork
INSERT INTO storage.buckets (id, name, public)
VALUES ('radio-artwork', 'radio-artwork', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY IF NOT EXISTS "Public read radio artwork"
ON storage.objects FOR SELECT
USING (bucket_id = 'radio-artwork');

-- Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Authenticated upload radio artwork"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'radio-artwork' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY IF NOT EXISTS "Authenticated update radio artwork"
ON storage.objects FOR UPDATE
USING (bucket_id = 'radio-artwork' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY IF NOT EXISTS "Authenticated delete radio artwork"
ON storage.objects FOR DELETE
USING (bucket_id = 'radio-artwork' AND auth.role() = 'authenticated');
