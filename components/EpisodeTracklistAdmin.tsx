import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Music, Search, Edit, Check } from 'lucide-react';
import TracklistManager from './TracklistManager';

interface Episode {
  id: string;
  name: string;
  cover_art_large_url: string;
  created_time: string;
  tracklist_count?: number;
}

const EpisodeTracklistAdmin = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    setLoading(true);
    try {
      // Fetch episodes
      const { data: episodesData, error: episodesError } = await supabase
        .from('art_of_rave_episodes')
        .select('id, name, cover_art_large_url, created_time')
        .order('created_time', { ascending: false });

      if (episodesError) throw episodesError;

      // Fetch tracklist counts
      const { data: trackCounts, error: countError } = await supabase
        .from('episode_tracklists')
        .select('episode_id');

      if (!countError && trackCounts) {
        const counts: Record<string, number> = {};
        trackCounts.forEach(t => {
          counts[t.episode_id] = (counts[t.episode_id] || 0) + 1;
        });

        const withCounts = (episodesData || []).map(ep => ({
          ...ep,
          tracklist_count: counts[ep.id] || 0
        }));
        setEpisodes(withCounts);
      } else {
        setEpisodes(episodesData || []);
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEpisodes = episodes.filter(ep =>
    ep.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleClose = () => {
    setSelectedEpisode(null);
    fetchEpisodes();
  };

  if (loading) {
    return <div className="text-center py-8">Loading episodes...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tracklist Manager</h2>
        <p className="text-gray-400">Add and edit tracklists for Art of Rave episodes</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search episodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredEpisodes.map((episode) => (
          <Card
            key={episode.id}
            className="bg-zinc-900 border-zinc-800 p-4 flex items-center gap-4 hover:border-purple-500/50 transition-colors"
          >
            <img
              src={episode.cover_art_large_url}
              alt={episode.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{episode.name}</h3>
              <p className="text-sm text-gray-400">{formatDate(episode.created_time)}</p>
            </div>
            <div className="flex items-center gap-3">
              {episode.tracklist_count && episode.tracklist_count > 0 ? (
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  {episode.tracklist_count} tracks
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <Music className="w-4 h-4" />
                  No tracklist
                </span>
              )}
              <Button
                size="sm"
                onClick={() => setSelectedEpisode(episode)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>


      {selectedEpisode && (
        <TracklistManager episode={selectedEpisode} onClose={handleClose} />
      )}
    </div>
  );
};

export default EpisodeTracklistAdmin;
