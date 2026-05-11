import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Play, Music } from 'lucide-react';
import { handleSocialClick, SOCIAL_LINKS } from '@/lib/socialMediaUtils';

interface Mix {
  id: string;
  title: string;
  soundcloud_url: string;
  display_order: number;
  is_visible: boolean;
  cover_image_url?: string;
}

const SoundCloudPlayer = () => {
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMixId, setSelectedMixId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMixes = async () => {
      const { data } = await supabase
        .from('soundcloud_mixes')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');
      if (data && data.length > 0) {
        setMixes(data);
        setSelectedMixId(data[0].id);
      }
      setLoading(false);
    };
    fetchMixes();
  }, []);

  const selectedMix = mixes.find(m => m.id === selectedMixId);

  const getEmbedUrl = (url: string) => {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%239333ea&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
  };

  const fallbackUrl = SOCIAL_LINKS.soundcloud.webUrl;

  return (
    <section id="player" className="py-20 bg-gradient-to-b from-black to-purple-950/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Listen to <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">My Mixes</span>
          </h2>
          <p className="text-gray-400">Stream the latest sets and mixes from SoundCloud</p>
        </div>

        {mixes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {mixes.map((mix) => (
              <button
                key={mix.id}
                onClick={() => setSelectedMixId(mix.id)}
                className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                  selectedMixId === mix.id
                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black scale-105 shadow-lg shadow-purple-500/30'
                    : 'hover:scale-105 hover:shadow-lg'
                }`}
              >
                {mix.cover_image_url ? (
                  <img src={mix.cover_image_url} alt={mix.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center">
                    <Music className="w-12 h-12 text-purple-400/50" />
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 transition-opacity ${
                  selectedMixId === mix.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <p className="text-white text-sm font-medium truncate">{mix.title}</p>
                </div>
                {selectedMixId === mix.id && (
                  <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1.5">
                    <Play className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="bg-black/50 rounded-2xl p-6 border border-purple-500/20">
          {loading ? (
            <div className="h-[166px] flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <iframe
              key={selectedMixId || 'fallback'}
              width="100%"
              height={mixes.length > 0 ? "166" : "450"}
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={selectedMix ? getEmbedUrl(selectedMix.soundcloud_url) : getEmbedUrl(fallbackUrl)}
              className="rounded-lg"
            />
          )}
          <div className="mt-4 text-center">
            <a 
              href={SOCIAL_LINKS.soundcloud.webUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => handleSocialClick(e, 'soundcloud')}
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.56 8.87V17h8.76c1.85 0 2.68-1.5 2.68-2.91 0-1.41-.96-2.91-2.68-2.91-.32 0-.64.07-.96.14C19.22 8.31 16.82 6 13.87 6c-.82 0-1.64.21-2.31.56v2.31zM1 12.5v2.75c0 .14.11.25.25.25h.5c.14 0 .25-.11.25-.25V12.5c0-.14-.11-.25-.25-.25h-.5c-.14 0-.25.11-.25.25zm1.75-1.75v6.25c0 .14.11.25.25.25h.5c.14 0 .25-.11.25-.25v-6.25c0-.14-.11-.25-.25-.25H3c-.14 0-.25.11-.25.25zm1.75-1v8c0 .14.11.25.25.25h.5c.14 0 .25-.11.25-.25v-8c0-.14-.11-.25-.25-.25h-.5c-.14 0-.25.11-.25.25zm1.75-.5v9c0 .14.11.25.25.25h.5c.14 0 .25-.11.25-.25v-9c0-.14-.11-.25-.25-.25h-.5c-.14 0-.25.11-.25.25zm1.75-.75v10.25c0 .14.11.25.25.25h.5c.14 0 .25-.11.25-.25V8.5c0-.14-.11-.25-.25-.25h-.5c-.14 0-.25.11-.25.25zm1.75-.25V17c0 .14.11.25.25.25h.5c.14 0 .25-.11.25-.25V8.25c0-.14-.11-.25-.25-.25h-.5c-.14 0-.25.11-.25.25z"/>
              </svg>
              Follow on SoundCloud
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoundCloudPlayer;
