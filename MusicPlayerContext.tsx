import { createContext, useContext, useState, useRef, ReactNode } from 'react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverImage: string;
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  playlist: Track[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return context;
};

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);

  const playlist: Track[] = [
    { id: 1, title: 'Another Life', artist: 'Terry Golden', duration: 195, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', coverImage: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174037815_7d07c39a.webp' },
    { id: 2, title: 'Walk Like An Egyptian', artist: 'Terry Golden', duration: 210, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', coverImage: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174039713_d974c3d7.webp' },
    { id: 3, title: 'Space', artist: 'Terry Golden', duration: 180, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', coverImage: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174041577_745c6033.webp' },
    { id: 4, title: 'Rave The Universe', artist: 'Terry Golden', duration: 205, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', coverImage: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174043537_d62d2e01.webp' },
    { id: 5, title: 'Shine', artist: 'Terry Golden', duration: 188, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', coverImage: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174045398_bac41115.webp' },
  ];

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const idx = playlist.findIndex(t => t.id === currentTrack.id);
    playTrack(playlist[(idx + 1) % playlist.length]);
  };

  const previousTrack = () => {
    if (!currentTrack) return;
    const idx = playlist.findIndex(t => t.id === currentTrack.id);
    playTrack(playlist[(idx - 1 + playlist.length) % playlist.length]);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  return (
    <MusicPlayerContext.Provider value={{ currentTrack, isPlaying, currentTime, volume, playlist, playTrack, togglePlay, nextTrack, previousTrack, seekTo, setVolume, audioRef }}>
      {children}
      <audio ref={audioRef} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} onEnded={nextTrack} />
    </MusicPlayerContext.Provider>
  );
};
