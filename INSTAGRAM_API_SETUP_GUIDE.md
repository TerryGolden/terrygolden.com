# Instagram Business API Setup Guide

This guide will walk you through setting up Instagram Business API integration for your artist website to display the feed from **@terrygoldenmusic**.

## Prerequisites

Before you begin, ensure you have:
- An Instagram Business or Creator account (not a personal account)
  - **Your account:** @terrygoldenmusic must be converted to Business/Creator
- A Facebook Page connected to your Instagram account
- A Facebook Developer account


## Step 1: Create a Facebook Developer App

1. **Go to Facebook Developers**
   - Visit https://developers.facebook.com/
   - Click "My Apps" in the top right
   - Click "Create App"

2. **Choose App Type**
   - Select "Business" as the app type
   - Click "Next"

3. **Configure Basic Settings**
   - App Display Name: "Terry Golden Website" (or your artist name)
   - App Contact Email: Your email address
   - Click "Create App"

4. **Add Instagram Product**
   - From your app dashboard, scroll to "Add Products"
   - Find "Instagram" and click "Set Up"
   - Also add "Instagram Basic Display" product

## Step 2: Get Your Instagram Business Account ID

1. **Using Graph API Explorer**
   - Go to https://developers.facebook.com/tools/explorer/
   - Select your app from the dropdown
   - Click "Generate Access Token"
   - Select permissions: `instagram_basic`, `pages_show_list`, `pages_read_engagement`
   - Click "Generate Access Token" and authorize

2. **Get Your Page ID**
   - In Graph API Explorer, enter: `me/accounts`
   - Click "Submit"
   - Copy the `id` of your Facebook Page

3. **Get Instagram Business Account ID**
   - In Graph API Explorer, enter: `{PAGE_ID}?fields=instagram_business_account`
   - Replace `{PAGE_ID}` with your page ID
   - Click "Submit"
   - Copy the `instagram_business_account.id` value
   - This is your `INSTAGRAM_ACCOUNT_ID`

## Step 3: Generate Long-Lived Access Token

Short-lived tokens expire in 1 hour. You need a long-lived token.

1. **Get Short-Lived User Access Token**
   - From Graph API Explorer (Step 2), copy your access token
   - This is your short-lived token

2. **Exchange for Long-Lived Token**
   - Go to: https://developers.facebook.com/tools/debug/accesstoken/
   - Paste your short-lived token
   - Click "Extend Access Token"
   - Copy the new long-lived token (valid for 60 days)

3. **Get Never-Expiring Page Access Token**
   - In Graph API Explorer, use your long-lived user token
   - Query: `me/accounts?fields=access_token,name`
   - Find your page and copy its `access_token`
   - This page token won't expire as long as your app is active

## Step 4: Set Up Permissions

Your app needs these permissions:

### Required Permissions:
- `instagram_basic` - Read basic Instagram account info
- `pages_show_list` - Access your Facebook Pages
- `pages_read_engagement` - Read engagement data
- `instagram_content_publish` - (Optional) For posting content

### How to Add Permissions:

1. **App Review** (For Production)
   - Go to your app dashboard
   - Click "App Review" > "Permissions and Features"
   - Request: `instagram_basic`, `pages_show_list`, `pages_read_engagement`
   - Provide use case and screencast
   - Wait for approval (can take 3-7 days)

2. **Development Mode** (For Testing)
   - Add yourself as a test user
   - Go to "Roles" > "Test Users"
   - Permissions work immediately in development mode

## Step 5: Configure Supabase Environment Variables

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to "Project Settings" > "Edge Functions" > "Manage secrets"

2. **Add These Secrets**
   ```
   INSTAGRAM_ACCESS_TOKEN=your_long_lived_page_access_token
   INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id
   ```

3. **Deploy Edge Function**
   - The `fetch-instagram-feed` function will use these credentials

## Step 6: Test the Connection

### Using the Admin Panel:

1. Navigate to Admin Dashboard > Instagram Setup
2. Enter your credentials
3. Click "Test Connection"
4. You should see your recent Instagram posts

### Using Graph API Explorer:

Test this query:
```
{INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=12
```

