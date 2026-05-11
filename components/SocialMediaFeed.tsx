import { useState, useEffect } from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink, AlertCircle, RefreshCw, ShieldAlert, Play, Grid3X3, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { handleSocialClick, SOCIAL_LINKS } from '@/lib/socialMediaUtils';

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface FeedResponse {
  data?: InstagramPost[];
  configured?: boolean;
  cached?: boolean;
  cacheAge?: number;
  error?: string;
  errorDetails?: string;
  tokenExpired?: boolean;
  tokenSource?: string;
}

const INSTAGRAM_USERNAME = SOCIAL_LINKS.instagram.username;

// Curated fallback posts from @terrygoldenmusic
// These represent recent content and are shown when the API is unavailable
const FALLBACK_POSTS: InstagramPost[] = [
  {
    id: 'fallback-1',
    caption: 'New weekly residency on @insomniacradio ONE! Every Wednesday at 11 PM PET. Download the Insomniac Radio app and tune in!',
    media_type: 'IMAGE',
    media_url: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AG7YVuXFMyPXpTO-_ACoxeo/LIve%20shots/Live%20DJ%20MOS_1.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    permalink: 'https://www.instagram.com/terrygoldenmusic/',
    timestamp: '2026-03-12T20:00:00Z',
    like_count: 847,
    comments_count: 62
  },
  {
    id: 'fallback-2',
    caption: 'Art of Rave Episode 156 is out now! Featuring tracks from Amelie Lens, Charlotte de Witte, and more.',
    media_type: 'IMAGE',
    media_url: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174048233_35cb62b4.webp',
    permalink: 'https://www.instagram.com/terrygoldenmusic/',
    timestamp: '2026-03-10T18:00:00Z',
    like_count: 623,
    comments_count: 45
  },
  {
    id: 'fallback-3',
    caption: '"Another Life" out now on all platforms. Link in bio.',
    media_type: 'IMAGE',
    media_url: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174037815_7d07c39a.webp',
    permalink: 'https://www.instagram.com/terrygoldenmusic/',
    timestamp: '2026-03-08T15:00:00Z',
    like_count: 1243,
    comments_count: 89
  },
  {
    id: 'fallback-4',
    caption: 'Walk Like An Egyptian - massive support from DJs worldwide. Thank you all!',
    media_type: 'IMAGE',
    media_url: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174039713_d974c3d7.webp',
    permalink: 'https://www.instagram.com/terrygoldenmusic/',
    timestamp: '2026-03-05T12:00:00Z',
    like_count: 956,
    comments_count: 71
  },
  {
    id: 'fallback-5',
    caption: 'Behind the decks. Nothing beats the energy of a live crowd.',
    media_type: 'IMAGE',
    media_url: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/ACoEjP2-A80cEv1LPqCUIxA/LIve%20shots/Live%20DJ%20MOS_6.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    permalink: 'https://www.instagram.com/terrygoldenmusic/',
    timestamp: '2026-03-03T20:00:00Z',
    like_count: 1567,
    comments_count: 103
  },
  {
    id: 'fallback-6',
    caption: 'Space - new single dropping soon on Interplay Records.',
    media_type: 'IMAGE',
    media_url: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174041577_745c6033.webp',
    permalink: 'https://www.instagram.com/terrygoldenmusic/',
    timestamp: '2026-03-01T14:00:00Z',
    like_count: 789,
    comments_count: 54
  },
  {
    id: 'fallback-7',
    caption: 'Rave The Universe - out now on Exx Muzik. Available on all streaming platforms.',
    media_type: 'IMAGE',
    media_url: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764174043537_d62d2e01.webp',
    permalink: 'https://www.instagram.com/terrygoldenmusic/',
    timestamp: '2026-02-27T16:00:00Z',
    like_count: 1102,
    comments_count: 78
  },
  {
    id: 'fallback-8',
    caption: 'Festival season is coming. Ready to bring the energy to stages around the world.',
    media_type: 'IMAGE',
    media_url: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AJEoMJuKmfTrE5-8Y9R25x4/LIve%20shots/Live%20DJ%20MOS_8.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    permalink: 'https://www.instagram.com/terrygoldenmusic/',
    timestamp: '2026-02-25T19:00:00Z',
    like_count: 2034,
    comments_count: 142
  },
];

