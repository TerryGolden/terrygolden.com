# Dropbox Sync Troubleshooting Guide

## Current Issue: Invalid Access Token

### Error Message
```
Dropbox API error: {"error":{".tag":"invalid_access_token"},"error_summary":"invalid_access_token/"}
```

### What This Means
The DROPBOX_ACCESS_TOKEN environment variable is either:
1. **Expired** - Short-lived tokens expire after 4 hours
2. **Revoked** - Token was manually revoked in Dropbox settings
3. **Invalid** - Token format is incorrect or corrupted

---

## Solution: Generate New Access Token

### Quick Fix (5 minutes)

#### Step 1: Go to Dropbox App Console
1. Visit: https://www.dropbox.com/developers/apps
2. Click on your existing app (or create new one)

#### Step 2: Generate Token
1. Click **Settings** tab
2. Scroll to **OAuth 2** section
3. Under "Generated access token", click **Generate**
4. Copy the entire token (starts with `sl.`)
5. **Save it securely** - you can't view it again

#### Step 3: Update Environment Variable
Update the `DROPBOX_ACCESS_TOKEN` secret with your new token.

#### Step 4: Test the Sync
1. Go to Admin Dashboard → Radio Episodes
2. Click "Sync Dropbox" button
3. Check for success message

---

## Understanding Token Types

### Short-Lived Tokens (4 hours)
- Start with: `sl.u...`
- Expire after 4 hours
- **Not suitable** for automated sync

### Long-Lived Tokens (No expiration)
- Start with: `sl.B...` or similar
- Never expire (unless revoked)
- **Recommended** for production use

### Refresh Tokens (Advanced)
- Can generate new access tokens automatically
- Requires OAuth flow implementation
- More complex but most secure

---

## Common Issues & Fixes

### Issue: "Path not found"
**Cause**: Dropbox folder structure doesn't match expected format
**Fix**: Ensure folder structure is:
```
/Episode 001/
  ├── artwork.jpg
  ├── tracklist.txt
  └── audio.mp3
```

### Issue: "Permission denied"
**Cause**: App doesn't have required permissions
**Fix**: 
1. Go to app **Permissions** tab
2. Enable: `files.metadata.read`, `files.content.read`, `sharing.read`
3. Click **Submit**
4. **Generate new token** (old one won't have new permissions)

### Issue: "Shared link not found"
**Cause**: Shared link URL is incorrect or expired
**Fix**: Update the shared URL in the sync function call

---

## Testing the Connection

### Test 1: Check Token Validity
Run this in your browser console or terminal:
```bash
curl -X POST https://api.dropboxapi.com/2/users/get_current_account \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success**: Returns user account info
**Failure**: Returns error about invalid token

### Test 2: List Files
```bash
curl -X POST https://api.dropboxapi.com/2/files/list_folder \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"path": ""}'
```

**Success**: Returns list of files/folders
**Failure**: Returns error

---

## Alternative Sync Methods

If Dropbox sync continues to fail, consider:

### Manual Upload via Admin
1. Go to Admin → Radio Episodes
2. Click "Add Episode"
3. Upload artwork manually
4. Paste tracklist
5. Add audio URL

### Bulk Import from Data File
1. Use the "Bulk Import" feature
2. Import from local data file
3. Update `radioEpisodesData.ts` with new episodes

---

## Need More Help?

### Check Function Logs
The edge function logs detailed information about each sync attempt.

### Verify Environment Variables
Ensure `DROPBOX_ACCESS_TOKEN` is set correctly in your edge function environment.

### Update Function
If using old function name, update to: `sync-dropbox-radio-v2`

---

## Prevention Tips

1. **Use Long-Lived Tokens**: Always generate from app settings
2. **Monitor Expiration**: Set calendar reminder to check token quarterly
3. **Test Regularly**: Run manual sync weekly to catch issues early
4. **Backup Data**: Keep local copy of episode metadata
5. **Document Changes**: Note when you update tokens or folder structure
