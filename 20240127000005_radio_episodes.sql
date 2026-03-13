-- Create radio_episodes table
CREATE TABLE IF NOT EXISTS radio_episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  air_date DATE NOT NULL,
  audio_url TEXT NOT NULL,
  cover_image_url TEXT,
  episode_number INTEGER NOT NULL UNIQUE,
  tracklist TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on episode_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_radio_episodes_number ON radio_episodes(episode_number);
CREATE INDEX IF NOT EXISTS idx_radio_episodes_published ON radio_episodes(is_published);
CREATE INDEX IF NOT EXISTS idx_radio_episodes_order ON radio_episodes(display_order);

-- Enable RLS
ALTER TABLE radio_episodes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view published episodes" ON radio_episodes
  FOR SELECT USING (is_published = true);

-- Admin full access (authenticated users)
CREATE POLICY "Authenticated users full access" ON radio_episodes
  FOR ALL USING (auth.role() = 'authenticated');
