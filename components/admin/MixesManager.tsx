import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, GripVertical, Trash2, Eye, EyeOff, Music, Upload, Image, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Mix {
  id: string;
  title: string;
  soundcloud_url: string;
  display_order: number;
  is_visible: boolean;
  cover_image_url?: string;
}

interface Props {
  onBack: () => void;
}

const MixesManager = ({ onBack }: Props) => {
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingArtwork, setFetchingArtwork] = useState(false);
  const [newMix, setNewMix] = useState({ title: '', soundcloud_url: '', cover_image_url: '' });
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [refetchingId, setRefetchingId] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => { fetchMixes(); }, []);

  const fetchMixes = async () => {
    const { data } = await supabase.from('soundcloud_mixes').select('*').order('display_order');
    if (data) setMixes(data);
    setLoading(false);
  };

  const fetchSoundCloudArtwork = async (url: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-soundcloud-artwork', {
        body: { soundcloud_url: url }
      });
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Failed to fetch artwork:', e);
      return null;
    }
  };

  const handleUrlChange = async (url: string) => {
    setNewMix(prev => ({ ...prev, soundcloud_url: url }));
    if (url && url.includes('soundcloud.com')) {
      setFetchingArtwork(true);
      const data = await fetchSoundCloudArtwork(url);
      if (data) {
        setNewMix(prev => ({
          ...prev,
          title: prev.title || data.title || '',
          cover_image_url: data.thumbnail_url_large || data.thumbnail_url || ''
        }));
      }
      setFetchingArtwork(false);
    }
  };

  const addMix = async () => {
    if (!newMix.title || !newMix.soundcloud_url) return;
    setSaving(true);
    const { data } = await supabase.from('soundcloud_mixes').insert({
      title: newMix.title, soundcloud_url: newMix.soundcloud_url, 
      display_order: mixes.length, is_visible: true,
      cover_image_url: newMix.cover_image_url || null
    }).select().single();
    if (data) setMixes([...mixes, data]);
    setNewMix({ title: '', soundcloud_url: '', cover_image_url: '' });
    setSaving(false);
  };

  const refetchArtwork = async (mix: Mix) => {
    setRefetchingId(mix.id);
    const data = await fetchSoundCloudArtwork(mix.soundcloud_url);
    if (data?.thumbnail_url) {
      const url = data.thumbnail_url_large || data.thumbnail_url;
      await supabase.from('soundcloud_mixes').update({ cover_image_url: url }).eq('id', mix.id);
      setMixes(mixes.map(m => m.id === mix.id ? { ...m, cover_image_url: url } : m));
    }
    setRefetchingId(null);
  };

  const toggleVisibility = async (id: string, visible: boolean) => {
    await supabase.from('soundcloud_mixes').update({ is_visible: !visible }).eq('id', id);
    setMixes(mixes.map(m => m.id === id ? { ...m, is_visible: !visible } : m));
  };

  const deleteMix = async (id: string) => {
    if (!confirm('Delete this mix?')) return;
    await supabase.from('soundcloud_mixes').delete().eq('id', id);
    setMixes(mixes.filter(m => m.id !== id));
  };

  const handleImageUpload = async (id: string, file: File) => {
    setUploadingId(id);
    const ext = file.name.split('.').pop();
    const path = `${id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('mix-artwork').upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('mix-artwork').getPublicUrl(path);
      await supabase.from('soundcloud_mixes').update({ cover_image_url: publicUrl }).eq('id', id);
      setMixes(mixes.map(m => m.id === id ? { ...m, cover_image_url: publicUrl } : m));
    }
    setUploadingId(null);
  };

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newMixes = [...mixes];
    const [dragged] = newMixes.splice(draggedIdx, 1);
    newMixes.splice(idx, 0, dragged);
    setMixes(newMixes);
    setDraggedIdx(idx);
  };

  const handleDragEnd = async () => {
    setDraggedIdx(null);
    for (let i = 0; i < mixes.length; i++) {
      await supabase.from('soundcloud_mixes').update({ display_order: i }).eq('id', mixes[i].id);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Music className="w-6 h-6 text-orange-500" /> SoundCloud Mixes</h1>
            <p className="text-gray-400 text-sm">Artwork auto-fetched from SoundCloud</p>
          </div>
        </div>

        <div className="bg-black/50 border border-orange-500/20 rounded-xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Add New Mix</h3>
          <div className="flex gap-4 mb-4">
            {newMix.cover_image_url ? (
              <img src={newMix.cover_image_url} alt="Preview" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                {fetchingArtwork ? <Loader2 className="w-6 h-6 text-orange-500 animate-spin" /> : <Image className="w-6 h-6 text-gray-600" />}
              </div>
            )}
            <div className="flex-1 space-y-3">
              <input value={newMix.soundcloud_url} onChange={e => handleUrlChange(e.target.value)} placeholder="Paste SoundCloud URL..." className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              <input value={newMix.title} onChange={e => setNewMix({...newMix, title: e.target.value})} placeholder="Mix Title (auto-filled)" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
            </div>
          </div>
          <button onClick={addMix} disabled={saving || !newMix.title || !newMix.soundcloud_url} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Mix
          </button>
        </div>

        {loading ? <p className="text-gray-400">Loading...</p> : (
          <div className="space-y-3">
            {mixes.map((mix, idx) => (
              <div key={mix.id} draggable onDragStart={() => handleDragStart(idx)} onDragOver={e => handleDragOver(e, idx)} onDragEnd={handleDragEnd}
                className={`flex items-center gap-4 bg-black/50 border rounded-lg p-4 ${mix.is_visible ? 'border-orange-500/30' : 'border-gray-700 opacity-50'}`}>
                <GripVertical className="w-5 h-5 text-gray-500 cursor-grab" />
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 relative group">
                  {mix.cover_image_url ? <img src={mix.cover_image_url} alt={mix.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Image className="w-6 h-6 text-gray-600" /></div>}
                  <input type="file" accept="image/*" ref={el => fileInputRefs.current[mix.id] = el} className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(mix.id, e.target.files[0])} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                    {uploadingId === mix.id || refetchingId === mix.id ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : (
                      <>
                        <button onClick={() => fileInputRefs.current[mix.id]?.click()} className="p-1 hover:bg-white/20 rounded"><Upload className="w-4 h-4 text-white" /></button>
                        <button onClick={() => refetchArtwork(mix)} className="p-1 hover:bg-white/20 rounded"><RefreshCw className="w-4 h-4 text-white" /></button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{mix.title}</p>
                  <p className="text-gray-500 text-xs truncate">{mix.soundcloud_url}</p>
                </div>
                <button onClick={() => toggleVisibility(mix.id, mix.is_visible)} className="p-2 hover:bg-gray-800 rounded">{mix.is_visible ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}</button>
                <button onClick={() => deleteMix(mix.id)} className="p-2 hover:bg-gray-800 rounded text-red-500"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            {mixes.length === 0 && <p className="text-gray-500 text-center py-8">No mixes added yet</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MixesManager;