Expected response:
```json
{
  "data": [
    {
      "id": "123456789",
      "caption": "Your post caption",
      "media_type": "IMAGE",
      "media_url": "https://...",
      "permalink": "https://instagram.com/p/...",
      "timestamp": "2024-01-01T12:00:00+0000",
      "like_count": 100,
      "comments_count": 10
    }
  ]
}
```

## Troubleshooting Common Errors

### Error: "Object with ID 'A18ZTC_3s9-26uRcSigxXGP' does not exist"
**This is the current error you're seeing!**

**Cause:** The Instagram Account ID stored in your Supabase database is incorrect or doesn't match @terrygoldenmusic

**Solution:**
1. **Verify Instagram Account Type**
   - Go to Instagram app > Profile > Settings > Account
   - Ensure @terrygoldenmusic is set to "Business" or "Creator" account
   - If it's a personal account, you MUST convert it first

2. **Get the Correct Account ID**
   - Go to https://developers.facebook.com/tools/explorer/
   - Generate access token with permissions: `instagram_basic`, `pages_show_list`
   - Query: `me/accounts` to get your Facebook Page ID
   - Query: `{PAGE_ID}?fields=instagram_business_account` to get the correct Instagram Account ID
   - The ID should be different from 'A18ZTC_3s9-26uRcSigxXGP'

3. **Update Supabase Secrets**
   - Go to Supabase Dashboard > Project Settings > Edge Functions > Manage secrets
   - Update `INSTAGRAM_ACCOUNT_ID` with the correct ID from step 2
   - Redeploy the edge function

4. **Verify Facebook Page Connection**
   - Go to your Facebook Page settings
   - Check "Instagram" section
   - Ensure @terrygoldenmusic is properly connected
   - If not connected, click "Connect Account" and authorize

### Error: "Object with ID does not exist" (General)
**Cause:** Wrong Instagram Account ID or insufficient permissions

**Solution:**
1. Verify you're using Instagram Business Account ID (not personal)
2. Ensure your Facebook Page is connected to Instagram
3. Check permissions in Graph API Explorer


### Error: "Invalid OAuth access token"
**Cause:** Token expired or invalid

**Solution:**
1. Generate a new long-lived token (Step 3)
2. Update Supabase environment variables
3. Redeploy edge function

### Error: "Unsupported get request"
**Cause:** Missing permissions or wrong account type

**Solution:**
1. Convert Instagram account to Business/Creator
2. Link to Facebook Page
3. Request proper permissions in App Review

### Error: "Application does not have permission"
**Cause:** App Review permissions not approved

**Solution:**
1. Submit app for review with required permissions
2. Use development mode for testing
3. Add test users who can access without approval

### Error: "Rate limit exceeded"
**Cause:** Too many API requests

**Solution:**
1. Instagram allows 200 requests per hour per user
2. Implement caching in your edge function
3. Reduce fetch frequency

## Token Refresh Strategy

Long-lived tokens expire after 60 days. Set up automatic refresh:

1. **Monitor Token Expiration**
   - Check token expiry in Graph API Explorer
   - Set calendar reminder for 50 days

2. **Refresh Before Expiry**
   - Generate new long-lived token (Step 3)
   - Update Supabase secrets
   - No downtime if done before expiry

3. **Automated Refresh** (Advanced)
   - Store refresh token in database
   - Create scheduled edge function to auto-refresh
   - Update secrets programmatically

## Security Best Practices

1. **Never Commit Tokens**
   - Keep tokens in environment variables only
   - Add to `.gitignore` if stored locally

2. **Use Minimal Permissions**
   - Only request permissions you need
   - Remove unused permissions

3. **Monitor Usage**
   - Check Facebook Developer dashboard for anomalies
   - Set up alerts for unusual activity

4. **Rotate Tokens Regularly**
   - Refresh every 30-45 days
   - Revoke old tokens after replacement

## Additional Resources

- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)

## Support

If you encounter issues:
1. Check the credential tester in Admin Panel
2. Review error logs in Supabase Edge Functions
3. Verify permissions in Facebook Developer Console
4. Test queries in Graph API Explorer

---

**Last Updated:** November 2024
