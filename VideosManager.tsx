import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Eye, EyeOff, Trash2, Edit, GripVertical, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtube_id?: string;
  video_url?: string;
  release_date: string;
  views: string;
  duration: string;
  type: 'official' | 'live' | 'short' | 'mix';
  year: number;
  is_visible: boolean;
  sort_order: number;
}

interface Props {
  onBack: () => void;
}

export default function VideosManager({ onBack }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    youtube_id: '',
    video_url: '',
    release_date: '',
    views: '',
    duration: '',
    type: 'live' as const,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('videos')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Video updated');
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([{ ...formData, sort_order: videos.length }]);
        if (error) throw error;
        toast.success('Video added');
      }
      resetForm();
      fetchVideos();
    } catch (error) {
      toast.error('Failed to save video');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      youtube_id: '',
      video_url: '',
      release_date: '',
      views: '',
      duration: '',
      type: 'live',
      year: new Date().getFullYear()
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (video: Video) => {
    setFormData({
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      youtube_id: video.youtube_id || '',
      video_url: video.video_url || '',
      release_date: video.release_date,
      views: video.views,
      duration: video.duration,
      type: video.type,
      year: video.year
    });
    setEditingId(video.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    try {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
      toast.success('Video deleted');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_visible: !currentVisibility })
        .eq('id', id);
      if (error) throw error;
      fetchVideos();
      toast.success(currentVisibility ? 'Video hidden' : 'Video visible');
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleDragStart = (id: string) => setDraggedItem(id);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;
    
    const draggedIdx = videos.findIndex(v => v.id === draggedItem);
    const targetIdx = videos.findIndex(v => v.id === targetId);
    
    const newVideos = [...videos];
    const [removed] = newVideos.splice(draggedIdx, 1);
    newVideos.splice(targetIdx, 0, removed);
    
    setVideos(newVideos);
    setDraggedItem(null);
    
    try {
      const updates = newVideos.map((video, index) => 
        supabase.from('videos').update({ sort_order: index }).eq('id', video.id)
      );
      await Promise.all(updates);
      toast.success('Order updated');
    } catch (error) {
      toast.error('Failed to update order');
      fetchVideos();
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <VideoIcon className="w-8 h-8 text-purple-400" />
                Videos Manager
              </h1>
              <p className="text-gray-400">Manage video gallery</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <Input placeholder="Thumbnail URL" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} required />
              <Input placeholder="YouTube ID (optional)" value={formData.youtube_id} onChange={e => setFormData({...formData, youtube_id: e.target.value})} />
              <Input placeholder="Video URL (optional)" value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} />
              <Input placeholder="Release Date" value={formData.release_date} onChange={e => setFormData({...formData, release_date: e.target.value})} />
              <Input placeholder="Views" value={formData.views} onChange={e => setFormData({...formData, views: e.target.value})} />
              <Input placeholder="Duration" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="bg-gray-800 text-white p-2 rounded">
                <option value="live">Live</option>
                <option value="mix">Mix</option>
                <option value="official">Official</option>
                <option value="short">Short</option>
              </select>
              <Input type="number" placeholder="Year" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
            </div>
            <Textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-4" />
            <div className="flex gap-2 mt-4">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">{editingId ? 'Update' : 'Add'}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {videos.map(video => (
            <div key={video.id} draggable onDragStart={() => handleDragStart(video.id)} onDragOver={handleDragOver} onDrop={() => handleDrop(video.id)} className="bg-gray-900 p-4 rounded-lg flex items-center gap-4 cursor-move hover:bg-gray-800">
              <GripVertical className="w-5 h-5 text-gray-500" />
              <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{video.title}</h3>
                <p className="text-gray-400 text-sm">{video.type} • {video.year} • {video.duration}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => toggleVisibility(video.id, video.is_visible)}>
                  {video.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleEdit(video)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(video.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
