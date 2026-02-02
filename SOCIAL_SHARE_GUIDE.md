# Social Share Functionality Guide

## Overview
The website now includes comprehensive social media sharing functionality across all major content types - releases, radio episodes, and currently playing tracks. Users can easily share content to multiple platforms with pre-populated text, images, and hashtags.

## Features

### Supported Platforms
- **Twitter/X** - Share with custom text and hashtags
- **Facebook** - Share with URL
- **LinkedIn** - Professional sharing
- **WhatsApp** - Direct messaging
- **Telegram** - Instant messaging
- **Email** - Email sharing with subject and body
- **Copy Link** - Quick clipboard copy with visual feedback
- **Native Share** - Mobile device native share sheet (when available)

### Share Locations

#### 1. Music Releases (FeaturedReleases Component)
- **Location**: Each release card has a share button in the top-right corner
- **Content Shared**:
  - Title: "[Track Name] by Terry Golden"
  - Description: "Check out this amazing track [on Label Name]! 🎵"
  - Image: Release artwork
  - Hashtags: #TerryGolden, #EDM, #ElectronicMusic
  - URL: Spotify URL or releases page

#### 2. Radio Episodes (RadioSection Component)
- **Location**: Each episode has a share button next to the expand/collapse button
- **Content Shared**:
  - Title: "Art of Rave - Episode [Number]"
  - Description: Episode intro text
  - Image: Art of Rave logo
  - Hashtags: #ArtOfRave, #TerryGolden, #RadioShow, #EDM
  - URL: Direct link to episode with anchor

#### 3. Music Player (Currently Playing Track)
- **Location**: Share button in the music player controls
- **Content Shared**:
  - Title: "[Track Name] by [Artist Name]"
  - Description: "Check out this track by Terry Golden! 🎵"
  - Hashtags: #TerryGolden, #NowPlaying, #EDM
  - URL: Homepage

## Component Details

### SocialShareButtons Component
**Location**: `src/components/SocialShareButtons.tsx`

**Props**:
```typescript
interface SocialShareButtonsProps {
  url: string;              // URL to share
  title: string;            // Title for the share
  description?: string;     // Optional description
  image?: string;          // Optional image URL
  hashtags?: string[];     // Optional array of hashtags
  compact?: boolean;       // Compact mode (fewer buttons initially)
}
```

**Features**:
- Circular icon buttons with hover effects
- Color-coded hover states (blue for Twitter, green for WhatsApp, etc.)
- Scale animation on hover
- Copy link with success feedback (checkmark icon)
- Compact mode for space-constrained areas
- Responsive design

## User Experience

### Interaction Flow
1. User clicks share button on content
2. Share modal/panel opens with social media buttons
3. User clicks desired platform
4. Platform's share dialog opens in new window/tab
5. Pre-populated content ready to post

### Visual Feedback
- Share button highlights on hover
- Modal/panel slides in smoothly
- Copy link button shows checkmark when successful
- All buttons have scale animation on hover

## Customization

### Adding New Platforms
To add a new social platform, edit `SocialShareButtons.tsx`:

```typescript
{
  name: 'PlatformName',
  icon: PlatformIcon,
  url: `https://platform.com/share?url=${shareUrl}&text=${shareText}`,
  color: 'hover:bg-[#BrandColor]'
}
```

### Customizing Share Text
Edit the component where share is implemented:

```typescript
<SocialShareButtons
  url="your-url"
  title="Your Title"
  description="Your custom description"
  hashtags={['Custom', 'Hashtags']}
/>
```

## Technical Implementation

### State Management
Each component maintains its own share modal state:
- `shareModalOpen` - Tracks which item's share modal is open
- `showShare` - Boolean for simple show/hide (MusicPlayer)

### URL Encoding
All share parameters are properly URL-encoded to handle special characters.

### Mobile Optimization
- Responsive button sizes
- Native share API support on mobile devices
- Touch-friendly button spacing

## Best Practices

### Content Guidelines
1. Keep titles concise and descriptive
2. Include relevant hashtags (3-5 maximum)
3. Add emojis sparingly for visual appeal
4. Ensure URLs are absolute and accessible
5. Use high-quality images for better engagement

### Performance
- Share buttons load instantly (no external scripts)
- Icons are SVG-based (lightweight)
- Modals use CSS transitions (smooth)

## Browser Compatibility
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Native share API for supported devices

## Future Enhancements
- Share analytics tracking
- Custom share images per platform
- Share count display
- Pre-filled message templates
- Instagram story sharing (requires API)
- TikTok sharing integration
