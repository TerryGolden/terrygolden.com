# Radio Episodes Import Guide

## Quick Start

### Option 1: Bulk Import (Recommended)
1. Go to Admin Dashboard → Radio Episodes
2. Click "Bulk Import" button (green)
3. Click "Start Import"
4. Wait for all 16 episodes (177-192) to be imported
5. Episodes will appear on the Radio page automatically

### Option 2: Dropbox Sync
1. Go to Admin Dashboard → Radio Episodes
2. Click "Sync Dropbox" button (blue)
3. Requires Dropbox API setup (see DROPBOX_SETUP_GUIDE.md)

### Option 3: Manual Entry
1. Go to Admin Dashboard → Radio Episodes
2. Click "Add Episode" button (purple)
3. Fill in episode details manually
4. Upload artwork and enter audio URL
5. Add tracklist (one track per line)
6. Click "Save"

## Episode Details (177-192)

All episodes from the Dropbox folder are configured to import automatically:
- **Episodes**: 177-192 (16 total)
- **Artwork**: Direct links to TG[number].jpg files in Dropbox
- **Audio**: Direct links to MP3 files in Dropbox
- **Air Dates**: Weekly from January 9, 2025

## Features

### Admin Interface
- Add, edit, delete episodes
- Upload custom artwork
- Reorder episodes (drag handles)
- Mark as published/draft
- Bulk import from Dropbox data

### Public Display
- Episode artwork thumbnails
- Expandable episode details
- Tracklist display
- Direct audio links
- Sorted by episode number (newest first)

## Troubleshooting

### Episodes not showing on Radio page
- Check that episodes are marked as "Published" in admin
- Verify audio_url and cover_image_url are valid
- Check browser console for errors

### Bulk import fails
- Check database connection
- Verify Supabase is configured
- Check that radio_episodes table exists

### Dropbox links not working
- Ensure URLs end with ?dl=1 (not ?dl=0)
- Check that Dropbox folder is still shared
- Verify file names match expected pattern

## Database Schema

```sql
radio_episodes:
  - id (UUID)
  - episode_number (INTEGER, UNIQUE)
  - title (TEXT)
  - description (TEXT)
  - air_date (DATE)
  - audio_url (TEXT)
  - cover_image_url (TEXT)
  - tracklist (TEXT[])
  - display_order (INTEGER)
  - is_published (BOOLEAN)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```
