# Instagram Sharing & Dropbox Sync Guide

## Instagram Sharing Feature

### Where to Find Instagram Share Buttons

#### Public Radio Page
1. Navigate to the **Radio** page from the main menu
2. **Click on any episode** to expand it (click anywhere on the episode card)
3. Once expanded, you'll see the **"Share"** button with an Instagram icon
4. The button has a purple/pink gradient and says "Share"

#### Admin Panel
1. Go to **Admin Dashboard** → **Radio Episodes Manager**
2. Each episode in the list has an Instagram icon button on the right side
3. Click the Instagram icon dropdown to choose:
   - **Share to Story** - 24-hour temporary post
   - **Share to Feed** - Permanent profile post
   - **Share as Reel** - Video post (requires video)

### Instagram Sharing Features

#### 1. Custom Tracklist Images
- Automatically generates a beautiful SVG image with:
  - Episode number and title
  - Full tracklist with artist and track names
  - Professional gradient background
- Choose between **Purple** or **Cyan** color themes
- Live preview before posting

#### 2. Automatic Artist Tagging
The system intelligently extracts artist names from tracklists and tags them:
- Handles: `Artist & Artist`
- Handles: `Artist feat. Artist` or `Artist ft. Artist`
- Handles: `Artist vs Artist`
- Handles: `Artist x Artist`
- Removes duplicates automatically
- Tags all unique artists in the Instagram post

#### 3. Multiple Post Types

**Story Post**
- 24-hour temporary post
- Full-screen vertical format
- Perfect for quick updates

**Feed Post**
- Permanent post on your profile
- Square or vertical format
- Shows in followers' feeds

**Reel Post**
- Video content (up to 90 seconds)
- Upload video file or provide URL
- Automatic video processing status checking
- Waits for Instagram to finish processing before publishing

### How to Share

#### Sharing to Story or Feed
1. Click the **Share** button on any episode
2. Select **"Story"** or **"Feed"** as the share type
3. Choose a color theme (**Purple** or **Cyan**)
4. Edit the caption if desired (default includes episode info)
5. Review the auto-detected artist tags
6. Click **"Post to Instagram"**
7. Wait for confirmation

#### Sharing as Reel
1. Click the Instagram dropdown → **"Reel"**
2. Either:
   - **Upload a video file** (MP4, MOV, etc. - max 100MB)
   - **Or paste a video URL** (must be publicly accessible)
3. Add a custom caption
4. Click **"Post to Instagram"**
5. The system will:
   - Upload your video to Instagram
   - Check processing status every 10 seconds
   - Publish once processing is complete (up to 5 minutes)

---

## Dropbox Tracklist Sync

### Overview
Automatically sync radio episodes from your Dropbox folder, including artwork, audio files, and tracklists.

### Dropbox Folder Structure

Your Dropbox folder should be organized like this:

```
Radio Shows/
├── Episode 001/
│   ├── artwork.jpg (or .png, .webp)
│   ├── tracklist.txt or tracklist.docx
│   └── audio.mp3 (or .wav, .m4a)
├── Episode 002/
│   ├── cover.png
│   ├── tracklist.docx
│   └── show.mp3
├── Episode 003/
│   ├── image.jpg
│   ├── tracks.txt
│   └── episode.mp3
```

**Requirements:**
- Each episode must be in its own subfolder
- Folder names should include episode numbers (e.g., "Episode 001", "Show 42", "EP123")
- Files are detected automatically by extension

### Supported File Types

**Artwork:**
- `.jpg`, `.jpeg`, `.png`, `.webp`
- Any image file in the folder will be used

**Tracklist:**
- `.txt` - Plain text files
- `.docx` - Microsoft Word documents
- Files with "tracklist" in the name are prioritized

**Audio:**
- `.mp3`, `.wav`, `.m4a`
- Any audio file in the folder will be linked

### Tracklist Format

The system supports multiple tracklist formats:

**Format 1: Artist - Track - Label**
```
John Doe - Midnight Dreams - XYZ Records
Jane Smith - Summer Vibes - ABC Music
DJ Cool - Party Time - DEF Label
```

**Format 2: Track - Artist - Label**
```
Midnight Dreams - John Doe - XYZ Records
Summer Vibes - Jane Smith - ABC Music
Party Time - DJ Cool - DEF Label
```

**Format 3: Artist - Track (no label)**
```
John Doe - Midnight Dreams
Jane Smith - Summer Vibes
DJ Cool - Party Time
```

**Format 4: Free-form** (if no dashes detected)
```
Any text will be added as-is
Each line becomes one track
```

The parser will automatically:
- Skip empty lines
- Skip lines containing "tracklist" or "track list"
- Format tracks consistently
- Handle different dash types (-, –, —)

### Running the Sync

1. Go to **Admin Dashboard**
2. Click **Radio Episodes Manager**
3. Click the **"Sync"** button (blue button with cloud icon)
4. Wait for the sync to complete (may take 1-2 minutes)
5. Review the results:
   - Number of episodes processed
   - Number of errors (if any)
   - List of processed episodes
   - Error messages for failed episodes

### After Syncing

- New episodes are created as **DRAFTS** (not published)
- Review each episode in the admin panel
- Edit details if needed (title, description, air date)
- Check the tracklist is formatted correctly
- Mark as **Published** when ready
- Episodes will then appear on the public Radio page

---

## Technical Details

### Edge Functions
- `post-to-instagram` - Posts to Instagram Stories, Feed, or Reels
- `generate-tracklist-image` - Creates custom SVG tracklist images
- `sync-dropbox-radio-v2` - Syncs episodes from Dropbox
- `parse-docx-tracklist` - Parses Word documents for tracklists

### Storage Buckets
- `radio-artwork` - Episode cover images
- `instagram-videos` - Uploaded video files for Reels

### Environment Variables Required
- `INSTAGRAM_ACCESS_TOKEN` - Instagram Graph API token
- `INSTAGRAM_BUSINESS_ACCOUNT_ID` - Instagram Business Account ID
- `DROPBOX_ACCESS_TOKEN` - Dropbox API access token

### Troubleshooting

**Instagram share not working?**
- Ensure Instagram credentials are configured in Supabase secrets
- Check that the Instagram account is a Business or Creator account
- Verify the access token has proper permissions

**Dropbox sync not finding files?**
- Ensure folder structure matches the expected format
- Check that files have correct extensions
- Verify Dropbox access token is valid

**Tracklist not parsing correctly?**
- Use consistent formatting (Artist - Track - Label)
- Ensure each track is on a new line
- Avoid special characters that might break parsing
- For DOCX files, use simple text formatting (no tables)
