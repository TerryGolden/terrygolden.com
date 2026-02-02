# Radio Analytics Guide

## Overview
The Radio Analytics dashboard provides comprehensive insights into listener engagement, episode performance, and growth trends for your radio shows.

## Features

### 1. **Real-Time Tracking**
- Automatic tracking of plays, downloads, and views
- Anonymous session-based analytics (no personal data collected)
- Tracks when users:
  - Expand episode details (view)
  - Click "Listen Now" (play)
  - Download episodes (download)

### 2. **Analytics Dashboard**
Access via: Admin Dashboard → Radio Analytics

#### Key Metrics Cards:
- **Total Plays**: Number of times episodes were played
- **Total Downloads**: Number of episode downloads
- **Total Views**: Number of times episode details were viewed
- **Total Events**: Sum of all tracked interactions

#### Growth Over Time Chart:
- 30-day trend line showing plays, downloads, and views
- Visual representation of listener engagement patterns
- Helps identify peak listening times and growth trends

#### Top Episodes Chart:
- Bar chart showing most popular episodes
- Compares plays, downloads, and views per episode
- Identifies your best-performing content

#### Event Distribution Chart:
- Pie chart showing breakdown of interaction types
- Percentage distribution of plays vs downloads vs views
- Understand how listeners engage with content

### 3. **Automatic Tracking Integration**
The tracking system is automatically integrated into:
- Radio page episode expansion (tracks views)
- "Listen Now" button clicks (tracks plays)
- Future download buttons (tracks downloads)

## Technical Details

### Database Schema
```sql
radio_analytics table:
- id: UUID (primary key)
- episode_id: UUID (references radio_episodes)
- event_type: VARCHAR (play/download/view)
- session_id: VARCHAR (anonymous session identifier)
- user_agent: TEXT (browser/device info)
- country: VARCHAR (future geo-tracking)
- created_at: TIMESTAMP
```

### Edge Function
`track-radio-event`: Records analytics events
- Accepts: episode_id, event_type, session_id
- Returns: success confirmation
- Handles errors gracefully (won't break user experience)

### Privacy
- No personal information collected
- Session IDs are randomly generated per browser session
- Complies with privacy best practices
- Anonymous analytics only

## Usage

### For Admins:
1. Go to Admin Dashboard
2. Click "Radio Analytics"
3. View real-time metrics and charts
4. Analyze trends to optimize content strategy

### For Developers:
Track custom events by calling:
```typescript
await supabase.functions.invoke('track-radio-event', {
  body: { 
    episode_id: 'uuid', 
    event_type: 'play' | 'download' | 'view',
    session_id: 'session-uuid'
  }
});
```

## Future Enhancements
- Geographic tracking (country-level)
- Time-of-day listening patterns
- Listener retention metrics
- Export analytics data to CSV
- Email reports for weekly/monthly summaries
- Integration with external analytics platforms

## Troubleshooting

### No Data Showing:
- Ensure episodes have been viewed/played after analytics was set up
- Check that the edge function is deployed
- Verify database table was created successfully

### Inaccurate Counts:
- Session-based tracking may count multiple plays from same user
- This is intentional to measure engagement, not unique listeners
- Consider implementing user authentication for unique listener tracking

## Benefits
- **Content Strategy**: Identify which episodes resonate most
- **Growth Tracking**: Monitor listener engagement over time
- **Performance Insights**: Understand how content is consumed
- **Data-Driven Decisions**: Make informed choices about future content
