import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Track {
  id?: string;
  episode_id: string;
  position: number;
  track_name: string;
  artist_name: string;
  label_name?: string;
  timestamp_seconds?: number;
  timestamp_display?: string;
  spotify_track_id?: string;
  spotify_url?: string;
  beatport_url?: string;
}

interface Props {
  episode: { id: string; name: string; cover_art_large_url: string };
  onClose: () => void;
}

const TracklistManager = ({ episode, onClose }: Props) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [searchingTracks, setSearchingTracks] = useState<Set<number>>(new Set());

  useEffect(() => { fetchTracks(); }, [episode.id]);

  const fetchTracks = async () => {
    const { data } = await supabase.from('episode_tracklists').select('*').eq('episode_id', episode.id).order('position');
    if (data) setTracks(data);
    setLoading(false);
  };

  const addTrack = () => {
    setTracks([...tracks, { episode_id: episode.id, position: tracks.length + 1, track_name: '', artist_name: '' }]);
  };

  const updateTrack = (idx: number, field: keyof Track, value: string) => {
    const updated = [...tracks];
    (updated[idx] as any)[field] = value;
    if (field === 'timestamp_display') updated[idx].timestamp_seconds = parseTimestamp(value);
    setTracks(updated);
  };

  const parseTimestamp = (ts: string): number => {
    const parts = ts.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const searchSpotify = async (idx: number) => {
    const track = tracks[idx];
    if (!track.artist_name || !track.track_name) {
      toast.error('Artist and track name required');
      return;
    }

    setSearchingTracks(new Set(searchingTracks).add(idx));
    
    try {
      const { data, error } = await supabase.functions.invoke('search-spotify-track', {
        body: { artist: track.artist_name, track: track.track_name }
      });

      if (error) throw error;

      if (data?.found) {
        const updated = [...tracks];
        updated[idx].spotify_track_id = data.trackId;
        updated[idx].spotify_url = data.trackUrl;
        setTracks(updated);
        toast.success(`Found: ${data.trackName}`);
      } else {
        toast.error('No Spotify match found');
      }
    } catch (err: any) {
      toast.error(err.message || 'Spotify search failed');
    } finally {
      const newSet = new Set(searchingTracks);
      newSet.delete(idx);
      setSearchingTracks(newSet);
    }
  };

  const searchAllSpotify = async () => {
    const tracksToSearch = tracks.filter(t => t.artist_name && t.track_name && !t.spotify_track_id);
    if (tracksToSearch.length === 0) {
      toast.info('All tracks already have Spotify links');
      return;
    }

    toast.info(`Searching Spotify for ${tracksToSearch.length} tracks...`);
    
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].artist_name && tracks[i].track_name && !tracks[i].spotify_track_id) {
        await searchSpotify(i);
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
      }
    }
  };

  const removeTrack = (idx: number) => setTracks(tracks.filter((_, i) => i !== idx));

  const moveTrack = (idx: number, dir: 'up' | 'down') => {
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === tracks.length - 1)) return;
    const arr = [...tracks];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    arr.forEach((t, i) => t.position = i + 1);
    setTracks(arr);
  };

  const parseBulkImport = () => {
    const lines = bulkText.split('\n').filter(l => l.trim());
    const parsed: Track[] = lines.map((line, i) => {
      const tsMatch = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*/);
      let rest = tsMatch ? line.slice(tsMatch[0].length) : line;
      const parts = rest.split(/\s*[-–—]\s*/);
      const artist = parts[0]?.trim() || 'Unknown';
      const track = parts.slice(1).join(' - ').trim() || rest.trim();
      return { episode_id: episode.id, position: tracks.length + i + 1, artist_name: artist, track_name: track, timestamp_display: tsMatch?.[1] || '', timestamp_seconds: tsMatch ? parseTimestamp(tsMatch[1]) : undefined };
    });
    setTracks([...tracks, ...parsed]);
    setBulkText('');
    setShowBulkImport(false);
    toast.success(`Imported ${parsed.length} tracks`);
  };

  const saveTracks = async () => {
    setSaving(true);
    try {
      await supabase.from('episode_tracklists').delete().eq('episode_id', episode.id);
      if (tracks.length > 0) {
        const toSave = tracks.map((t, i) => ({ ...t, position: i + 1, id: undefined }));
        const { error } = await supabase.from('episode_tracklists').insert(toSave);
        if (error) throw error;
      }
      toast.success('Tracklist saved!');
      onClose();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-700 flex items-center gap-2">
          <img src={episode.cover_art_large_url} className="w-14 h-14 rounded" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold">Edit Tracklist</h2>
            <p className="text-gray-400 text-sm truncate">{episode.name}</p>
          </div>
          <Button size="sm" variant="outline" onClick={searchAllSpotify}><Search className="w-4 h-4 mr-1" />Search All</Button>
          <Button size="sm" variant="outline" onClick={() => setShowBulkImport(!showBulkImport)}><Upload className="w-4 h-4 mr-1" />Bulk</Button>
          <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={saveTracks} disabled={saving} className="bg-purple-600 hover:bg-purple-700">{saving ? 'Saving...' : 'Save'}</Button>
        </div>
        {showBulkImport && (
          <div className="p-4 bg-zinc-800 border-b border-zinc-700">
            <p className="text-sm text-gray-400 mb-2">Paste tracklist (format: "00:00 Artist - Track Name" per line)</p>
            <Textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={5} placeholder="00:00 Artist Name - Track Title&#10;05:30 Another Artist - Another Track" />
            <Button size="sm" onClick={parseBulkImport} className="mt-2 bg-cyan-600 hover:bg-cyan-700">Import Tracks</Button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {tracks.map((track, idx) => (
            <div key={idx} className="bg-zinc-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold w-6 text-center">{idx + 1}</span>
                <Input placeholder="Artist" value={track.artist_name} onChange={(e) => updateTrack(idx, 'artist_name', e.target.value)} className="flex-1" />
                <Input placeholder="Track Name" value={track.track_name} onChange={(e) => updateTrack(idx, 'track_name', e.target.value)} className="flex-1" />
                <Input placeholder="Label" value={track.label_name || ''} onChange={(e) => updateTrack(idx, 'label_name', e.target.value)} className="w-32" />
                <Input placeholder="00:00" value={track.timestamp_display || ''} onChange={(e) => updateTrack(idx, 'timestamp_display', e.target.value)} className="w-20" />
                <Button size="sm" variant="ghost" onClick={() => searchSpotify(idx)} disabled={searchingTracks.has(idx)}>
                  {searchingTracks.has(idx) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => moveTrack(idx, 'up')}>↑</Button>
                <Button size="sm" variant="ghost" onClick={() => moveTrack(idx, 'down')}>↓</Button>
                <Button size="sm" variant="ghost" onClick={() => removeTrack(idx)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
              </div>
              {track.spotify_url && (
                <div className="pl-8 text-xs text-green-400 flex items-center gap-2">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify linked
                </div>
              )}
            </div>
          ))}
          <Button onClick={addTrack} variant="outline" className="w-full border-dashed"><Plus className="w-4 h-4 mr-2" />Add Track</Button>
        </div>
      </Card>
    </div>
  );
};

export default TracklistManager;
