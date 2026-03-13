import { useState } from 'react';
import { Instagram, Loader2, Check, AlertCircle, Film } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import InstagramShareModal from '@/components/InstagramShareModal';

interface Props {
  episodeTitle: string;
  episodeNumber: number;
  tracklist: string[];
  coverImageUrl?: string;
}

const InstagramShareButton = ({ episodeTitle, episodeNumber, tracklist, coverImageUrl }: Props) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const parseTracklist = () => tracklist.map(track => {
    const parts = track.split(' - ');
    return { artist: parts[0] || track, title: parts[1] || '' };
  });

  const handleShare = async (mediaType: 'STORIES' | 'FEED') => {
    setLoading(true);
    setResult(null);
    
    try {
      const tracks = parseTracklist();
      const { data: imgData } = await supabase.functions.invoke('generate-tracklist-image', {
        body: { episodeTitle, episodeNumber, tracklist: tracks, coverImageUrl, theme: 'purple' }
      });

      const imageUrl = coverImageUrl || 'https://example.com/placeholder.jpg';
      const artistTags = imgData?.artists || [];
      const caption = `Art of Rave Episode ${episodeNumber}\n${episodeTitle}\n\nNew episode out now!\n\n#artofrave #djterrygolden #electronicmusic`;

      const { data, error } = await supabase.functions.invoke('post-to-instagram', {
        body: { imageUrl, caption, mediaType, artistTags }
      });

      if (error) throw error;
      setResult({ success: true, message: data.message || 'Posted!' });
      setShowOptions(false);
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleReelClick = () => {
    setShowOptions(false);
    setShowModal(true);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-sm text-white disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Instagram className="w-4 h-4" />}
        Share
      </button>

      {showOptions && !loading && (
        <div className="absolute right-0 top-full mt-2 bg-zinc-800 rounded-xl shadow-xl border border-zinc-700 p-2 z-10 min-w-[140px]">
          <button onClick={() => handleShare('STORIES')} className="w-full text-left px-3 py-2 hover:bg-zinc-700 rounded-lg text-sm flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-400" /> Story
          </button>
          <button onClick={() => handleShare('FEED')} className="w-full text-left px-3 py-2 hover:bg-zinc-700 rounded-lg text-sm flex items-center gap-2">
            <Instagram className="w-4 h-4 text-purple-400" /> Feed Post
          </button>
          <button onClick={handleReelClick} className="w-full text-left px-3 py-2 hover:bg-zinc-700 rounded-lg text-sm flex items-center gap-2">
            <Film className="w-4 h-4 text-cyan-400" /> Reel
          </button>
        </div>
      )}

      {result && (
        <div className={`absolute right-0 top-full mt-2 p-3 rounded-xl flex items-center gap-2 text-sm z-10 ${result.success ? 'bg-green-900/90 text-green-300' : 'bg-red-900/90 text-red-300'}`}>
          {result.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {result.message}
        </div>
      )}

      <InstagramShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        episodeTitle={episodeTitle}
        episodeNumber={episodeNumber}
        tracklist={tracklist}
        coverImageUrl={coverImageUrl}
      />
    </div>
  );
};

export default InstagramShareButton;
