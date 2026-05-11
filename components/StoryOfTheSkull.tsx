import { ChevronDown } from 'lucide-react';

export default function StoryOfTheSkull() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764344796103_4178e785.webp"
            alt="The Skull"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-wider">
            THE SKULL
          </h1>
          <p className="text-2xl md:text-4xl font-light tracking-widest text-[#D4AF37] mb-12">
            A SYMBOL OF TRANSFORMATION
          </p>
        </div>

        <button 
          onClick={() => scrollToSection('chaos')}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        >
          <ChevronDown className="w-12 h-12 text-[#D4AF37]" />
        </button>
      </section>

      {/* Chaos Section */}
      <section id="chaos" className="relative min-h-screen flex items-center justify-center py-20 px-6">
        <div className="absolute inset-0">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764344338018_37216d81.webp"
            alt="Chaos"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <h2 className="text-6xl md:text-8xl font-bold mb-12 text-center tracking-wider">
            IF YOU WANT CHANGE
          </h2>
          <h3 className="text-5xl md:text-7xl font-bold mb-16 text-center tracking-wider text-[#D4AF37]">
            YOU HAVE TO INVITE CHAOS
          </h3>
          
          <div className="space-y-8 text-xl md:text-2xl leading-relaxed text-gray-300">
            <p>
              In the stillness of comfort, we stagnate. We become prisoners of our own patterns, 
              locked in cycles that feel safe but leave us hollow.
            </p>
            <p>
              The skull reminds us of impermanence. Of the finite nature of existence. 
              That every moment we cling to safety is a moment we deny our potential for transformation.
            </p>
            <p className="text-[#D4AF37] font-semibold">
              Chaos is not the enemy. Chaos is the catalyst.
            </p>
          </div>
        </div>

        <button 
          onClick={() => scrollToSection('fracture')}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        >
          <ChevronDown className="w-12 h-12 text-[#D4AF37]" />
        </button>
      </section>

      {/* Fracture Section */}
      <section id="fracture" className="relative min-h-screen flex items-center justify-center py-20 px-6">
        <div className="absolute inset-0">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764344338940_52109f2d.webp"
            alt="Fractured"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-bold mb-16 text-center tracking-wider">
            THE FRACTURED SELF
          </h2>
          
          <div className="space-y-8 text-xl md:text-2xl leading-relaxed text-gray-300">
            <p>
              We are not one person. We are a collection of past selves, each living in different 
              timelines of memory and possibility.
            </p>
            <p>
              The skull represents the death of who we were, making space for who we can become. 
              Each fracture is a portal—a doorway to another version of ourselves.
            </p>
            <p>
              When we embrace chaos, we shatter the illusion of a singular identity. 
              We discover that we contain multitudes.
            </p>
            <p className="text-[#D4AF37] font-semibold text-center text-3xl mt-12">
              In breaking, we become whole.
            </p>
          </div>
        </div>

        <button 
          onClick={() => scrollToSection('portal')}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        >
          <ChevronDown className="w-12 h-12 text-[#D4AF37]" />
        </button>
      </section>

      {/* Portal Section */}
      <section id="portal" className="relative min-h-screen flex items-center justify-center py-20 px-6">
        <div className="absolute inset-0">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1764344802128_7a585612.webp"
            alt="Portal"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-bold mb-16 text-center tracking-wider">
            THE PORTAL AWAITS
          </h2>
          
          <div className="space-y-8 text-xl md:text-2xl leading-relaxed text-gray-300">
            <p>
              Every ending is a threshold. Every death, a doorway. The skull is not a symbol of finality—
              it is an invitation to cross over.
            </p>
            <p>
              Through music, we create portals. Frequencies that transport us beyond the mundane, 
              into realms where transformation is not just possible, but inevitable.
            </p>
            <p>
              The question is not whether you will change. The question is whether you will 
              choose to step through the portal, or remain on the other side, watching.
            </p>
          </div>

          <div className="mt-16 p-12 border-2 border-[#D4AF37] bg-black/50 backdrop-blur">
            <p className="text-3xl md:text-5xl font-bold text-center tracking-wider leading-tight">
              THE SKULL IS YOUR GUIDE
            </p>
            <p className="text-xl md:text-2xl text-center mt-6 text-gray-400">
              Through chaos, through fracture, through the portal
            </p>
            <p className="text-2xl md:text-3xl text-center mt-8 text-[#D4AF37] font-semibold">
              Into the music. Into yourself.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
