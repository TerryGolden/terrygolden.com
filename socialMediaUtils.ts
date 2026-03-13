// Social media utility functions for handling deep linking to mobile apps

export const SOCIAL_LINKS = {
  instagram: {
    username: 'terrygoldenmusic',
    webUrl: 'https://www.instagram.com/terrygoldenmusic',
    appUrl: 'instagram://user?username=terrygoldenmusic'
  },
  soundcloud: {
    username: 'djterrygolden',
    webUrl: 'https://soundcloud.com/djterrygolden',
    appUrl: 'soundcloud://users:djterrygolden'
  },
  youtube: {
    username: 'terrygoldenmusic',
    webUrl: 'https://www.youtube.com/@terrygoldenmusic',
    appUrl: 'vnd.youtube://www.youtube.com/@terrygoldenmusic'
  },
  youtubeMusic: {
    channelId: 'terrygoldenmusic',
    webUrl: 'https://music.youtube.com/channel/UCterrygoldenmusic',
    appUrl: 'vnd.youtube.music://music.youtube.com/channel/UCterrygoldenmusic'
  },
  facebook: {
    username: 'TerryGoldenmusic',
    webUrl: 'https://www.facebook.com/TerryGoldenmusic/',
    appUrl: 'fb://page/TerryGoldenmusic'
  },
  spotify: {
    artistId: '0yoxuOLsU1fPmUb1KIjGU9',
    webUrl: 'https://open.spotify.com/artist/0yoxuOLsU1fPmUb1KIjGU9',
    appUrl: 'spotify://artist/0yoxuOLsU1fPmUb1KIjGU9'
  },
  beatport: {
    artistId: 'terry-golden',
    webUrl: 'https://www.beatport.com/artist/terry-golden/123456',
    appUrl: 'beatport://artist/terry-golden'
  },
  appleMusic: {
    artistId: '1234567890',
    webUrl: 'https://music.apple.com/us/artist/terry-golden/1234567890',
    appUrl: 'music://music.apple.com/us/artist/terry-golden/1234567890'
  }
};

export type SocialPlatform = 'instagram' | 'soundcloud' | 'youtube' | 'youtubeMusic' | 'facebook' | 'spotify' | 'beatport' | 'appleMusic';

export const isMobileDevice = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

/**
 * Parse a Spotify URL and extract the type and ID
 * Supports: artist, album, track, playlist, show, episode
 */
export const parseSpotifyUrl = (url: string): { type: string; id: string } | null => {
  // Match patterns like:
  // https://open.spotify.com/artist/0yoxuOLsU1fPmUb1KIjGU9
  // https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy
  // https://open.spotify.com/track/2sJRNiUW5jVTehcTa98jSG
  // https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
  // https://open.spotify.com/show/...
  // https://open.spotify.com/episode/...
  const match = url.match(/open\.spotify\.com\/(artist|album|track|playlist|show|episode)\/([a-zA-Z0-9]+)/);
  
  if (match) {
    return {
      type: match[1],
      id: match[2]
    };
  }
  
  // Also handle search URLs
  const searchMatch = url.match(/open\.spotify\.com\/search\/(.+)/);
  if (searchMatch) {
    return {
      type: 'search',
      id: decodeURIComponent(searchMatch[1])
    };
  }
  
  return null;
};

/**
 * Convert a Spotify web URL to a mobile app deep link
 */
export const getSpotifyAppUrl = (webUrl: string): string => {
  const parsed = parseSpotifyUrl(webUrl);
  
  if (!parsed) {
    // If we can't parse it, return the default artist page
    return SOCIAL_LINKS.spotify.appUrl;
  }
  
  if (parsed.type === 'search') {
    // Spotify app search deep link
    return `spotify://search/${encodeURIComponent(parsed.id)}`;
  }
  
  // Standard deep link format: spotify://type/id
  return `spotify://${parsed.type}/${parsed.id}`;
};

