import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, FolderOpen, Image as ImageIcon, Share2, Eye, EyeOff } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import AlbumForm from './AlbumForm';
import AlbumOrganizer from './AlbumOrganizer';
import { AlbumShareModal } from './AlbumShareModal';

interface Props { onBack: () => void; }


interface Album {
  id: string;
  title: string;
  description: string;
  cover_photo_id: string | null;
  cover_photo_url?: string;
  photo_count?: number;
  sort_order: number;
  is_published: boolean;
}

export default function AlbumManager({ onBack }: Props) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [organizingAlbum, setOrganizingAlbum] = useState<Album | null>(null);
  const [sharingAlbum, setSharingAlbum] = useState<Album | null>(null);
  const { toast } = useToast();


  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    const { data, error } = await supabase
      .from('photo_albums')
      .select(`
        *,
        cover_photo:press_photos!cover_photo_id(image_url)
      `)
      .order('sort_order', { ascending: true });

    if (error) {
      toast({ title: 'Error loading albums', description: error.message, variant: 'destructive' });
    } else if (data) {
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
    setLoading(false);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from('photo_albums').update({ is_published: !current }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: current ? 'Album hidden from public' : 'Album published' });
      setAlbums(albums.map(a => a.id === id ? { ...a, is_published: !current } : a));
    }
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm('Delete this album? Photos will not be deleted.')) return;
    const { error } = await supabase.from('photo_albums').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Album deleted' });
      fetchAlbums();
    }
  };


  if (organizingAlbum) {
    return <AlbumOrganizer album={organizingAlbum} onBack={() => { setOrganizingAlbum(null); fetchAlbums(); }} />;
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FolderOpen className="w-6 h-6 text-purple-500" />Album Manager</h1>
              <p className="text-gray-400 text-sm">Organize photos into collections</p>
            </div>
          </div>
          <button onClick={() => { setEditingAlbum(null); setFormOpen(true); }} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />Create Album
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading albums...</p>
        ) : albums.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <FolderOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No albums yet</h3>
            <p className="text-gray-400 mb-6">Create your first album to organize photos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map(album => (
              <div key={album.id} className={`bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-colors ${!album.is_published ? 'opacity-60' : ''}`}>
                <div className="aspect-video bg-gray-800 relative">
                  {album.cover_photo_url ? (
                    <img src={album.cover_photo_url} alt={album.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-12 h-12 text-gray-600" /></div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{album.photo_count} photos</div>
                  {!album.is_published && <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Hidden</div>}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">{album.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{album.description}</p>
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setOrganizingAlbum(album)} className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm">Organize</button>
                    <button onClick={() => setSharingAlbum(album)} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded"><Share2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => togglePublished(album.id, album.is_published)}
                      className={`flex-1 p-2 rounded text-sm flex items-center justify-center gap-1 ${album.is_published ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {album.is_published ? <><Eye className="w-4 h-4" />Public</> : <><EyeOff className="w-4 h-4" />Hidden</>}
                    </button>
                    <button onClick={() => { setEditingAlbum(album); setFormOpen(true); }} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteAlbum(album.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {formOpen && <AlbumForm album={editingAlbum} onClose={() => { setFormOpen(false); setEditingAlbum(null); }} onSuccess={() => { setFormOpen(false); setEditingAlbum(null); fetchAlbums(); }} />}
      {sharingAlbum && <AlbumShareModal album={sharingAlbum} open={!!sharingAlbum} onClose={() => setSharingAlbum(null)} />}

    </div>
  );
}
