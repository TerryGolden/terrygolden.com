import { useState, useEffect } from 'react';
import { Video } from '@/data/videoData';
import VideoModal from './VideoModal';
import { Button } from './ui/button';
import { Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      // Map database fields to Video interface
      const mappedVideos = (data || []).map(v => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail,
        youtubeId: v.youtube_id,
        videoUrl: v.video_url,
        description: v.description,
        releaseDate: v.release_date,
        views: v.views,
        duration: v.duration,
        type: v.type,
        year: v.year
      }));
      
      setVideos(mappedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from(new Set(videos.map(v => v.year))).sort((a, b) => b - a);
  const types = [
    { value: 'all', label: 'All Videos' },
    { value: 'official', label: 'Official Videos' },
    { value: 'live', label: 'Live Performances' },
    { value: 'mix', label: 'DJ Mixes' },
    { value: 'short', label: 'Shorts' }
  ];

  const filteredVideos = videos.filter(video => {
    const yearMatch = selectedYear === 'all' || video.year === selectedYear;
    const typeMatch = selectedType === 'all' || video.type === selectedType;
    return yearMatch && typeMatch;
  });


  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white text-lg">Loading videos...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Video Gallery
          </h2>
          <p className="text-gray-400 text-lg">Watch official music videos, live performances, and exclusive content</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <div className="flex gap-2">
            <Button
              variant={selectedYear === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedYear('all')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              All Years
            </Button>
            {years.map(year => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                onClick={() => setSelectedYear(year)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {year}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {types.map(type => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? 'default' : 'outline'}
                onClick={() => setSelectedType(type.value)}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="group cursor-pointer bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs text-white">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{video.views} views</span>
                  <span>•</span>
                  <span>{video.releaseDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No videos found for the selected filters.</p>
          </div>
        )}
      </div>

      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