/**
 * Handle click on a Spotify link with mobile app deep linking
 */
export const handleSpotifyClick = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  spotifyUrl: string
) => {
  e.preventDefault();
  
  if (isMobileDevice()) {
    const appUrl = getSpotifyAppUrl(spotifyUrl);
    // Try to open app first
    window.location.href = appUrl;
    // Fallback to web if app doesn't open within 1.5 seconds
    setTimeout(() => {
      window.open(spotifyUrl, '_blank');
    }, 1500);
  } else {
    // Desktop - open web version
    window.open(spotifyUrl, '_blank');
  }
};

/**
 * Parse a Beatport URL and extract the type and ID/slug
 * Supports: track, release, artist, label, chart, genre
 */
export const parseBeatportUrl = (url: string): { type: string; slug: string; id?: string } | null => {
  // Match patterns like:
  // https://www.beatport.com/track/track-name/12345678
  // https://www.beatport.com/release/release-name/12345678
  // https://www.beatport.com/artist/artist-name/12345
  // https://www.beatport.com/label/label-name/12345
  // https://www.beatport.com/chart/chart-name/12345
  // https://www.beatport.com/genre/trance/7
  
  // Pattern for track, release, artist, label, chart with numeric ID
  const matchWithId = url.match(/beatport\.com\/(track|release|artist|label|chart)\/([a-zA-Z0-9-]+)\/(\d+)/);
  
  if (matchWithId) {
    return {
      type: matchWithId[1],
      slug: matchWithId[2],
      id: matchWithId[3]
    };
  }
  
  // Pattern for genre pages
  const genreMatch = url.match(/beatport\.com\/genre\/([a-zA-Z0-9-]+)\/(\d+)/);
  if (genreMatch) {
    return {
      type: 'genre',
      slug: genreMatch[1],
      id: genreMatch[2]
    };
  }
  
  // Pattern for simple artist/label pages without ID
  const simpleMatch = url.match(/beatport\.com\/(artist|label)\/([a-zA-Z0-9-]+)\/?$/);
  if (simpleMatch) {
    return {
      type: simpleMatch[1],
      slug: simpleMatch[2]
    };
  }
  
  // Pattern for search
  const searchMatch = url.match(/beatport\.com\/search\?q=([^&]+)/);
  if (searchMatch) {
    return {
      type: 'search',
      slug: decodeURIComponent(searchMatch[1])
    };
  }
  
  return null;
};

/**
 * Convert a Beatport web URL to a mobile app deep link
 * Beatport app uses beatport:// protocol
 */
export const getBeatportAppUrl = (webUrl: string): string => {
  const parsed = parseBeatportUrl(webUrl);
  
  if (!parsed) {
    // If we can't parse it, return the default artist page
    return SOCIAL_LINKS.beatport.appUrl;
  }
  
  // Beatport app deep link formats:
  // beatport://track/12345678
  // beatport://release/12345678
  // beatport://artist/12345
  // beatport://label/12345
  // beatport://chart/12345
  // beatport://search?q=query
  
  if (parsed.type === 'search') {
    return `beatport://search?q=${encodeURIComponent(parsed.slug)}`;
  }
  
  // If we have an ID, use it for the deep link (more reliable)
  if (parsed.id) {
    return `beatport://${parsed.type}/${parsed.id}`;
  }
  
  // Fallback to slug-based URL
  return `beatport://${parsed.type}/${parsed.slug}`;
};

/**
 * Handle click on a Beatport link with mobile app deep linking
 */
export const handleBeatportClick = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  beatportUrl: string
) => {
  e.preventDefault();
  
  if (isMobileDevice()) {
    const appUrl = getBeatportAppUrl(beatportUrl);
    // Try to open app first
    window.location.href = appUrl;
    // Fallback to web if app doesn't open within 1.5 seconds
    setTimeout(() => {
      window.open(beatportUrl, '_blank');
    }, 1500);
  } else {
    // Desktop - open web version
    window.open(beatportUrl, '_blank');
  }
};

