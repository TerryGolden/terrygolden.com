import { useState, useEffect, useMemo } from 'react';
import { Camera, Download, Grid, Star, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PhotoLightbox from '@/components/PhotoLightbox';
import PhotoAlbums from '@/components/PhotoAlbums';

type Category = 'all' | 'live' | 'studio' | 'promotional';

interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  thumbnail_url: string;
  high_res_url: string;
  photographer: string;
  date_taken: string;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
}

export default function Photos() {
  const [category, setCategory] = useState<Category>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('press_photos')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = useMemo(() => {
    if (category === 'all') return photos;
    return photos.filter(p => p.category === category);
  }, [category, photos]);

  const featuredPhotos = photos.filter(p => p.is_featured);

  const categories = [
    { id: 'all', label: 'All Photos', icon: Grid },
    { id: 'live', label: 'Live Performances', icon: Camera },
    { id: 'studio', label: 'Studio Shots', icon: Filter },
    { id: 'promotional', label: 'Promotional', icon: Star },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Press Photos</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            High-resolution photos available for press and media use. Click any photo to view and download.
          </p>
        </div>

        {featuredPhotos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />Featured Photos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredPhotos.slice(0, 3).map((photo) => (
                <div key={photo.id} onClick={() => setLightboxIndex(photos.findIndex(p => p.id === photo.id))}
                  className="relative group cursor-pointer overflow-hidden rounded-xl aspect-video">
                  <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold">{photo.title}</h3>
                      <p className="text-white/70 text-sm">{photo.photographer}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">FEATURED</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <PhotoAlbums />

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id as Category)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                category === cat.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}>
              <cat.icon className="w-4 h-4" />{cat.label}
            </button>
          ))}
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <Camera className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No photos available</h3>
            <p className="text-gray-400">Check back soon for new photos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} onClick={() => setLightboxIndex(photos.findIndex(p => p.id === photo.id))}
                className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square bg-gray-800">
                <img src={photo.thumbnail_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="inline-block bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-2">Need All Photos?</h3>
            <p className="text-gray-400 mb-4">Download the complete press kit with all high-resolution photos.</p>
            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium flex items-center gap-2 mx-auto">
              <Download className="w-5 h-5" />Download Press Kit
            </button>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photo={photos[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
          onNext={() => setLightboxIndex(Math.min(photos.length - 1, lightboxIndex + 1))}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < photos.length - 1}
        />
      )}
    </div>
  );
}
