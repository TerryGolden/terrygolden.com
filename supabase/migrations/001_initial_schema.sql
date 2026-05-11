-- ============================================
-- TERRY GOLDEN WEBSITE - FULL DATABASE SCHEMA
-- Migrated from Famous.ai to Supabase
-- Run at: https://supabase.com/dashboard/project/ogmcctnpxgemlvulhtom/sql
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- RELEASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS releases (
    id SERIAL PRIMARY KEY,
    spotify_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album_type TEXT,
    release_date TEXT,
    artwork_url TEXT,
    spotify_url TEXT,
    label TEXT,
    total_tracks INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    apple_music_url TEXT,
    youtube_url TEXT,
    youtube_music_url TEXT,
    deezer_url TEXT,
    beatport_url TEXT,
    beatport_chart_position INTEGER
);

CREATE INDEX IF NOT EXISTS idx_releases_display_order ON releases(display_order);
CREATE INDEX IF NOT EXISTS idx_releases_release_date ON releases(release_date DESC);

-- ============================================
-- MONITORED ARTISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS monitored_artists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    spotify_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    image_url TEXT,
    genres TEXT[],
    followers INTEGER,
    last_synced_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    venue TEXT,
    event_date DATE NOT NULL,
    event_time TEXT,
    event_end_time TEXT,
    location TEXT,
    city TEXT,
    country TEXT,
    ticket_link TEXT,
    event_image_url TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'upcoming',
    is_completed BOOLEAN DEFAULT FALSE,
    setlist TEXT,
    reviews JSONB DEFAULT '[]'::jsonb,
    event_photos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- ============================================
-- RADIO STATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS radio_stations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    schedule VARCHAR(100) NOT NULL,
    "time" VARCHAR(20) NOT NULL,
    repeat VARCHAR(50) DEFAULT 'Weekly',
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    url VARCHAR(500),
    latitude NUMERIC(10,6) NOT NULL,
    longitude NUMERIC(10,6) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RADIO EPISODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS radio_episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    air_date DATE NOT NULL,
    audio_url TEXT,
    cover_image_url TEXT,
    episode_number INTEGER NOT NULL,
    tracklist JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_radio_episodes_air_date ON radio_episodes(air_date DESC);

-- ============================================
-- ART OF RAVE EPISODES TABLE (Mixcloud)
-- ============================================
CREATE TABLE IF NOT EXISTS art_of_rave_episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mixcloud_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    url TEXT NOT NULL,
    created_time TIMESTAMPTZ NOT NULL,
    updated_time TIMESTAMPTZ,
    play_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    audio_length INTEGER,
    cover_art_url TEXT,
    cover_art_large_url TEXT,
    description TEXT,
    tracklist JSONB,
    tags JSONB,
    embed_html TEXT,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aor_episodes_created ON art_of_rave_episodes(created_time DESC);