/**
 * Parse a YouTube Music URL and extract the type and ID
 * Supports: watch (video/song), playlist, channel, browse (album/artist), search
 */
export const parseYouTubeMusicUrl = (url: string): { type: string; id: string; params?: Record<string, string> } | null => {
  // Match patterns like:
  // https://music.youtube.com/watch?v=VIDEO_ID
  // https://music.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
  // https://music.youtube.com/playlist?list=PLAYLIST_ID
  // https://music.youtube.com/channel/CHANNEL_ID
  // https://music.youtube.com/browse/BROWSE_ID (for albums, artists like MPREb_xxx, UCxxx)
  // https://music.youtube.com/search?q=QUERY
  
  try {
    const urlObj = new URL(url);
    
    // Must be music.youtube.com domain
    if (!urlObj.hostname.includes('music.youtube.com')) {
      return null;
    }
    
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;
    
    // Watch page (song/video)
    if (pathname === '/watch') {
      const videoId = searchParams.get('v');
      const listId = searchParams.get('list');
      if (videoId) {
        return {
          type: 'watch',
          id: videoId,
          params: listId ? { list: listId } : undefined
        };
      }
    }
    
    // Playlist page
    if (pathname === '/playlist') {
      const listId = searchParams.get('list');
      if (listId) {
        return {
          type: 'playlist',
          id: listId
        };
      }
    }
    
    // Channel page
    const channelMatch = pathname.match(/^\/channel\/([a-zA-Z0-9_-]+)/);
    if (channelMatch) {
      return {
        type: 'channel',
        id: channelMatch[1]
      };
    }
    
    // Browse page (albums, artists, etc.)
    const browseMatch = pathname.match(/^\/browse\/([a-zA-Z0-9_-]+)/);
    if (browseMatch) {
      return {
        type: 'browse',
        id: browseMatch[1]
      };
    }
    
    // Search page
    if (pathname === '/search') {
      const query = searchParams.get('q');
      if (query) {
        return {
          type: 'search',
          id: query
        };
      }
    }
    
    // Handle direct artist/album links like /artist/ARTIST_ID or /album/ALBUM_ID
    const directMatch = pathname.match(/^\/(artist|album)\/([a-zA-Z0-9_-]+)/);
    if (directMatch) {
      return {
        type: directMatch[1],
        id: directMatch[2]
      };
    }
    
  } catch {
    // Invalid URL
    return null;
  }
  
  return null;
};

/**
 * Convert a YouTube Music web URL to a mobile app deep link
 * YouTube Music app uses vnd.youtube.music:// or youtubemusic:// protocol
 */
export const getYouTubeMusicAppUrl = (webUrl: string): string => {
  const parsed = parseYouTubeMusicUrl(webUrl);
  
  if (!parsed) {
    // If we can't parse it, return the default channel page
    return SOCIAL_LINKS.youtubeMusic.appUrl;
  }
  
  // YouTube Music app deep link formats:
  // The app generally accepts the full URL path after the protocol
  // vnd.youtube.music://music.youtube.com/watch?v=VIDEO_ID
  // vnd.youtube.music://music.youtube.com/playlist?list=PLAYLIST_ID
  // vnd.youtube.music://music.youtube.com/channel/CHANNEL_ID
  // vnd.youtube.music://music.youtube.com/browse/BROWSE_ID
  // vnd.youtube.music://music.youtube.com/search?q=QUERY
  
  // Build the path based on parsed type
  let path = '';
  
  switch (parsed.type) {
    case 'watch':
      path = `/watch?v=${parsed.id}`;
      if (parsed.params?.list) {
        path += `&list=${parsed.params.list}`;
      }
      break;
    case 'playlist':
      path = `/playlist?list=${parsed.id}`;
      break;
    case 'channel':
      path = `/channel/${parsed.id}`;
      break;
    case 'browse':
      path = `/browse/${parsed.id}`;
      break;
    case 'search':
      path = `/search?q=${encodeURIComponent(parsed.id)}`;
      break;
    case 'artist':
      path = `/browse/${parsed.id}`;
      break;
    case 'album':
      path = `/browse/${parsed.id}`;
      break;
    default:
      path = `/channel/${parsed.id}`;
  }
  
  // Use vnd.youtube.music:// as the primary protocol
  // This is the more reliable deep link format for YouTube Music
  return `vnd.youtube.music://music.youtube.com${path}`;
};

