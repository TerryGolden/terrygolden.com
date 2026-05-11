import { useState } from 'react';
import { 
  X, ExternalLink, Music, Calendar, MapPin, Play, Users, 
  Disc3, Globe, Instagram, Twitter, Facebook, Headphones
} from 'lucide-react';
import { GuestDJ } from '@/data/guestDJsData';

interface GuestDJProfileModalProps {
  dj: GuestDJ | null;
  isOpen: boolean;
  onClose: () => void;
}

// Spotify icon component
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

// SoundCloud icon component
const SoundCloudIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.084-.1zm-.899 1.125c-.051 0-.094.046-.101.1l-.233 1.029.233 1.005c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-1.005-.255-1.029c-.009-.06-.052-.1-.099-.1zm1.83-.655c-.068 0-.12.055-.129.12l-.218 1.685.218 1.64c.009.065.061.12.129.12.068 0 .12-.055.129-.12l.248-1.64-.248-1.685c-.009-.065-.061-.12-.129-.12zm.899-.555c-.068 0-.12.055-.129.12l-.218 2.24.218 2.17c.009.065.061.12.129.12.068 0 .12-.055.129-.12l.248-2.17-.248-2.24c-.009-.065-.061-.12-.129-.12zm.899-.42c-.085 0-.148.065-.157.148l-.2 2.513.2 2.42c.009.083.072.148.157.148.085 0 .148-.065.157-.148l.227-2.42-.227-2.513c-.009-.083-.072-.148-.157-.148zm.899-.39c-.085 0-.148.065-.157.148l-.2 2.903.2 2.785c.009.083.072.148.157.148.085 0 .148-.065.157-.148l.227-2.785-.227-2.903c-.009-.083-.072-.148-.157-.148zm.899-.27c-.102 0-.175.075-.184.177l-.182 3.051.182 2.925c.009.102.082.177.184.177.102 0 .175-.075.184-.177l.209-2.925-.209-3.051c-.009-.102-.082-.177-.184-.177zm.899-.18c-.102 0-.175.075-.184.177l-.182 3.231.182 3.09c.009.102.082.177.184.177.102 0 .175-.075.184-.177l.209-3.09-.209-3.231c-.009-.102-.082-.177-.184-.177zm.899-.09c-.119 0-.201.085-.21.204l-.164 3.231.164 3.09c.009.119.091.204.21.204.119 0 .201-.085.21-.204l.191-3.09-.191-3.231c-.009-.119-.091-.204-.21-.204zm.899 0c-.119 0-.201.085-.21.204l-.164 3.231.164 3.09c.009.119.091.204.21.204.119 0 .201-.085.21-.204l.191-3.09-.191-3.231c-.009-.119-.091-.204-.21-.204zm.899-.09c-.136 0-.227.094-.236.23l-.146 3.411.146 3.24c.009.136.1.23.236.23.136 0 .227-.094.236-.23l.164-3.24-.164-3.411c-.009-.136-.1-.23-.236-.23zm.899-.09c-.136 0-.227.094-.236.23l-.146 3.501.146 3.33c.009.136.1.23.236.23.136 0 .227-.094.236-.23l.164-3.33-.164-3.501c-.009-.136-.1-.23-.236-.23zm.899-.09c-.153 0-.253.102-.262.255l-.128 3.591.128 3.42c.009.153.109.255.262.255.153 0 .253-.102.262-.255l.146-3.42-.146-3.591c-.009-.153-.109-.255-.262-.255zm.899-.09c-.153 0-.253.102-.262.255l-.128 3.681.128 3.51c.009.153.109.255.262.255.153 0 .253-.102.262-.255l.146-3.51-.146-3.681c-.009-.153-.109-.255-.262-.255zm.899-.09c-.17 0-.279.111-.288.281l-.11 3.771.11 3.6c.009.17.118.281.288.281.17 0 .279-.111.288-.281l.128-3.6-.128-3.771c-.009-.17-.118-.281-.288-.281zm3.352-.27c-.255 0-.465.075-.645.21-.135-1.53-1.425-2.73-2.985-2.73-.39 0-.765.075-1.11.21-.135.045-.165.09-.165.18v6.75c0 .09.075.165.165.18h4.74c1.32 0 2.385-1.065 2.385-2.385s-1.065-2.415-2.385-2.415z"/>
  </svg>
);

