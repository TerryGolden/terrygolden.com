import { Play, ExternalLink, Loader2, Star, Share2 } from 'lucide-react';
import { useState } from 'react';
import { PageType } from './AppLayout';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useReleases, Release } from '@/hooks/useReleases';
import PlatformLinks from './PlatformLinks';
import SocialShareButtons from './SocialShareButtons';
import { handleSpotifyClick, isMobileDevice } from '@/lib/socialMediaUtils';


interface Props {
  fullPage?: boolean;
  setCurrentPage?: (page: PageType) => void;
}

const FeaturedReleases = ({ fullPage, setCurrentPage }: Props) => {
  const { playTrack, playlist } = useMusicPlayer();
  const { releases, loading, error } = useReleases(fullPage ? false : true);
  const displayReleases = fullPage ? releases : releases.slice(0, 6);
  const [shareModalOpen, setShareModalOpen] = useState<string | null>(null);


  const handlePlayTrack = (release: Release) => {
    const track = playlist.find(t => t.id.toString() === release.id);
    if (track) {
      playTrack(track);
    } else {
      const encoded = encodeURIComponent(`Terry Golden ${release.title}`);
      const url = release.spotify_url || `https://open.spotify.com/search/${encoded}`;
      
      // Use Spotify deep linking on mobile
      if (isMobileDevice()) {
        // Create a synthetic event for the handler
        const syntheticEvent = {
          preventDefault: () => {},
        } as React.MouseEvent<HTMLButtonElement>;
        handleSpotifyClick(syntheticEvent, url);
      } else {
        window.open(url, '_blank');
      }
    }
  };

  const getPlatformLinks = (release: Release) => {
    const encoded = encodeURIComponent(`Terry Golden ${release.title}`);
    return {
      spotify: release.spotify_url || `https://open.spotify.com/search/${encoded}`,
      appleMusic: release.apple_music_url || `https://music.apple.com/search?term=${encoded}`,
      deezer: release.deezer_url || `https://www.deezer.com/search/${encoded}`,
      youtubeMusic: release.youtube_music_url || `https://music.youtube.com/search?q=${encoded}`,
      youtube: release.youtube_url || `https://www.youtube.com/results?search_query=${encoded}`,
      beatport: release.beatport_url || `https://www.beatport.com/search?q=${encoded}`,
    };
  };

  if (loading) {
    return (
      <section className={fullPage ? 'pt-24 pb-20' : 'py-20 bg-black'}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={fullPage ? 'pt-24 pb-20' : 'py-20 bg-black'}>
        <div className="text-center py-20 text-gray-400">Failed to load releases</div>
      </section>
    );
  }

  return (
    <section id="releases" className={fullPage ? 'pt-24 pb-20' : 'py-20 bg-black'}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
              {fullPage ? '' : 'Latest '}<span className="text-[#D4AF37]">Releases</span>
            </h2>
            <p className="text-gray-400">{fullPage ? 'All tracks' : 'Fresh tracks'}</p>
          </div>
          {!fullPage && setCurrentPage && (
            <button onClick={() => setCurrentPage('releases')} className="hidden sm:flex items-center gap-2 text-[#D4AF37] hover:text-[#C5A028] font-semibold">
              View All <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>

        {displayReleases.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No releases available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReleases.map((release) => (
              <div key={release.id} className="group bg-gradient-to-b from-[#D4AF37]/5 to-black rounded-xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all">
                <div className="aspect-square overflow-hidden relative">
                  <img src={release.artwork_url || '/placeholder.svg'} alt={release.title} className="w-full h-full object-cover" />
                  {release.beatport_chart_position && (
                    <div className="absolute top-3 left-3 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" /> #{release.beatport_chart_position}
                    </div>
                  )}
                  <button onClick={() => handlePlayTrack(release)} className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] hover:scale-110 flex items-center justify-center transition-all">
                      <Play className="w-8 h-8 text-black ml-1" fill="black" />
                    </div>
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{release.title}</h3>
                      <p className="text-gray-500 text-sm">{new Date(release.release_date).toLocaleDateString()}</p>
                      {release.label && <p className="text-gray-600 text-xs mb-2">{release.label}</p>}
                    </div>
                    <button
                      onClick={() => setShareModalOpen(shareModalOpen === release.id ? null : release.id)}
                      className="p-2 rounded-full bg-gray-800 hover:bg-[#D4AF37] transition-all hover:scale-110 flex-shrink-0"
                      title="Share this release"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  {shareModalOpen === release.id && (
                    <div className="mb-3 p-3 bg-black/50 rounded-lg border border-[#D4AF37]/20">
                      <SocialShareButtons
                        url={release.spotify_url || `${window.location.origin}/releases`}
                        title={`${release.title} by Terry Golden`}
                        description={`Check out this amazing track${release.label ? ` on ${release.label}` : ''}! 🎵`}
                        image={release.artwork_url}
                        hashtags={['TerryGolden', 'EDM', 'ElectronicMusic']}
                        compact
                      />
                    </div>
                  )}
                  
                  <PlatformLinks links={getPlatformLinks(release)} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedReleases;