/**
 * Get alternative YouTube Music app URL using youtubemusic:// protocol
 * Some devices may respond better to this protocol
 */
export const getYouTubeMusicAlternativeAppUrl = (webUrl: string): string => {
  const parsed = parseYouTubeMusicUrl(webUrl);
  
  if (!parsed) {
    return 'youtubemusic://';
  }
  
  // Alternative format using youtubemusic:// protocol
  switch (parsed.type) {
    case 'watch':
      return `youtubemusic://watch?v=${parsed.id}${parsed.params?.list ? `&list=${parsed.params.list}` : ''}`;
    case 'playlist':
      return `youtubemusic://playlist?list=${parsed.id}`;
    case 'channel':
      return `youtubemusic://channel/${parsed.id}`;
    case 'browse':
      return `youtubemusic://browse/${parsed.id}`;
    case 'search':
      return `youtubemusic://search?q=${encodeURIComponent(parsed.id)}`;
    default:
      return `youtubemusic://`;
  }
};

/**
 * Handle click on a YouTube Music link with mobile app deep linking
 * Attempts to open the YouTube Music app first, with fallback to web browser
 */
export const handleYouTubeMusicClick = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  youTubeMusicUrl: string
) => {
  e.preventDefault();
  
  if (isMobileDevice()) {
    // Try the primary deep link protocol first (vnd.youtube.music://)
    const appUrl = getYouTubeMusicAppUrl(youTubeMusicUrl);
    
    // Try to open app first
    window.location.href = appUrl;
    
    // If the primary protocol doesn't work, try the alternative after a short delay
    setTimeout(() => {
      const altAppUrl = getYouTubeMusicAlternativeAppUrl(youTubeMusicUrl);
      window.location.href = altAppUrl;
    }, 500);
    
    // Fallback to web if app doesn't open within 1.5 seconds
    setTimeout(() => {
      window.open(youTubeMusicUrl, '_blank');
    }, 1500);
  } else {
    // Desktop - open web version
    window.open(youTubeMusicUrl, '_blank');
  }
};

/**
 * Parse an Apple Music URL and extract the type and ID
 * Supports: album, artist, playlist, song, music-video, station, curator, activity
 */
