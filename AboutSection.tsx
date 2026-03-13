import { Music, Radio, Users, Award, Globe, TrendingUp } from 'lucide-react';
import { pressImages } from '@/data/siteData';

const AboutSection = () => {
  const stats = [
    { icon: Users, label: 'Monthly Listeners', value: '50K+' },
    { icon: Music, label: 'Releases', value: '80+' },
    { icon: Award, label: 'Beatport Charts', value: '#11' },
    { icon: Radio, label: 'Radio Stations', value: '100+' },
    { icon: Globe, label: 'Daily Radio Listeners', value: '2.5M+' },
    { icon: TrendingUp, label: 'Art of Rave Episodes', value: '200+' },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 rounded-2xl blur-3xl" />
            <img src={pressImages[1]} alt="Terry Golden" className="relative w-full rounded-2xl shadow-2xl border border-[#D4AF37]/20" />
          </div>

          <div>
            <span className="text-[#D4AF37] uppercase tracking-wider text-sm font-bold">Biography</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
              Terry <span className="text-[#D4AF37]">Golden</span>
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p className="text-lg leading-relaxed"><span className="text-white font-semibold">Terry Golden is a Denmark-based Producer and DJ</span> whose unique take on the melodic undertones of Electronic Music has led to his steady climb.</p>
              <p className="leading-relaxed">Releasing on labels like <span className="text-[#D4AF37] font-semibold">Interplay Records, Ensis Records, and ICONYC</span>, consistently reaching top charting positions across Beatport, and earning slots across renowned European stages.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-[#D4AF37]/10 to-black rounded-xl p-6 text-center border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all">
              <stat.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-black rounded-2xl p-8 border border-[#D4AF37]/30">
          <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Career Highlights</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
            <div><h4 className="text-[#D4AF37] font-semibold mb-2">Art of Rave Radio</h4><p>Host of acclaimed radio show with 200+ episodes, reaching 2.5 million daily listeners on 100+ stations worldwide.</p></div>
            <div><h4 className="text-[#D4AF37] font-semibold mb-2">Chart Success</h4><p>More than ten tracks placing in the Top 5 Melodic Techno chart on Beatport, alongside top positions on iTunes.</p></div>
            <div><h4 className="text-[#D4AF37] font-semibold mb-2">Industry Support</h4><p>Garnered support from Camelphat, Paul Van Dyk, Benny Benassi, and other leading industry names.</p></div>
            <div><h4 className="text-[#D4AF37] font-semibold mb-2">Streaming Milestone</h4><p>Over ten million streams to date, with music continuing to command attention globally.</p></div>
            <div><h4 className="text-[#D4AF37] font-semibold mb-2">Iconic Venues & Festivals</h4><p>Played Ultra Miami, Ultra Europe, Untold Festival, Neversea Festival, Ministry Of Sound, and Mambo Ibiza, just to name a few.</p></div>
            <div><h4 className="text-[#D4AF37] font-semibold mb-2">Global Reach</h4><p>Performed at some of the world's most prestigious electronic music events, connecting with audiences across multiple continents.</p></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
