import { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Props {
  album: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface Photo {
  id: string;
  title: string;
  image_url: string;
}

export default function AlbumForm({ album, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState(album?.title || '');
  const [description, setDescription] = useState(album?.description || '');
  const [coverPhotoId, setCoverPhotoId] = useState(album?.cover_photo_id || '');
  const [isPublished, setIsPublished] = useState(album?.is_published ?? true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('press_photos')
      .select('id, title, image_url')
      .limit(50);
    if (data) setPhotos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const albumData = {
      title,
      description,
      cover_photo_id: coverPhotoId || null,
      is_published: isPublished
    };

    const { error } = album
      ? await supabase.from('photo_albums').update(albumData).eq('id', album.id)
      : await supabase.from('photo_albums').insert(albumData);

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: album ? 'Album updated' : 'Album created' });
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{album ? 'Edit Album' : 'Create Album'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Album Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Photo</label>
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-white/5 rounded-lg">
              {photos.map(photo => (
                <div key={photo.id} onClick={() => setCoverPhotoId(photo.id)}
                  className={`relative aspect-square rounded cursor-pointer border-2 ${coverPhotoId === photo.id ? 'border-purple-500' : 'border-transparent'}`}>
                  <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded" />
            <label htmlFor="published" className="text-sm text-gray-300">Published (visible to public)</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg">
              {saving ? 'Saving...' : (album ? 'Update Album' : 'Create Album')}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
