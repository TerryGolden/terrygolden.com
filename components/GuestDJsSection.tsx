import { useState } from 'react';
import { Star, Users, Mic2 } from 'lucide-react';
import { guestDJsData, getDJByName, GuestDJ } from '@/data/guestDJsData';
import GuestDJProfileModal from '@/components/GuestDJProfileModal';

export default function GuestDJsSection() {
  const [selectedDJ, setSelectedDJ] = useState<GuestDJ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tier1DJs = guestDJsData.filter(dj => dj.tier === 1);
  const tier2DJs = guestDJsData.filter(dj => dj.tier === 2);
  const tier3DJs = guestDJsData.filter(dj => dj.tier === 3);

  const handleDJClick = (djName: string) => {
    const dj = getDJByName(djName);
    if (dj) {
      setSelectedDJ(dj);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDJ(null);
  };

  return (
    <>
      <section className="mb-16">
        <div className="relative bg-gradient-to-br from-pink-900/30 via-purple-900/40 to-black rounded-3xl border border-pink-500/30 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-pink-500/5 to-transparent rounded-full pointer-events-none" />
          
          <div className="relative p-6 sm:p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="w-5 h-5 text-pink-400" />
                <span className="text-pink-400 uppercase tracking-wider text-sm font-semibold">Featured Artists</span>
                <Star className="w-5 h-5 text-pink-400" />
              </div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Guest DJ Hall of Fame
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Art of Rave has featured some of the biggest names in electronic dance music. 
                These legendary artists have graced our show with exclusive guest mixes.
              </p>
              <p className="text-purple-400 text-sm mt-2">
                Click on any artist to view their full profile
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 bg-pink-900/30 px-4 py-2 rounded-full border border-pink-500/30">
                <Users className="w-5 h-5 text-pink-400" />
                <span className="text-white font-semibold">{guestDJsData.length}+ Guest DJs</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-900/30 px-4 py-2 rounded-full border border-purple-500/30">
                <Mic2 className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Exclusive Mixes</span>
              </div>
            </div>

            {/* DJ Photo Collage Grid */}
            <div className="space-y-10">
              {/* Tier 1 - Headliners (Large photos) */}
              <div>
                <h3 className="text-center text-pink-400 text-sm uppercase tracking-widest mb-6 font-semibold">
                  Headliners
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                  {tier1DJs.map((dj, index) => (
                    <button
                      key={dj.id}
                      onClick={() => handleDJClick(dj.name)}
                      className="group relative focus:outline-none"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300 scale-105" />
                      <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-pink-500/40 group-hover:border-pink-400 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 shadow-lg group-hover:shadow-pink-500/30">
                        <img 
                          src={dj.imageUrl} 
                          alt={dj.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        {/* DJ Name */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white font-bold text-sm sm:text-base text-center truncate">
                            {dj.name}
                          </p>
                          <p className="text-pink-400 text-xs text-center truncate">
                            {dj.country}
                          </p>
                        </div>
                        {/* Tier badge */}
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                          HEADLINER
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier 2 - Major Artists (Medium photos) */}
              <div>
                <h3 className="text-center text-purple-400 text-sm uppercase tracking-widest mb-6 font-semibold">
                  Major Artists
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {tier2DJs.map((dj, index) => (
                    <button
                      key={dj.id}
                      onClick={() => handleDJClick(dj.name)}
                      className="group relative focus:outline-none"
                      style={{ animationDelay: `${(tier1DJs.length + index) * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 scale-105" />
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/40 group-hover:border-purple-400 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-1 shadow-md group-hover:shadow-purple-500/30">
                        <img 
                          src={dj.imageUrl} 
                          alt={dj.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        {/* DJ Name */}
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-white font-semibold text-xs sm:text-sm text-center truncate">
                            {dj.name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier 3 - Rising Stars (Smaller photos) */}
              <div>
                <h3 className="text-center text-gray-400 text-sm uppercase tracking-widest mb-6 font-semibold">
                  Rising Stars
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {tier3DJs.map((dj, index) => (
                    <button
                      key={dj.id}
                      onClick={() => handleDJClick(dj.name)}
                      className="group focus:outline-none"
                      style={{ animationDelay: `${(tier1DJs.length + tier2DJs.length + index) * 100}ms` }}
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700/50 group-hover:border-pink-500/50 transition-all duration-300 transform group-hover:scale-105 shadow-sm group-hover:shadow-pink-500/20">
                        <img 
                          src={dj.imageUrl} 
                          alt={dj.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        {/* DJ Name */}
                        <div className="absolute bottom-0 left-0 right-0 p-1.5">
                          <p className="text-white font-medium text-[10px] sm:text-xs text-center truncate">
                            {dj.name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="mt-10 text-center">
              <p className="text-gray-500 text-sm">
                ...and many more incredible artists
              </p>
              <div className="flex justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-pink-500/50 fill-pink-500/50" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Modal */}
      <GuestDJProfileModal 
        dj={selectedDJ}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
