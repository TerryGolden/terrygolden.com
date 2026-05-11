import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, GripVertical, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Props {
  album: any;
  onBack: () => void;
}

interface AlbumPhoto {
  id: string;
  photo_id: string;
  sort_order: number;
  photo: {
    id: string;
    title: string;
    image_url: string;
  };
}

interface AvailablePhoto {
  id: string;
  title: string;
  image_url: string;
}

export default function AlbumOrganizer({ album, onBack }: Props) {
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [availablePhotos, setAvailablePhotos] = useState<AvailablePhoto[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlbumPhotos();
    fetchAvailablePhotos();
  }, []);

  const fetchAlbumPhotos = async () => {
    const { data } = await supabase
      .from('album_photos')
      .select('*, photo:press_photos(*)')
      .eq('album_id', album.id)
      .order('sort_order', { ascending: true });
    if (data) setAlbumPhotos(data as any);
  };

  const fetchAvailablePhotos = async () => {
    const { data: allPhotos } = await supabase.from('press_photos').select('id, title, image_url');
    const { data: albumPhotoIds } = await supabase.from('album_photos').select('photo_id').eq('album_id', album.id);
    const usedIds = new Set(albumPhotoIds?.map(ap => ap.photo_id) || []);
    if (allPhotos) {
      setAvailablePhotos(allPhotos.filter(p => !usedIds.has(p.id)));
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newPhotos = [...albumPhotos];
    const draggedItem = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(index, 0, draggedItem);
    setAlbumPhotos(newPhotos);
    setDraggedIndex(index);
  };

  const saveOrder = async () => {
    const updates = albumPhotos.map((ap, idx) => ({
      id: ap.id,
      sort_order: idx
    }));

    for (const update of updates) {
      await supabase.from('album_photos').update({ sort_order: update.sort_order }).eq('id', update.id);
    }
    toast({ title: 'Order saved' });
  };

  const addPhoto = async (photoId: string) => {
    const { error } = await supabase.from('album_photos').insert({
      album_id: album.id,
      photo_id: photoId,
      sort_order: albumPhotos.length
    });
    if (!error) {
      toast({ title: 'Photo added' });
      fetchAlbumPhotos();
      fetchAvailablePhotos();
      setShowAddModal(false);
    }
  };

  const removePhoto = async (id: string) => {
    await supabase.from('album_photos').delete().eq('id', id);
    toast({ title: 'Photo removed' });
    fetchAlbumPhotos();
    fetchAvailablePhotos();
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
            <div>
              <h1 className="text-2xl font-bold text-white">{album.title}</h1>
              <p className="text-gray-400 text-sm">Drag to reorder photos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />Add Photos
            </button>
            <button onClick={saveOrder} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2">
              <Save className="w-4 h-4" />Save Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albumPhotos.map((ap, idx) => (
            <div key={ap.id} draggable onDragStart={() => handleDragStart(idx)} onDragOver={(e) => handleDragOver(e, idx)}
              className="bg-white/5 rounded-xl overflow-hidden border border-white/10 cursor-move hover:border-purple-500">
              <div className="relative aspect-square">
                <img src={ap.photo.image_url} alt={ap.photo.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <GripVertical className="w-3 h-3" />{idx + 1}
                </div>
                <button onClick={() => removePhoto(ap.id)} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2">
                <p className="text-white text-sm truncate">{ap.photo.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add Photos to Album</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-4 grid grid-cols-3 md:grid-cols-4 gap-3">
              {availablePhotos.map(photo => (
                <div key={photo.id} onClick={() => addPhoto(photo.id)}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-purple-500">
                  <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
