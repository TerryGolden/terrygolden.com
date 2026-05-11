import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import PhotoLightbox from '@/components/PhotoLightbox';


export default function AlbumEmbed() {
  const { id } = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadAlbum();
  }, [id]);

  const loadAlbum = async () => {
    const { data: albumData } = await supabase
      .from('photo_albums')
      .select('*')
      .eq('id', id)
      .single();

    if (albumData) {
      setAlbum(albumData);
      const { data: photosData } = await supabase
        .from('album_photos')
        .select('photo_id, display_order, photos(*)')
        .eq('album_id', id)
        .order('display_order');
      
      setPhotos(photosData?.map(p => p.photos) || []);
    }
  };

  if (!album) return null;

  return (
    <div className="bg-black text-white p-4">
      <h2 className="text-2xl font-bold mb-4">{album.name}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {photos.map((photo, idx) => (
          <img
            key={photo.id}
            src={photo.image_url}
            alt={photo.title}
            className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-80 transition"
            onClick={() => { setCurrentIndex(idx); setLightboxOpen(true); }}
          />
        ))}
      </div>
      {lightboxOpen && photos[currentIndex] && (
        <PhotoLightbox 
          photo={photos[currentIndex]} 
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          onNext={() => setCurrentIndex(Math.min(photos.length - 1, currentIndex + 1))}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < photos.length - 1}
        />
      )}

    </div>
  );
}
