import { useState } from 'react';
import { Edit2, Trash2, Loader2, Music, Star, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { Release, deleteRelease, toggleFeatured, updateDisplayOrder } from '@/hooks/useReleases';

interface Props {
  release: Release;
  index: number;
  total: number;
  onEdit: () => void;
  onRefetch: () => void;
  allReleases: Release[];
}

const ReleaseListItem = ({ release, index, total, onEdit, onRefetch, allReleases }: Props) => {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [moving, setMoving] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this release?')) return;
    setDeleting(true);
    try {
      await deleteRelease(release.id);
      onRefetch();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFeatured = async () => {
    setToggling(true);
    try {
      await toggleFeatured(release.id, !release.is_featured);
      onRefetch();
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  const handleMove = async (direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= total) return;
    
    setMoving(true);
    try {
      const current = allReleases[index];
      const target = allReleases[targetIdx];
      await updateDisplayOrder([
        { id: current.id, display_order: target.display_order },
        { id: target.id, display_order: current.display_order }
      ]);
      onRefetch();
    } catch (err) {
      console.error(err);
    } finally {
      setMoving(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      release.is_featured 
        ? 'bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-[#D4AF37]/40' 
        : 'bg-black/30 border-[#D4AF37]/10 hover:border-[#D4AF37]/30'
    }`}>
      <div className="flex flex-col gap-0.5 text-gray-600">
        <button onClick={() => handleMove('up')} disabled={index === 0 || moving} className="hover:text-[#D4AF37] disabled:opacity-30">
          <ChevronUp className="w-4 h-4" />
        </button>
        <GripVertical className="w-4 h-4 text-gray-700" />
        <button onClick={() => handleMove('down')} disabled={index === total - 1 || moving} className="hover:text-[#D4AF37] disabled:opacity-30">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
        {release.artwork_url ? (
          <img src={release.artwork_url} alt={release.title} className="w-full h-full object-cover" />
        ) : (
          <Music className="w-6 h-6 text-gray-600 m-auto mt-4" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold truncate">{release.title}</h3>
          {release.beatport_chart_position && (
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">#{release.beatport_chart_position}</span>
          )}
        </div>
        <p className="text-gray-400 text-sm truncate">{release.artist} • {release.label || 'No label'}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-500 text-xs">{new Date(release.release_date).toLocaleDateString()}</p>
          <div className="flex items-center gap-1">
            {release.spotify_url && <span className="w-2 h-2 rounded-full bg-[#1DB954]" title="Spotify" />}
            {release.apple_music_url && <span className="w-2 h-2 rounded-full bg-[#FA243C]" title="Apple Music" />}
            {release.deezer_url && <span className="w-2 h-2 rounded-full bg-[#FF0092]" title="Deezer" />}
            {release.youtube_music_url && <span className="w-2 h-2 rounded-full bg-[#FF0000]" title="YouTube Music" />}
            {release.youtube_url && <span className="w-2 h-2 rounded-full bg-[#FF4444]" title="YouTube" />}
            {release.beatport_url && <span className="w-2 h-2 rounded-full bg-[#94D500]" title="Beatport" />}
          </div>
        </div>
      </div>


      <div className="flex items-center gap-1">
        <button 
          onClick={handleToggleFeatured} 
          disabled={toggling}
          className={`p-2 rounded-lg transition-all ${
            release.is_featured 
              ? 'text-[#D4AF37] bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30' 
              : 'text-gray-500 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
          }`}
          title={release.is_featured ? 'Remove from featured' : 'Add to featured'}
        >
          {toggling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className={`w-5 h-5 ${release.is_featured ? 'fill-current' : ''}`} />}
        </button>
        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg">
          <Edit2 className="w-5 h-5" />
        </button>
        <button onClick={handleDelete} disabled={deleting} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg disabled:opacity-50">
          {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default ReleaseListItem;
