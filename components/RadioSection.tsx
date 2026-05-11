import { useState } from 'react';
import { Radio, ChevronDown, ChevronUp, Play, Share2 } from 'lucide-react';
import { artOfRaveLogo, radioEpisodes } from '@/data/siteData';
import SocialShareButtons from './SocialShareButtons';

const RadioSection = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [shareModalOpen, setShareModalOpen] = useState<number | null>(null);


  return (
    <section className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 text-center">
            <img src={artOfRaveLogo} alt="Art of Rave" className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl mb-6" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <Radio className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 uppercase tracking-wider text-sm">Weekly Show</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">Art of Rave</h1>
            <p className="text-gray-400">New episode every week featuring the best electronic music.</p>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Episodes</h2>
            {radioEpisodes.map((ep) => (
              <div key={ep.id} className="bg-gradient-to-r from-purple-900/20 to-black rounded-xl border border-purple-500/20">
                <div className="w-full p-6 flex items-center justify-between">
                  <button 
                    onClick={() => setExpandedId(expandedId === ep.id ? null : ep.id)} 
                    className="flex-1 flex items-center gap-4 text-left hover:opacity-80 transition-opacity"
                  >
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Episode {ep.episode}</h3>
                      <p className="text-gray-500 text-sm">{ep.date}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShareModalOpen(shareModalOpen === ep.id ? null : ep.id)}
                      className="p-2 rounded-full bg-gray-800 hover:bg-purple-600 transition-all hover:scale-110"
                      title="Share this episode"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <button onClick={() => setExpandedId(expandedId === ep.id ? null : ep.id)}>
                      {expandedId === ep.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
                
                {shareModalOpen === ep.id && (
                  <div className="px-6 pb-4">
                    <div className="p-3 bg-black/50 rounded-lg border border-purple-500/20">
                      <SocialShareButtons
                        url={`${window.location.origin}/art-of-rave#episode-${ep.episode}`}
                        title={`Art of Rave - Episode ${ep.episode}`}
                        description={ep.intro}

                        image={artOfRaveLogo}
                        hashtags={['ArtOfRave', 'TerryGolden', 'RadioShow', 'EDM']}
                        compact
                      />
                    </div>
                  </div>
                )}
                
                {expandedId === ep.id && (
                  <div className="px-6 pb-6 border-t border-purple-500/20">
                    <p className="text-gray-300 my-4">{ep.intro}</p>
                    <h4 className="text-sm font-semibold text-purple-400 uppercase mb-3">Tracklist</h4>
                    <ol>{ep.tracklist.map((track, i) => (<li key={i} className="text-gray-300 py-2 border-b border-gray-800 last:border-0">{i+1}. {track}</li>))}</ol>
                  </div>
                )}
              </div>

            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadioSection;
