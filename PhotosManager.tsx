import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Trash2, Star, Image, Camera, Plus, Images, Eye, EyeOff, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { photosData } from '@/data/photosData';
import { photosDataExtra } from '@/data/photosDataExtra';
import PhotoUploadModal from './PhotoUploadModal';
import BulkPhotoUpload from './BulkPhotoUpload';

interface Props { onBack: () => void; }

interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  photographer: string;
  date_taken: string;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
}

export default function PhotosManager({ onBack }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('press_photos')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setPhotos(data || []);
    } catch (err: any) {
      toast({ title: 'Error loading photos', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const seedPhotos = async () => {
    const allPhotos = [...photosData, ...photosDataExtra];
    for (let i = 0; i < allPhotos.length; i++) {
      const photo = allPhotos[i];
      await supabase.from('press_photos').upsert({
        title: photo.title,
        description: photo.description,
        category: photo.category,
        image_url: photo.image_url,
        thumbnail_url: photo.thumbnail_url,
        high_res_url: photo.high_res_url,
        photographer: photo.photographer,
        date_taken: photo.date_taken,
        is_featured: photo.is_featured,
        is_visible: true,
        sort_order: i,
        download_count: photo.download_count
      });
    }
    toast({ title: 'Photos seeded successfully!' });
    fetchPhotos();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('press_photos').update({ is_featured: !current }).eq('id', id);
    setPhotos(photos.map(p => p.id === id ? { ...p, is_featured: !current } : p));
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from('press_photos').update({ is_visible: !current }).eq('id', id);
    setPhotos(photos.map(p => p.id === id ? { ...p, is_visible: !current } : p));
    toast({ title: current ? 'Photo hidden' : 'Photo visible' });
  };

  const deletePhoto = async (id: string) => {
    await supabase.from('press_photos').delete().eq('id', id);
    setPhotos(photos.filter(p => p.id !== id));
    toast({ title: 'Photo deleted' });
  };


  const handleDragStart = (id: string) => setDraggedItem(id);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;
    
    const draggedIdx = photos.findIndex(p => p.id === draggedItem);
    const targetIdx = photos.findIndex(p => p.id === targetId);
    
    const newPhotos = [...photos];
    const [removed] = newPhotos.splice(draggedIdx, 1);
    newPhotos.splice(targetIdx, 0, removed);
    
    const updated = newPhotos.map((p, idx) => ({ ...p, sort_order: idx }));
    setPhotos(updated);
    
    for (const photo of updated) {
      await supabase.from('press_photos').update({ sort_order: photo.sort_order }).eq('id', photo.id);
    }
    
    setDraggedItem(null);
    toast({ title: 'Order updated' });
  };

  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Image className="w-6 h-6 text-purple-500" />Photos Manager</h1>
              <p className="text-gray-400 text-sm">Drag to reorder • Toggle visibility & featured status</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setUploadModalOpen(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2">
              <Upload className="w-4 h-4" />Upload
            </button>
            <button onClick={() => setBulkUploadOpen(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2">
              <Images className="w-4 h-4" />Bulk
            </button>
            <button onClick={seedPhotos} className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600 text-white rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />Seed
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'live', 'studio', 'promotional'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg capitalize ${filter === cat ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading photos...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <Camera className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No photos yet</h3>
            <p className="text-gray-400 mb-6">Upload your first photo or seed sample photos</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setUploadModalOpen(true)} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2">
                <Upload className="w-4 h-4" />Upload Photo
              </button>
              <button onClick={seedPhotos} className="px-6 py-3 bg-purple-600/50 hover:bg-purple-600 text-white rounded-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />Seed Sample Photos
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(photo => (
              <div key={photo.id} draggable onDragStart={() => handleDragStart(photo.id)}
                onDragOver={handleDragOver} onDrop={() => handleDrop(photo.id)}
                className={`bg-white/5 rounded-xl overflow-hidden border border-white/10 cursor-move ${!photo.is_visible ? 'opacity-50' : ''}`}>
                <div className="relative">
                  <img src={photo.image_url} alt={photo.title} className="w-full aspect-square object-cover" />
                  <div className="absolute top-2 left-2 bg-black/70 rounded p-1"><GripVertical className="w-4 h-4 text-white" /></div>
                  {!photo.is_visible && <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Hidden</div>}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium text-sm truncate">{photo.title}</h3>
                  <p className="text-gray-400 text-xs">{photo.category}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => toggleFeatured(photo.id, photo.is_featured)}
                      className={`p-1.5 rounded ${photo.is_featured ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                      <Star className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleVisibility(photo.id, photo.is_visible)}
                      className={`p-1.5 rounded ${photo.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {photo.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deletePhoto(photo.id)} className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/40">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PhotoUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onSuccess={fetchPhotos} />
      <BulkPhotoUpload isOpen={bulkUploadOpen} onClose={() => setBulkUploadOpen(false)} onSuccess={fetchPhotos} />
    </div>
  );
}