-- ============================================
-- EPISODE TRACKLISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS episode_tracklists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    episode_id UUID NOT NULL REFERENCES art_of_rave_episodes(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 1 NOT NULL,
    track_name VARCHAR(500) NOT NULL,
    artist_name VARCHAR(500) NOT NULL,
    timestamp_seconds INTEGER,
    timestamp_display VARCHAR(20),
    spotify_url VARCHAR(1000),
    beatport_url VARCHAR(1000),
    spotify_track_id TEXT,
    label_name TEXT,
    source VARCHAR(50) DEFAULT 'manual',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracklists_episode ON episode_tracklists(episode_id);

-- ============================================
-- RADIO ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS radio_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    episode_id UUID REFERENCES art_of_rave_episodes(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    session_id VARCHAR(255),
    user_agent TEXT,
    country VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRESS PHOTOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS press_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('live', 'studio', 'promotional')),
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    high_res_url TEXT,
    photographer VARCHAR(255),
    date_taken DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_press_photos_category ON press_photos(category);

-- ============================================
-- PHOTO ALBUMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS photo_albums (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_photo_id UUID,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ALBUM PHOTOS TABLE (Junction)
-- ============================================
CREATE TABLE IF NOT EXISTS album_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    album_id UUID REFERENCES photo_albums(id) ON DELETE CASCADE,
    photo_id UUID REFERENCES press_photos(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRESS ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS press_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    source_logo TEXT,
    date TEXT NOT NULL,
    published_date DATE,
    excerpt TEXT,
    link TEXT,
    image TEXT,
    featured BOOLEAN DEFAULT FALSE,
    visible BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    auto_discovered BOOLEAN DEFAULT FALSE,
    discovery_source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIDEOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT NOT NULL,
    youtube_id TEXT,
    video_url TEXT,
    release_date TEXT,
    views TEXT,
    duration TEXT,
    type TEXT CHECK (type IN ('official', 'live', 'short', 'mix')),
    year INTEGER,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SOUNDCLOUD MIXES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS soundcloud_mixes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    soundcloud_url TEXT NOT NULL,
    cover_image_url TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKING CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS booking_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    region TEXT,
    title TEXT NOT NULL,
    company_name TEXT,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    website_url TEXT,
    demo_url TEXT,
    gradient_color TEXT DEFAULT 'purple',
    icon_name TEXT DEFAULT 'Mail',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GUESTMIX SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guestmix_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    instagram_handle TEXT,
    bio TEXT,
    press_photo_url TEXT,
    mix_url TEXT,
    voiceover_url TEXT,
    tracklist_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed BOOLEAN DEFAULT FALSE,
    confirmation_token TEXT,
    unsubscribed_at TIMESTAMPTZ,
    source TEXT DEFAULT 'footer_form'
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);

-- ============================================
-- EMAIL TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject_template VARCHAR(500),
    html_content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'custom',
    is_system BOOLEAN DEFAULT FALSE,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMAIL CAMPAIGNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft' NOT NULL,
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    total_recipients INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_opens INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAMPAIGN ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS campaign_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    subscriber_email TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    click_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0
);

-- ============================================
-- EMAIL WORKFLOWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    trigger_config JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WORKFLOW STEPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES email_workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_type TEXT NOT NULL,
    step_config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WORKFLOW EXECUTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES email_workflows(id) ON DELETE CASCADE,
    subscriber_email TEXT NOT NULL,
    current_step_id UUID REFERENCES workflow_steps(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    next_execution_at TIMESTAMPTZ
);

-- ============================================
-- WORKFLOW STEP ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_step_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    step_id UUID REFERENCES workflow_steps(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LINK CHECK RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS link_check_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    station_id UUID REFERENCES radio_stations(id) ON DELETE CASCADE,
    station_name TEXT NOT NULL,
    url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('valid', 'invalid', 'pending', 'unknown')),
    status_code INTEGER,
    error_message TEXT,
    response_time_ms INTEGER,
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSTAGRAM POSTS CACHE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS instagram_posts_cache (
    id TEXT PRIMARY KEY,
    caption TEXT,
    media_type TEXT NOT NULL,
    media_url TEXT NOT NULL,
    permalink TEXT NOT NULL,
    thumbnail_url TEXT,
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instagram_posts_timestamp ON instagram_posts_cache(timestamp DESC);

-- ============================================
-- INSTAGRAM CACHE METADATA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS instagram_cache_metadata (
    id SERIAL PRIMARY KEY,
    last_fetched_at TIMESTAMPTZ NOT NULL,
    post_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSTAGRAM TOKEN STORE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS instagram_token_store (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    access_token TEXT NOT NULL,
    token_type TEXT DEFAULT 'long_lived',
    expires_at TIMESTAMPTZ,
    last_refreshed_at TIMESTAMPTZ DEFAULT NOW(),
    account_username TEXT DEFAULT 'terrygoldenmusic',
    account_id TEXT,
    is_valid BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_of_rave_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE episode_tracklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE soundcloud_mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestmix_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_step_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_check_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_cache_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_token_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_analytics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ POLICIES (for website display)
-- ============================================
CREATE POLICY "Public read access for releases" ON releases FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access for radio_stations" ON radio_stations FOR SELECT USING (active = true);
CREATE POLICY "Public read access for radio_episodes" ON radio_episodes FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access for art_of_rave_episodes" ON art_of_rave_episodes FOR SELECT USING (true);
CREATE POLICY "Public read access for episode_tracklists" ON episode_tracklists FOR SELECT USING (true);
CREATE POLICY "Public read access for press_photos" ON press_photos FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read access for photo_albums" ON photo_albums FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access for album_photos" ON album_photos FOR SELECT USING (true);
CREATE POLICY "Public read access for press_items" ON press_items FOR SELECT USING (visible = true);
CREATE POLICY "Public read access for videos" ON videos FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read access for soundcloud_mixes" ON soundcloud_mixes FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read access for booking_contacts" ON booking_contacts FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for instagram_posts_cache" ON instagram_posts_cache FOR SELECT USING (true);
CREATE POLICY "Public read access for instagram_cache_metadata" ON instagram_cache_metadata FOR SELECT USING (true);

-- Public insert for newsletter and guestmix submissions
CREATE POLICY "Public insert for newsletter_subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert for guestmix_submissions" ON guestmix_submissions FOR INSERT WITH CHECK (true);

-- ============================================
-- AUTOMATIC UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON releases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monitored_artists_updated_at BEFORE UPDATE ON monitored_artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_radio_stations_updated_at BEFORE UPDATE ON radio_stations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_radio_episodes_updated_at BEFORE UPDATE ON radio_episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_press_photos_updated_at BEFORE UPDATE ON press_photos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_photo_albums_updated_at BEFORE UPDATE ON photo_albums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_press_items_updated_at BEFORE UPDATE ON press_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_soundcloud_mixes_updated_at BEFORE UPDATE ON soundcloud_mixes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_contacts_updated_at BEFORE UPDATE ON booking_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guestmix_submissions_updated_at BEFORE UPDATE ON guestmix_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_workflows_updated_at BEFORE UPDATE ON email_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_episode_tracklists_updated_at BEFORE UPDATE ON episode_tracklists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instagram_posts_cache_updated_at BEFORE UPDATE ON instagram_posts_cache FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instagram_cache_metadata_updated_at BEFORE UPDATE ON instagram_cache_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instagram_token_store_updated_at BEFORE UPDATE ON instagram_token_store FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================
INSERT INTO monitored_artists (spotify_id, name, is_active) 
VALUES ('3z97WMRi731dCvKklIf2X6', 'Terry Golden', true)
ON CONFLICT (spotify_id) DO NOTHING;

-- Success message
SELECT 'Migration completed successfully! Full Terry Golden website schema created.' as status;
