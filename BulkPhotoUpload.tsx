import { useState, useRef, DragEvent } from 'react';
import { X, Upload, Trash2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FileWithPreview {
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
  error?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkPhotoUpload({ isOpen, onClose, onSuccess }: Props) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [category, setCategory] = useState('live');
  const [photographer, setPhotographer] = useState('');
  const [date, setDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFiles = (selectedFiles: File[]) => {
    const imageFiles = selectedFiles.filter(f => f.type.startsWith('image/'));
    const newFiles: FileWithPreview[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i].uploaded) continue;

      try {
        const file = files[i].file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `press-photos/${fileName}`;

        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: 50 } : f));

        const { error: uploadError } = await supabase.storage.from('press-photos').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('press-photos').getPublicUrl(filePath);

        await supabase.from('press_photos').insert({
          title: file.name.replace(/\.[^/.]+$/, ''),
          category,
          photographer,
          date_taken: date,
          image_url: publicUrl,
          thumbnail_url: publicUrl,
          high_res_url: publicUrl,
          is_visible: true,
          is_featured: false,
          sort_order: 999
        });


        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: 100, uploaded: true } : f));
        successCount++;
      } catch (err: any) {
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, error: err.message } : f));
      }
    }

    setUploading(false);
    toast({ title: `${successCount} photos uploaded successfully!` });
    if (successCount > 0) onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-white">Bulk Photo Upload</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/20'}`}
            onClick={() => fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} />
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-white">Drop images here or click to browse</p>
            <p className="text-gray-400 text-sm">Select multiple images</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                <option value="live">Live</option>
                <option value="studio">Studio</option>
                <option value="promotional">Promotional</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Photographer</label>
              <input type="text" value={photographer} onChange={(e) => setPhotographer(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
            </div>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {files.map((item, idx) => (
                <div key={idx} className="relative bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <img src={item.preview} alt="" className="w-full aspect-square object-cover" />
                  {item.uploaded && <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1"><Check className="w-4 h-4 text-white" /></div>}
                  {!item.uploaded && !uploading && (
                    <button onClick={() => removeFile(idx)} className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600">
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                  {item.progress > 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-purple-500 transition-all" style={{ width: `${item.progress}%` }} />
                  </div>}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={uploadAll} disabled={files.length === 0 || uploading}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-medium">
              {uploading ? 'Uploading...' : `Upload ${files.length} Photos`}
            </button>
            <button onClick={onClose} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
