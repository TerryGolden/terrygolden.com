import { Link } from 'react-router-dom';
import { Radio, ArrowRight } from 'lucide-react';
import { artOfRaveLogo, radioEpisodes } from '@/data/siteData';

const RadioPreview = () => {
  const latestEpisode = radioEpisodes[0];

  return (
    <section className="py-20 bg-gradient-to-b from-purple-950/30 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Radio className="w-6 h-6 text-purple-400" />
              <span className="text-purple-400 uppercase tracking-wider text-sm font-semibold">Weekly Radio Show</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Art of <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Rave</span>
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Join me every week for the hottest electronic music, exclusive premieres, and the best tracks from around the world.
            </p>
            
            <div className="bg-black/50 rounded-xl p-6 border border-purple-500/20 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">LATEST</span>
                <span className="text-gray-400 text-sm">Episode {latestEpisode.episode}</span>
              </div>
              <p className="text-gray-300 mb-4">{latestEpisode.intro}</p>
              <div className="text-sm text-gray-500">
                {latestEpisode.tracklist.slice(0, 3).map((track, i) => (
                  <div key={i} className="py-1 border-b border-gray-800 last:border-0">{track}</div>
                ))}
                <div className="py-1 text-purple-400">+ {latestEpisode.tracklist.length - 3} more tracks</div>
              </div>
            </div>

            <Link
              to="/art-of-rave"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-colors"
            >
              All Episodes <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl blur-3xl" />
            <img
              src={artOfRaveLogo}
              alt="Art of Rave"
              className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadioPreview;
