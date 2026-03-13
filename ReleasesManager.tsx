import { useState } from 'react';
import { ArrowLeft, Plus, Loader2, Music, Star, Disc3, Grid, List } from 'lucide-react';
import { useReleases, Release } from '@/hooks/useReleases';
import ReleaseForm from './ReleaseForm';
import SpotifyTest from './SpotifyTest';
import ReleaseListItem from './ReleaseListItem';
import BulkImport from './BulkImport';

interface Props {
  onBack: () => void;
}

const ReleasesManager = ({ onBack }: Props) => {
  const { releases, loading, refetch } = useReleases();
  const [showForm, setShowForm] = useState(false);
  const [showSpotifyTest, setShowSpotifyTest] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  const filteredReleases = filter === 'featured' 
    ? releases.filter(r => r.is_featured) 
    : releases;

  const featuredCount = releases.filter(r => r.is_featured).length;

  if (showSpotifyTest) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <button onClick={() => setShowSpotifyTest(false)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <SpotifyTest />
        </div>
      </div>
    );
  }

  if (showBulkImport) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <button onClick={() => { setShowBulkImport(false); refetch(); }} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <BulkImport />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                <span className="text-[#D4AF37]">Releases</span> Manager
              </h1>
              <p className="text-gray-400 text-sm">{releases.length} releases • {featuredCount} featured</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSpotifyTest(true)} className="px-3 py-2 bg-[#1DB954]/20 text-[#1DB954] text-sm rounded-lg hover:bg-[#1DB954]/30 border border-[#1DB954]/30">
              <Disc3 className="w-4 h-4" />
            </button>
            <button onClick={() => setShowBulkImport(true)} className="px-4 py-2 bg-purple-500/20 text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-500/30 border border-purple-500/30">
              Bulk Import
            </button>
            <button onClick={() => { setEditingRelease(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#C5A028]">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 bg-black/30 border border-[#D4AF37]/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}>All ({releases.length})</button>
            <button onClick={() => setFilter('featured')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${filter === 'featured' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}>
              <Star className="w-3 h-3" /> Featured ({featuredCount})
            </button>
          </div>
          <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-gray-500'}`}><List className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-gray-500'}`}><Grid className="w-4 h-4" /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" /></div>
        ) : filteredReleases.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#D4AF37]/30 rounded-xl">
            <Music className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No releases found</h3>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg">Add Release</button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredReleases.map((release, idx) => (
              <ReleaseListItem
                key={release.id}
                release={release}
                index={idx}
                total={filteredReleases.length}
                onEdit={() => { setEditingRelease(release); setShowForm(true); }}
                onRefetch={refetch}
                allReleases={releases}
              />
            ))}
          </div>
        )}
      </div>
      {showForm && <ReleaseForm release={editingRelease} onClose={() => setShowForm(false)} onSave={refetch} />}
    </div>
  );
};

export default ReleasesManager;