export default function SocialMediaFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{ cached: boolean; cacheAge?: number } | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [showAdminNotice, setShowAdminNotice] = useState(false);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setRetrying(forceRefresh);
      const { data, error: fetchError } = await supabase.functions.invoke<FeedResponse>('fetch-instagram-feed', {
        body: { forceRefresh }
      });
      
      if (fetchError) {
        console.warn('Instagram feed fetch error, showing fallback:', fetchError);
        showFallbackFeed();
        return;
      }
      
      // Check if token is expired
      if (data?.tokenExpired) {
        setTokenExpired(true);
        setErrorMessage(data.errorDetails || 'Instagram access token has expired');
        setShowAdminNotice(true);
        showFallbackFeed();
        return;
      }
      
      // Check if Instagram is configured
      if (data?.configured === false) {
        showFallbackFeed();
        return;
      }
      
      // Check if we have valid data
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        setPosts(data.data);
        setCacheInfo({ cached: data.cached || false, cacheAge: data.cacheAge });
        setError(false);
        setTokenExpired(false);
        setErrorMessage(null);
        setUsingFallback(false);
        setShowAdminNotice(false);
      } else {
        if (data?.error) {
          setErrorMessage(data.errorDetails || data.error);
        }
        showFallbackFeed();
      }
    } catch {
      showFallbackFeed();
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const showFallbackFeed = () => {
    setPosts(FALLBACK_POSTS);
    setUsingFallback(true);
    setError(false);
    setLoading(false);
  };

  const formatCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const handleRefresh = () => {
    fetchInstagramPosts(true);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now.getTime() - postDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20 mb-4">
            <Instagram className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-gray-300">@{INSTAGRAM_USERNAME}</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Social Feed</h2>
          <p className="text-gray-400 max-w-md mx-auto">Follow the journey on Instagram</p>
        </div>

        {/* Admin Token Expired Notice */}
        {showAdminNotice && tokenExpired && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-red-400 font-bold">Instagram Token Expired</h3>
                    <button 
                      onClick={() => setShowAdminNotice(false)}
                      className="text-gray-500 hover:text-white transition-colors text-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    The Instagram access token for @{INSTAGRAM_USERNAME} expired on <span className="text-red-400 font-medium">January 26, 2026</span>. 
                    The feed below shows curated content as a fallback.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Admin: Go to Admin Dashboard &gt; Instagram Token Manager to update the token
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      onClick={handleRefresh}
                      disabled={retrying}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm hover:bg-white/10 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
                      {retrying ? 'Retrying...' : 'Retry Connection'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fallback Notice Banner */}
        {usingFallback && !showAdminNotice && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
              <Grid3X3 className="w-4 h-4" />
              <span>Showing recent highlights</span>
              <button
                onClick={handleRefresh}
                disabled={retrying}
                className="ml-2 text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-800 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          /* Posts Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-800"
              >
                <img
                  src={post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url}
                  alt={post.caption?.slice(0, 50) || 'Instagram post'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Video indicator */}
                {post.media_type === 'VIDEO' && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                )}

                {/* Carousel indicator */}
                {post.media_type === 'CAROUSEL_ALBUM' && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <Grid3X3 className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {/* Caption preview */}
                  {post.caption && (
                    <div className="absolute top-0 left-0 right-0 p-3">
                      <p className="text-white/80 text-xs line-clamp-2 leading-relaxed">
                        {post.caption.slice(0, 100)}{post.caption.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  )}
                  
                  {/* Bottom stats */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-white text-sm">
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4" />
                          <span>{formatCount(post.like_count)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4" />
                          <span>{formatCount(post.comments_count)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.timestamp && (
                          <span className="text-white/50 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(post.timestamp)}
                          </span>
                        )}
                        <ExternalLink className="w-4 h-4 text-white/70" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Follow Button */}
        {posts.length > 0 && (
          <div className="text-center mt-10">
            <a
              href={SOCIAL_LINKS.instagram.webUrl}
              onClick={(e) => handleSocialClick(e, 'instagram')}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 font-medium"
            >
              <Instagram className="w-5 h-5" />
              Follow @{INSTAGRAM_USERNAME}
            </a>
            {usingFallback && (
              <p className="text-gray-600 text-xs mt-3">
                Live feed temporarily unavailable — showing curated highlights
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
