import { X, Download, ChevronLeft, ChevronRight, Camera, Calendar } from 'lucide-react';
import { PressPhoto } from '@/data/photosData';

interface PhotoLightboxProps {
  photo: PressPhoto;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function PhotoLightbox({ photo, onClose, onPrev, onNext, hasPrev, hasNext }: PhotoLightboxProps) {
  const handleDownload = async () => {
    const link = document.createElement('a');
    link.href = photo.high_res_url;
    link.download = `${photo.title.replace(/\s+/g, '_')}_high_res.webp`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-50">
        <X className="w-8 h-8" />
      </button>
      
      {hasPrev && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/50 rounded-full">
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      
      {hasNext && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/50 rounded-full">
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      <div className="max-w-6xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
        <img src={photo.image_url} alt={photo.title} className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg" />
        
        <div className="mt-4 text-center text-white">
          <h3 className="text-2xl font-bold">{photo.title}</h3>
          <p className="text-white/70 mt-1">{photo.description}</p>
          
          <div className="flex items-center justify-center gap-6 mt-3 text-sm text-white/60">
            <span className="flex items-center gap-1"><Camera className="w-4 h-4" />{photo.photographer}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(photo.date_taken).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Download className="w-4 h-4" />{photo.download_count} downloads</span>
          </div>
          
          <button onClick={handleDownload} className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full font-medium flex items-center gap-2 mx-auto">
            <Download className="w-5 h-5" />Download High-Res
          </button>
        </div>
      </div>
    </div>
  );
}
