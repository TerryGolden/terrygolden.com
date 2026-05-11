import { Music, Instagram, Facebook, Youtube, Cloud } from 'lucide-react';
import { handleSocialClick, handleSpotifyClick, SOCIAL_LINKS, SocialPlatform } from '@/lib/socialMediaUtils';

const SocialMediaBar = () => {
  const socialLinks = [
    { name: 'Spotify', url: SOCIAL_LINKS.spotify.webUrl, icon: Music, color: '#1DB954', platform: 'spotify' as SocialPlatform },
    { name: 'SoundCloud', url: SOCIAL_LINKS.soundcloud.webUrl, icon: Cloud, color: '#FF5500', platform: 'soundcloud' as SocialPlatform },
    { name: 'Instagram', url: SOCIAL_LINKS.instagram.webUrl, icon: Instagram, color: '#E4405F', platform: 'instagram' as SocialPlatform },
    { name: 'Facebook', url: SOCIAL_LINKS.facebook.webUrl, icon: Facebook, color: '#1877F2', platform: 'facebook' as SocialPlatform },
    { name: 'YouTube', url: SOCIAL_LINKS.youtube.webUrl, icon: Youtube, color: '#FF0000', platform: 'youtube' as SocialPlatform },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, platform: SocialPlatform, url: string) => {
    if (platform === 'spotify') {
      handleSpotifyClick(e, url);
    } else {
      handleSocialClick(e, platform as Exclude<SocialPlatform, 'spotify'>);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleClick(e, link.platform, link.url)}
            className="group relative w-12 h-12 bg-white/5 border border-[#D4AF37]/30 rounded-full flex items-center justify-center hover:border-[#D4AF37] transition-all duration-300 hover:scale-110"
            aria-label={link.name}
          >
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {link.name}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaBar;
