import { useState, useEffect, useMemo } from 'react';
import { supabase, safeInvokeFunction } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EpisodeTracklist from '@/components/EpisodeTracklist';
import GuestDJsSection from '@/components/GuestDJsSection';
import GuestMixApplicationForm from '@/components/GuestMixApplicationForm';
import { artOfRaveLogo, radioEpisodes as staticEpisodes } from '@/data/siteData';
import { artOfRaveStations1 } from '@/data/artOfRaveStations';
import { artOfRaveStations2 } from '@/data/artOfRaveStations2';
import { artOfRaveStations3 } from '@/data/artOfRaveStations3';
import { artOfRaveStations4 } from '@/data/artOfRaveStations4';
import { Calendar, ChevronDown, ChevronUp, Music, Globe, Radio, Clock, MapPin, ExternalLink, Play, Loader2, Headphones, Mic2, Instagram, Send, Star, Search, Filter, Plus, X, Check, Wifi, WifiOff, SortAsc, SortDesc, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EpisodeInstagramShareModal from '@/components/EpisodeInstagramShareModal';

// BUILD VERSION - Change this to verify deployment
const BUILD_VERSION = "v2.0.3-Dec23-2025";
const BUILD_TIMESTAMP = "2025-12-23T13:08:00Z";

// Only include verified radio stations (removed placeholder stations from files 5-7)
const initialStations = [...artOfRaveStations1, ...artOfRaveStations2, ...artOfRaveStations3, ...artOfRaveStations4];
interface RadioEpisode {
  id: string;
  title: string;
  description: string;
  air_date: string;
  audio_url: string;
  cover_image_url: string;
  episode_number: number;
  tracklist: string[];
  is_published: boolean;
  mixcloud_key?: string;
}
interface Station {
  id: string;
  name: string;
  schedule: string;
  time: string;
  repeat: string;
  country: string;
  timezone: string;
  url: string;
  latitude: number;
  longitude: number;
  isLive?: boolean;
}

// Check if a station is currently live based on schedule
const checkIfLive = (station: Station): boolean => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', {
    weekday: 'long'
  });
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Parse station time
  const [stationHour, stationMinute] = station.time.split(':').map(Number);

  // Check if the schedule matches today
  const scheduleDay = station.schedule.replace('Every ', '');
  if (!currentDay.toLowerCase().includes(scheduleDay.toLowerCase().replace('s', ''))) {
    return false;
  }

  // Check if within broadcast window (assume 1-hour show)
  const stationStartMinutes = stationHour * 60 + stationMinute;
  const currentMinutes = currentHour * 60 + currentMinute;
  return currentMinutes >= stationStartMinutes && currentMinutes < stationStartMinutes + 60;
};

