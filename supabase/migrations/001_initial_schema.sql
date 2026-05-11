-- Terry Golden Website - Complete Database Schema Migration
-- Run this in your Supabase SQL Editor at: https://supabase.com/dashboard/project/ogmcctnpxgemlvulhtom/sql

-- ============================================
-- RELEASES TABLE - Music releases from Spotify
-- ============================================
CREATE TABLE IF NOT EXISTS releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Terry Golden',
  artwork_url TEXT,
  release_date DATE,
  spotify_url TEXT,
  spotify_id TEXT UNIQUE,
  album_type TEXT CHECK (album_type IN ('album', 'single', 'compilation', 'ep')),
  total_tracks INTEGER DEFAULT 1,
  label TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster Spotify ID lookups
CREATE INDEX IF NOT EXISTS idx_releases_spotify_id ON releases(spotify_id);
CREATE INDEX IF NOT EXISTS idx_releases_release_date ON releases(release_date DESC);

-- ============================================
-- MONITORED ARTISTS TABLE - Artists to track
-- ============================================
CREATE TABLE IF NOT EXISTS monitored_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT,
  genres TEXT[],
  followers INTEGER,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monitored_artists_spotify_id ON monitored_artists(spotify_id);

-- ============================================
-- RADIO STATIONS TABLE - Radio station data
-- ============================================
CREATE TABLE IF NOT EXISTS radio_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT,
  logo_url TEXT,
  description TEXT,
  country TEXT,
  city TEXT,
  timezone TEXT,
  schedule JSONB,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_radio_stations_active ON radio_stations(is_active);

-- ============================================
-- RADIO EPISODES TABLE - Radio show episodes
-- ============================================
CREATE TABLE IF NOT EXISTS radio_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  episode_number INTEGER,
  air_date DATE,
  audio_url TEXT,
  cover_image TEXT,
  duration_seconds INTEGER,
  tracklist JSONB,
  spotify_playlist_url TEXT,
  soundcloud_url TEXT,
  mixcloud_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_radio_episodes_air_date ON radio_episodes(air_date DESC);
CREATE INDEX IF NOT EXISTS idx_radio_episodes_published ON radio_episodes(is_published);

-- ============================================
-- LINK CHECK RESULTS TABLE - URL validation
-- ============================================
CREATE TABLE IF NOT EXISTS link_check_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES radio_stations(id) ON DELETE CASCADE,
  station_name TEXT,
  url TEXT,
  status TEXT CHECK (status IN ('valid', 'invalid', 'unknown')),
  status_code INTEGER,
  error_message TEXT,
  response_time_ms INTEGER,
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(station_id)
);

CREATE INDEX IF NOT EXISTS idx_link_check_results_station ON link_check_results(station_id);

-- ============================================
-- PRESS PHOTOS TABLE - Press/promo photos
-- ============================================
CREATE TABLE IF NOT EXISTS press_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('press', 'live', 'promo', 'behind-scenes', 'event')),
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  photographer TEXT,
  location TEXT,
  event_name TEXT,
  photo_date DATE,
  is_featured BOOLEAN DEFAULT false,
  is_downloadable BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_press_photos_category ON press_photos(category);
CREATE INDEX IF NOT EXISTS idx_press_photos_featured ON press_photos(is_featured);

-- ============================================
-- PRESS MENTIONS TABLE - Press/media coverage
-- ============================================
CREATE TABLE IF NOT EXISTS press_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  date TEXT,
  published_date DATE,
  excerpt TEXT,
  link TEXT UNIQUE,
  image TEXT,
  discovery_source TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_press_mentions_published ON press_mentions(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_press_mentions_source ON press_mentions(source);

-- ============================================
-- EVENTS TABLE - Upcoming and past events
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT,
  city TEXT,
  country TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  end_date DATE,
  end_time TIME,
  ticket_url TEXT,
  event_url TEXT,
  image_url TEXT,
  event_type TEXT CHECK (event_type IN ('festival', 'club', 'private', 'radio', 'livestream', 'other')),
  is_featured BOOLEAN DEFAULT false,
  is_cancelled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_upcoming ON events(event_date) WHERE event_date >= CURRENT_DATE;

-- ============================================
-- CONTACT SUBMISSIONS TABLE - Contact form
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT CHECK (inquiry_type IN ('booking', 'press', 'general', 'licensing', 'collaboration')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_check_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ POLICIES (for website visitors)
-- ============================================
CREATE POLICY "Public read access for releases" ON releases FOR SELECT USING (true);
CREATE POLICY "Public read access for radio_stations" ON radio_stations FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for radio_episodes" ON radio_episodes FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access for press_photos" ON press_photos FOR SELECT USING (true);
CREATE POLICY "Public read access for press_mentions" ON press_mentions FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);

-- Allow public to submit contact forms and newsletter signups
CREATE POLICY "Public insert for contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert for newsletter_subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON releases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monitored_artists_updated_at BEFORE UPDATE ON monitored_artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_radio_stations_updated_at BEFORE UPDATE ON radio_stations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_radio_episodes_updated_at BEFORE UPDATE ON radio_episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_press_photos_updated_at BEFORE UPDATE ON press_photos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_press_mentions_updated_at BEFORE UPDATE ON press_mentions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSTAGRAM POSTS CACHE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS instagram_posts_cache (
  id TEXT PRIMARY KEY,
  caption TEXT,
  media_type TEXT,
  media_url TEXT,
  thumbnail_url TEXT,
  permalink TEXT,
  timestamp TIMESTAMPTZ,
  like_count INTEGER,
  comments_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instagram_posts_timestamp ON instagram_posts_cache(timestamp DESC);

-- ============================================
-- INSTAGRAM CACHE METADATA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS instagram_cache_metadata (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_fetched_at TIMESTAMPTZ DEFAULT NOW(),
  post_count INTEGER DEFAULT 0
);

-- Enable RLS for Instagram tables
ALTER TABLE instagram_posts_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_cache_metadata ENABLE ROW LEVEL SECURITY;

-- Public read access for Instagram cache (website needs to display these)
CREATE POLICY "Public read access for instagram_posts_cache" ON instagram_posts_cache FOR SELECT USING (true);
CREATE POLICY "Public read access for instagram_cache_metadata" ON instagram_cache_metadata FOR SELECT USING (true);

-- ============================================
-- SAMPLE DATA (Terry Golden)
-- ============================================
INSERT INTO monitored_artists (spotify_id, name, is_active) 
VALUES ('3z97WMRi731dCvKklIf2X6', 'Terry Golden', true)
ON CONFLICT (spotify_id) DO NOTHING;

-- Success message
SELECT 'Migration completed successfully! All tables created for Terry Golden website.' as status;
