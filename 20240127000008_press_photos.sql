-- Create press_photos table
CREATE TABLE IF NOT EXISTS press_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  high_res_url TEXT,
  photographer TEXT,
  date_taken TEXT,
  is_featured BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE press_photos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON press_photos FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can insert" ON press_photos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON press_photos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON press_photos FOR DELETE TO authenticated USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_press_photos_category ON press_photos(category);
CREATE INDEX IF NOT EXISTS idx_press_photos_featured ON press_photos(is_featured);
CREATE INDEX IF NOT EXISTS idx_press_photos_sort_order ON press_photos(sort_order);
