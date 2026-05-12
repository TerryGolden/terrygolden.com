import { useState, useEffect, useRef } from 'react';
import { X, Instagram, Share2, Loader2, Check, AlertCircle, Image, Eye, Film, Upload, Link, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ExportPanel from '@/components/ExportPanel';


interface Track { artist: string; title: string; }
interface Props {
  isOpen: boolean;
  onClose: () => void;
  episodeTitle: string;
  episodeNumber: number;
  tracklist: string[];
  coverImageUrl?: string;
}

type ShareType = 'STORIES' | 'FEED' | 'REELS';

const InstagramShareModal = ({ isOpen, onClose, episodeTitle, episodeNumber, tracklist, coverImageUrl }: Props) => {
  const [shareType, setShareType] = useState<ShareType>('STORIES');
  const [theme, setTheme] = useState<'dark' | 'purple'>('purple');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      generatePreview();
      setResult(null);
    }
  }, [isOpen, theme, shareType]);

  if (!isOpen) return null;

  const generatePreview = (width = 1080, height = 1920) => {
    setGenerating(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;

      // Adjust dimensions based on share type
      const dimensions = shareType === 'STORIES' ? { w: 1080, h: 1920 } :
                        shareType === 'FEED' ? { w: 1080, h: 1080 } :
                        { w: 1080, h: 1920 };

      const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.h);
      if (theme === 'purple') {
        gradient.addColorStop(0, '#6B21A8');
        gradient.addColorStop(1, '#1F2937');
      } else {
        gradient.addColorStop(0, '#0891B2');
        gradient.addColorStop(1, '#1F2937');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.w, dimensions.h);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Art of Rave`, dimensions.w / 2, 200);
      
      ctx.font = '40px Arial';
      ctx.fillText(`Episode ${episodeNumber}`, dimensions.w / 2, 280);
      
      ctx.font = '35px Arial';
      ctx.fillText(episodeTitle, dimensions.w / 2, 350);

      setPreviewImage(canvas.toDataURL());
      setGenerating(false);
    }, 500);
  };

  const handleExport = async (settings: { width: number; height: number; format: string; quality: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = settings.width;
    canvas.height = settings.height;

    const gradient = ctx.createLinearGradient(0, 0, 0, settings.height);
    if (theme === 'purple') {
      gradient.addColorStop(0, '#6B21A8');
      gradient.addColorStop(1, '#1F2937');
    } else {
      gradient.addColorStop(0, '#0891B2');
      gradient.addColorStop(1, '#1F2937');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, settings.width, settings.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Art of Rave`, settings.width / 2, 200);
    ctx.font = '40px Arial';
    ctx.fillText(`Episode ${episodeNumber}`, settings.width / 2, 280);
    ctx.font = '35px Arial';
    ctx.fillText(episodeTitle, settings.width / 2, 350);

    const mimeType = `image/${settings.format}`;
    const quality = settings.quality / 100;
    const dataUrl = canvas.toDataURL(mimeType, quality);

    // Try native share API for mobile
    if (navigator.share && /mobile/i.test(navigator.userAgent)) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `art-of-rave-ep${episodeNumber}.${settings.format}`, { type: mimeType });
        await navigator.share({ files: [file], title: `Art of Rave Episode ${episodeNumber}` });
        setResult({ success: true, message: 'Shared successfully!' });
        return;
      } catch (err) {
        console.log('Share failed, falling back to download');
      }
    }

    // Fallback to download
    const link = document.createElement('a');
    link.download = `art-of-rave-ep${episodeNumber}.${settings.format}`;
    link.href = dataUrl;
    link.click();
    setResult({ success: true, message: 'Downloaded successfully!' });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20">
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20 sticky top-0 bg-zinc-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center shadow-lg">
              <Instagram className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Share to Instagram</h2>
              <p className="text-sm text-gray-400">Episode {episodeNumber} • {episodeTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {(['STORIES', 'FEED', 'REELS'] as ShareType[]).map(type => (
                <button key={type} onClick={() => setShareType(type)} className={`p-4 rounded-2xl border-2 transition-all ${shareType === type ? 'border-pink-500 bg-gradient-to-br from-pink-500/20 to-purple-500/20 scale-105' : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'}`}>
                  {type === 'STORIES' && <Share2 className="w-6 h-6 mx-auto mb-2 text-pink-400" />}
                  {type === 'FEED' && <Image className="w-6 h-6 mx-auto mb-2 text-purple-400" />}
                  {type === 'REELS' && <Film className="w-6 h-6 mx-auto mb-2 text-orange-400" />}
                  <span className="text-sm font-semibold">{type === 'STORIES' ? 'Story' : type === 'FEED' ? 'Feed' : 'Reel'}</span>
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-5 border border-purple-500/30">
              <label className="text-sm font-semibold text-purple-300 mb-3 block">Choose Theme</label>
              <div className="flex gap-3">
                <button onClick={() => setTheme('purple')} className={`flex-1 py-3 rounded-xl font-semibold transition-all ${theme === 'purple' ? 'bg-gradient-to-r from-purple-600 to-pink-600 scale-105' : 'bg-zinc-800 hover:bg-zinc-700'}`}>Purple Gradient</button>
                <button onClick={() => setTheme('dark')} className={`flex-1 py-3 rounded-xl font-semibold transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 scale-105' : 'bg-zinc-800 hover:bg-zinc-700'}`}>Cyan Gradient</button>
              </div>
            </div>

            {result && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${result.success ? 'bg-green-900/40 text-green-300 border border-green-500/30' : 'bg-red-900/40 text-red-300 border border-red-500/30'}`}>
                {result.success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-sm font-medium">{result.message}</span>
              </div>
            )}

            <ExportPanel onExport={handleExport} disabled={!previewImage} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-300">Live Preview</label>
              <button onClick={() => generatePreview()} disabled={generating} className="text-xs text-purple-400 flex items-center gap-1 hover:text-purple-300 transition">
                {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />} Refresh
              </button>
            </div>
            <div className="bg-zinc-800 rounded-2xl overflow-hidden aspect-[9/16] flex items-center justify-center border-2 border-zinc-700 shadow-xl">
              {generating ? (
                <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
              ) : previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-gray-500">Generating...</p>
              )}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default InstagramShareModal;
