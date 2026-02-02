# Dropbox Radio Shows Auto-Sync Setup Guide

## Problem: Short-Lived Token
The token you provided starts with `sl.u` which is a **short-lived token** that expires after 4 hours.

## Solution: Generate a Long-Lived Access Token

### Step 1: Create/Access Your Dropbox App
1. Go to https://www.dropbox.com/developers/apps
2. Find your existing app OR click "Create app"
   - Choose **Scoped access**
   - Choose **Full Dropbox** access
   - Name: "Radio Shows Sync" (or your preferred name)

### Step 2: Configure Permissions
1. Click on your app
2. Go to the **Permissions** tab
3. Enable these scopes:
   - ✅ `files.metadata.read` - Read file metadata
   - ✅ `files.content.read` - Read file content
   - ✅ `files.content.write` - Write files (if uploading)
   - ✅ `sharing.read` - Read shared links
4. Click **Submit** to save

### Step 3: Generate Access Token (Method 1 - Simple)
1. Go to the **Settings** tab
2. Scroll to **OAuth 2** section
3. Under "Generated access token", click **Generate**
4. Copy the token (should start with `sl.` but be permanent)
5. **Important**: This token never expires unless you revoke it

### Step 4: Update Your Secret
Replace the current `DROPBOX_ACCESS_TOKEN` secret with the new token.

---

## Setting Up Automatic Weekly Sync (Thursday Midnight)

The edge function is ready, but automatic scheduling requires additional setup:

### Option 1: GitHub Actions (Recommended)
Create `.github/workflows/sync-radio.yml`:
```yaml
name: Sync Radio Shows
on:
  schedule:
    - cron: '0 0 * * 4'  # Thursday at midnight UTC
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Call Sync Function
          curl -X POST https://api.databasepad.com/functions/v1/sync-dropbox-radio-v2 \
            -H "Content-Type: application/json" \
            -d '{}'

```

### Option 2: External Cron Service
Use services like:
- **EasyCron** (https://www.easycron.com)
- **cron-job.org** (https://cron-job.org)

Set up a weekly job to call:
```
POST https://api.databasepad.com/functions/v1/sync-dropbox-radio-v2
```

### Option 3: Server Cron Job
If you have a server:
```bash
# Add to crontab
0 0 * * 4 curl -X POST https://api.databasepad.com/functions/v1/sync-dropbox-radio-v2
```

---


## Manual Sync
You can always manually sync from the Admin Dashboard:
1. Go to Admin → Radio Episodes
2. Click "Sync Dropbox" button
3. View sync results

---

## Folder Structure Expected
The sync function expects this structure:
```
/Radio Shows Folder/
  ├── Episode 001/
  │   ├── artwork.jpg
  │   ├── tracklist.txt
  │   └── audio.mp3
  ├── Episode 002/
  │   ├── artwork.png
  │   ├── tracklist.txt
  │   └── show.mp3
```

## Next Steps
1. Generate proper long-lived token
2. Update DROPBOX_ACCESS_TOKEN secret
3. Test manual sync from Admin Dashboard
4. Set up automatic scheduling (optional)
