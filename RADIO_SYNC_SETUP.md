# Radio Show Sync Setup Guide

## Overview
This system automatically syncs radio show episodes from Dropbox, including artwork, audio files, and tracklists with full Spotify integration.

## Dropbox Folders

### 1. Main Radio Episodes Folder (Artwork & Audio)
**URL:** https://www.dropbox.com/scl/fo/9mvcraiygd1jrx03e90dc/APq-pc8EfBnXlS3z5w2ku2M?rlkey=snxswbmg6aeb3rqobr7gfjvev&st=z5nfg4zw&dl=0

### 2. Tracklists Folder
**URL:** https://www.dropbox.com/scl/fo/s2a25ix5a0yk4eid0uhfz/ADpsGbf9hozcGdpbv599xhc?rlkey=j0x4d2dxdgxni7iapf3vwl3tj&st=8jc32qov&dl=0

**Format:** Each episode has a subfolder named "Episode X" containing:
- `tracklist.docx` - Word document with tracks in format: `artist name - track name [label name]`
- Optional artwork and audio files

## Automatic Sync Schedule

### 3. ✅ Automatic Weekly Sync (GitHub Actions)
- Created `.github/workflows/sync-radio.yml`
- Runs every Thursday at midnight UTC
- Can also be triggered manually from GitHub Actions tab

---

## ⚠️ IMPORTANT: Fix Your Dropbox Token

### Problem
The token you provided starts with `sl.u` which is a **short-lived token** that expires after 4 hours.

### Solution
Follow the guide in `DROPBOX_SETUP_GUIDE.md` to generate a proper long-lived token.

**Quick Steps:**
1. Go to https://www.dropbox.com/developers/apps
2. Open your app (App key: njwg5y6u6sawdv9)
3. Go to Settings tab
4. Under "OAuth 2", click "Generate" access token
5. Copy the new token
6. Update your `DROPBOX_ACCESS_TOKEN` secret with the new token

---

## Expected Folder Structure

Your Dropbox folder should be organized like this:

```
/Radio Shows Folder/
  ├── Episode 001/
  │   ├── artwork.jpg (or .png, .webp)
  │   ├── tracklist.txt
  │   └── audio.mp3 (or .wav, .m4a)
  │
  ├── Episode 002/
  │   ├── cover.png
  │   ├── tracklist.txt
  │   └── show.mp3
  │
  └── Episode 003/
      ├── artwork.jpg
      ├── tracks.txt
      └── radio.mp3
```

**File Naming Tips:**
- **Artwork**: Include "artwork" or "cover" in filename, or use .jpg/.png/.webp
- **Tracklist**: Include "tracklist" in filename, or use .txt extension
- **Audio**: Use .mp3, .wav, or .m4a extension

---

## How to Use

### Manual Sync (Test First!)
1. Go to your admin dashboard
2. Navigate to Radio Episodes
3. Click "Sync Dropbox" button
4. Watch the results appear

### Automatic Sync
Once you've updated the token and tested manually:
- The GitHub Action will run every Thursday at midnight UTC
- You can also trigger it manually from GitHub → Actions tab

---

## Troubleshooting

### "Invalid Access Token" Error
→ Your token expired. Generate a new long-lived token (see DROPBOX_SETUP_GUIDE.md)

### "No artwork or audio found"
→ Check your folder structure and file naming

### Episodes not appearing
→ Check that `is_published` is set to true in the database

---

## Next Steps

1. ✅ Generate new long-lived Dropbox token
2. ✅ Update DROPBOX_ACCESS_TOKEN secret
3. ✅ Test manual sync from admin dashboard
4. ✅ Verify episodes appear correctly
5. ✅ Let automatic sync run weekly

---

## Need Help?

- Token issues: See `DROPBOX_SETUP_GUIDE.md`
- Folder structure: See "Expected Folder Structure" above
- Manual sync: Admin → Radio Episodes → Sync Dropbox