// Main Art of Rave Page Component
export default function ArtOfRave() {
  const [episodes, setEpisodes] = useState<RadioEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDatabase, setUseDatabase] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<RadioEpisode | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showLatestPlayer, setShowLatestPlayer] = useState(false);
  const [episodeTracklists, setEpisodeTracklists] = useState<Record<string, {
    artist_name: string;
    track_name: string;
  }[]>>({});

  // Station state
  const [allStations, setAllStations] = useState<Station[]>(initialStations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'country' | 'time'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [addStationOpen, setAddStationOpen] = useState(false);

  // New station form
  const [newStation, setNewStation] = useState({
    name: '',
    schedule: 'Every Monday',
    time: '20:00',
    country: '',
    timezone: 'GMT+00:00',
    url: ''
  });

  // Get latest episode
  const latestEpisode = useMemo(() => {
    return episodes.length > 0 ? episodes[0] : null;
  }, [episodes]);

  // Get Mixcloud embed URL for latest episode
  const latestEpisodeMixcloudEmbed = useMemo(() => {
    if (!latestEpisode) return null;
    if (latestEpisode.mixcloud_key) {
      return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(latestEpisode.mixcloud_key)}`;
    }
    if (latestEpisode.audio_url && latestEpisode.audio_url.includes('mixcloud.com')) {
      const match = latestEpisode.audio_url.match(/mixcloud\.com(\/[^?]+)/);
      if (match) {
        return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(match[1])}`;
      }
    }
    return null;
  }, [latestEpisode]);

  // Get unique countries and schedules
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(allStations.map(s => s.country))].sort();
    return uniqueCountries;
  }, [allStations]);
  const schedules = useMemo(() => {
    const uniqueSchedules = [...new Set(allStations.map(s => s.schedule))].sort();
    return uniqueSchedules;
  }, [allStations]);

  // Filter and sort stations
  const filteredStations = useMemo(() => {
    let filtered = allStations.map(station => ({
      ...station,
      isLive: checkIfLive(station)
    }));

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(query) || s.country.toLowerCase().includes(query) || s.timezone.toLowerCase().includes(query));
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(s => s.country === selectedCountry);
    }

    // Schedule filter
    if (selectedSchedule !== 'all') {
      filtered = filtered.filter(s => s.schedule === selectedSchedule);
    }

    // Live only filter
    if (showLiveOnly) {
      filtered = filtered.filter(s => s.isLive);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'country':
          comparison = a.country.localeCompare(b.country);
          break;
        case 'time':
          comparison = a.time.localeCompare(b.time);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return filtered;
  }, [allStations, searchQuery, selectedCountry, selectedSchedule, showLiveOnly, sortBy, sortOrder]);

  // Count live stations
  const liveCount = useMemo(() => {
    return allStations.filter(s => checkIfLive(s)).length;
  }, [allStations]);

  // Add new station
  const handleAddStation = () => {
    if (!newStation.name || !newStation.country) return;
    const station: Station = {
      id: `custom-${Date.now()}`,
      name: newStation.name,
      schedule: newStation.schedule,
      time: newStation.time,
      repeat: 'Weekly',
      country: newStation.country,
      timezone: newStation.timezone,
      url: newStation.url || '#',
      latitude: 0,
      longitude: 0
    };
    setAllStations(prev => [...prev, station]);
    setNewStation({
      name: '',
      schedule: 'Every Monday',
      time: '20:00',
      country: '',
      timezone: 'GMT+00:00',
      url: ''
    });
    setAddStationOpen(false);
  };
  useEffect(() => {
    fetchEpisodes();
  }, []);
  const fetchEpisodes = async () => {
    try {
      const {
        data: artData,
        error: artError
      } = await supabase.from('art_of_rave_episodes').select('*').order('created_time', {
        ascending: false
      });
      if (!artError && artData && artData.length > 0) {
        const transformedData = artData.map((ep: any) => ({
          id: ep.id,
          title: ep.name,
          description: ep.description || '',
          air_date: ep.created_time,
          audio_url: ep.url || '',
          cover_image_url: ep.cover_art_large_url || '',
          episode_number: parseInt(ep.name?.match(/\d+/)?.[0] || '0'),
          tracklist: ep.tracklist || [],
          is_published: true,
          mixcloud_key: ep.mixcloud_key || ''
        }));
        setEpisodes(transformedData);
        setExpandedId(transformedData[0]?.id || null);

        // Fetch tracklists for all episodes
        fetchAllTracklists(transformedData.map((e: RadioEpisode) => e.id));
        setLoading(false);
        return;
      }
      const {
        data,
        error
      } = await supabase.from('radio_episodes').select('*').eq('is_published', true).order('episode_number', {
        ascending: false
      });
      if (error) throw error;
      if (data && data.length > 0) {
        setEpisodes(data);
        setExpandedId(data[0]?.id || null);
        fetchAllTracklists(data.map((e: RadioEpisode) => e.id));
      } else {
        setUseDatabase(false);
      }
    } catch {
      setUseDatabase(false);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllTracklists = async (episodeIds: string[]) => {
    const {
      data,
      error
    } = await supabase.from('episode_tracklists').select('episode_id, artist_name, track_name, position').in('episode_id', episodeIds).order('position');
    if (!error && data) {
      const grouped: Record<string, {
        artist_name: string;
        track_name: string;
      }[]> = {};
      data.forEach((track: any) => {
        if (!grouped[track.episode_id]) grouped[track.episode_id] = [];
        grouped[track.episode_id].push({
          artist_name: track.artist_name,
          track_name: track.track_name
        });
      });
      setEpisodeTracklists(grouped);
    }
  };
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const trackEvent = async (episodeId: string, eventType: 'play' | 'download' | 'view') => {
    // Use safe invoke to prevent errors when edge function is not available
    await safeInvokeFunction('track-radio-event', {
      body: {
        episode_id: episodeId,
        event_type: eventType,
        session_id: sessionId
      }
    });
  };
  const handleExpand = (episodeId: string) => {
    const newId = expandedId === episodeId ? null : episodeId;
    setExpandedId(newId);
    if (newId) trackEvent(episodeId, 'view');
  };
  const openShareModal = (ep: RadioEpisode) => {
    setSelectedEpisode(ep);
    setShareModalOpen(true);
  };
  const toggleSort = (field: 'name' | 'country' | 'time') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Get artists for selected episode
  const getEpisodeArtists = (episodeId: string) => {
    const tracks = episodeTracklists[episodeId] || [];
    return [...new Set(tracks.map(t => t.artist_name))];
  };
  return <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ========================================== */}
          {/* HERO SECTION - Art of Rave Introduction */}
          {/* ========================================== */}
          <section className="mb-16">
            <div className="relative bg-gradient-to-br from-purple-900/40 via-zinc-900/90 to-black rounded-3xl border border-purple-500/30 overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative grid lg:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12">
                {/* Left Column - Logo */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-xl animate-pulse" />
                    <img src={artOfRaveLogo} alt="Art of Rave" className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-2xl shadow-2xl shadow-purple-500/30 object-cover" />
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

                </div>
                
                {/* Right Column - Description & Stats */}
                <div className="flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-4 text-purple-300">About The Show</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    <span className="text-white font-semibold">Art of Rave</span> is Terry Golden's weekly radio show, 
                    delivering the finest selection of electronic dance music from around the globe. Each episode features 
                    exclusive tracks, fresh releases, and timeless classics that define the rave culture.
                  </p>
                  
                  {/* Latest Episode Player */}
                  {latestEpisode && latestEpisodeMixcloudEmbed && <div className="mb-6 bg-zinc-800/50 rounded-xl p-4 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs text-purple-400 uppercase tracking-wider">Latest Episode</p>
                          <h3 className="font-semibold text-white">{latestEpisode.title}</h3>
                          <p className="text-xs text-gray-400">{formatDate(latestEpisode.air_date)}</p>
                        </div>
                        <button onClick={() => {
                      setShowLatestPlayer(!showLatestPlayer);
                      if (!showLatestPlayer) trackEvent(latestEpisode.id, 'play');
                    }} className={`p-3 rounded-full transition-all ${showLatestPlayer ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                          {showLatestPlayer ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {showLatestPlayer && <div className="mt-3 rounded-lg overflow-hidden animate-in slide-in-from-top duration-300">
                          <iframe width="100%" height="120" src={latestEpisodeMixcloudEmbed} frameBorder="0" allow="autoplay" className="rounded-lg" />
                        </div>}
                    </div>}
                  
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20 text-center hover:border-purple-500/50 transition-colors">
                      <Music className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">225+</p>
                      <p className="text-xs text-gray-400">Episodes</p>
                    </div>
                    <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20 text-center hover:border-purple-500/50 transition-colors">
                      <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white" data-mixed-content="true" data-mixed-content="true">{allStations.length}</p>
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
          </section>

          {/* ========================================== */}
          {/* GUEST DJs SECTION - Hall of Fame */}
          {/* ========================================== */}
          <GuestDJsSection />

          {/* ========================================== */}
          {/* APPLY FOR GUEST MIX SECTION */}
          {/* ========================================== */}
          <section className="mb-16">
            <div className="relative bg-gradient-to-br from-purple-900/30 via-zinc-900 to-black rounded-3xl border border-purple-500/30 overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative p-6 sm:p-8 lg:p-12">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Send className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 uppercase tracking-wider text-sm font-semibold">Join The Show</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Apply for a Guest Mix
                  </h2>
                  <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Are you a DJ looking to showcase your talent? Submit your guest mix for a chance to be featured 
                    on Art of Rave and reach millions of listeners worldwide!
                  </p>
                </div>

                {/* Requirements */}
                <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-purple-500/20 text-center">
                    <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Music className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Quality Mix</h4>
                    <p className="text-xs text-gray-400">High-quality MP3 format, 1 hour duration</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-purple-500/20 text-center">
                    <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mic2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Voice Over</h4>
                    <p className="text-xs text-gray-400">Short intro for the show</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-purple-500/20 text-center">
                    <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Full Tracklist</h4>
                    <p className="text-xs text-gray-400">Artist - Track, Label format</p>
                  </div>
                </div>

                {/* Application Form */}
                <div className="max-w-2xl mx-auto">
                  <GuestMixApplicationForm />
                </div>
              </div>
            </div>
          </section>



          {/* ========================================== */}
          {/* RADIO STATIONS SECTION - Enhanced List View */}
          {/* ========================================== */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Where To Listen
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Art of Rave is broadcast on <span className="text-purple-400 font-semibold" data-mixed-content="true" data-mixed-content="true">{allStations.length} radio stations</span> across the globe. 
                Find your local station below.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 via-zinc-900 to-black rounded-2xl border border-purple-500/30 p-4 sm:p-6">
              {/* Header with stats and add button */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    <Globe className="w-6 h-6 text-purple-400" />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      Worldwide Radio Stations
                    </span>
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-gray-400" data-mixed-content="true" data-mixed-content="true">{allStations.length}105</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-400" data-mixed-content="true" data-mixed-content="true">{countries.length} countries</span>
                    {liveCount > 0 && <>
                        <span className="text-gray-600">|</span>
                        <span className="flex items-center gap-1 text-green-400" data-mixed-content="true" data-mixed-content="true">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          {liveCount} live now
                        </span>
                      </>}
                  </div>
                </div>
                
                <Dialog open={addStationOpen} onOpenChange={setAddStationOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" /> Add Station
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-900 border-purple-500/30 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-purple-400">Add New Station</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="station-name">Station Name *</Label>
                        <Input id="station-name" value={newStation.name} onChange={e => setNewStation(prev => ({
                        ...prev,
                        name: e.target.value
                      }))} placeholder="e.g., Radio XYZ" className="bg-zinc-800 border-zinc-700 mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="station-country">Country *</Label>
                        <Input id="station-country" value={newStation.country} onChange={e => setNewStation(prev => ({
                        ...prev,
                        country: e.target.value
                      }))} placeholder="e.g., United States" className="bg-zinc-800 border-zinc-700 mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="station-schedule">Schedule</Label>
                          <Select value={newStation.schedule} onValueChange={value => setNewStation(prev => ({
                          ...prev,
                          schedule: value
                        }))}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="Every Monday">Every Monday</SelectItem>
                              <SelectItem value="Every Tuesday">Every Tuesday</SelectItem>
                              <SelectItem value="Every Wednesday">Every Wednesday</SelectItem>
                              <SelectItem value="Every Thursday">Every Thursday</SelectItem>
                              <SelectItem value="Every Friday">Every Friday</SelectItem>
                              <SelectItem value="Every Saturday">Every Saturday</SelectItem>
                              <SelectItem value="Every Sunday">Every Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="station-time">Time</Label>
                          <Input id="station-time" type="time" value={newStation.time} onChange={e => setNewStation(prev => ({
                          ...prev,
                          time: e.target.value
                        }))} className="bg-zinc-800 border-zinc-700 mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="station-timezone">Timezone</Label>
                        <Select value={newStation.timezone} onValueChange={value => setNewStation(prev => ({
                        ...prev,
                        timezone: value
                      }))}>
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 max-h-60">
                            <SelectItem value="GMT-12:00">GMT-12:00</SelectItem>
                            <SelectItem value="GMT-11:00">GMT-11:00</SelectItem>
                            <SelectItem value="GMT-10:00">GMT-10:00 (Hawaii)</SelectItem>
                            <SelectItem value="GMT-09:00">GMT-09:00 (Alaska)</SelectItem>
                            <SelectItem value="GMT-08:00">GMT-08:00 (Pacific)</SelectItem>
                            <SelectItem value="GMT-07:00">GMT-07:00 (Mountain)</SelectItem>
                            <SelectItem value="GMT-06:00">GMT-06:00 (Central)</SelectItem>
                            <SelectItem value="GMT-05:00">GMT-05:00 (Eastern)</SelectItem>
                            <SelectItem value="GMT-04:00">GMT-04:00 (Atlantic)</SelectItem>
                            <SelectItem value="GMT-03:00">GMT-03:00 (Brazil)</SelectItem>
                            <SelectItem value="GMT-02:00">GMT-02:00</SelectItem>
                            <SelectItem value="GMT-01:00">GMT-01:00</SelectItem>
                            <SelectItem value="GMT+00:00">GMT+00:00 (London)</SelectItem>
                            <SelectItem value="GMT+01:00">GMT+01:00 (Paris)</SelectItem>
                            <SelectItem value="GMT+02:00">GMT+02:00 (Cairo)</SelectItem>
                            <SelectItem value="GMT+03:00">GMT+03:00 (Moscow)</SelectItem>
                            <SelectItem value="GMT+04:00">GMT+04:00 (Dubai)</SelectItem>
                            <SelectItem value="GMT+05:00">GMT+05:00</SelectItem>
                            <SelectItem value="GMT+05:30">GMT+05:30 (India)</SelectItem>
                            <SelectItem value="GMT+06:00">GMT+06:00</SelectItem>
                            <SelectItem value="GMT+07:00">GMT+07:00 (Bangkok)</SelectItem>
                            <SelectItem value="GMT+08:00">GMT+08:00 (Singapore)</SelectItem>
                            <SelectItem value="GMT+09:00">GMT+09:00 (Tokyo)</SelectItem>
                            <SelectItem value="GMT+10:00">GMT+10:00 (Sydney)</SelectItem>
                            <SelectItem value="GMT+11:00">GMT+11:00</SelectItem>
                            <SelectItem value="GMT+12:00">GMT+12:00 (Auckland)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="station-url">Website URL</Label>
                        <Input id="station-url" value={newStation.url} onChange={e => setNewStation(prev => ({
                        ...prev,
                        url: e.target.value
                      }))} placeholder="https://..." className="bg-zinc-800 border-zinc-700 mt-1" />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => setAddStationOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={handleAddStation} disabled={!newStation.name || !newStation.country} className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Check className="w-4 h-4 mr-2" /> Add Station
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search and Filters */}
              <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 border border-zinc-700/50">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input placeholder="Search stations by name, country, or timezone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-zinc-900 border-zinc-700 h-11" />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>}
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-3">
                    {/* Country Filter */}
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700">
                        <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                        <SelectValue placeholder="All Countries" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 max-h-80">
                        <SelectItem value="all" data-mixed-content="true" data-mixed-content="true">All Countries ({allStations.length})</SelectItem>
                        {countries.map(country => {
                        const count = allStations.filter(s => s.country === country).length;
                        return <SelectItem key={country} value={country} data-mixed-content="true" data-mixed-content="true">
                              {country} ({count})
                            </SelectItem>;
                      })}
                      </SelectContent>
                    </Select>

                    {/* Schedule Filter */}
                    <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
                      <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700">
                        <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                        <SelectValue placeholder="All Days" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="all">All Days</SelectItem>
                        {schedules.map(schedule => <SelectItem key={schedule} value={schedule}>
                            {schedule}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>

                    {/* Live Only Toggle */}
                    <Button variant={showLiveOnly ? 'default' : 'outline'} onClick={() => setShowLiveOnly(!showLiveOnly)} className={showLiveOnly ? 'bg-green-600 hover:bg-green-700' : ''} data-mixed-content="true" data-mixed-content="true">
                      {showLiveOnly ? <Wifi className="w-4 h-4 mr-2" /> : <WifiOff className="w-4 h-4 mr-2" />}
                      Live Only
                    </Button>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-700/50">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Sort by:</span>
                  <div className="flex gap-2">
                    <Button variant={sortBy === 'name' ? 'default' : 'ghost'} size="sm" onClick={() => toggleSort('name')} className={sortBy === 'name' ? 'bg-purple-600 hover:bg-purple-700' : ''} data-mixed-content="true" data-mixed-content="true">
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />)}
                    </Button>
                    <Button variant={sortBy === 'country' ? 'default' : 'ghost'} size="sm" onClick={() => toggleSort('country')} className={sortBy === 'country' ? 'bg-purple-600 hover:bg-purple-700' : ''} data-mixed-content="true" data-mixed-content="true">
                      Country {sortBy === 'country' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />)}
                    </Button>
                    <Button variant={sortBy === 'time' ? 'default' : 'ghost'} size="sm" onClick={() => toggleSort('time')} className={sortBy === 'time' ? 'bg-purple-600 hover:bg-purple-700' : ''} data-mixed-content="true" data-mixed-content="true">
                      Time {sortBy === 'time' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />)}
                    </Button>
                  </div>
                  
                  {/* Clear Filters */}
                  {(searchQuery || selectedCountry !== 'all' || selectedSchedule !== 'all' || showLiveOnly) && <Button variant="ghost" size="sm" onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry('all');
                  setSelectedSchedule('all');
                  setShowLiveOnly(false);
                }} className="ml-auto text-gray-400 hover:text-white">
                      <X className="w-4 h-4 mr-1" /> Clear Filters
                    </Button>}
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400" data-mixed-content="true" data-mixed-content="true">
                  Showing <span className="text-white font-semibold">{filteredStations.length}</span> of {allStations.length} stations
                </p>
              </div>
              
              {/* Station list */}
              {filteredStations.length === 0 ? <div className="text-center py-12">
                  <Radio className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No stations found matching your criteria</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                setSearchQuery('');
                setSelectedCountry('all');
                setSelectedSchedule('all');
                setShowLiveOnly(false);
              }}>
                    Clear Filters
                  </Button>
                </div> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredStations.map(station => <div key={station.id} className={`relative bg-zinc-800/50 hover:bg-purple-600/20 border rounded-xl p-4 transition-all group ${station.isLive ? 'border-green-500/50 bg-green-900/10' : 'border-zinc-700 hover:border-purple-500'}`}>
                      {/* Live Badge */}
                      {station.isLive && <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-green-500/30">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          LIVE
                        </div>}
                      
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold group-hover:text-purple-300 transition-colors truncate pr-2">
                            {station.name}
                          </div>
                          <div className="text-xs text-purple-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {station.country}
                          </div>
                        </div>
                        <Radio className={`w-5 h-5 flex-shrink-0 ${station.isLive ? 'text-green-400' : 'text-purple-400 opacity-50 group-hover:opacity-100'} transition-opacity`} />
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          {station.schedule}
                        </div>
                        <div className="flex items-center gap-2" data-mixed-content="true" data-mixed-content="true">
                          <Clock className="w-3 h-3 text-purple-400" />
                          {station.time} ({station.timezone})
                        </div>
                      </div>
                      
                      {station.url && station.url !== '#' ? <a href={station.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors w-full justify-center ${station.isLive ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white'}`}>
                          <ExternalLink className="w-3 h-3" /> 
                          {station.isLive ? 'Listen Live' : 'Visit Station'}
                        </a> : <div className="text-xs text-gray-500 text-center py-1.5">
                          No website available
                        </div>}
                    </div>)}
                </div>}
            </div>
          </section>

          {/* ========================================== */}
          {/* EPISODES SECTION - Latest Radio Episodes */}
          {/* ========================================== */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Latest Episodes
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Catch up on past episodes and discover new music from around the world.
              </p>
            </div>
            
            {loading ? <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              </div> : useDatabase && episodes.length > 0 ? <div className="grid gap-4 max-w-4xl mx-auto">
                {episodes.map(ep => <div key={ep.id} className="bg-gradient-to-r from-purple-900/20 to-black rounded-xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-colors">
                    <button onClick={() => handleExpand(ep.id)} className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-purple-500/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-purple-900/50">
                          {ep.cover_image_url ? <img src={ep.cover_image_url} alt={ep.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-purple-400" />
                            </div>}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{ep.title || `Episode ${ep.episode_number}`}</h3>
                          <p className="text-purple-400 text-sm" data-mixed-content="true" data-mixed-content="true">Episode {ep.episode_number}</p>
                          <p className="text-gray-500 text-sm">{formatDate(ep.air_date)}</p>
                        </div>
                      </div>
                      {expandedId === ep.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                    
                    {expandedId === ep.id && <div className="px-4 sm:px-6 pb-6 border-t border-purple-500/20">
                        {/* Mixcloud Embedded Player */}
                        {(ep.mixcloud_key || ep.audio_url && ep.audio_url.includes('mixcloud.com')) && <div className="mt-4 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Headphones className="w-4 h-4 text-purple-400" />
                              <span className="text-sm font-semibold text-purple-300">Listen Now</span>
                            </div>
                            <div className="rounded-lg overflow-hidden bg-zinc-900/50 border border-purple-500/20">
                              <iframe width="100%" height="120" src={ep.mixcloud_key ? `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(ep.mixcloud_key)}` : `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(ep.audio_url.match(/mixcloud\.com(\/[^?]+)/)?.[1] || '')}`} frameBorder="0" allow="autoplay" className="rounded-lg" />
                            </div>
                          </div>}
                        
                        {ep.description && <p className="text-gray-300 my-4">{ep.description}</p>}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {ep.audio_url && <a href={ep.audio_url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent(ep.id, 'play')} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                              <ExternalLink className="w-4 h-4" /> Open in Mixcloud
                            </a>}
                          <button onClick={() => openShareModal(ep)} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors">
                            <Instagram className="w-4 h-4" /> Share Episode
                          </button>
                        </div>
                        <EpisodeTracklist episodeId={ep.id} episodeTitle={ep.title} className="mt-6" />
                      </div>}

                  </div>)}
              </div> : <div className="grid gap-4 max-w-4xl mx-auto">
                {staticEpisodes.map(ep => <div key={ep.id} className="bg-gradient-to-r from-purple-900/20 to-black rounded-xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-colors">
                    <button onClick={() => setExpandedId(expandedId === String(ep.id) ? null : String(ep.id))} className="w-full p-6 flex items-center justify-between text-left hover:bg-purple-500/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold" data-mixed-content="true" data-mixed-content="true">Episode {ep.episode}</h3>
                          <p className="text-gray-500 text-sm">{ep.date}</p>
                        </div>
                      </div>
                      {expandedId === String(ep.id) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                    
                    {expandedId === String(ep.id) && <div className="px-6 pb-6 border-t border-purple-500/20">
                        <p className="text-gray-300 my-4">{ep.intro}</p>
                        <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">Tracklist</h4>
                        <ol className="space-y-2">
                          {ep.tracklist.map((track, i) => <li key={i} className="flex items-center gap-3 text-gray-300 py-2 border-b border-gray-800 last:border-0">
                              <span className="text-purple-400 text-sm w-6" data-mixed-content="true" data-mixed-content="true">{i + 1}.</span>
                              {track}
                            </li>)}
                        </ol>
                      </div>}
                  </div>)}
              </div>}
          </section>
          
          {/* VERSION INDICATOR - For deployment verification */}
          <div className="fixed bottom-4 right-4 bg-purple-900/90 text-purple-300 text-xs px-3 py-2 rounded-lg border border-purple-500/30 z-50" data-mixed-content="true" data-mixed-content="true">
            Build: {BUILD_VERSION}
          </div>
        </div>
      </main>
      
      <Footer />

      

      {/* Instagram Share Modal */}
      {selectedEpisode && <EpisodeInstagramShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} episodeTitle={selectedEpisode.title} episodeNumber={selectedEpisode.episode_number} tracklist={selectedEpisode.tracklist || []} tracklistArtists={getEpisodeArtists(selectedEpisode.id)} coverImageUrl={selectedEpisode.cover_image_url} audioUrl={selectedEpisode.audio_url} mixcloudKey={selectedEpisode.mixcloud_key} />}


      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.8);
        }
      `}</style>
    </div>;
}