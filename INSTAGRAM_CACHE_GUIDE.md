# Instagram Feed Caching System

## Overview

The Instagram feed caching system reduces API calls to Instagram's Graph API and improves performance by storing fetched posts in your Supabase database. The cache automatically refreshes every 30 minutes, and you can manually refresh it from the admin panel.

## How It Works

### 1. **Automatic Caching**
- When the Instagram feed is requested, the system first checks the cache
- If the cache is less than 30 minutes old, cached data is returned immediately
- If the cache is older than 30 minutes, fresh data is fetched from Instagram API
- New data is automatically stored in the database for future requests

### 2. **Database Tables**

Two tables store the Instagram feed data:

**`instagram_posts_cache`**
- Stores individual Instagram posts
- Fields: id, caption, media_type, media_url, permalink, thumbnail_url, timestamp

**`instagram_cache_metadata`**
- Tracks when the cache was last updated
- Fields: last_fetched_at, post_count

### 3. **Cache Invalidation**

The cache is automatically invalidated when:
- 30 minutes have passed since the last fetch
- You manually click "Force Refresh" in the admin panel
- New posts are detected (cache is cleared and rebuilt)

## Admin Panel Features

Navigate to **Admin Dashboard → Instagram Cache** to:

### View Cache Status
- **Last Updated**: See when the cache was last refreshed
- **Cached Posts**: Number of posts stored in the database
- **Cache Status**: Whether the cache is valid or expired

### Manual Refresh
Click the **"Force Refresh Now"** button to:
- Immediately fetch fresh data from Instagram
- Clear old cached posts
- Store new posts in the database
- Update the cache timestamp

### Preview Cached Posts
See thumbnail previews of the 8 most recent cached posts

## Benefits

### 1. **Reduced API Calls**
- Instagram API has rate limits (200 requests per hour per user)
- Caching reduces API calls by ~95% for typical usage
- Prevents hitting rate limits on high-traffic sites

### 2. **Improved Performance**
- Cached data loads instantly from your database
- No waiting for Instagram API responses
- Better user experience with faster page loads

### 3. **Reliability**
- If Instagram API is temporarily unavailable, cached data is still served
- Graceful degradation ensures your site keeps working

### 4. **Cost Savings**
- Fewer API calls mean lower infrastructure costs
- Reduced bandwidth usage

## Technical Details

### Cache Refresh Logic

```typescript
// Check cache age
const cacheAge = (now - lastFetchedAt) / 1000 / 60; // minutes
const cacheValid = cacheAge < 30 && !forceRefresh;

if (cacheValid) {
  // Return cached data
  return cachedPosts;
} else {
  // Fetch fresh data from Instagram API
  // Clear old cache
  // Store new posts
  // Update metadata
}
```

### Frontend Integration

The `SocialMediaFeed` component automatically uses the caching system:

```typescript
// Fetch with cache (default)
fetchInstagramPosts();

// Force refresh (bypass cache)
fetchInstagramPosts(true);
```

## Monitoring

### Cache Performance Metrics

Track these metrics in the admin panel:
- **Cache Hit Rate**: How often cached data is used vs. API calls
- **Last Refresh Time**: Ensure cache is updating regularly
- **Post Count**: Verify all posts are being cached

### Troubleshooting

**Cache not updating?**
- Check Instagram API credentials in Instagram Setup
- Verify the edge function `fetch-instagram-feed` is deployed
- Check browser console for errors

**Old posts showing?**
- Click "Force Refresh Now" in the admin panel
- Verify cache_age shows recent timestamp

**No posts in cache?**
- Ensure Instagram API is properly configured
- Check that posts exist on the Instagram account
- Review edge function logs for errors

## Best Practices

1. **Set up Instagram API first** before using cache features
2. **Monitor cache status** regularly in the admin panel
3. **Use manual refresh** after posting new content to Instagram
4. **Check cache age** if posts seem outdated
5. **Review logs** if experiencing issues

## API Endpoints

### Fetch Instagram Feed (with caching)
```typescript
const { data } = await supabase.functions.invoke('fetch-instagram-feed', {
  body: { forceRefresh: false } // or true to bypass cache
});
```

### Response Format
```json
{
  "data": [...posts],
  "configured": true,
  "cached": true,
  "cacheAge": 15  // minutes since last fetch
}
```

## Security

- Cache tables use Row Level Security (RLS)
- Public read access for displaying posts
- Service role access for edge functions to write
- No sensitive data stored in cache

## Future Enhancements

Potential improvements to the caching system:
- Configurable cache duration (not just 30 minutes)
- Cache warming (pre-fetch before expiration)
- Partial cache updates (only fetch new posts)
- Cache analytics dashboard
- Webhook integration for instant updates
