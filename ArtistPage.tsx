import { Music, Radio, Users, Award, Globe, TrendingUp, Mail, Instagram, Facebook, Twitter, Youtube, MapPin, Music2, Cloud } from 'lucide-react';
import { Button } from './ui/button';
import { handleSocialClick, handleSpotifyClick, SOCIAL_LINKS, SocialPlatform } from '@/lib/socialMediaUtils';

const ArtistPage = () => {
  const stats = [
    { icon: Users, label: 'Monthly Listeners', value: '50K+' },
    { icon: Music, label: 'Total Releases', value: '80+' },
    { icon: Award, label: 'Beatport Top 10', value: '#11' },
    { icon: Globe, label: 'Radio Stations', value: '100+' },
    { icon: Radio, label: 'Daily Radio Listeners', value: '2.5M+' },
    { icon: TrendingUp, label: 'Radio Episodes', value: '200+' },
  ];

  const achievements = [
    { year: '2025', title: 'Art of Rave Radio Show', desc: '200+ episodes with 2.5M+ daily listeners across 100+ radio stations worldwide' },
    { year: '2024', title: 'Top 5 Beatport Charts', desc: 'More than 10 tracks placed in Top 5 Melodic Techno chart on Beatport' },
    { year: '2023', title: 'Industry Support', desc: 'Garnered support from Camelphat, Paul Van Dyk, and Benny Benassi' },
    { year: '2022', title: 'Major Label Releases', desc: 'Released on Interplay Records, Ensis Records, ICONYC, and more' },
    { year: '2021', title: '10M+ Streams', desc: 'Achieved over 10 million streams across all platforms' },
  ];

  const photos = [
    'https://www.dropbox.com/scl/fo/arx48wlfk7qtchtsx4vcy/ANjdW76bJxs_g-ZkOvYQZrw/Colour/Terry%20Golden_Black%201.jpg?rlkey=3icvvkf1cxjlphevsbirx1gjg&raw=1',
    'https://www.dropbox.com/scl/fo/arx48wlfk7qtchtsx4vcy/AD_zfyYeEc7GQBNa7Lfvtjk/Colour/Terry%20Golden_Grafitty%20Street%201.jpg?rlkey=3icvvkf1cxjlphevsbirx1gjg&raw=1',
    'https://www.dropbox.com/scl/fo/arx48wlfk7qtchtsx4vcy/AOp-qVlfleXuA5GL7_lQTRE/Colour/Terry%20Golden_Leather%201.jpg?rlkey=3icvvkf1cxjlphevsbirx1gjg&raw=1',
    'https://www.dropbox.com/scl/fo/arx48wlfk7qtchtsx4vcy/AG2fgPydHnxKL1N2sH6e-hk/Colour/Terry%20Golden_BW%201.jpg?rlkey=3icvvkf1cxjlphevsbirx1gjg&raw=1',
  ];

  const socialLinks = [
    { icon: Instagram, label: '@terrygoldenmusic', url: SOCIAL_LINKS.instagram.webUrl, platform: 'instagram' as SocialPlatform },
    { icon: Facebook, label: 'Terry Golden Music', url: SOCIAL_LINKS.facebook.webUrl, platform: 'facebook' as SocialPlatform },
    { icon: Twitter, label: '@TerryGo39456241', url: 'https://twitter.com/TerryGo39456241', platform: null },
    { icon: Music2, label: 'Spotify', url: SOCIAL_LINKS.spotify.webUrl, platform: 'spotify' as SocialPlatform },
    { icon: Cloud, label: 'SoundCloud', url: SOCIAL_LINKS.soundcloud.webUrl, platform: 'soundcloud' as SocialPlatform },
    { icon: Music, label: 'Beatport', url: 'https://www.beatport.com/artist/terry-golden/851376', platform: null },
    { icon: Youtube, label: 'YouTube', url: SOCIAL_LINKS.youtube.webUrl, platform: 'youtube' as SocialPlatform },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, platform: SocialPlatform | null, url: string) => {
    if (platform === 'spotify') {
      handleSpotifyClick(e, url);
    } else if (platform) {
      handleSocialClick(e, platform as Exclude<SocialPlatform, 'spotify'>);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="relative h-96 overflow-hidden">
        <img src={photos[1]} alt="Terry Golden" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <h1 className="text-6xl font-black text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Terry <span className="text-[#D4AF37]">Golden</span>
          </h1>
          <p className="text-xl text-gray-300">Danish DJ & Producer | Progressive & Melodic Techno</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-[#D4AF37]/10 to-black rounded-xl p-6 text-center border border-[#D4AF37]/30">
              <stat.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-6">Biography</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
              <p><span className="text-white font-semibold">Terry Golden</span> is a Denmark-based Producer and DJ whose unique take on the melodic undertones of Electronic Music has led to his steady climb.</p>
              <p>Known for a sound that sits between <span className="text-[#D4AF37] font-semibold">Melodic Techno and Progressive House</span>, blending melodic vocals with impactful drops.</p>
              <p>With more than <span className="text-white font-semibold">ten tracks placing in the Top 5 Melodic Techno chart on Beatport</span>, Terry has garnered support from <span className="text-[#D4AF37] font-semibold">Camelphat, Paul Van Dyke, and Benny Benassi</span>.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo, i) => (
              <img key={i} src={photo} alt={`Terry Golden ${i + 1}`} className="w-full h-48 object-cover rounded-xl border border-[#D4AF37]/20" />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-black rounded-2xl p-8 border border-[#D4AF37]/30">
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Connect</h2>
            <div className="space-y-4">
              {socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" onClick={(e) => handleClick(e, link.platform, link.url)} className="flex items-center gap-3 text-gray-300 hover:text-[#D4AF37] transition-colors">
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-black rounded-2xl p-8 border border-[#D4AF37]/30">
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Bookings</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 text-gray-300">
                <Mail className="w-5 h-5 mt-1 text-[#D4AF37]" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <a href="mailto:booking@terrygolden.com" className="hover:text-[#D4AF37] transition-colors">booking@terrygolden.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 mt-1 text-[#D4AF37]" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Based in</p>
                  <p>Copenhagen, Denmark</p>
                </div>
              </div>
            </div>
            <Button onClick={() => window.location.href = 'mailto:booking@terrygolden.com'} className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold">
              Request Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
