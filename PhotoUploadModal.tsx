import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PhotoUploadModal({ isOpen, onClose, onSuccess }: Props) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'live',
    photographer: '',
    date_taken: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: 'Please select a file', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('press-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('press-photos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('press_photos').insert({
        ...formData,
        image_url: publicUrl,
        thumbnail_url: publicUrl,
        high_res_url: publicUrl,
        is_featured: false,
        is_visible: true,
        sort_order: 999,
      });

      if (dbError) throw dbError;

      toast({ title: 'Photo uploaded successfully!' });
      onSuccess();
      onClose();
      setFormData({ title: '', description: '', category: 'live', photographer: '', date_taken: new Date().toISOString().split('T')[0] });
      setFile(null);
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full border border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Upload Photo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Photo File</label>
            <input type="file" accept="image/*" onChange={handleFileChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input type="text" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" rows={3} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
              <option value="live">Live Performance</option>
              <option value="studio">Studio Shot</option>
              <option value="promotional">Promotional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Photographer</label>
            <input type="text" value={formData.photographer}
              onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date Taken</label>
            <input type="date" value={formData.date_taken}
              onChange={(e) => setFormData({ ...formData, date_taken: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
          </div>

          <button type="submit" disabled={uploading}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium flex items-center justify-center gap-2">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>
    </div>
  );
}
