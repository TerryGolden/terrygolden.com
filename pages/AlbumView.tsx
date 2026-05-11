import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import PhotoLightbox from '@/components/PhotoLightbox';

import { Helmet } from 'react-helmet-async';

export default function AlbumView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Loading...</p></div>;
  if (!album) return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Album not found</p></div>;

  return (
    <>
      <Helmet>
        <title>{album.name} - Photo Album</title>
        <meta property="og:title" content={album.name} />
        <meta property="og:description" content={album.description || `View ${photos.length} photos in this album`} />
        <meta property="og:image" content={album.cover_photo_url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/photos')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{album.name}</h1>
              {album.description && <p className="text-gray-400">{album.description}</p>}
            </div>
            <Button onClick={() => navigator.share?.({ title: album.name, url: window.location.href })}>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <img key={photo.id} src={photo.image_url} alt={photo.title} className="w-full h-64 object-cover rounded cursor-pointer hover:opacity-80 transition" onClick={() => { setCurrentIndex(idx); setLightboxOpen(true); }} />
            ))}
          </div>
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
    </>
  );
}
