import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PlatformLinks from '@/components/PlatformLinks';
import SocialShareButtons from '@/components/SocialShareButtons';
import { albumIds } from '@/data/releasesData';
import { handleSpotifyClick, isMobileDevice } from '@/lib/socialMediaUtils';


interface Release {
  id: string;
  name: string;
  releaseDate: string;
  image: string;
  type: string;
  spotifyUrl: string;
  appleMusicUrl: string;
  deezerUrl: string;
  youtubeMusicUrl: string;
  youtubeUrl: string;
  beatportUrl: string;
  totalTracks: number;
}

const Releases = () => {
  const [filter, setFilter] = useState('All');
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const types = ['All', 'single', 'album'];

  useEffect(() => { fetchReleases(); }, []);

  const fetchReleases = async () => {
    try {
      const { data: dbReleases } = await supabase
        .from('releases')
        .select('*')
        .order('display_order', { ascending: true })
        .order('release_date', { ascending: false });

      if (dbReleases && dbReleases.length > 0) {
        const mapped = dbReleases.map(r => {
          const name = r.title || r.name || 'Unknown';
          const encoded = encodeURIComponent(`Terry Golden ${name}`);
          return {
            id: r.spotify_id || r.id,
            name,
            releaseDate: r.release_date,
            image: r.artwork_url || r.image_url,
            type: r.album_type || r.type || 'single',
            spotifyUrl: r.spotify_url || `https://open.spotify.com/search/${encoded}`,
            appleMusicUrl: r.apple_music_url || `https://music.apple.com/search?term=${encoded}`,
            deezerUrl: r.deezer_url || `https://www.deezer.com/search/${encoded}`,
            youtubeMusicUrl: r.youtube_music_url || `https://music.youtube.com/search?q=${encoded}`,
            youtubeUrl: r.youtube_url || `https://www.youtube.com/results?search_query=${encoded}`,
            beatportUrl: r.beatport_url || `https://www.beatport.com/search?q=${encoded}`,
            totalTracks: r.total_tracks || 1
          };
        });
        setReleases(mapped);
      } else {
        const { data, error } = await supabase.functions.invoke('fetch-albums-v3', {
          body: { albumIds }
        });
        if (!error && data?.releases) setReleases(data.releases);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'All' ? releases : releases.filter(r => r.type?.toLowerCase() === filter.toLowerCase());

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handlePlayClick = (e: React.MouseEvent<HTMLAnchorElement>, spotifyUrl: string) => {
    handleSpotifyClick(e, spotifyUrl);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              <span className="text-[#D4AF37]">Releases</span>
            </h1>
            <p className="text-gray-400 text-lg">Complete Discography</p>
          </div>
          <div className="flex justify-center gap-3 mb-12">
            {types.map((type) => (
              <button key={type} onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === type ? 'bg-[#D4AF37] text-black' : 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30'
                }`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D4AF37] border-t-transparent"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No releases found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((release) => (
                <div key={release.id} className="group bg-zinc-900 rounded-lg overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all">
                  <div className="aspect-square overflow-hidden relative">
                    <img src={release.image} alt={release.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a 
                        href={release.spotifyUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => handlePlayClick(e, release.spotifyUrl)}
                        className="p-4 bg-[#D4AF37] rounded-full hover:bg-[#B8941F] transition-colors hover:scale-110"
                        title={isMobileDevice() ? 'Open in Spotify app' : 'Play on Spotify'}
                      >
                        <Play className="w-8 h-8 text-black fill-black" />
                      </a>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#D4AF37] uppercase tracking-wider">{release.type}</span>
                      <span className="text-xs text-gray-500">{formatDate(release.releaseDate)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">{release.name}</h3>
                    <div className="mb-3">
                      <PlatformLinks 
                        links={{
                          spotify: release.spotifyUrl,
                          appleMusic: release.appleMusicUrl,
                          deezer: release.deezerUrl,
                          youtubeMusic: release.youtubeMusicUrl,
                          youtube: release.youtubeUrl,
                          beatport: release.beatportUrl
                        }} 
                        size="sm" 
                      />
                    </div>
                    <div className="pt-3 border-t border-gray-800">
                      <SocialShareButtons
                        url={release.spotifyUrl}
                        title={`${release.name} by Terry Golden`}
                        description={`Check out this ${release.type} from Terry Golden`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Releases;
