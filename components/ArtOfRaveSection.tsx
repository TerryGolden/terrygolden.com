import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Radio, ChevronDown, ChevronUp, ListMusic, Music, Globe, Clock, MapPin, ExternalLink, List, Map, Play, Headphones, Mic2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SpotifyAuthButton } from '@/components/SpotifyAuthButton';
import { artOfRaveLogo } from '@/data/siteData';
import { artOfRaveStations1 } from '@/data/artOfRaveStations';
import { artOfRaveStations2 } from '@/data/artOfRaveStations2';
import { artOfRaveStations3 } from '@/data/artOfRaveStations3';
import { artOfRaveStations4 } from '@/data/artOfRaveStations4';
import { artOfRaveStations5 } from '@/data/artOfRaveStations5';
import { artOfRaveStations6 } from '@/data/artOfRaveStations6';
import { artOfRaveStations7 } from '@/data/artOfRaveStations7';

// Combine all stations - 105 total
const allStations = [
  ...artOfRaveStations1,
  ...artOfRaveStations2,
  ...artOfRaveStations3,
  ...artOfRaveStations4,
  ...artOfRaveStations5,
  ...artOfRaveStations6,
  ...artOfRaveStations7,
];

interface Track {
  id: string;
  episode_id: string;
  artist_name: string;
  track_name: string;
  position: number;
}

interface Episode {
  id: string;
  name: string;
  slug: string;
  url: string;
  created_time: string;
  play_count: number;
  favorite_count: number;
  audio_length: number;
  cover_art_large_url: string;
  description: string;
  tracklist: any[];
  tags: any[];
  mixcloud_key: string;
}

