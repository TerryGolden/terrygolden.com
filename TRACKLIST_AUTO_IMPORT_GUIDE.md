# Radio Episode Tracklist Auto-Import Guide

## Overview
The system automatically imports radio episode tracklists from Dropbox Word documents with full Spotify integration.

## Dropbox Folder Structure

**Main Folder:** https://www.dropbox.com/scl/fo/s2a25ix5a0yk4eid0uhfz/ADpsGbf9hozcGdpbv599xhc?rlkey=j0x4d2dxdgxni7iapf3vwl3tj&st=8jc32qov&dl=0

```
Tracklists/
├── Episode 1/
│   ├── tracklist.docx
│   ├── artwork.jpg (optional)
│   └── audio.mp3 (optional)
├── Episode 2/
│   ├── tracklist.docx
│   └── artwork.png
└── Episode 3/
    └── tracklist.docx
```

## Tracklist Format

Each `tracklist.docx` file should contain tracks in this format:

```
artist name - track name [label name]
```

### Examples:
```
Amelie Lens - In My Mind [LENSKE]
Charlotte de Witte - Selected [KNTXT]
Adam Beyer - Your Mind [Drumcode]
```

**Notes:**
- Label name in brackets `[Label]` is optional
- Minutes/timestamps are NOT required
- One track per line
- The system will automatically parse and structure the data

## How It Works

### 1. Automatic Sync (Weekly)
- Runs every Thursday at midnight UTC
- Automatically processes all Episode folders
- Updates existing episodes or creates new ones

### 2. Manual Sync
**Admin Panel:**
1. Go to Admin Dashboard
2. Click "Radio Episodes"
3. Click "Sync" button
4. Wait for confirmation message

### 3. Data Processing
For each episode folder:
1. **Extract Episode Number** from folder name (e.g., "Episode 23" → 23)
2. **Parse Tracklist** from `tracklist.docx`:
   - Artist name
   - Track name
   - Label name (if provided)
3. **Upload Artwork** (if found)
4. **Store in Database**:
   - Episode metadata in `radio_episodes` table
   - Individual tracks in `episode_tracklists` table

### 4. Spotify Integration
After import, the system automatically:
1. Searches Spotify for each track
2. Matches to correct Spotify track ID
3. Stores Spotify URLs for instant playback
4. Enables "Create Playlist" functionality

## Database Schema

### radio_episodes
- Basic episode info (title, date, artwork, audio)
- Legacy tracklist array (for backwards compatibility)

### episode_tracklists
- Individual track records with:
  - `artist_name`
  - `track_name`
  - `label_name`
  - `spotify_track_id`
  - `spotify_url`
  - `track_number` (order in episode)

## Troubleshooting

### Episode Not Importing
- Check folder name starts with "Episode"
- Ensure `tracklist.docx` exists in folder
- Verify file is actually a Word document (.docx)

### Tracks Not Parsing
- Check format: `Artist - Track [Label]`
- Ensure one track per line
- Remove any headers like "Tracklist:" or "Episode X"

### Spotify Not Matching
- Verify artist and track names are spelled correctly
- Check if track exists on Spotify
- Use "Search Spotify" button in admin to manually match

## Best Practices

1. **Consistent Naming:** Always use "Episode X" format
2. **Clean Data:** Remove headers, timestamps, and extra formatting
3. **Accurate Info:** Double-check artist and track names
4. **Include Labels:** Helps with Spotify matching accuracy
5. **Test First:** Import one episode manually before bulk import

## Manual Override

If auto-import fails, you can:
1. Edit episode in admin panel
2. Use "Tracklist Manager" to manually add tracks
3. Use "Search Spotify" to match tracks individually
4. Use "Batch Search" to match all tracks at once
