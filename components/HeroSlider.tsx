import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Radio, ExternalLink, Music, Calendar, Clock } from 'lucide-react';
import { heroImages } from '@/data/siteData';

interface HeroSlide {
  id: string;
  image: string;
  type: 'insomniac' | 'default';
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string };
}

const slides: HeroSlide[] = [
  {
    id: 'insomniac',
    image: 'https://d64gsuwffb70l.cloudfront.net/692721d6a05df0400d86237a_1773416325382_3a3b2a87.JPG',
    type: 'insomniac',
    cta: { label: 'Listen on Insomniac Radio', href: 'https://insom.co/radioapp', external: true },
    secondaryCta: { label: 'Latest Releases', href: '/releases' },
  },
  {
    id: 'hero-1',
    image: heroImages[0],
    type: 'default',
    title: 'TERRY GOLDEN',
    subtitle: 'International DJ & Producer',
    cta: { label: 'Listen Now', href: '#player' },
    secondaryCta: { label: 'Latest Releases', href: '/releases' },
  },
  {
    id: 'hero-2',
    image: heroImages[1],
    type: 'default',
    title: 'ART OF RAVE',
    subtitle: 'Weekly Radio Show — Streaming Worldwide',
    cta: { label: 'Listen Now', href: '#player' },
    secondaryCta: { label: 'View Episodes', href: '/art-of-rave' },
  },
  {
    id: 'hero-3',
    image: heroImages[2],
    type: 'default',
    title: 'LIVE PERFORMANCES',
    subtitle: 'Electrifying Sets Across the Globe',
    cta: { label: 'Upcoming Events', href: '#events' },
    secondaryCta: { label: 'Book Now', href: '#contact' },
  },
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const goTo = useCallback((index: number) => setCurrentIndex(index), []);
  const prev = useCallback(() => setCurrentIndex((i) => (i - 1 + slides.length) % slides.length), []);
  const next = useCallback(() => setCurrentIndex((i) => (i + 1) % slides.length), []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = slides[currentIndex];

  return (
    <div 
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {!loadedImages[i] && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-pulse" />
          )}
          <img
            src={slide.image}
            alt={slide.title || 'Terry Golden'}
            className={`w-full h-full object-cover transition-all duration-700 ${
              loadedImages[i] ? 'blur-0 scale-100' : 'blur-xl scale-105'
            }`}
            loading={i === 0 ? 'eager' : 'lazy'}
            onLoad={() => handleImageLoad(i)}
            decoding="async"
          />
          {/* Gradient overlays */}
          {slide.type === 'insomniac' ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-black/15" />
            </>
          )}

        </div>
      ))}

      {/* Slide Content */}
      <div className="absolute inset-0 flex items-center">
        {currentSlide.type === 'insomniac' ? (
          <InsomniacSlide slide={currentSlide} isActive={currentIndex === 0} />
        ) : (
          <DefaultSlide slide={currentSlide} isActive={true} />
        )}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prev} 
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/50 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 rounded-full text-white/70 hover:text-[#D4AF37] transition-all duration-300 backdrop-blur-sm z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button 
        onClick={next} 
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/50 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 rounded-full text-white/70 hover:text-[#D4AF37] transition-all duration-300 backdrop-blur-sm z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-full ${
              i === currentIndex
                ? 'w-8 sm:w-10 h-2.5 sm:h-3 bg-[#D4AF37]'
                : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
        <div
          className="h-full bg-[#D4AF37] transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

/* ============================================
   INSOMNIAC RADIO ONE — Featured Slide
   ============================================ */
const InsomniacSlide = ({ slide, isActive }: { slide: HeroSlide; isActive: boolean }) => {
  return (
    <div className={`w-full h-full flex items-center transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start max-w-3xl">
          
          {/* Insomniac Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.2s backwards' }}
          >
            <Radio className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-white/90 text-xs sm:text-sm font-semibold uppercase tracking-widest">
              New Weekly Residency
            </span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>

          {/* Main Title */}
          <div style={{ animation: 'fadeInUp 0.8s ease-out 0.4s backwards' }}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tight mb-1">
              INSOMNIAC
            </h1>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight mb-2">
              <span className="text-white">RADIO </span>
              <span className="text-[#D4AF37]" style={{ 
                textShadow: '0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.2)' 
              }}>
                ONE
              </span>
            </h1>
          </div>

          {/* Artist Name */}
          <div 
            className="mt-3 sm:mt-4 mb-6 sm:mb-8"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.6s backwards' }}
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/90 tracking-wide">
              TERRY GOLDEN
            </p>
            <div className="w-16 sm:w-24 h-[2px] bg-[#D4AF37] mt-2 sm:mt-3" />
          </div>

          {/* Schedule Info */}
          <div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-8 sm:mb-10"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.8s backwards' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm sm:text-base">Every Wednesday</p>
                <p className="text-white/50 text-xs">Weekly Show</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm sm:text-base">11:00 PM PET</p>
                <p className="text-white/50 text-xs">Pacific Time</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
            style={{ animation: 'fadeInUp 0.8s ease-out 1s backwards' }}
          >
            <a
              href={slide.cta?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-10 py-3.5 sm:py-4 bg-[#D4AF37] hover:bg-[#e6c34a] text-black rounded-lg font-bold text-sm sm:text-base transition-all duration-300 uppercase tracking-wider overflow-hidden shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="relative">Listen on Insomniac Radio</span>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-60" />
            </a>
            <a
              href={slide.secondaryCta?.href}
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-10 py-3.5 sm:py-4 border-2 border-white/20 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-white rounded-lg font-bold text-sm sm:text-base transition-all duration-300 uppercase tracking-wider backdrop-blur-sm"
            >
              <Music className="w-4 h-4 sm:w-5 sm:h-5" />
              Latest Releases
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements — right side */}
      <div className="hidden lg:block absolute right-12 xl:right-24 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative">
          {/* Glowing ring */}
          <div className="w-48 xl:w-56 h-48 xl:h-56 rounded-full border border-[#D4AF37]/20 flex items-center justify-center animate-pulse">
            <div className="w-36 xl:w-44 h-36 xl:h-44 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
              <div className="w-24 xl:w-32 h-24 xl:h-32 rounded-full bg-[#D4AF37]/10 backdrop-blur-sm flex items-center justify-center border border-[#D4AF37]/40">
                <Radio className="w-10 xl:w-12 h-10 xl:h-12 text-[#D4AF37]" />
              </div>
            </div>
          </div>
          {/* Floating dots */}
          <div className="absolute -top-4 -right-4 w-3 h-3 rounded-full bg-[#D4AF37]/60 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute -bottom-2 -left-6 w-2 h-2 rounded-full bg-[#D4AF37]/40 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 -right-8 w-2 h-2 rounded-full bg-[#D4AF37]/50 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
};

/* ============================================
   DEFAULT — Standard Hero Slides (bottom-aligned, compact)
   ============================================ */
const DefaultSlide = ({ slide, isActive }: { slide: HeroSlide; isActive: boolean }) => {
  return (
    <div className={`w-full h-full flex items-end transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full px-6 sm:px-10 lg:px-16 pb-20 sm:pb-24 lg:pb-28">
        <div className="max-w-4xl">
          {/* Title — smaller */}
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight leading-tight uppercase"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.3s backwards' }}
          >
            {slide.title?.split(' ').map((word, idx) => (
              <span key={idx}>
                {idx % 2 === 1 ? (
                  <span className="text-[#D4AF37]" style={{ textShadow: '0 0 20px rgba(212,175,55,0.3)' }}>{word}</span>
                ) : (
                  <span className="text-white">{word}</span>
                )}
                {' '}
              </span>
            ))}
          </h2>

          {/* Subtitle — smaller */}
          <p
            className="text-xs sm:text-sm md:text-base text-gray-300 mb-4 sm:mb-5 tracking-wide font-medium max-w-xl"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.5s backwards' }}
          >
            {slide.subtitle}
          </p>

          {/* CTA Buttons — smaller */}
          <div
            className="flex flex-row gap-2 sm:gap-3"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.7s backwards' }}
          >
            <a
              href={slide.cta?.href}
              className="group inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#D4AF37] hover:bg-[#e6c34a] text-black rounded-md font-semibold text-xs sm:text-sm transition-all duration-300 uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
              {slide.cta?.label}
            </a>
            <a
              href={slide.secondaryCta?.href}
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 border border-white/20 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-white rounded-md font-semibold text-xs sm:text-sm transition-all duration-300 uppercase tracking-wider backdrop-blur-sm"
            >
              {slide.secondaryCta?.label}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


export default HeroSlider;
