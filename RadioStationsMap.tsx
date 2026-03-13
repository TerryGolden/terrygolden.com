import { useState, useMemo } from 'react';
import { Radio, Globe, Clock, ExternalLink, MapPin, List, Map, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { artOfRaveStations1 } from '@/data/artOfRaveStations';
import { artOfRaveStations2 } from '@/data/artOfRaveStations2';
import { artOfRaveStations3 } from '@/data/artOfRaveStations3';
import { artOfRaveStations4 } from '@/data/artOfRaveStations4';

// Combine all stations
const allStations = [
  ...artOfRaveStations1,
  ...artOfRaveStations2,
  ...artOfRaveStations3,
  ...artOfRaveStations4,
];

// Convert lat/lng to SVG coordinates (simple equirectangular projection)
const latLngToXY = (lat: number, lng: number, width: number, height: number) => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

export default function RadioStationsMap() {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const countries = useMemo(() => [...new Set(allStations.map(s => s.country))].sort(), []);
  const filteredStations = selectedCountry ? allStations.filter(s => s.country === selectedCountry) : allStations;
  const activeStation = allStations.find(s => s.id === (selectedStation || hoveredStation));

  const handleStationClick = (stationId: string) => {
    setSelectedStation(selectedStation === stationId ? null : stationId);
  };

  // SVG dimensions
  const mapWidth = 800;
  const mapHeight = 400;

  return (
    <div className="bg-gradient-to-br from-purple-900/30 via-zinc-900 to-black rounded-2xl border border-purple-500/30 p-4 sm:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
            <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Worldwide Radio Stations
            </span>
          </h3>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            {allStations.length} stations broadcasting Art of Rave globally
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'map' ? 'default' : 'outline'} 
            onClick={() => setViewMode('map')} 
            size="sm"
            className={viewMode === 'map' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/50 hover:bg-purple-500/20'}
          >
            <Map className="w-4 h-4 mr-1" /> Map
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            onClick={() => setViewMode('list')} 
            size="sm"
            className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/50 hover:bg-purple-500/20'}
          >
            <List className="w-4 h-4 mr-1" /> List
          </Button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="relative">
          {/* Interactive World Map */}
          <div className="relative w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-purple-500/20">
            <svg 
              viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
              className="w-full h-auto"
              style={{ minHeight: '300px', maxHeight: '500px' }}
            >
              {/* Definitions */}
              <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0c1929" />
                  <stop offset="50%" stopColor="#0f2744" />
                  <stop offset="100%" stopColor="#0c1929" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <radialGradient id="markerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </radialGradient>
                <radialGradient id="activeMarkerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </radialGradient>
              </defs>
              
              {/* Ocean background */}
              <rect width={mapWidth} height={mapHeight} fill="url(#oceanGradient)" />
              
              {/* Simplified continent shapes */}
              <g fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" opacity="0.7">
                {/* North America */}
                <path d="M40,60 Q100,30 180,40 L220,60 Q260,100 240,140 L200,170 Q160,200 120,200 L80,180 Q40,150 40,100 Z" />
                {/* South America */}
                <path d="M160,220 Q200,230 210,280 L220,340 Q200,390 160,380 L130,340 Q120,280 140,240 Z" />
                {/* Europe */}
                <path d="M360,50 Q400,40 450,50 L470,80 Q465,110 430,120 L380,115 Q350,100 360,70 Z" />
                {/* Africa */}
                <path d="M370,140 Q420,130 460,160 L480,230 Q460,320 400,340 L350,300 Q330,230 350,170 Z" />
                {/* Asia */}
                <path d="M470,40 Q560,25 660,40 L720,70 Q740,120 700,150 L620,170 Q540,180 490,150 L460,100 Z" />
                {/* India */}
                <path d="M550,160 Q580,150 600,180 L590,240 Q560,270 530,240 L520,190 Z" />
                {/* Southeast Asia */}
                <path d="M620,180 Q660,170 680,210 L670,260 Q630,290 600,260 Z" />
                {/* Australia */}
                <path d="M650,300 Q710,280 750,320 L760,370 Q740,400 680,390 L650,360 Z" />
                {/* UK/Ireland */}
                <ellipse cx="350" cy="70" rx="15" ry="20" />
                {/* Japan */}
                <ellipse cx="720" cy="100" rx="12" ry="25" />
                {/* Indonesia */}
                <path d="M630,270 Q670,260 710,280 L700,300 Q660,310 630,290 Z" />
              </g>
              
              {/* Grid lines */}
              <g stroke="#3b82f6" strokeWidth="0.5" opacity="0.1">
                {[1, 2, 3, 4].map((i) => (
                  <line key={`h${i}`} x1="0" y1={i * 80} x2={mapWidth} y2={i * 80} />
                ))}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2={mapHeight} />
                ))}
              </g>
              
              {/* Station markers */}
              {allStations.map(station => {
                const { x, y } = latLngToXY(station.latitude, station.longitude, mapWidth, mapHeight);
                const isActive = hoveredStation === station.id || selectedStation === station.id;
                
                return (
                  <g 
                    key={station.id}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredStation(station.id)}
                    onMouseLeave={() => setHoveredStation(null)}
                    onClick={() => handleStationClick(station.id)}
                  >
                    {/* Pulse animation for active */}
                    {isActive && (
                      <circle cx={x} cy={y} r="20" fill="#a855f7" opacity="0.2">
                        <animate attributeName="r" values="10;25;10" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Main marker */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isActive ? 8 : 5}
                      fill={isActive ? 'url(#activeMarkerGradient)' : 'url(#markerGradient)'}
                      stroke="#fff"
                      strokeWidth={isActive ? 2 : 1}
                      filter={isActive ? "url(#glow)" : ""}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Station info card overlay */}
            {activeStation && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-black/95 border border-purple-500 rounded-xl p-4 backdrop-blur-sm z-10 shadow-xl shadow-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Radio className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-lg truncate">{activeStation.name}</h4>
                    <p className="text-purple-400 text-sm">{activeStation.country}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>{activeStation.schedule} at {activeStation.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>{activeStation.timezone}</span>
                  </div>
                </div>
                {activeStation.url && (
                  <a 
                    href={activeStation.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors w-full justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Listen Now
                  </a>
                )}
              </div>
            )}
            
            {/* Instructions */}
            {!activeStation && (
              <div className="absolute bottom-4 left-4 text-gray-400 text-sm bg-black/60 px-3 py-2 rounded-lg backdrop-blur-sm">
                <span className="hidden sm:inline">Hover over or click</span>
                <span className="sm:hidden">Tap</span> a station marker to see details
              </div>
            )}
            
            {/* Station count badge */}
            <div className="absolute top-4 right-4 bg-purple-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {allStations.length} Stations
            </div>
          </div>
          
          {/* Quick station list below map */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Featured Stations
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {allStations.slice(0, 10).map(station => (
                <button
                  key={station.id}
                  onClick={() => handleStationClick(station.id)}
                  onMouseEnter={() => setHoveredStation(station.id)}
                  onMouseLeave={() => setHoveredStation(null)}
                  className={`text-left p-3 rounded-lg border transition-all text-sm ${
                    selectedStation === station.id || hoveredStation === station.id
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-zinc-800/50 border-zinc-700 text-gray-300 hover:border-purple-500/50 hover:bg-zinc-800'
                  }`}
                >
                  <div className="font-medium truncate">{station.name}</div>
                  <div className="text-xs opacity-70 mt-1">{station.country}</div>
                </button>
              ))}
            </div>
            {allStations.length > 10 && (
              <button 
                onClick={() => setViewMode('list')}
                className="mt-4 text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors"
              >
                View all {allStations.length} stations <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Country filter buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={!selectedCountry ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setSelectedCountry(null)}
              className={!selectedCountry ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/50 hover:bg-purple-500/20'}
            >
              All ({allStations.length})
            </Button>
            {countries.slice(0, 12).map(country => (
              <Button 
                key={country} 
                variant={selectedCountry === country ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setSelectedCountry(country)}
                className={selectedCountry === country ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/50 hover:bg-purple-500/20'}
              >
                {country}
              </Button>
            ))}
            {countries.length > 12 && (
              <span className="text-gray-500 text-sm self-center">+{countries.length - 12} more</span>
            )}
          </div>
          
          {/* Station cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredStations.map(station => (
              <a 
                key={station.id} 
                href={station.url}
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-zinc-800/50 hover:bg-purple-600/20 border border-zinc-700 hover:border-purple-500 rounded-xl p-4 transition-all group block"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/50 to-pink-600/50 flex items-center justify-center flex-shrink-0 group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                    <Radio className="w-5 h-5 text-purple-300 group-hover:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold group-hover:text-purple-400 transition-colors truncate">
                      {station.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {station.schedule} at {station.time}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-purple-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {station.country}
                      </span>
                      <span className="text-xs text-gray-500">{station.timezone}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
