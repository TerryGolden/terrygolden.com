import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Music, Clock, ExternalLink, ListMusic, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  handleSpotifyClick, 
  handleAppleMusicClick,
  isMobileDevice, 
  getSpotifyAppUrl 
} from '@/lib/socialMediaUtils';

interface Track {
  id: string;
  position: number;
  track_name: string;
  artist_name: string;
  label_name?: string;
  timestamp_seconds?: number;
  timestamp_display?: string;
  spotify_track_id?: string;
  spotify_url?: string;
  beatport_url?: string;
  apple_music_url?: string;
  youtube_url?: string;
}

interface Props {
  episodeId: string;
  episodeTitle?: string;
  className?: string;
}

// Generate search URLs for different platforms
const generateSearchUrls = (artist: string, track: string) => {
  const query = encodeURIComponent(`${artist} ${track}`);
  return {
    spotify: `https://open.spotify.com/search/${query}`,
    appleMusic: `https://music.apple.com/us/search?term=${query}`,
    youtube: `https://www.youtube.com/results?search_query=${query}`,
    youtubeMusic: `https://music.youtube.com/search?q=${query}`
  };
};

const EpisodeTracklist = ({ episodeId, episodeTitle, className = '' }: Props) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchingSpotify, setSearchingSpotify] = useState(false);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);

  useEffect(() => {
    fetchTracklist();
  }, [episodeId]);

  const fetchTracklist = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('episode_tracklists')
      .select('*')
      .eq('episode_id', episodeId)
      .order('position');

    if (!error && data) {
      setTracks(data);
      // Auto-search for tracks without Spotify IDs
      const tracksWithoutSpotify = data.filter(t => !t.spotify_track_id);
      if (tracksWithoutSpotify.length > 0) {
        searchSpotifyForTracks(tracksWithoutSpotify);
      }
    }
    setLoading(false);
  };

  const searchSpotifyForTracks = async (tracksToSearch: Track[]) => {
    setSearchingSpotify(true);
    
    for (const track of tracksToSearch) {
      try {
        const { data, error } = await supabase.functions.invoke('search-spotify-track', {
          body: { artist: track.artist_name, track: track.track_name }
        });

        if (!error && data?.found) {
          // Update database with Spotify info
          await supabase
            .from('episode_tracklists')
            .update({
              spotify_track_id: data.trackId,
              spotify_url: data.trackUrl
            })
            .eq('id', track.id);

          // Update local state
          setTracks(prev => prev.map(t => 
            t.id === track.id 
              ? { ...t, spotify_track_id: data.trackId, spotify_url: data.trackUrl }
              : t
          ));
        }
      } catch (err) {
        console.error(`Failed to search Spotify for ${track.track_name}:`, err);
      }
    }
    
    setSearchingSpotify(false);
  };

  const createPlaylist = async () => {
    const spotifyToken = localStorage.getItem('spotify_access_token');
    
    if (!spotifyToken) {
      toast.error('Please connect your Spotify account first');
      return;
    }

    const trackIds = tracks
      .filter(t => t.spotify_track_id)
      .map(t => t.spotify_track_id);

    if (trackIds.length === 0) {
      toast.error('No Spotify tracks found in this tracklist');
      return;
    }

    setCreatingPlaylist(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-spotify-playlist', {
        body: {
          episodeTitle: episodeTitle || 'Radio Episode Tracklist',
          trackIds,
          accessToken: spotifyToken
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Playlist created! ${data.trackCount} tracks added`);
        
        // Use deep linking on mobile to open the playlist in Spotify app
        if (isMobileDevice() && data.playlistUrl) {
          const appUrl = getSpotifyAppUrl(data.playlistUrl);
          window.location.href = appUrl;
          // Fallback to web if app doesn't open
          setTimeout(() => {
            window.open(data.playlistUrl, '_blank');
          }, 1500);
        } else {
          window.open(data.playlistUrl, '_blank');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create playlist');
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const handleTrackSpotifyClick = (e: React.MouseEvent<HTMLAnchorElement>, spotifyUrl: string) => {
    handleSpotifyClick(e, spotifyUrl);
  };

  const handleTrackAppleMusicClick = (e: React.MouseEvent<HTMLAnchorElement>, appleMusicUrl: string) => {
    handleAppleMusicClick(e, appleMusicUrl);
  };

  const handleYouTubeClick = (e: React.MouseEvent<HTMLAnchorElement>, youtubeUrl: string) => {
    e.preventDefault();
    if (isMobileDevice()) {
      // Try YouTube app deep link
      const videoMatch = youtubeUrl.match(/[?&]v=([^&]+)/);
      if (videoMatch) {
        window.location.href = `vnd.youtube://${videoMatch[1]}`;
        setTimeout(() => {
          window.open(youtubeUrl, '_blank');
        }, 1500);
      } else {
        window.open(youtubeUrl, '_blank');
      }
    } else {
      window.open(youtubeUrl, '_blank');
    }
  };

  const toggleTrackLinks = (trackId: string) => {
    setExpandedTrackId(expandedTrackId === trackId ? null : trackId);
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-zinc-800 rounded w-24 mb-3"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-zinc-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className={`text-gray-500 text-sm flex items-center gap-2 ${className}`}>
        <Music className="w-4 h-4" />
        No tracklist available
      </div>
    );
  }

  const spotifyTracksCount = tracks.filter(t => t.spotify_track_id).length;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-400" />
          Tracklist ({tracks.length} tracks)
        </h4>
        
        {spotifyTracksCount > 0 && (
          <Button
            onClick={createPlaylist}
            disabled={creatingPlaylist}
            size="sm"
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            {creatingPlaylist ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ListMusic className="w-4 h-4" />
            )}
            Create Playlist ({spotifyTracksCount})
          </Button>
        )}
      </div>

      {searchingSpotify && (
        <div className="mb-3 text-sm text-gray-400 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Searching Spotify for tracks...
        </div>
      )}

      <div className="space-y-1">
        {tracks.map((track) => {
          const searchUrls = generateSearchUrls(track.artist_name, track.track_name);
          const isExpanded = expandedTrackId === track.id;
          
          return (
            <div key={track.id} className="group">
              <div
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer"
                onClick={() => toggleTrackLinks(track.id)}
              >
                <span className="text-purple-400 font-mono text-sm w-6 text-center">
                  {track.position}
                </span>
                
                {track.timestamp_display && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 font-mono w-14">
                    <Clock className="w-3 h-3" />
                    {track.timestamp_display}
                  </span>
                )}
                
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-white">{track.artist_name}</span>
                  <span className="text-gray-400 mx-2">-</span>
                  <span className="text-gray-300">{track.track_name}</span>
                  {track.label_name && (
                    <span className="text-gray-500 text-xs ml-2">[{track.label_name}]</span>
                  )}
                </div>
                
                {/* Quick action buttons - always visible on hover */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Spotify */}
                  {track.spotify_url ? (
                    <a
                      href={track.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackSpotifyClick(e, track.spotify_url!);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-green-600/20 text-green-400 text-xs hover:bg-green-600/30 transition-colors"
                      title={isMobileDevice() ? 'Open in Spotify app' : 'Open in Spotify'}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                    </a>
                  ) : (
                    <a
                      href={searchUrls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackSpotifyClick(e, searchUrls.spotify);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-green-600/10 text-green-400/70 text-xs hover:bg-green-600/20 transition-colors"
                      title="Search on Spotify"
                    >
                      <Search className="w-3 h-3" />
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                    </a>
                  )}
                  
                  {/* Expand indicator */}
                  <span className="text-gray-500 text-xs">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>
              
              {/* Expanded streaming links */}
              {isExpanded && (
                <div className="ml-9 mt-1 mb-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/50 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs text-gray-400 mb-2">Find this track on:</p>
                  <div className="flex flex-wrap gap-2">
                    {/* Spotify */}
                    <a
                      href={track.spotify_url || searchUrls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleTrackSpotifyClick(e, track.spotify_url || searchUrls.spotify)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600/20 text-green-400 text-xs hover:bg-green-600/30 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Spotify
                    </a>
                    
                    {/* Apple Music */}
                    <a
                      href={track.apple_music_url || searchUrls.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleTrackAppleMusicClick(e, track.apple_music_url || searchUrls.appleMusic)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-600/20 text-pink-400 text-xs hover:bg-pink-600/30 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.8.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81.84-.553 1.472-1.287 1.88-2.208.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.228-2.403-.95-.486-.58-.59-1.252-.4-1.984.206-.794.79-1.29 1.49-1.59.478-.207.983-.3 1.49-.387.376-.064.753-.13 1.123-.233.217-.06.378-.162.44-.397.014-.058.013-.12.013-.18V8.572c0-.2-.058-.294-.253-.323-.373-.055-.745-.115-1.118-.165-.747-.1-1.494-.2-2.243-.29-.635-.078-1.27-.148-1.906-.22-.46-.053-.92-.11-1.38-.163-.093-.01-.187-.01-.28-.014-.17-.007-.283.083-.31.253-.01.067-.016.134-.016.2v8.08c0 .37-.04.736-.186 1.08-.316.744-.9 1.2-1.667 1.418-.39.11-.79.164-1.197.17-.943.013-1.763-.27-2.346-.99-.46-.57-.575-1.228-.41-1.93.2-.858.81-1.418 1.57-1.757.46-.206.95-.317 1.452-.4.412-.07.824-.13 1.23-.22.193-.04.378-.106.503-.28.082-.114.103-.243.103-.378V5.333c0-.2.03-.395.127-.578.12-.226.31-.366.55-.41.14-.028.283-.04.426-.054l1.57-.168c.795-.085 1.59-.17 2.384-.255l1.97-.21c.652-.07 1.303-.14 1.955-.21l1.5-.16c.108-.013.217-.013.325-.02.227-.006.394.097.472.313.03.084.042.173.042.262v5.664z"/>
                      </svg>
                      Apple Music
                    </a>
                    
                    {/* YouTube */}
                    <a
                      href={track.youtube_url || searchUrls.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleYouTubeClick(e, track.youtube_url || searchUrls.youtube)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/20 text-red-400 text-xs hover:bg-red-600/30 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube
                    </a>
                    
                    {/* YouTube Music */}
                    <a
                      href={searchUrls.youtubeMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (isMobileDevice()) {
                          window.location.href = `vnd.youtube.music://music.youtube.com/search?q=${encodeURIComponent(`${track.artist_name} ${track.track_name}`)}`;
                          setTimeout(() => {
                            window.open(searchUrls.youtubeMusic, '_blank');
                          }, 1500);
                        } else {
                          window.open(searchUrls.youtubeMusic, '_blank');
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/20 text-red-400 text-xs hover:bg-red-600/30 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
                      </svg>
                      YT Music
                    </a>
                    
                    {/* Beatport */}
                    {track.beatport_url && (
                      <a
                        href={track.beatport_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-600/20 text-cyan-400 text-xs hover:bg-cyan-600/30 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Beatport
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Click on a track to see all streaming options
      </p>
    </div>
  );
};

export default EpisodeTracklist;
