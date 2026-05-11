import { useState, useEffect } from 'react';
import { RefreshCw, Instagram, Clock, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function InstagramCacheManager() {
  const [loading, setLoading] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCacheInfo();
  }, []);

  const fetchCacheInfo = async () => {
    try {
      const { data: metadata } = await supabase
        .from('instagram_cache_metadata')
        .select('*')
        .order('last_fetched_at', { ascending: false })
        .limit(1)
        .single();

      const { data: cachedPosts } = await supabase
        .from('instagram_posts_cache')
        .select('*')
        .order('timestamp', { ascending: false });

      setCacheInfo(metadata);
      setPosts(cachedPosts || []);
    } catch (error) {
      console.error('Error fetching cache info:', error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-instagram-feed', {
        body: { forceRefresh: true }
      });

      if (error) throw error;

      toast({
        title: 'Instagram Feed Refreshed',
        description: `Successfully fetched ${data?.data?.length || 0} posts from Instagram`,
      });

      await fetchCacheInfo();
    } catch (error: any) {
      toast({
        title: 'Refresh Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getTimeSince = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 1000 / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="w-5 h-5" />
            Instagram Feed Cache
          </CardTitle>
          <CardDescription>
            Manage Instagram feed caching to reduce API calls and improve performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <p className="text-lg font-semibold">
                {cacheInfo ? getTimeSince(cacheInfo.last_fetched_at) : 'Never'}
              </p>
              {cacheInfo && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(cacheInfo.last_fetched_at)}
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">Cached Posts</span>
              </div>
              <p className="text-lg font-semibold">{posts.length}</p>
              <p className="text-xs text-gray-500 mt-1">Posts in database</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Cache Status</span>
              </div>
              <p className="text-lg font-semibold">
                {cacheInfo && 
                  (Date.now() - new Date(cacheInfo.last_fetched_at).getTime()) / 1000 / 60 < 30
                  ? 'Valid'
                  : 'Expired'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Refreshes every 30 min</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Force Refresh Now
            </Button>
          </div>

          {posts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Recent Cached Posts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {posts.slice(0, 8).map((post) => (
                  <div key={post.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}
                      alt={post.caption?.slice(0, 30) || 'Instagram post'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
