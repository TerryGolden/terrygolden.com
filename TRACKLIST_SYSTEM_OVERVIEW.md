# Radio Tracklist System - Complete Overview

## System Architecture

### Data Flow
```
Dropbox Word Documents
    ↓
parse-docx-tracklist (Edge Function)
    ↓
sync-dropbox-radio-v2 (Edge Function)
    ↓
Database (episode_tracklists table)
    ↓
EpisodeTracklist Component (Frontend)
    ↓
search-spotify-track (Edge Function)
    ↓
Spotify API
    ↓
Clickable Links + Playlist Creation
```

## Components

### 1. Dropbox Storage
**Tracklists Folder:** https://www.dropbox.com/scl/fo/s2a25ix5a0yk4eid0uhfz/ADpsGbf9hozcGdpbv599xhc

**Structure:**
```
Episode 1/
  └── tracklist.docx
Episode 2/
  └── tracklist.docx
```

**Format:** `artist name - track name [label name]`

### 2. Edge Functions

#### parse-docx-tracklist
- Downloads Word document from Dropbox
- Uses Dropbox Export API to convert to text
- Parses format: `artist - track [label]`
- Returns structured JSON array

#### sync-dropbox-radio-v2
- Lists all Episode folders from Dropbox
- Calls parse-docx-tracklist for each episode
- Creates/updates radio_episodes records
- Inserts tracks into episode_tracklists table
- Runs weekly via GitHub Actions

#### search-spotify-track
- Searches Spotify API for track
- Returns best match with track ID and URL
- Uses Client Credentials flow

#### create-spotify-playlist
- Creates playlist in user's Spotify account
- Adds all tracks from episode
- Returns playlist URL

### 3. Database Schema

```sql
episode_tracklists (
  id UUID PRIMARY KEY,
  episode_id UUID REFERENCES radio_episodes(id),
  position INTEGER,
  track_name TEXT,
  artist_name TEXT,
  label_name TEXT,
  spotify_track_id TEXT,
  spotify_url TEXT,
  timestamp_seconds INTEGER,
  timestamp_display TEXT,
  beatport_url TEXT
)
```

### 4. Frontend Components

#### EpisodeTracklist.tsx
- Fetches tracks from database
- Auto-searches Spotify for missing IDs
- Displays clickable Spotify links
- Provides "Create Playlist" button

#### Radio.tsx
- Lists all published episodes
- Embeds EpisodeTracklist when expanded
- Shows Instagram share button

#### TracklistManager.tsx (Admin)
- Manual track editing
- Batch Spotify search
- Individual track search
- Bulk import from text

## User Workflows

### For Admins

1. **Organize Dropbox**
   - Create "Episode X" folders
   - Add tracklist.docx files
   - Format: `artist - track [label]`

2. **Sync Episodes**
   - Admin → Radio Episodes → "Sync" button
   - Or wait for weekly auto-sync (Thursdays)

3. **Review & Publish**
   - Check imported episodes
   - Edit if needed
   - Mark as published

4. **Spotify Matching**
   - Use "Search All" for batch matching
   - Or individual search per track
   - Cached permanently once found

### For Visitors

1. **Browse Episodes**
   - Visit Radio page
   - Click episode to expand

2. **View Tracklist**
   - See all tracks with artist/label
   - Hover to see Spotify links

3. **Listen on Spotify**
   - Click Spotify button on any track
   - Opens directly in Spotify

4. **Create Playlist**
   - First time: "Connect Spotify"
   - Click "Create Playlist (X)"
   - Playlist opens in your account

## Automation

### GitHub Actions Workflow
`.github/workflows/sync-radio.yml`
- Runs every Thursday at midnight UTC
- Calls sync-dropbox-radio-v2
- Processes all Episode folders
- Updates database automatically

## Key Features

✅ **Automatic Import** - Weekly sync from Dropbox
✅ **Smart Parsing** - Handles various formats
✅ **Spotify Integration** - Auto-search and matching
✅ **Caching** - Spotify IDs stored permanently
✅ **Clickable Links** - Direct Spotify playback
✅ **Playlist Creation** - One-click playlist generation
✅ **Manual Override** - Admin can edit anything
✅ **Instagram Sharing** - Share with tracklist images

## Troubleshooting

### Import Issues
- Verify Dropbox token is valid (not expired)
- Check folder names start with "Episode"
- Ensure tracklist.docx exists
- Verify format: `artist - track [label]`

### Spotify Issues
- Check artist/track spelling
- Some tracks may not exist on Spotify
- Token expires after 1 hour (re-auth needed)
- Manual URL entry available

## Documentation Files

- `TRACKLIST_AUTO_IMPORT_GUIDE.md` - Detailed import guide
- `TRACKLIST_PARSING_GUIDE.md` - Parsing and management
- `SPOTIFY_INTEGRATION_GUIDE.md` - Spotify features
- `RADIO_SYNC_SETUP.md` - Initial setup
- `DROPBOX_SETUP_GUIDE.md` - Dropbox configuration
