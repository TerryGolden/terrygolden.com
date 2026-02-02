# Radio Episode Tracklist Management Guide

## Overview
Complete system for managing radio episode tracklists with automatic import from Dropbox Word documents and full Spotify integration.

## Automatic Import from Dropbox

### Dropbox Folder Setup
**Tracklists Folder:** https://www.dropbox.com/scl/fo/s2a25ix5a0yk4eid0uhfz/ADpsGbf9hozcGdpbv599xhc?rlkey=j0x4d2dxdgxni7iapf3vwl3tj&st=8jc32qov&dl=0

**Structure:**
```
Tracklists/
├── Episode 1/
│   └── tracklist.docx
├── Episode 2/
│   └── tracklist.docx
└── Episode 3/
    └── tracklist.docx
```

### Tracklist Format in Word Documents
Each line should follow this format:
```
artist name - track name [label name]
```

**Examples:**
```
Amelie Lens - In My Mind [LENSKE]
Charlotte de Witte - Selected [KNTXT]
Adam Beyer - Your Mind [Drumcode]
Nina Kraviz - Ghetto Kraviz
```

**Important Notes:**
- Label name in brackets `[Label]` is optional
- Minutes/timestamps are NOT required
- One track per line
- Remove headers like "Tracklist:" or "Episode X"

### How Auto-Import Works

1. **Weekly Automatic Sync**
   - Runs every Thursday at midnight UTC
   - Processes all Episode folders
   - Updates existing episodes or creates new ones

2. **Manual Sync**
   - Admin Dashboard → Radio Episodes → Click "Sync" button
   - Processes all episodes immediately

3. **Data Processing**

   - Creates episode entries in database
   - Parses tracklists into structured format

2. **Tracklist Parsing**
   - Extracts Artist, Track, and Label from each line
   - Removes timestamps, numbering, and formatting
   - Stores in `episode_tracklists` table

3. **Spotify Integration** (Automatic)
   - When episode is viewed, tracks without Spotify IDs are searched
   - Best match is selected and stored
   - Spotify URLs become clickable links
   - Cached for instant loading on future visits

## Manual Tracklist Management

### Admin Panel - TracklistManager

1. **Edit Tracklist**
   - Click "Edit" on any episode
   - Add/remove/reorder tracks
   - Enter Artist, Track, Label for each

2. **Spotify Search**
   - Click 🔍 icon to search individual track
   - Click "Search All" to batch search all tracks
   - Green Spotify icon shows when linked

3. **Bulk Import**
   - Click "Bulk" button
   - Paste tracklist (one per line)
   - Automatically parses format
   - Click "Import Tracks"

4. **Save**
   - Click "Save" to store in database
   - Spotify IDs are preserved

## Spotify Features

### For Visitors (Public Radio Page)

1. **Clickable Tracks**
   - Hover over any track
   - Click Spotify button to open in Spotify
   - Preview track (if available)

2. **Create Playlist**
   - First time: Click "Connect Spotify"
   - Authorize the application
   - Click "Create Playlist (X)" button
   - Playlist opens in your Spotify account

### For Admins

1. **Search Individual Track**
   - Click search icon next to track
   - Best match is automatically selected
   - Manual URL entry also available

2. **Batch Search**
   - Click "Search All" button
   - Searches all tracks without Spotify IDs
   - 500ms delay between searches (rate limiting)
   - Progress shown during search

## Database Schema

### episode_tracklists Table
```sql
- id: UUID
- episode_id: UUID (references radio_episodes)
- position: INTEGER
- track_name: TEXT
- artist_name: TEXT
- label_name: TEXT (optional)
- timestamp_seconds: INTEGER (optional)
- timestamp_display: TEXT (optional)
- spotify_track_id: TEXT (cached)
- spotify_url: TEXT (cached)
- beatport_url: TEXT (optional)
```

## Tips for Best Results

### Tracklist Formatting
- Use consistent separator: `-` or `—`
- Format: `Artist - Track - Label`
- One track per line
- Avoid extra formatting or symbols

### Spotify Matching
- More specific = better matches
- Include remix info: "Track (Original Mix)"
- Use full artist names
- Check spelling carefully

### Performance
- Spotify IDs are cached permanently
- First load searches and stores
- Subsequent loads are instant
- Batch search processes 2 tracks/second

## Troubleshooting

### Tracklist Not Parsing
- Check file format (.txt or .docx)
- Verify separator character (dash)
- Ensure one track per line
- Remove extra headers or text

### Spotify Not Finding Tracks
- Verify artist and track spelling
- Try variations (feat. vs ft.)
- Some tracks may not be on Spotify
- Manual URL entry available

### Playlist Creation Fails
- Reconnect Spotify account
- Check token hasn't expired
- Ensure tracks have Spotify IDs
- Verify Spotify account permissions

## Workflow Summary

1. **Organize Dropbox**: Create episode folders with files
2. **Sync**: Click "Sync" in admin panel
3. **Review**: Check episodes imported correctly
4. **Search Spotify**: Use "Search All" for batch matching
5. **Publish**: Mark episode as published
6. **Visitors**: Can click tracks and create playlists

## API Functions

- `sync-dropbox-radio-v2`: Syncs episodes from Dropbox
- `parse-docx-tracklist`: Parses Word documents
- `search-spotify-track`: Finds Spotify matches
- `create-spotify-playlist`: Creates user playlists