const ArtOfRaveSection = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [tracklists, setTracklists] = useState<Record<string, Track[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Map state
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const countries = useMemo(() => [...new Set(allStations.map(s => s.country))].sort(), []);
  const filteredStations = selectedCountry ? allStations.filter(s => s.country === selectedCountry) : allStations;
  const activeStation = allStations.find(s => s.id === (selectedStation || hoveredStation));

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('art_of_rave_episodes')
        .select('*')
        .order('created_time', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEpisodes(data || []);
      if (data && data.length > 0) {
        setExpandedId(data[0].id);
        fetchAllTracklists(data.map(e => e.id));
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTracklists = async (episodeIds: string[]) => {
    const { data, error } = await supabase
      .from('episode_tracklists')
      .select('id, episode_id, artist_name, track_name, position')
      .in('episode_id', episodeIds)
      .order('position');

    if (!error && data) {
      const grouped: Record<string, Track[]> = {};
      data.forEach(track => {
        if (!grouped[track.episode_id]) grouped[track.episode_id] = [];
        grouped[track.episode_id].push(track);
      });
      setTracklists(grouped);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getUniqueArtists = (episodeId: string) => {
    const tracks = tracklists[episodeId] || [];
    return [...new Set(tracks.map(t => t.artist_name))].slice(0, 4);
  };

  return (
    <section className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================== */}
        {/* HERO SECTION - Art of Rave Introduction */}
        {/* ========================================== */}
        <div className="mb-16">
          <div className="relative bg-gradient-to-br from-purple-900/40 via-zinc-900/90 to-black rounded-3xl border border-purple-500/30 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative grid lg:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12">
              {/* Left Column - Logo */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-xl animate-pulse" />
                  <img 
                    src={artOfRaveLogo} 
                    alt="Art of Rave" 
                    className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-2xl shadow-2xl shadow-purple-500/30 object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 uppercase tracking-wider text-sm font-semibold">Weekly Radio Show</span>
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Art of Rave
                </h1>
                <p className="text-gray-300 text-lg mb-6 flex items-center gap-2">
                  <Mic2 className="w-5 h-5 text-purple-400" />
                  Hosted by Terry Golden
                </p>
                <SpotifyAuthButton onSuccess={() => {}} />
              </div>
              
              {/* Right Column - Description & Stats */}
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4 text-purple-300">About The Show</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  <span className="text-white font-semibold">Art of Rave</span> is Terry Golden's weekly radio show, 
                  delivering the finest selection of electronic dance music from around the globe. Each episode features 
                  exclusive tracks, fresh releases, and timeless classics that define the rave culture.
                </p>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Broadcasting to millions of listeners worldwide, Art of Rave has become a staple for EDM enthusiasts 
                  seeking high-energy beats, euphoric melodies, and the authentic sound of the underground scene. 
                  Tune in every week for a journey through the best in techno, house, trance, and beyond.
                </p>
                
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20 text-center hover:border-purple-500/50 transition-colors">
                    <Music className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">225+</p>
                    <p className="text-xs text-gray-400">Episodes</p>
                  </div>
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20 text-center hover:border-purple-500/50 transition-colors">
                    <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{allStations.length}+</p>
                    <p className="text-xs text-gray-400">Stations</p>
                  </div>
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20 text-center hover:border-purple-500/50 transition-colors">
                    <Headphones className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">2M+</p>
                    <p className="text-xs text-gray-400">Listeners</p>
                  </div>
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20 text-center hover:border-purple-500/50 transition-colors">
                    <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">Weekly</p>
                    <p className="text-xs text-gray-400">New Episodes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* WORLD MAP SECTION - Interactive Station Map */}
        {/* ========================================== */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Where To Listen
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Art of Rave is broadcast on <span className="text-purple-400 font-semibold">{allStations.length} radio stations</span> across the globe. 
              Find your local station below.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 via-zinc-900 to-black rounded-2xl border border-purple-500/30 p-4 sm:p-6">
            {/* Header with view toggle */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                  <Globe className="w-6 h-6 text-purple-400" />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Worldwide Radio Stations
                  </span>
                </h3>
                <p className="text-gray-400 mt-1">{allStations.length} stations broadcasting globally</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'map' ? 'default' : 'outline'} 
                  onClick={() => setViewMode('map')} 
                  size="sm" 
                  className={viewMode === 'map' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <Map className="w-4 h-4 mr-1" /> Map View
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  onClick={() => setViewMode('list')} 
                  size="sm" 
                  className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <List className="w-4 h-4 mr-1" /> List View
                </Button>
              </div>
            </div>

            {/* MAP VIEW */}
            {viewMode === 'map' && (
              <div className="relative">
                <div className="relative w-full bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] rounded-xl overflow-hidden border border-purple-500/20">
                  <svg viewBox="0 0 1000 500" className="w-full h-auto" style={{ minHeight: '400px' }}>
                    <defs>
                      <linearGradient id="oceanGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0a1628" />
                        <stop offset="50%" stopColor="#0d1f3c" />
                        <stop offset="100%" stopColor="#0a1628" />
                      </linearGradient>
                      <linearGradient id="landGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1e3a5f" />
                        <stop offset="100%" stopColor="#152a45" />
                      </linearGradient>
                      <filter id="glow2">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="softGlow2">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <pattern id="grid2" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e3a5f" strokeWidth="0.5" opacity="0.3"/>
                      </pattern>
                    </defs>
                    
                    {/* Ocean background */}
                    <rect width="1000" height="500" fill="url(#oceanGradient2)" />
                    <rect width="1000" height="500" fill="url(#grid2)" />
                    
                    {/* World Map - Realistic 2D continent shapes */}
                    <g fill="url(#landGradient2)" stroke="#3b82f6" strokeWidth="0.5" opacity="0.85">
                      {/* North America */}
                      <path d="M120,80 L180,60 L240,55 L280,60 L310,75 L330,95 L340,120 L335,150 L320,175 L295,195 L265,210 L235,215 L205,210 L180,195 L165,175 L155,155 L150,135 L145,115 L135,100 Z" />
                      {/* Alaska */}
                      <path d="M80,70 L100,60 L120,55 L140,60 L150,75 L145,90 L130,95 L110,90 L90,85 Z" />
                      {/* Greenland */}
                      <path d="M380,45 L420,40 L450,50 L460,70 L455,95 L435,110 L405,105 L385,90 L375,70 Z" />
                      {/* Central America */}
                      <path d="M205,210 L225,215 L240,230 L235,250 L220,265 L200,260 L190,245 L195,225 Z" />
                      {/* South America */}
                      <path d="M235,265 L265,270 L290,290 L305,320 L310,360 L300,400 L280,430 L250,445 L220,440 L195,420 L180,385 L175,345 L185,305 L205,280 L225,270 Z" />
                      {/* Europe */}
                      <path d="M470,85 L510,80 L550,85 L580,95 L600,110 L605,130 L595,145 L570,155 L540,158 L510,155 L485,145 L470,130 L465,110 Z" />
                      {/* UK */}
                      <path d="M445,95 L460,90 L468,100 L465,115 L455,120 L445,115 L440,105 Z" />
                      {/* Ireland */}
                      <path d="M430,100 L442,98 L445,108 L440,115 L432,112 Z" />
                      {/* Scandinavia */}
                      <path d="M510,55 L540,45 L570,50 L590,65 L595,85 L580,95 L550,85 L520,80 L505,70 Z" />
                      {/* Africa */}
                      <path d="M470,165 L510,160 L550,170 L580,195 L600,235 L605,280 L595,330 L570,375 L530,400 L485,405 L445,390 L420,355 L410,310 L415,260 L430,215 L450,180 Z" />
                      {/* Madagascar */}
                      <path d="M620,340 L635,335 L645,355 L640,385 L625,395 L615,380 L615,355 Z" />
                      {/* Middle East */}
                      <path d="M600,145 L640,140 L675,155 L690,180 L680,205 L650,215 L615,205 L600,180 L595,160 Z" />
                      {/* Russia/Northern Asia */}
                      <path d="M590,50 L650,40 L720,35 L800,45 L870,60 L920,85 L940,115 L930,140 L890,155 L840,160 L780,155 L720,145 L660,130 L620,115 L600,95 L595,70 Z" />
                      {/* India */}
                      <path d="M680,180 L720,175 L750,195 L760,230 L745,270 L715,290 L680,280 L665,250 L670,215 Z" />
                      {/* Southeast Asia */}
                      <path d="M760,200 L800,195 L830,215 L840,250 L825,280 L790,290 L760,275 L755,240 Z" />
                      {/* China/East Asia */}
                      <path d="M750,130 L800,125 L850,135 L890,155 L900,180 L890,210 L860,225 L820,230 L780,220 L755,200 L750,165 Z" />
                      {/* Japan */}
                      <path d="M910,145 L925,140 L935,155 L930,180 L920,195 L905,190 L900,170 L905,155 Z" />
                      {/* Indonesia */}
                      <path d="M800,295 L840,290 L880,305 L900,330 L890,355 L850,365 L810,355 L795,330 Z" />
                      {/* Philippines */}
                      <path d="M870,250 L885,245 L895,260 L890,280 L875,285 L865,270 Z" />
                      {/* Australia */}
                      <path d="M820,360 L870,350 L920,360 L960,385 L975,420 L960,455 L920,470 L870,475 L825,460 L800,430 L795,395 Z" />
                      {/* Tasmania */}
                      <path d="M885,480 L905,478 L915,490 L905,502 L890,500 L882,490 Z" />
                      {/* New Zealand */}
                      <path d="M965,440 L980,435 L990,450 L985,475 L970,485 L958,475 L960,455 Z" />
                    </g>
                    
                    {/* Latitude/Longitude lines */}
                    <g stroke="#3b82f6" strokeWidth="0.3" opacity="0.15" fill="none">
                      <line x1="0" y1="125" x2="1000" y2="125" />
                      <line x1="0" y1="250" x2="1000" y2="250" />
                      <line x1="0" y1="375" x2="1000" y2="375" />
                      <line x1="250" y1="0" x2="250" y2="500" />
                      <line x1="500" y1="0" x2="500" y2="500" />
                      <line x1="750" y1="0" x2="750" y2="500" />
                    </g>
                    
                    {/* Station markers */}
                    {allStations.map(station => {
                      const x = ((station.longitude + 180) / 360) * 1000;
                      const y = ((90 - station.latitude) / 180) * 500;
                      const isActive = hoveredStation === station.id || selectedStation === station.id;
                      return (
                        <g 
                          key={station.id} 
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredStation(station.id)}
                          onMouseLeave={() => setHoveredStation(null)}
                          onClick={() => setSelectedStation(selectedStation === station.id ? null : station.id)}
                        >
                          {isActive && (
                            <>
                              <circle cx={x} cy={y} r="20" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.6">
                                <animate attributeName="r" values="8;25;8" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                              </circle>
                              <circle cx={x} cy={y} r="15" fill="#a855f7" opacity="0.2">
                                <animate attributeName="r" values="10;18;10" dur="1.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.5s" repeatCount="indefinite" />
                              </circle>
                            </>
                          )}
                          <g filter={isActive ? 'url(#glow2)' : 'url(#softGlow2)'}>
                            <ellipse cx={x} cy={y + (isActive ? 4 : 2)} rx={isActive ? 5 : 3} ry={isActive ? 2 : 1} fill="#000" opacity="0.3" />
                            <circle cx={x} cy={y} r={isActive ? 8 : 5} fill={isActive ? '#ec4899' : '#a855f7'} stroke="#fff" strokeWidth={isActive ? 2.5 : 1.5} />
                            <circle cx={x - (isActive ? 2 : 1)} cy={y - (isActive ? 2 : 1)} r={isActive ? 2.5 : 1.5} fill="#fff" opacity="0.4" />
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Station info popup */}
                  {activeStation && (
                    <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-black/95 border border-purple-500 rounded-xl p-4 z-10 backdrop-blur-sm shadow-xl shadow-purple-500/20">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-lg flex items-center gap-2">
                            <Radio className="w-4 h-4 text-purple-400" />
                            {activeStation.name}
                          </h4>
                          <p className="text-purple-400 text-sm">{activeStation.country}</p>
                        </div>
                        <button onClick={() => setSelectedStation(null)} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
                      </div>
                      <div className="space-y-1 text-sm text-gray-300 mb-3">
                        <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" />{activeStation.schedule} at {activeStation.time}</p>
                        <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-400" />Timezone: {activeStation.timezone}</p>
                      </div>
                      {activeStation.url && activeStation.url !== '#' && (
                        <a href={activeStation.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                          <ExternalLink className="w-4 h-4" /> Listen Now
                        </a>
                      )}
                    </div>
                  )}
                  
                  {/* Station count badge */}
                  <div className="absolute top-4 right-4 bg-purple-600/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {allStations.length} Stations
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-gray-300 hidden sm:block">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500 border border-white"></span>
                      <span>Radio Station</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick access station buttons */}
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Quick Access:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {allStations.slice(0, 10).map(station => (
                      <button 
                        key={station.id} 
                        onClick={() => setSelectedStation(station.id)}
                        className={`text-left p-3 rounded-lg border text-sm transition-all ${
                          selectedStation === station.id 
                            ? 'bg-purple-600/30 border-purple-500' 
                            : 'bg-zinc-800/50 border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="font-medium truncate">{station.name}</div>
                        <div className="text-xs text-gray-400">{station.country}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* LIST VIEW */}
            {viewMode === 'list' && (
              <div>
                {/* Country filter buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant={!selectedCountry ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCountry(null)} className={!selectedCountry ? 'bg-purple-600 hover:bg-purple-700' : ''}>
                    All ({allStations.length})
                  </Button>
                  {countries.slice(0, 10).map(country => (
                    <Button key={country} variant={selectedCountry === country ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCountry(country)} className={selectedCountry === country ? 'bg-purple-600 hover:bg-purple-700' : ''}>
                      {country}
                    </Button>
                  ))}
                </div>
                
                {/* Station list */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredStations.map(station => (
                    <a key={station.id} href={station.url !== '#' ? station.url : undefined} target="_blank" rel="noopener noreferrer" className="bg-zinc-800/50 hover:bg-purple-600/20 border border-zinc-700 hover:border-purple-500 rounded-xl p-4 block transition-all group">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold group-hover:text-purple-300 transition-colors">{station.name}</div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{station.schedule} at {station.time}</div>
                        </div>
                        <Radio className="w-5 h-5 text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-purple-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{station.country}</span>
                        <span className="text-xs text-gray-500">{station.timezone}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* EPISODES SECTION */}
        {/* ========================================== */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Latest Episodes
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Catch up on past episodes and discover new music from around the world.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-400">Loading episodes...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((episode) => {
              const trackCount = tracklists[episode.id]?.length || 0;
              const artists = getUniqueArtists(episode.id);
              return (
                <div key={episode.id} className="bg-gradient-to-r from-purple-900/20 to-black rounded-xl border border-purple-500/20 overflow-hidden">
                  <button onClick={() => setExpandedId(expandedId === episode.id ? null : episode.id)} className="w-full p-6 flex items-center justify-between text-left hover:bg-purple-500/10 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <img src={episode.cover_art_large_url} alt={episode.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1">{episode.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(episode.created_time)}</span>
                          {trackCount > 0 && <span className="flex items-center gap-1 text-purple-400"><ListMusic className="w-3 h-3" />{trackCount} tracks</span>}
                          {trackCount === 0 && <span className="flex items-center gap-1 text-gray-500"><Play className="w-3 h-3" />No tracklist</span>}
                        </div>
                        {artists.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {artists.map((artist, idx) => (
                              <span key={idx} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{artist}</span>
                            ))}
                            {tracklists[episode.id]?.length > 4 && <span className="text-xs text-gray-500">+more</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    {expandedId === episode.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>

                  {expandedId === episode.id && (
                    <div className="px-6 pb-6 border-t border-purple-500/20">
                      <div className="mt-4 mb-6">
                        <iframe width="100%" height="120" src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(episode.mixcloud_key)}`} frameBorder="0" className="rounded-lg" />
                      </div>
                      {episode.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {episode.tags.map((tag: any, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-purple-500/20 text-purple-300">{tag.name}</Badge>
                          ))}
                        </div>
                      )}
                      {episode.description && <p className="text-gray-300 mb-4">{episode.description}</p>}
                      {trackCount > 0 && (
                        <>
                          <h4 className="text-sm font-semibold text-purple-400 uppercase mb-3">Tracklist</h4>
                          <ol className="space-y-2">
                            {tracklists[episode.id].map((track, idx) => (
                              <li key={track.id} className="text-gray-300 py-2 border-b border-gray-800 last:border-0">
                                {idx + 1}. {track.artist_name} - {track.track_name}
                              </li>
                            ))}
                          </ol>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtOfRaveSection;