export const parseAppleMusicUrl = (url: string): { type: string; id: string; storefront: string; trackId?: string } | null => {
  // Match patterns like:
  // https://music.apple.com/us/album/album-name/1234567890
  // https://music.apple.com/us/album/album-name/1234567890?i=1234567891 (specific track in album)
  // https://music.apple.com/us/artist/artist-name/1234567890
  // https://music.apple.com/us/playlist/playlist-name/pl.1234567890
  // https://music.apple.com/us/song/song-name/1234567890
  // https://music.apple.com/us/music-video/video-name/1234567890
  // https://music.apple.com/us/station/station-name/ra.1234567890
  // https://music.apple.com/us/curator/curator-name/1234567890
  // https://music.apple.com/us/activity/activity-name/1234567890
  
  try {
    const urlObj = new URL(url);
    
    // Must be music.apple.com domain
    if (!urlObj.hostname.includes('music.apple.com')) {
      return null;
    }
    
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;
    
    // Pattern: /storefront/type/name/id
    // e.g., /us/album/album-name/1234567890
    const match = pathname.match(/^\/([a-z]{2})\/(album|artist|playlist|song|music-video|station|curator|activity)\/[^/]+\/([a-zA-Z0-9.]+)/);
    
    if (match) {
      const result: { type: string; id: string; storefront: string; trackId?: string } = {
        storefront: match[1],
        type: match[2],
        id: match[3]
      };
      
      // Check for track ID in album URL (the ?i= parameter)
      const trackId = searchParams.get('i');
      if (trackId && match[2] === 'album') {
        result.trackId = trackId;
      }
      
      return result;
    }
    
    // Handle search URLs
    // https://music.apple.com/us/search?term=query
    const searchMatch = pathname.match(/^\/([a-z]{2})\/search/);
    if (searchMatch) {
      const term = searchParams.get('term');
      if (term) {
        return {
          storefront: searchMatch[1],
          type: 'search',
          id: term
        };
      }
    }
    
    // Handle browse URLs
    // https://music.apple.com/us/browse
    const browseMatch = pathname.match(/^\/([a-z]{2})\/browse/);
    if (browseMatch) {
      return {
        storefront: browseMatch[1],
        type: 'browse',
        id: ''
      };
    }
    
  } catch {
    // Invalid URL
    return null;
  }
  
  return null;
};

/**
 * Convert an Apple Music web URL to a mobile app deep link
 * Apple Music app uses music:// protocol (primary) or itms:// protocol (alternative)
 */
export const getAppleMusicAppUrl = (webUrl: string): string => {
  const parsed = parseAppleMusicUrl(webUrl);
  
  if (!parsed) {
    // If we can't parse it, return the default artist page
    return SOCIAL_LINKS.appleMusic.appUrl;
  }
  
  // Apple Music app deep link formats:
  // The music:// protocol works best when pointing to the full URL
  // music://music.apple.com/us/album/1234567890
  // music://music.apple.com/us/artist/1234567890
  // music://music.apple.com/us/playlist/pl.1234567890
  // music://music.apple.com/us/song/1234567890
  
  // Build the path based on parsed type
  let path = `/${parsed.storefront}/${parsed.type}`;
  
  // For most types, we need to include a placeholder name and the ID
  // Apple Music URLs require the format: /storefront/type/name/id
  switch (parsed.type) {
    case 'album':
      path += `/-/${parsed.id}`;
      if (parsed.trackId) {
        path += `?i=${parsed.trackId}`;
      }
      break;
    case 'artist':
      path += `/-/${parsed.id}`;
      break;
    case 'playlist':
      path += `/-/${parsed.id}`;
      break;
    case 'song':
      path += `/-/${parsed.id}`;
      break;
    case 'music-video':
      path += `/-/${parsed.id}`;
      break;
    case 'station':
      path += `/-/${parsed.id}`;
      break;
    case 'curator':
      path += `/-/${parsed.id}`;
      break;
    case 'activity':
      path += `/-/${parsed.id}`;
      break;
    case 'search':
      path = `/${parsed.storefront}/search?term=${encodeURIComponent(parsed.id)}`;
      break;
    case 'browse':
      path = `/${parsed.storefront}/browse`;
      break;
    default:
      path += `/-/${parsed.id}`;
  }
  
  // Use music:// as the primary protocol
  // This is the official Apple Music deep link protocol
  return `music://music.apple.com${path}`;
};

/**
 * Get alternative Apple Music app URL using itms:// protocol
 * Some devices may respond better to this protocol (especially older iOS versions)
 */
