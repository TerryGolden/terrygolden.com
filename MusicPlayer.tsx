import { Play, Pause, SkipBack, SkipForward, Volume2, List, Share2 } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useState } from 'react';
import { AudioVisualizer, themes } from './AudioVisualizer';
import { VisualizerControls } from './VisualizerControls';
import SocialShareButtons from './SocialShareButtons';

const MusicPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, nextTrack, previousTrack, playlist, playTrack } = useMusicPlayer();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState('golden');
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;


  const currentTheme = themes.find(t => t.id === currentThemeId) || themes[0];

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-[#D4AF37]/20 z-50">
      {showPlaylist && (
        <div className="absolute bottom-full left-0 right-0 bg-black/95 border-t border-[#D4AF37]/20 max-h-96 overflow-y-auto">
          <div className="p-2">
            {playlist.map((track) => (
              <button key={track.id} onClick={() => { playTrack(track); setShowPlaylist(false); }} className={`w-full p-2 sm:p-3 rounded hover:bg-zinc-800 text-left transition ${currentTrack.id === track.id ? 'bg-zinc-800 border-l-2 border-[#D4AF37]' : ''}`}>
                <div className="font-medium text-xs sm:text-sm truncate">{track.title}</div>
                <div className="text-xs text-zinc-400 truncate">{track.artist} • {formatTime(track.duration)}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {showShare && (
        <div className="absolute bottom-full left-0 right-0 bg-black/95 border-t border-[#D4AF37]/20 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Share Now Playing</h3>
              <button onClick={() => setShowShare(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <SocialShareButtons
              url={`${window.location.origin}`}
              title={`${currentTrack.title} by ${currentTrack.artist}`}
              description={`Check out this track by Terry Golden! 🎵`}
              hashtags={['TerryGolden', 'NowPlaying', 'EDM']}
            />
          </div>
        </div>
      )}
      
      {/* Visualizer */}
      <div className="h-20 overflow-hidden">
        <AudioVisualizer theme={currentTheme} height={80} />
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-xs sm:text-sm truncate">{currentTrack.title}</div>
            <div className="text-[#D4AF37] text-xs truncate">{currentTrack.artist}</div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={previousTrack} className="p-2 hover:bg-zinc-800 rounded-full transition">
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={togglePlay} className="p-2 sm:p-3 bg-[#D4AF37] hover:bg-[#C5A028] rounded-full transition">
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-black" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 text-black" />}
            </button>
            <button onClick={nextTrack} className="p-2 hover:bg-zinc-800 rounded-full transition">
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            <VisualizerControls currentTheme={currentThemeId} onThemeChange={setCurrentThemeId} />
            <button 
              onClick={() => setShowShare(!showShare)} 
              className="p-2 hover:bg-zinc-800 rounded-full transition"
              title="Share track"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => setShowPlaylist(!showPlaylist)} className="p-2 hover:bg-zinc-800 rounded-full transition hidden sm:block">
              <List className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-full transition hidden sm:block">
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default MusicPlayer;
