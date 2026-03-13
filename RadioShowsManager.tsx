import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Radio, GripVertical, Trash2, Edit2, Save, X, Upload, Loader2, Calendar, Music, Cloud, Database } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import RadioBulkImport from './RadioBulkImport';
import InstagramShareButton from './InstagramShareButton';

interface RadioEpisode {
  id: string;
  title: string;
  description: string;
  air_date: string;
  audio_url: string;
  cover_image_url: string;
  episode_number: number;
  tracklist: string[];
  display_order: number;
  is_published: boolean;
}

interface Props { onBack: () => void; }

const RadioShowsManager = ({ onBack }: Props) => {
  const [episodes, setEpisodes] = useState<RadioEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', air_date: '', audio_url: '', cover_image_url: '', episode_number: 1, tracklist: '', is_published: true });

  const handleDropboxSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('sync-dropbox-radio-v2');
      if (error) throw error;
      setSyncResult(data);
    } catch (err: any) {
      setSyncResult({ success: false, error: err.message });
    }
    setSyncing(false);
  };

  useEffect(() => { fetchEpisodes(); }, []);

  const fetchEpisodes = async () => {
    const { data } = await supabase.from('radio_episodes').select('*').order('episode_number', { ascending: false });
    if (data) setEpisodes(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const tracklist = form.tracklist.split('\n').filter(t => t.trim());
    const payload = { ...form, tracklist, display_order: editingId ? undefined : episodes.length };
    if (editingId) await supabase.from('radio_episodes').update(payload).eq('id', editingId);
    else await supabase.from('radio_episodes').insert(payload);
    await fetchEpisodes();
    resetForm();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this episode?')) return;
    await supabase.from('radio_episodes').delete().eq('id', id);
    fetchEpisodes();
  };

  const handleEdit = (ep: RadioEpisode) => {
    setForm({ ...ep, tracklist: ep.tracklist?.join('\n') || '' });
    setEditingId(ep.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ title: '', description: '', air_date: '', audio_url: '', cover_image_url: '', episode_number: Math.max(...episodes.map(e => e.episode_number), 0) + 1, tracklist: '', is_published: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = `${Date.now()}-${file.name}`;
    const { data } = await supabase.storage.from('radio-artwork').upload(fileName, file);
    if (data) {
      const { data: urlData } = supabase.storage.from('radio-artwork').getPublicUrl(fileName);
      setForm(f => ({ ...f, cover_image_url: urlData.publicUrl }));
    }
  };

  if (loading) return <div className="pt-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Radio className="w-6 h-6 text-purple-400" /> Radio Episodes</h1>
              <p className="text-gray-400 text-sm">{episodes.length} episodes</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowBulkImport(true)} className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm"><Database className="w-4 h-4" /> Bulk</button>
            <button onClick={handleDropboxSync} disabled={syncing} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm disabled:opacity-50">
              {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />} Sync
            </button>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm"><Plus className="w-4 h-4" /> Add</button>
          </div>
        </div>

        {syncResult && (
          <div className={`mb-6 p-4 rounded-xl border ${syncResult.success ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
            <div className="flex justify-between">
              <div>
                <h3 className="text-white font-semibold">{syncResult.success ? 'Sync Complete' : 'Sync Failed'}</h3>
                {syncResult.message && <p className="text-sm text-gray-300">{syncResult.message}</p>}
                {syncResult.error && <p className="text-sm text-red-400">{syncResult.error}</p>}
              </div>
              <button onClick={() => setSyncResult(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-purple-500/30">
            <h3 className="text-lg font-bold text-white mb-4">{editingId ? 'Edit' : 'New'} Episode</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              <input type="number" value={form.episode_number} onChange={e => setForm(f => ({ ...f, episode_number: +e.target.value }))} placeholder="Episode #" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              <input type="date" value={form.air_date} onChange={e => setForm(f => ({ ...f, air_date: e.target.value }))} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              <input value={form.audio_url} onChange={e => setForm(f => ({ ...f, audio_url: e.target.value }))} placeholder="Audio URL" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white mb-4" />
            <textarea value={form.tracklist} onChange={e => setForm(f => ({ ...f, tracklist: e.target.value }))} placeholder="Tracklist (one per line: Artist - Track)" rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white mb-4" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden relative">
                {form.cover_image_url ? <img src={form.cover_image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Music className="w-8 h-8 text-gray-600" /></div>}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer">
                  <Upload className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <label className="flex items-center gap-2 text-gray-300">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="rounded" /> Published
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
              <button onClick={resetForm} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><X className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {episodes.map((ep) => (
            <div key={ep.id} className="flex items-center gap-4 bg-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-purple-500/30">
              <div className="w-14 h-14 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                {ep.cover_image_url ? <img src={ep.cover_image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-purple-900/30"><Radio className="w-5 h-5 text-purple-400" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">#{ep.episode_number}</span>
                  <h3 className="text-white font-semibold truncate">{ep.title || `Episode ${ep.episode_number}`}</h3>
                  {!ep.is_published && <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded">Draft</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ep.air_date}</span>
                  <span>{ep.tracklist?.length || 0} tracks</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <InstagramShareButton episodeTitle={ep.title} episodeNumber={ep.episode_number} tracklist={ep.tracklist || []} coverImageUrl={ep.cover_image_url} />
                <button onClick={() => handleEdit(ep)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(ep.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
        
        {showBulkImport && <RadioBulkImport onClose={() => setShowBulkImport(false)} onComplete={() => { setShowBulkImport(false); fetchEpisodes(); }} />}
      </div>
    </div>
  );
};

export default RadioShowsManager;