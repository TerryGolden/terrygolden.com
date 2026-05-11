import { useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Music, Star, ArrowLeft, Disc3 } from 'lucide-react';
import { useReleases, deleteRelease, Release } from '@/hooks/useReleases';
import ReleaseForm from './ReleaseForm';
import SpotifyTest from './SpotifyTest';

interface Props {
  onBack: () => void;
}

const AdminReleases = ({ onBack }: Props) => {
  const { releases, loading, refetch } = useReleases();
  const [showForm, setShowForm] = useState(false);
  const [showSpotifyTest, setShowSpotifyTest] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this release?')) return;
    setDeleting(id);
    try {
      await deleteRelease(id);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (release: Release) => {
    setEditingRelease(release);
    setShowForm(true);
  };

  if (showSpotifyTest) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setShowSpotifyTest(false)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" /> Back to Admin
          </button>
          <SpotifyTest />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
            <div>
              <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                <span className="text-[#D4AF37]">Admin</span> - Releases
              </h1>
              <p className="text-gray-400">Manage your music releases</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSpotifyTest(true)} className="flex items-center gap-2 px-4 py-3 bg-[#1DB954]/20 text-[#1DB954] font-bold rounded-lg hover:bg-[#1DB954]/30 border border-[#1DB954]/30">
              <Disc3 className="w-5 h-5" /> Test Spotify API
            </button>
            <button onClick={() => { setEditingRelease(null); setShowForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#C5A028]">
              <Plus className="w-5 h-5" /> Add Release
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : releases.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#D4AF37]/30 rounded-xl">
            <Music className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No releases yet</h3>
            <p className="text-gray-400 mb-6">Add your first release to get started</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#C5A028]">Add Release</button>
          </div>
        ) : (
          <div className="grid gap-4">
            {releases.map((release) => (
              <div key={release.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-xl hover:border-[#D4AF37]/40 transition-all">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                  {release.artwork_url ? <img src={release.artwork_url} alt={release.title} className="w-full h-full object-cover" /> : <Music className="w-8 h-8 text-gray-600 m-auto mt-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold truncate">{release.title}</h3>
                    {release.is_featured && <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />}
                    {release.beatport_chart_position && <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded">#{release.beatport_chart_position}</span>}
                  </div>
                  <p className="text-gray-400 text-sm">{release.artist} • {release.label || 'No label'}</p>
                  <p className="text-gray-500 text-xs">{new Date(release.release_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(release)} className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg"><Edit2 className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(release.id)} disabled={deleting === release.id} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg disabled:opacity-50">
                    {deleting === release.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <ReleaseForm release={editingRelease} onClose={() => setShowForm(false)} onSave={refetch} />}
    </div>
  );
};

export default AdminReleases;
