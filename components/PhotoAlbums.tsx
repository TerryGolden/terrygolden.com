import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, ArrowLeft, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PhotoLightbox from './PhotoLightbox';


interface Album {
  id: string;
  title: string;
  description: string;
  cover_photo_url?: string;
  photo_count: number;
}

interface AlbumPhoto {
  id: string;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  high_res_url: string;
  photographer: string;
  date_taken: string;
}

export default function PhotoAlbums() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);


  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    const { data } = await supabase
      .from('photo_albums')
      .select('*, cover_photo:press_photos!cover_photo_id(image_url)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (data) {
      const albumsWithCounts = await Promise.all(data.map(async (album) => {
        const { count } = await supabase
          .from('album_photos')
          .select('*', { count: 'exact', head: true })
          .eq('album_id', album.id);
        return {
          ...album,
          cover_photo_url: album.cover_photo?.image_url,
          photo_count: count || 0
        };
      }));
      setAlbums(albumsWithCounts);
    }
  };

  const fetchAlbumPhotos = async (albumId: string) => {
    const { data } = await supabase
      .from('album_photos')
      .select('photo:press_photos(*)')
      .eq('album_id', albumId)
      .order('sort_order', { ascending: true });

    if (data) {
      setAlbumPhotos(data.map(ap => ap.photo as any));
    }
  };

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
    fetchAlbumPhotos(album.id);
  };

  if (selectedAlbum) {
    return (
      <div className="mb-12">
        <button onClick={() => setSelectedAlbum(null)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6">
          <ArrowLeft className="w-5 h-5" />Back to Albums
        </button>
        <h2 className="text-3xl font-bold text-white mb-2">{selectedAlbum.title}</h2>
        <p className="text-gray-400 mb-8">{selectedAlbum.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albumPhotos.map((photo, idx) => (
            <div key={photo.id} onClick={() => setLightboxIndex(idx)}
              className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square bg-gray-800">
              <img src={photo.thumbnail_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>

        {lightboxIndex !== null && (
          <PhotoLightbox
            photo={albumPhotos[lightboxIndex]}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
            onNext={() => setLightboxIndex(Math.min(albumPhotos.length - 1, lightboxIndex + 1))}
            hasPrev={lightboxIndex > 0}
            hasNext={lightboxIndex < albumPhotos.length - 1}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <FolderOpen className="w-6 h-6 text-purple-500" />Photo Albums
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map(album => (
          <div key={album.id} onClick={() => handleAlbumClick(album)}
            className="group cursor-pointer bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
            <div className="aspect-video bg-gray-800 relative">
              {album.cover_photo_url ? (
                <img src={album.cover_photo_url} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-12 h-12 text-gray-600" /></div>
              )}
              <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full">{album.photo_count} photos</div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-1">{album.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-3">{album.description}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/album/${album.id}`); }}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
              >
                <ExternalLink className="w-4 h-4" />View Shareable Album
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
