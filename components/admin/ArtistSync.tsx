import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, Users, RefreshCw, Plus, Trash2, Music } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Artist {
  id: string;
  spotify_id: string;
  name: string;
  image_url: string | null;
  genres: string[];
  followers: number;
  last_synced_at: string | null;
  is_active: boolean;
}

export const ArtistSync = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [newArtistUrl, setNewArtistUrl] = useState('');
  const [addingArtist, setAddingArtist] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchArtists(); }, []);

  const fetchArtists = async () => {
    setLoading(true);
    const { data } = await supabase.from('monitored_artists').select('*').order('name');
    setArtists(data || []);
    setLoading(false);
  };

  const extractArtistId = (url: string): string | null => {
    const match = url.match(/artist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const addArtist = async () => {
    const artistId = extractArtistId(newArtistUrl);
    if (!artistId) { setError('Invalid Spotify artist URL'); return; }
    
    setAddingArtist(true);
    setError('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('artist-sync-v2', {
        body: { artistId }
      });
      if (fnError) throw new Error(fnError.message);
      if (!data.success) throw new Error(data.error);

      setSyncResult(data);
      setNewArtistUrl('');
      fetchArtists();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingArtist(false);
    }
  };

  const syncAllArtists = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('artist-sync-v2', {
        body: { syncAll: true }
      });
      if (fnError) throw new Error(fnError.message);
      setSyncResult(data);

      fetchArtists();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const removeArtist = async (id: string) => {
    await supabase.from('monitored_artists').delete().eq('id', id);
    fetchArtists();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/80 backdrop-blur border border-cyan-500/30 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Plus className="w-6 h-6 text-cyan-400" />
          Add Artist to Monitor
        </h2>
        <div className="flex gap-3">
          <input type="url" value={newArtistUrl} onChange={(e) => setNewArtistUrl(e.target.value)}
            className="flex-1 bg-black/60 border border-gray-700 rounded-xl px-5 py-4 text-white focus:border-cyan-400 focus:outline-none"
            placeholder="https://open.spotify.com/artist/..." />
          <button onClick={addArtist} disabled={addingArtist || !newArtistUrl}
            className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-400 flex items-center gap-2 disabled:opacity-50">
            {addingArtist ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Add & Sync
          </button>
        </div>
        {error && <p className="mt-3 text-red-400 flex items-center gap-2"><XCircle className="w-4 h-4" />{error}</p>}
      </div>

      <div className="bg-gray-900/80 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Monitored Artists ({artists.length})
          </h2>
          <button onClick={syncAllArtists} disabled={syncing || artists.length === 0}
            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 flex items-center gap-2 disabled:opacity-50">
            {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            Sync All Artists
          </button>
        </div>

        {syncResult && (
          <div className="mb-4 p-4 bg-[#1DB954]/10 border border-[#1DB954]/40 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-[#1DB954]" />
              <span className="text-[#1DB954] font-bold">Sync Complete!</span>
            </div>
            <p className="text-gray-300">Artists synced: {syncResult.artistsSynced} | New releases: {syncResult.newReleasesAdded}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
        ) : artists.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No artists being monitored. Add one above!</p>
        ) : (
          <div className="grid gap-3">
            {artists.map((artist) => (
              <div key={artist.id} className="flex items-center gap-4 bg-black/40 rounded-xl p-4 border border-gray-800">
                {artist.image_url ? (
                  <img src={artist.image_url} alt={artist.name} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
                    <Music className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-bold text-white">{artist.name}</p>
                  <p className="text-sm text-gray-500">{artist.followers?.toLocaleString()} followers</p>
                  {artist.last_synced_at && (
                    <p className="text-xs text-gray-600">Last synced: {new Date(artist.last_synced_at).toLocaleString()}</p>
                  )}
                </div>
                <button onClick={() => removeArtist(artist.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
