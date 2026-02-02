# Mixcloud Integration Guide - Art of Rave

## Overview

The Art of Rave page automatically fetches and displays episodes from your Mixcloud account (https://www.mixcloud.com/DJTerryGolden/). Episodes include cover art, tracklists, play counts, and embedded players.

## Features

### 1. Automatic Episode Syncing
- Episodes are automatically synced from Mixcloud
- Cover art is fetched and displayed
- Play counts, favorites, and comments are tracked
- Tags and genres are imported
- Embedded Mixcloud player for each episode

### 2. Weekly Automated Updates
- GitHub Actions workflow runs every Monday at 9:00 AM UTC
- Automatically fetches the latest 50 episodes
- Updates existing episodes with new play counts and metadata

### 3. Admin Management
- Manual sync available in Admin Dashboard
- Configure how many episodes to sync (1-100)
- View sync statistics and results

## How to Use

### Viewing Episodes
1. Navigate to "Art of Rave" in the main navigation
2. Episodes are displayed with cover art and metadata
3. Click any episode to expand and see:
   - Embedded Mixcloud player
   - Tags/genres
   - Description (if available)
   - Tracklist (if available)

### Manual Sync (Admin)
1. Go to Admin Dashboard (gear icon in navigation)
2. Click "Art of Rave" card
3. Set the number of episodes to sync
4. Click "Sync from Mixcloud"
5. Wait for confirmation message

### Automatic Sync
The system automatically syncs episodes every Monday. You can also trigger a manual sync:
1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Sync Mixcloud Episodes" workflow
4. Click "Run workflow"

## Technical Details

### Database Structure
Episodes are stored in the `art_of_rave_episodes` table with:
- Episode name and slug
- Mixcloud URL and key
- Cover art URLs (medium and large)
- Play count, favorites, comments
- Audio length
- Tags and genres
- Tracklist (if available)
- Created and updated timestamps

### API Integration
- Uses Mixcloud public API (no authentication required)
- Endpoint: https://api.mixcloud.com/DJTerryGolden/cloudcasts/
- Fetches metadata, artwork, and statistics
- Updates existing episodes on re-sync

### Edge Function
The `sync-mixcloud-episodes` function:
- Fetches episodes from Mixcloud API
- Transforms data for database storage
- Upserts episodes (updates if exists, inserts if new)
- Returns sync statistics

## Troubleshooting

### Episodes Not Appearing
1. Check if episodes exist on Mixcloud
2. Run manual sync from Admin Dashboard
3. Check browser console for errors

### Old Play Counts
- Play counts update during sync
- Run manual sync to get latest numbers
- Automatic sync runs weekly

### Missing Tracklists
- Tracklists must be added on Mixcloud
- Re-sync after adding tracklists on Mixcloud
- Some episodes may not have tracklists

## Customization

### Change Sync Frequency
Edit `.github/workflows/sync-mixcloud.yml`:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Change this line
```

### Change Number of Episodes
In Admin Dashboard or edit the workflow file to change the default limit.

### Styling
- Episode cards: `src/components/ArtOfRaveSection.tsx`
- Page layout: `src/pages/ArtOfRave.tsx`
- Colors use purple/pink gradient theme

## Support

For issues or questions:
1. Check this guide first
2. Verify Mixcloud account is accessible
3. Check GitHub Actions logs for sync errors
4. Review browser console for frontend errors
