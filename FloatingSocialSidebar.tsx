import { useState } from 'react';
import { Music2, Instagram, Facebook, Youtube, Cloud, ChevronLeft, ChevronRight } from 'lucide-react';
import { handleUniversalSocialClick, SOCIAL_LINKS, SocialPlatform, isMobileDevice } from '@/lib/socialMediaUtils';

interface FloatingSocialSidebarProps {
  position?: 'left' | 'right';
}

const FloatingSocialSidebar = ({ position = 'right' }: FloatingSocialSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const socialLinks = [
    { name: 'Spotify', icon: Music2, url: SOCIAL_LINKS.spotify.webUrl, color: '#1DB954', platform: 'spotify' as SocialPlatform },
    { name: 'SoundCloud', icon: Cloud, url: SOCIAL_LINKS.soundcloud.webUrl, color: '#FF5500', platform: 'soundcloud' as SocialPlatform },
    { name: 'Instagram', icon: Instagram, url: SOCIAL_LINKS.instagram.webUrl, color: '#E4405F', platform: 'instagram' as SocialPlatform },
    { name: 'Facebook', icon: Facebook, url: SOCIAL_LINKS.facebook.webUrl, color: '#1877F2', platform: 'facebook' as SocialPlatform },
    { name: 'YouTube', icon: Youtube, url: SOCIAL_LINKS.youtube.webUrl, color: '#FF0000', platform: 'youtube' as SocialPlatform },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, platform: SocialPlatform, url: string) => {
    // Use the universal handler which properly handles all platforms with deep linking
    handleUniversalSocialClick(e, platform, url);
  };

  return (
    <div className={`fixed top-1/2 -translate-y-1/2 z-40 ${position === 'left' ? 'left-0' : 'right-0'}`}>
      <div className={`flex ${position === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-amber-500/60 hover:bg-amber-600/70 text-white py-6 px-2 transition-all duration-300 shadow-lg backdrop-blur-sm relative group"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <div className="flex flex-col items-center gap-2">
            {position === 'left' ? (
              isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />
            ) : (
              isExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />
            )}
            <span className="text-xs font-semibold whitespace-nowrap writing-mode-vertical transform rotate-180" style={{ writingMode: 'vertical-rl' }}>
              Let's Connect
            </span>
          </div>
        </button>

        <div className={`bg-amber-500/50 backdrop-blur-md overflow-hidden transition-all duration-300 ${isExpanded ? 'w-48' : 'w-0'}`}>
          <div className="py-6">
            <h3 className="text-white font-bold text-center mb-4 px-4">Let's Connect</h3>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleClick(e, social.platform, social.url)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/20 transition-all duration-200 group text-white"
              >
                <social.icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {social.name}
                  {isMobileDevice() && <span className="text-xs opacity-70 ml-1">(opens app)</span>}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSocialSidebar;