export default function GuestDJProfileModal({ dj, isOpen, onClose }: GuestDJProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'bio' | 'episodes' | 'appearances'>('bio');

  if (!isOpen || !dj) return null;

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 1: return 'Headliner';
      case 2: return 'Major Artist';
      case 3: return 'Rising Star';
      default: return 'Guest DJ';
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'from-pink-500 to-purple-500';
      case 2: return 'from-purple-500 to-blue-500';
      case 3: return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-black rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header with DJ image */}
          <div className={`relative bg-gradient-to-r ${getTierColor(dj.tier)} p-6 pb-24`}>
            <div className="absolute inset-0 bg-black/40" />
            {/* Background image */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url(${dj.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px)'
              }}
            />
            <div className="relative">
              <span className="inline-block px-3 py-1 bg-black/30 rounded-full text-xs font-semibold mb-2">
                {getTierLabel(dj.tier)}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-1">{dj.name}</h2>
              <p className="text-white/80 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {dj.country}
              </p>
            </div>
          </div>

          {/* Profile content */}
          <div className="relative -mt-16 px-6 pb-6">
            {/* Avatar and stats */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Avatar with actual image */}
              <div className="w-28 h-28 rounded-xl overflow-hidden shadow-lg border-4 border-zinc-900 flex-shrink-0">
                <img 
                  src={dj.imageUrl} 
                  alt={dj.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Quick stats */}
              <div className="flex flex-wrap gap-3 items-end">
                {dj.stats.monthlyListeners && (
                  <div className="bg-zinc-800/80 rounded-lg px-3 py-2 border border-zinc-700">
                    <p className="text-xs text-gray-400">Monthly Listeners</p>
                    <p className="text-lg font-bold text-purple-400">{dj.stats.monthlyListeners}</p>
                  </div>
                )}
                {dj.stats.followers && (
                  <div className="bg-zinc-800/80 rounded-lg px-3 py-2 border border-zinc-700">
                    <p className="text-xs text-gray-400">Followers</p>
                    <p className="text-lg font-bold text-pink-400">{dj.stats.followers}</p>
                  </div>
                )}
                {dj.stats.releases && (
                  <div className="bg-zinc-800/80 rounded-lg px-3 py-2 border border-zinc-700">
                    <p className="text-xs text-gray-400">Releases</p>
                    <p className="text-lg font-bold text-blue-400">{dj.stats.releases}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-2 mb-6">
              {dj.socialLinks.spotify && (
                <a 
                  href={dj.socialLinks.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1DB954]/20 hover:bg-[#1DB954]/30 border border-[#1DB954]/50 rounded-lg transition-colors"
                >
                  <SpotifyIcon className="w-5 h-5 text-[#1DB954]" />
                  <span className="text-sm font-medium">Spotify</span>
                </a>
              )}
              {dj.socialLinks.soundcloud && (
                <a 
                  href={dj.socialLinks.soundcloud} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF5500]/20 hover:bg-[#FF5500]/30 border border-[#FF5500]/50 rounded-lg transition-colors"
                >
                  <SoundCloudIcon className="w-5 h-5 text-[#FF5500]" />
                  <span className="text-sm font-medium">SoundCloud</span>
                </a>
              )}
              {dj.socialLinks.instagram && (
                <a 
                  href={dj.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-pink-500/50 rounded-lg transition-colors"
                >
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              )}
              {dj.socialLinks.twitter && (
                <a 
                  href={dj.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/50 rounded-lg transition-colors"
                >
                  <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              )}
              {dj.socialLinks.facebook && (
                <a 
                  href={dj.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/50 rounded-lg transition-colors"
                >
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              )}
              {dj.socialLinks.website && (
                <a 
                  href={dj.socialLinks.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600 rounded-lg transition-colors"
                >
                  <Globe className="w-5 h-5 text-gray-300" />
                  <span className="text-sm font-medium">Website</span>
                </a>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {dj.genres.map((genre, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full text-xs text-purple-300"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-zinc-800 pb-2">
              <button
                onClick={() => setActiveTab('bio')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'bio' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Biography
              </button>
              <button
                onClick={() => setActiveTab('episodes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'episodes' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Headphones className="w-4 h-4 inline mr-2" />
                Guest Mixes ({dj.episodes.length})
              </button>
              <button
                onClick={() => setActiveTab('appearances')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'appearances' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Upcoming ({dj.upcomingAppearances.length})
              </button>
            </div>

            {/* Tab content */}
            <div className="min-h-[200px]">
              {/* Bio Tab */}
              {activeTab === 'bio' && (
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">{dj.bio}</p>
                </div>
              )}

              {/* Episodes Tab */}
              {activeTab === 'episodes' && (
                <div className="space-y-3">
                  {dj.episodes.length > 0 ? (
                    dj.episodes.map((episode, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <Play className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{episode.title}</h4>
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                              <Disc3 className="w-3 h-3" />
                              Episode {episode.episodeNumber}
                              <span className="text-gray-600">•</span>
                              <Calendar className="w-3 h-3" />
                              {new Date(episode.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        {episode.mixcloudUrl && (
                          <a 
                            href={episode.mixcloudUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            Listen <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No guest mixes available yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Appearances Tab */}
              {activeTab === 'appearances' && (
                <div className="space-y-3">
                  {dj.upcomingAppearances.length > 0 ? (
                    dj.upcomingAppearances.map((appearance, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{appearance.event}</h4>
                            <p className="text-purple-400 text-sm">{appearance.venue}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {appearance.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(appearance.date).toLocaleDateString('en-US', { 
                                  weekday: 'short',
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                          {appearance.ticketUrl && (
                            <a 
                              href={appearance.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                              Get Tickets <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No upcoming appearances announced</p>
                      <p className="text-sm mt-1">Check back soon for updates!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
