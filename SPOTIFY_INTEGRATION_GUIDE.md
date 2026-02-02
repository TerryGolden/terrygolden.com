# Spotify Integration Guide

## Overview
The radio show tracklists now have full Spotify integration, allowing tracks to be clickable links that open in Spotify, and enabling playlist creation from episode tracklists.

## Features

### 1. Automatic Spotify Track Matching
- Each track in a tracklist is automatically searched on Spotify
- Spotify track IDs and URLs are stored in the database
- Tracks become clickable links that open in Spotify
- Cached for faster loading on subsequent visits

### 2. Create Spotify Playlists
- "Create Playlist" button appears when tracks have Spotify links
- Generates a Spotify playlist from the episode's tracklist
- Requires user to connect their Spotify account
- Playlist is created in the user's Spotify library

### 3. Admin Tools
- Search individual tracks for Spotify matches
- "Search All" button to find Spotify links for all tracks
- Manual Spotify URL entry option
- Label field for track metadata

## How It Works

### Frontend (Public Radio Page)
1. When an episode is expanded, the tracklist loads
2. Tracks without Spotify IDs are automatically searched
3. Spotify links appear on hover for each track
4. "Create Playlist" button shows count of Spotify-linked tracks
5. Users can connect Spotify and create playlists with one click

### Admin Panel
1. Open TracklistManager for any episode
2. Enter artist, track name, and label for each track
3. Click search icon (🔍) to find Spotify match for individual track
4. Click "Search All" to batch search all tracks
5. Spotify icon appears when track is linked
6. Save tracklist to store Spotify IDs in database

### Dropbox Auto-Import
1. Tracklists are parsed from .txt or .docx files
2. Format: "Artist - Track - Label" or "Artist - Track"
3. Tracks are imported into episode_tracklists table
4. Use admin panel to run "Search All" for Spotify matching

## Database Schema

### episode_tracklists table
- `spotify_track_id`: Spotify's unique track identifier
- `spotify_url`: Direct link to track on Spotify
- `label_name`: Record label for the track
- Other fields: track_name, artist_name, timestamp, etc.

## User Flow for Playlist Creation

1. **Connect Spotify** (one-time)
   - Click "Connect Spotify" button on Radio page
   - Authorize the application
   - Token is stored locally for future use

2. **Create Playlist**
   - Expand any episode with Spotify-linked tracks
   - Click "Create Playlist (X)" button
   - Playlist is created in your Spotify account
   - Opens automatically in Spotify

## API Functions

### search-spotify-track
- Searches Spotify for a track by artist and track name
- Returns track ID, URL, and metadata
- Uses Spotify Client Credentials flow

### create-spotify-playlist
- Creates a playlist in user's Spotify account
- Adds all tracks with Spotify IDs
- Requires user access token (OAuth)

## Tips

- **Accuracy**: More specific artist/track names = better matches
- **Batch Processing**: Use "Search All" in admin for efficiency
- **Rate Limiting**: Automatic 500ms delay between searches
- **Caching**: Spotify IDs are stored permanently
- **Missing Tracks**: Not all tracks may be on Spotify

## Troubleshooting

**Tracks not found on Spotify:**
- Check spelling of artist and track names
- Try variations (e.g., "feat." vs "ft.")
- Some tracks may not be available on Spotify

**Playlist creation fails:**
- Ensure Spotify account is connected
- Check that token hasn't expired (re-connect if needed)
- Verify at least one track has a Spotify ID

**Search is slow:**
- Rate limiting prevents API abuse
- Large tracklists may take 30-60 seconds
- Progress is shown during search
