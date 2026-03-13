import { handleSpotifyClick, handleBeatportClick, handleYouTubeMusicClick, handleAppleMusicClick, isMobileDevice } from '@/lib/socialMediaUtils';

interface PlatformLinksProps {
  links: {
    spotify?: string;
    deezer?: string;
    youtube?: string;
    youtubeMusic?: string;
    appleMusic?: string;
    beatport?: string;
  };
  size?: 'sm' | 'md';
}

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.208c.186-.467.31-.956.373-1.456.087-.698.104-1.4.104-2.103V6.124zM17.5 16l-3 .7V10.5l3-.7v6.2zm-5.5 1.3l-3 .7V12l3-.7v6z"/>
  </svg>
);

const DeezerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M18.81 4.16v3.03H24V4.16zM6.27 8.38v3.027h5.189V8.38zm12.54 0v3.027H24V8.38zM6.27 12.566v3.027h5.189v-3.027zm6.271 0v3.027h5.19v-3.027zm6.27 0v3.027H24v-3.027zM0 16.752v3.027h5.19v-3.027zm6.27 0v3.027h5.189v-3.027zm6.271 0v3.027h5.19v-3.027zm6.27 0v3.027H24v-3.027z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const YouTubeMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
  </svg>
);

const BeatportIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M21.429 17.055c-.636 2.583-2.767 4.627-5.392 5.17-.146.03-.292.054-.439.073v-4.321a3.214 3.214 0 10-3.214 0v4.32a5.967 5.967 0 01-.439-.073c-2.625-.543-4.756-2.587-5.392-5.17-.636-2.583.203-5.344 2.159-7.095L12 6.857l3.288 3.103c1.956 1.751 2.795 4.512 2.16 7.095zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

type PlatformType = 'spotify' | 'beatport' | 'youtubeMusic' | 'appleMusic' | 'other';

const PlatformLinks = ({ links, size = 'md' }: PlatformLinksProps) => {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const btnSize = size === 'sm' ? 'p-1.5' : 'p-2';
  
  const platforms: Array<{
    name: string;
    url: string | undefined;
    icon: () => JSX.Element;
    color: string;
    platformType: PlatformType;
  }> = [
    { name: 'Spotify', url: links.spotify, icon: SpotifyIcon, color: 'hover:text-[#1DB954] hover:bg-[#1DB954]/20', platformType: 'spotify' },
    { name: 'Apple Music', url: links.appleMusic, icon: AppleMusicIcon, color: 'hover:text-[#FA243C] hover:bg-[#FA243C]/20', platformType: 'appleMusic' },
    { name: 'Deezer', url: links.deezer, icon: DeezerIcon, color: 'hover:text-[#FF0092] hover:bg-[#FF0092]/20', platformType: 'other' },
    { name: 'YouTube Music', url: links.youtubeMusic, icon: YouTubeMusicIcon, color: 'hover:text-[#FF0000] hover:bg-[#FF0000]/20', platformType: 'youtubeMusic' },
    { name: 'YouTube', url: links.youtube, icon: YouTubeIcon, color: 'hover:text-[#FF0000] hover:bg-[#FF0000]/20', platformType: 'other' },
    { name: 'Beatport', url: links.beatport, icon: BeatportIcon, color: 'hover:text-[#94D500] hover:bg-[#94D500]/20', platformType: 'beatport' },
  ];

  // Only render platforms that have URLs
  const availablePlatforms = platforms.filter(p => p.url && p.url.trim() !== '');

  if (availablePlatforms.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, platform: typeof platforms[0]) => {
    if (platform.platformType === 'spotify' && platform.url) {
      handleSpotifyClick(e, platform.url);
    } else if (platform.platformType === 'beatport' && platform.url) {
      handleBeatportClick(e, platform.url);
    } else if (platform.platformType === 'youtubeMusic' && platform.url) {
      handleYouTubeMusicClick(e, platform.url);
    } else if (platform.platformType === 'appleMusic' && platform.url) {
      handleAppleMusicClick(e, platform.url);
    }
    // For other platforms, let the default link behavior work
  };

  const getTitle = (platform: typeof platforms[0]) => {
    const isMobile = isMobileDevice();
    const appSuffix = isMobile ? ' (opens app)' : '';
    
    switch (platform.platformType) {
      case 'spotify':
        return `Listen on ${platform.name}${appSuffix}`;
      case 'beatport':
        return `Buy on ${platform.name}${appSuffix}`;
      case 'youtubeMusic':
        return `Listen on ${platform.name}${appSuffix}`;
      case 'appleMusic':
        return `Listen on ${platform.name}${appSuffix}`;
      default:
        return `Listen on ${platform.name}`;
    }
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {availablePlatforms.map((platform) => (
        <a 
          key={platform.name} 
          href={platform.url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => handleClick(e, platform)}
          className={`${btnSize} bg-zinc-800 rounded-full text-gray-400 transition-all hover:scale-110 ${platform.color}`}
          title={getTitle(platform)}
        >
          <div className={iconSize}><platform.icon /></div>
        </a>
      ))}
    </div>
  );
};

export default PlatformLinks;
