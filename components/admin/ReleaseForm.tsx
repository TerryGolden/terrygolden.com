import { useState } from 'react';
import { X, Save, Loader2, Music, Sparkles } from 'lucide-react';
import { Release, addRelease, updateRelease } from '@/hooks/useReleases';
import { supabase } from '@/lib/supabase';

interface Props {
  release?: Release | null;
  onClose: () => void;
  onSave: () => void;
}

const ReleaseForm = ({ release, onClose, onSave }: Props) => {
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [form, setForm] = useState({
    title: release?.title || '',
    artist: release?.artist || 'Terry Golden',
    release_date: release?.release_date || new Date().toISOString().split('T')[0],
    label: release?.label || '',
    artwork_url: release?.artwork_url || '',
    spotify_url: release?.spotify_url || '',
    apple_music_url: release?.apple_music_url || '',
    youtube_url: release?.youtube_url || '',
    youtube_music_url: release?.youtube_music_url || '',
    deezer_url: release?.deezer_url || '',
    beatport_url: release?.beatport_url || '',
    beatport_chart_position: release?.beatport_chart_position || null,
    is_featured: release?.is_featured || false,
  });

  const fetchSpotifyMetadata = async (url: string) => {
    if (!url.includes('spotify.com/album')) return;
    setFetching(true);
    setFetchError('');
    setFetchSuccess(false);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-spotify-album', {
        body: { spotifyUrl: url }
      });
      if (error) throw new Error(error.message);
      if (!data.success) throw new Error(data.error || 'Failed to fetch');
      const m = data.metadata;
      setForm(prev => ({
        ...prev,
        title: m.title || prev.title,
        artist: m.artist || prev.artist,
        release_date: m.release_date || prev.release_date,
        label: m.label || prev.label,
        artwork_url: m.artwork_url || prev.artwork_url,
        spotify_url: m.spotify_url || prev.spotify_url,
      }));
      setFetchSuccess(true);
      setTimeout(() => setFetchSuccess(false), 3000);
    } catch (err: any) {
      setFetchError(err.message || 'Could not fetch metadata');
    } finally {
      setFetching(false);
    }
  };

  const handleSpotifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setForm({ ...form, spotify_url: url });
    if (url.includes('spotify.com/album')) fetchSpotifyMetadata(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (release?.id) await updateRelease(release.id, form);
      else await addRelease(form as any);
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-black/50 border border-[#D4AF37]/30 rounded-lg px-4 py-2 text-white focus:border-[#D4AF37] focus:outline-none";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-[#D4AF37]/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]/20">
          <h2 className="text-xl font-bold text-[#D4AF37]">{release ? 'Edit Release' : 'Add New Release'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-semibold">Auto-Fill from Spotify</span>
            </div>
            <p className="text-gray-400 text-sm mb-3">Paste a Spotify album URL to automatically fetch metadata.</p>
            <div className="relative">
              <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1DB954]" />
              <input type="url" value={form.spotify_url} onChange={handleSpotifyChange} placeholder="https://open.spotify.com/album/..." className={`${inputClass} pl-10`} />
              {fetching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37] animate-spin" />}
            </div>
            {fetchError && <p className="text-red-400 text-sm mt-2">{fetchError}</p>}
            {fetchSuccess && <p className="text-green-400 text-sm mt-2">Metadata loaded!</p>}
          </div>
          {form.artwork_url && <div className="flex justify-center"><img src={form.artwork_url} alt="Artwork" className="w-32 h-32 rounded-lg object-cover border border-[#D4AF37]/30" /></div>}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">Title *</label><input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Artist</label><input type="text" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">Release Date *</label><input type="date" required value={form.release_date} onChange={e => setForm({...form, release_date: e.target.value})} className={inputClass} /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Label</label><input type="text" value={form.label} onChange={e => setForm({...form, label: e.target.value})} className={inputClass} /></div>
          </div>
          <div><label className="text-sm text-gray-400 mb-1 block">Artwork URL</label><input type="url" value={form.artwork_url} onChange={e => setForm({...form, artwork_url: e.target.value})} className={inputClass} /></div>
          <div className="border-t border-[#D4AF37]/20 pt-4 mt-4">
            <h3 className="text-[#D4AF37] font-semibold mb-3">Platform Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-gray-400 mb-1 block">Apple Music</label><input type="url" value={form.apple_music_url} onChange={e => setForm({...form, apple_music_url: e.target.value})} className={inputClass} placeholder="https://music.apple.com/..." /></div>
              <div><label className="text-sm text-gray-400 mb-1 block">Deezer</label><input type="url" value={form.deezer_url} onChange={e => setForm({...form, deezer_url: e.target.value})} className={inputClass} placeholder="https://deezer.com/..." /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><label className="text-sm text-gray-400 mb-1 block">YouTube Music</label><input type="url" value={form.youtube_music_url} onChange={e => setForm({...form, youtube_music_url: e.target.value})} className={inputClass} placeholder="https://music.youtube.com/..." /></div>
              <div><label className="text-sm text-gray-400 mb-1 block">YouTube</label><input type="url" value={form.youtube_url} onChange={e => setForm({...form, youtube_url: e.target.value})} className={inputClass} placeholder="https://youtube.com/..." /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><label className="text-sm text-gray-400 mb-1 block">Beatport</label><input type="url" value={form.beatport_url} onChange={e => setForm({...form, beatport_url: e.target.value})} className={inputClass} placeholder="https://beatport.com/..." /></div>
              <div><label className="text-sm text-gray-400 mb-1 block">Beatport Chart #</label><input type="number" min="1" value={form.beatport_chart_position || ''} onChange={e => setForm({...form, beatport_chart_position: e.target.value ? parseInt(e.target.value) : null})} className={inputClass} /></div>
            </div>
          </div>
          <div className="flex items-center pt-2"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} className="w-5 h-5 accent-[#D4AF37]" /><span className="text-white">Featured Release</span></label></div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-800">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#C5A028] flex items-center gap-2 disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReleaseForm;