export const getAppleMusicAlternativeAppUrl = (webUrl: string): string => {
  const parsed = parseAppleMusicUrl(webUrl);
  
  if (!parsed) {
    return 'itms://music.apple.com';
  }
  
  // Build the path similar to the primary URL
  let path = `/${parsed.storefront}/${parsed.type}`;
  
  switch (parsed.type) {
    case 'album':
      path += `/-/${parsed.id}`;
      if (parsed.trackId) {
        path += `?i=${parsed.trackId}`;
      }
      break;
    case 'artist':
    case 'playlist':
    case 'song':
    case 'music-video':
    case 'station':
    case 'curator':
    case 'activity':
      path += `/-/${parsed.id}`;
      break;
    case 'search':
      path = `/${parsed.storefront}/search?term=${encodeURIComponent(parsed.id)}`;
      break;
    case 'browse':
      path = `/${parsed.storefront}/browse`;
      break;
    default:
      path += `/-/${parsed.id}`;
  }
  
  // Use itms:// as the alternative protocol
  // This is the iTunes Store protocol that also works for Apple Music
  return `itms://music.apple.com${path}`;
};

/**
 * Handle click on an Apple Music link with mobile app deep linking
 * Attempts to open the Apple Music app first, with fallback to web browser
 */
export const handleAppleMusicClick = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  appleMusicUrl: string
) => {
  e.preventDefault();
  
  if (isMobileDevice()) {
    // Try the primary deep link protocol first (music://)
    const appUrl = getAppleMusicAppUrl(appleMusicUrl);
    
    // Try to open app first
    window.location.href = appUrl;
    
    // If the primary protocol doesn't work, try the alternative after a short delay
    setTimeout(() => {
      const altAppUrl = getAppleMusicAlternativeAppUrl(appleMusicUrl);
      window.location.href = altAppUrl;
    }, 500);
    
    // Fallback to web if app doesn't open within 1.5 seconds
    setTimeout(() => {
      window.open(appleMusicUrl, '_blank');
    }, 1500);
  } else {
    // Desktop - open web version
    window.open(appleMusicUrl, '_blank');
  }
};

/**
 * Handle click on social media links (non-Spotify, non-Beatport, non-YouTube Music, non-Apple Music)
 */
export const handleSocialClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  platform: Exclude<SocialPlatform, 'spotify' | 'beatport' | 'youtubeMusic' | 'appleMusic'>
) => {
  e.preventDefault();
  const config = SOCIAL_LINKS[platform];
  
  if (isMobileDevice()) {
    // Try to open app first
    window.location.href = config.appUrl;
    // Fallback to web if app doesn't open within 1.5 seconds
    setTimeout(() => {
      window.open(config.webUrl, '_blank');
    }, 1500);
  } else {
    // Desktop - open web version
    window.open(config.webUrl, '_blank');
  }
};

/**
 * Universal social click handler that works for all platforms including Spotify, Beatport, YouTube Music, and Apple Music
 */
export const handleUniversalSocialClick = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  platform: SocialPlatform,
  customUrl?: string
) => {
  e.preventDefault();
  
  if (platform === 'spotify') {
    const url = customUrl || SOCIAL_LINKS.spotify.webUrl;
    handleSpotifyClick(e, url);
  } else if (platform === 'beatport') {
    const url = customUrl || SOCIAL_LINKS.beatport.webUrl;
    handleBeatportClick(e, url);
  } else if (platform === 'youtubeMusic') {
    const url = customUrl || SOCIAL_LINKS.youtubeMusic.webUrl;
    handleYouTubeMusicClick(e, url);
  } else if (platform === 'appleMusic') {
    const url = customUrl || SOCIAL_LINKS.appleMusic.webUrl;
    handleAppleMusicClick(e, url);
  } else {
    const config = SOCIAL_LINKS[platform];
    
    if (isMobileDevice()) {
      window.location.href = config.appUrl;
      setTimeout(() => {
        window.open(config.webUrl, '_blank');
      }, 1500);
    } else {
      window.open(config.webUrl, '_blank');
    }
  }
};

export const getSocialUrl = (platform: SocialPlatform) => {
  return SOCIAL_LINKS[platform].webUrl;
};
