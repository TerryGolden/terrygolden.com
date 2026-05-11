import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, ExternalLink, Star, Save, X, Database, Search, Eye, EyeOff, RefreshCw, Globe, Calendar, CheckCircle, Loader2, Filter, ChevronDown, ChevronUp, AlertCircle, Newspaper, Chrome, FileSearch, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '@/lib/supabase';
import { epkPressItems } from '@/data/pressData';

interface PressItem {
  id: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  link: string;
  image: string;
  featured: boolean;
  display_order: number;
  visible: boolean;
  published_date: string | null;
  auto_discovered: boolean;
  discovery_source: string | null;
}

interface DiscoveredPress {
  title: string;
  source: string;
  date: string;
  published_date: string;
  excerpt: string;
  link: string;
  image: string;
  discovery_source: string;
}

interface SourceResult {
  count: number;
  error?: string;
}

interface Props { onBack: () => void; }

const PressManager = ({ onBack }: Props) => {
  const [items, setItems] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PressItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [discoveries, setDiscoveries] = useState<DiscoveredPress[]>([]);
  const [showDiscoveries, setShowDiscoveries] = useState(false);
  const [searchUrls, setSearchUrls] = useState<{ title: string; source: string; searchUrl: string }[]>([]);
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden' | 'auto'>('all');
  const [sourceResults, setSourceResults] = useState<{ [key: string]: SourceResult }>({});
  const [availableSources, setAvailableSources] = useState<{ newsapi: boolean; google: boolean }>({ newsapi: false, google: false });
  const [selectedSources, setSelectedSources] = useState<string[]>(['newsapi', 'google', 'scrape']);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [showSourceOptions, setShowSourceOptions] = useState(false);
  const [artistName, setArtistName] = useState('Terry Golden');
  const [discoveryFilter, setDiscoveryFilter] = useState<string>('all');

  const edmPublications = [
    'EDM.com', 'DJ Mag', 'We Rave You', 'EDM Sauce', 'Dancing Astronaut',
    'Your EDM', 'Magnetic Magazine', 'EDM Identity', 'This Song Is Sick', 'Run The Trap',
    'EDM House Network', 'Rave Jungle'
  ];


  useEffect(() => { fetchItems(); }, []);


  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('press_items')
      .select('*')
      .order('published_date', { ascending: false, nullsFirst: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const saveItem = async () => {
    if (!editing) return;
    const itemToSave = {
      ...editing,
      visible: editing.visible ?? true,
      published_date: editing.published_date || parseDate(editing.date),
    };
    
    if (isNew) {
      const { id, ...rest } = itemToSave;
      await supabase.from('press_items').insert([{ ...rest, display_order: items.length + 1 }]);
    } else {
      await supabase.from('press_items').update(itemToSave).eq('id', editing.id);
    }
    setEditing(null);
    setIsNew(false);
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    if (confirm('Delete this press item?')) {
      await supabase.from('press_items').delete().eq('id', id);
      fetchItems();
    }
  };

  const toggleFeatured = async (item: PressItem) => {
    await supabase.from('press_items').update({ featured: !item.featured }).eq('id', item.id);
    fetchItems();
  };

  const toggleVisibility = async (item: PressItem) => {
    await supabase.from('press_items').update({ visible: !item.visible }).eq('id', item.id);
    fetchItems();
  };

  const parseDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    
    const monthYearMatch = dateStr.match(/^([A-Za-z]+)\s*(\d{4})$/);
    if (monthYearMatch) {
      const months: { [key: string]: number } = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
      };
      const monthNum = months[monthYearMatch[1].toLowerCase().substring(0, 3)];
      if (monthNum !== undefined) {
        return new Date(parseInt(monthYearMatch[2]), monthNum, 15).toISOString().split('T')[0];
      }
    }
    
    const yearMatch = dateStr.match(/^(\d{4})$/);
    if (yearMatch) {
      return new Date(parseInt(yearMatch[1]), 6, 1).toISOString().split('T')[0];
    }
    
    return new Date().toISOString().split('T')[0];
  };

  const seedPressItems = async () => {
    if (!confirm('This will add all EPK press items. Continue?')) return;
    setSeeding(true);
    const itemsToInsert = epkPressItems.map((item, i) => ({
      ...item,
      display_order: items.length + i + 1,
      visible: true,
      published_date: parseDate(item.date),
      auto_discovered: false,
    }));
    await supabase.from('press_items').insert(itemsToInsert);
    setSeeding(false);
    fetchItems();
  };

  const discoverPressOnline = async () => {
    setDiscovering(true);
    setShowDiscoveries(true);
    setDiscoveries([]);
    setSourceResults({});
    
    try {
      const { data, error } = await supabase.functions.invoke('discover-press-mentions', {
        body: {
          artistName,
          sources: selectedSources,
          specificSites: selectedSites.length > 0 ? selectedSites : undefined
        }
      });
      
      if (error) throw error;
      
      if (data?.discoveries) {
        // Filter out already existing items by URL
        const existingUrls = items.map(item => item.link.toLowerCase());
        const newDiscoveries = data.discoveries.filter(
          (d: DiscoveredPress) => !existingUrls.includes(d.link.toLowerCase())
        );
        setDiscoveries(newDiscoveries);
      }
      
      if (data?.searchUrls) {
        setSearchUrls(data.searchUrls);
      }
      
      if (data?.sourceResults) {
        setSourceResults(data.sourceResults);
      }
      
      if (data?.availableSources) {
        setAvailableSources(data.availableSources);
      }
    } catch (err) {
      console.error('Error discovering press:', err);
      alert('Error discovering press mentions. Please try again.');
    } finally {
      setDiscovering(false);
    }
  };

  const scrapeSpecificSite = async (siteName: string) => {
    setDiscovering(true);
    setShowDiscoveries(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('discover-press-mentions', {
        body: {
          artistName,
          sources: ['scrape'],
          specificSites: [siteName]
        }
      });
      
      if (error) throw error;
      
      if (data?.discoveries) {
        const existingUrls = items.map(item => item.link.toLowerCase());
        const existingDiscoveryUrls = discoveries.map(d => d.link.toLowerCase());
        const newDiscoveries = data.discoveries.filter(
          (d: DiscoveredPress) => 
            !existingUrls.includes(d.link.toLowerCase()) &&
            !existingDiscoveryUrls.includes(d.link.toLowerCase())
        );
        setDiscoveries(prev => [...prev, ...newDiscoveries]);
      }
      
      if (data?.sourceResults) {
        setSourceResults(prev => ({ ...prev, ...data.sourceResults }));
      }
    } catch (err) {
      console.error('Error scraping site:', err);
    } finally {
      setDiscovering(false);
    }
  };

  const addDiscoveredItem = async (discovery: DiscoveredPress) => {
    const newItem = {
      title: discovery.title,
      source: discovery.source,
      date: discovery.date,
      excerpt: discovery.excerpt,
      link: discovery.link,
      image: discovery.image,
      featured: false,
      display_order: items.length + 1,
      visible: false,
      published_date: discovery.published_date,
      auto_discovered: true,
      discovery_source: discovery.discovery_source,
    };
    
    await supabase.from('press_items').insert([newItem]);
    setDiscoveries(prev => prev.filter(d => d.link !== discovery.link));
    fetchItems();
  };

  const addAllDiscoveries = async () => {
    const filteredDiscoveries = getFilteredDiscoveries();
    if (filteredDiscoveries.length === 0) return;
    if (!confirm(`Add all ${filteredDiscoveries.length} discovered items (hidden by default)?`)) return;
    
    const newItems = filteredDiscoveries.map((discovery, i) => ({
      title: discovery.title,
      source: discovery.source,
      date: discovery.date,
      excerpt: discovery.excerpt,
      link: discovery.link,
      image: discovery.image,
      featured: false,
      display_order: items.length + i + 1,
      visible: false,
      published_date: discovery.published_date,
      auto_discovered: true,
      discovery_source: discovery.discovery_source,
    }));
    
    await supabase.from('press_items').insert(newItems);
    setDiscoveries(prev => prev.filter(d => !filteredDiscoveries.includes(d)));
    fetchItems();
  };

  const newItem = () => {
    setEditing({
      id: '',
      title: '',
      source: '',
      date: '',
      excerpt: '',
      link: '',
      image: '',
      featured: false,
      display_order: 0,
      visible: true,
      published_date: null,
      auto_discovered: false,
      discovery_source: null,
    });
    setIsNew(true);
  };

  const filteredItems = items.filter(item => {
    if (filter === 'visible') return item.visible;
    if (filter === 'hidden') return !item.visible;
    if (filter === 'auto') return item.auto_discovered;
    return true;
  });

  const getFilteredDiscoveries = () => {
    if (discoveryFilter === 'all') return discoveries;
    return discoveries.filter(d => d.discovery_source.includes(discoveryFilter));
  };

  const getSourceIcon = (source: string) => {
    if (source === 'NewsAPI') return <Newspaper className="w-3 h-3" />;
    if (source === 'Google') return <Chrome className="w-3 h-3" />;
    if (source.startsWith('Scraped:')) return <FileSearch className="w-3 h-3" />;
    return <Globe className="w-3 h-3" />;
  };

  const getSourceColor = (source: string) => {
    if (source === 'NewsAPI') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (source === 'Google') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (source.startsWith('Scraped:')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  if (editing) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h1 className="text-2xl font-bold text-white">{isNew ? 'Add Press Feature' : 'Edit Press Feature'}</h1>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm">Title</label>
              <input value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Source</label>
                <input value={editing.source} onChange={e => setEditing({...editing, source: e.target.value})} className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Display Date (e.g., "Oct 2025")</label>
                <input value={editing.date} onChange={e => setEditing({...editing, date: e.target.value})} className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Published Date (for sorting)</label>
              <input 
                type="date" 
                value={editing.published_date || ''} 
                onChange={e => setEditing({...editing, published_date: e.target.value})} 
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" 
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Excerpt</label>
              <textarea value={editing.excerpt} onChange={e => setEditing({...editing, excerpt: e.target.value})} rows={3} className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Link URL</label>
              <input value={editing.link} onChange={e => setEditing({...editing, link: e.target.value})} className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Image/Logo URL</label>
              <input value={editing.image} onChange={e => setEditing({...editing, image: e.target.value})} className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editing.visible} 
                  onChange={e => setEditing({...editing, visible: e.target.checked})}
                  className="w-5 h-5 rounded border-purple-500/30 bg-black/50 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-300">Visible on Press Page</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editing.featured} 
                  onChange={e => setEditing({...editing, featured: e.target.checked})}
                  className="w-5 h-5 rounded border-purple-500/30 bg-black/50 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-300">Featured</span>
              </label>
            </div>
            <Button onClick={saveItem} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Save className="w-4 h-4 mr-2" />Save Press Feature
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="text-2xl font-bold text-white">Press Manager</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowSourceOptions(!showSourceOptions)} 
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-900/30"
            >
              <Filter className="w-4 h-4 mr-2" />
              Search Options
              {showSourceOptions ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
            <Button 
              onClick={discoverPressOnline} 
              disabled={discovering}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
            >
              {discovering ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Searching...</>
              ) : (
                <><Globe className="w-4 h-4 mr-2" />Find Press Online</>
              )}
            </Button>
            <Button onClick={newItem} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />Add Feature
            </Button>
          </div>
        </div>

        {/* Search Options Panel */}
        {showSourceOptions && (
          <div className="mb-6 bg-black/40 rounded-xl border border-purple-500/30 p-6">
            <h3 className="text-white font-semibold mb-4">Discovery Options</h3>
            
            {/* Artist Name */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm block mb-2">Artist Name to Search</label>
              <input 
                value={artistName}
                onChange={e => setArtistName(e.target.value)}
                className="w-full max-w-md bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                placeholder="Terry Golden"
              />
            </div>

            {/* Source Selection */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm block mb-2">Search Sources</label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedSources.includes('newsapi')}
                    onChange={e => {
                      if (e.target.checked) setSelectedSources(prev => [...prev, 'newsapi']);
                      else setSelectedSources(prev => prev.filter(s => s !== 'newsapi'));
                    }}
                    className="w-4 h-4 rounded border-blue-500/30 bg-black/50 text-blue-500"
                  />
                  <span className="text-gray-300 flex items-center gap-1">
                    <Newspaper className="w-4 h-4 text-blue-400" />
                    NewsAPI
                    {!availableSources.newsapi && <span className="text-xs text-yellow-500">(not configured)</span>}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedSources.includes('google')}
                    onChange={e => {
                      if (e.target.checked) setSelectedSources(prev => [...prev, 'google']);
                      else setSelectedSources(prev => prev.filter(s => s !== 'google'));
                    }}
                    className="w-4 h-4 rounded border-green-500/30 bg-black/50 text-green-500"
                  />
                  <span className="text-gray-300 flex items-center gap-1">
                    <Chrome className="w-4 h-4 text-green-400" />
                    Google Custom Search
                    {!availableSources.google && <span className="text-xs text-yellow-500">(not configured)</span>}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedSources.includes('scrape')}
                    onChange={e => {
                      if (e.target.checked) setSelectedSources(prev => [...prev, 'scrape']);
                      else setSelectedSources(prev => prev.filter(s => s !== 'scrape'));
                    }}
                    className="w-4 h-4 rounded border-orange-500/30 bg-black/50 text-orange-500"
                  />
                  <span className="text-gray-300 flex items-center gap-1">
                    <FileSearch className="w-4 h-4 text-orange-400" />
                    Direct Website Scraping
                  </span>
                </label>
              </div>
            </div>

            {/* Specific Sites for Scraping */}
            {selectedSources.includes('scrape') && (
              <div>
                <label className="text-gray-400 text-sm block mb-2">
                  Specific Sites to Scrape (leave empty for all)
                </label>
                <div className="flex flex-wrap gap-2">
                  {edmPublications.map(pub => (
                    <button
                      key={pub}
                      onClick={() => {
                        if (selectedSites.includes(pub)) {
                          setSelectedSites(prev => prev.filter(s => s !== pub));
                        } else {
                          setSelectedSites(prev => [...prev, pub]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedSites.includes(pub)
                          ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                          : 'bg-black/30 text-gray-400 border border-gray-700/50 hover:border-orange-500/30 hover:text-orange-400'
                      }`}
                    >
                      {pub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Discoveries Panel */}
        {showDiscoveries && (
          <div className="mb-8 bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-xl border border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                Discovered Press Mentions
              </h2>
              <div className="flex gap-2">
                {getFilteredDiscoveries().length > 0 && (
                  <Button onClick={addAllDiscoveries} size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/30">
                    <CheckCircle className="w-4 h-4 mr-1" />Add All ({getFilteredDiscoveries().length})
                  </Button>
                )}
                <Button onClick={() => setShowDiscoveries(false)} size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Source Results Summary */}
            {Object.keys(sourceResults).length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {Object.entries(sourceResults).map(([source, result]) => (
                  <div 
                    key={source}
                    className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                      result.error 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : result.count > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}
                  >
                    {result.error ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {source}: {result.error ? result.error : `${result.count} found`}
                  </div>
                ))}
              </div>
            )}

            {/* Discovery Filter */}
            {discoveries.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setDiscoveryFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs ${
                    discoveryFilter === 'all' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-black/30 text-gray-400'
                  }`}
                >
                  All ({discoveries.length})
                </button>
                <button
                  onClick={() => setDiscoveryFilter('NewsAPI')}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 ${
                    discoveryFilter === 'NewsAPI' ? 'bg-blue-500/30 text-blue-300' : 'bg-black/30 text-gray-400'
                  }`}
                >
                  <Newspaper className="w-3 h-3" />
                  NewsAPI ({discoveries.filter(d => d.discovery_source === 'NewsAPI').length})
                </button>
                <button
                  onClick={() => setDiscoveryFilter('Google')}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 ${
                    discoveryFilter === 'Google' ? 'bg-green-500/30 text-green-300' : 'bg-black/30 text-gray-400'
                  }`}
                >
                  <Chrome className="w-3 h-3" />
                  Google ({discoveries.filter(d => d.discovery_source === 'Google').length})
                </button>
                <button
                  onClick={() => setDiscoveryFilter('Scraped')}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 ${
                    discoveryFilter === 'Scraped' ? 'bg-orange-500/30 text-orange-300' : 'bg-black/30 text-gray-400'
                  }`}
                >
                  <FileSearch className="w-3 h-3" />
                  Scraped ({discoveries.filter(d => d.discovery_source.startsWith('Scraped')).length})
                </button>
              </div>
            )}

            {discovering ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-400">Searching for press mentions...</p>
                <p className="text-gray-500 text-sm mt-1">This may take a moment as we search multiple sources</p>
              </div>
            ) : getFilteredDiscoveries().length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No new press mentions found automatically.</p>
                <p className="text-gray-500 text-sm mb-4">Try scraping specific sites or search manually:</p>
                
                {/* Quick Scrape Buttons */}
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-2">Quick Scrape:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {edmPublications.slice(0, 5).map(pub => (
                      <Button
                        key={pub}
                        onClick={() => scrapeSpecificSite(pub)}
                        disabled={discovering}
                        size="sm"
                        variant="outline"
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-900/30"
                      >
                        <FileSearch className="w-3 h-3 mr-1" />
                        {pub}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Manual Search Links */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {searchUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url.searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-black/30 border border-purple-500/30 rounded-lg text-sm text-purple-400 hover:border-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {url.source}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {getFilteredDiscoveries().map((discovery, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-cyan-500/20">
                    {discovery.image && (
                      <img src={discovery.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{discovery.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-400 text-sm">{discovery.source}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500 text-sm">{discovery.date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border ${getSourceColor(discovery.discovery_source)}`}>
                          {getSourceIcon(discovery.discovery_source)}
                          {discovery.discovery_source.replace('Scraped:', '')}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs truncate mt-1">{discovery.excerpt}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a href={discovery.link} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Button onClick={() => addDiscoveredItem(discovery)} size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Scrape Section (when discoveries exist) */}
            {!discovering && discoveries.length > 0 && (
              <div className="mt-4 pt-4 border-t border-cyan-500/20">
                <p className="text-gray-400 text-sm mb-2">Scrape more sites:</p>
                <div className="flex flex-wrap gap-2">
                  {edmPublications.map(pub => (
                    <Button
                      key={pub}
                      onClick={() => scrapeSpecificSite(pub)}
                      disabled={discovering}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-orange-400 hover:bg-orange-900/20"
                    >
                      <FileSearch className="w-3 h-3 mr-1" />
                      {pub}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All', count: items.length },
            { key: 'visible', label: 'Visible', count: items.filter(i => i.visible).length },
            { key: 'hidden', label: 'Hidden', count: items.filter(i => !i.visible).length },
            { key: 'auto', label: 'Auto-Discovered', count: items.filter(i => i.auto_discovered).length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-black/30 text-gray-400 hover:text-white hover:bg-black/50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Items List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-black/30 rounded-xl border border-purple-500/20">
            <p className="text-gray-400 mb-4">No press items yet</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={seedPressItems} className="bg-purple-600 hover:bg-purple-700">
                <Database className="w-4 h-4 mr-2" />Import EPK Press Items
              </Button>
              <Button onClick={discoverPressOnline} variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/30">
                <Globe className="w-4 h-4 mr-2" />Find Press Online
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  item.visible 
                    ? 'bg-black/50 border-purple-500/30' 
                    : 'bg-black/30 border-gray-700/30 opacity-60'
                }`}
              >
                {item.image && <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold truncate">{item.title}</h3>
                    {item.auto_discovered && item.discovery_source && (
                      <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border ${getSourceColor(item.discovery_source)}`}>
                        {getSourceIcon(item.discovery_source)}
                        {item.discovery_source.replace('Scraped:', '')}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{item.source} • {item.date}</p>
                  {item.published_date && (
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.published_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Visibility Toggle */}
                  <button 
                    onClick={() => toggleVisibility(item)} 
                    className={`p-2 rounded-lg transition-colors ${
                      item.visible 
                        ? 'text-green-400 hover:bg-green-900/30' 
                        : 'text-gray-500 hover:bg-gray-800/50'
                    }`}
                    title={item.visible ? 'Visible on Press Page' : 'Hidden from Press Page'}
                  >
                    {item.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  
                  {/* Featured Toggle */}
                  <button 
                    onClick={() => toggleFeatured(item)} 
                    className={`p-2 rounded-lg ${item.featured ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`}
                    title={item.featured ? 'Featured' : 'Not Featured'}
                  >
                    <Star className="w-5 h-5" fill={item.featured ? '#facc15' : 'none'} />
                  </button>
                  
                  {/* External Link */}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  
                  {/* Edit */}
                  <button onClick={() => setEditing(item)} className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30">
                    Edit
                  </button>
                  
                  {/* Delete */}
                  <button onClick={() => deleteItem(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Seed Button (if items exist but want to add more) */}
        {items.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Import More Press Items</h3>
                <p className="text-gray-500 text-sm">Add predefined EPK press items or discover new ones online</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={seedPressItems} disabled={seeding} variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-900/30">
                  <Database className="w-4 h-4 mr-2" />{seeding ? 'Adding...' : 'Add EPK Press'}
                </Button>
                <Button onClick={discoverPressOnline} disabled={discovering} variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/30">
                  <RefreshCw className={`w-4 h-4 mr-2 ${discovering ? 'animate-spin' : ''}`} />
                  Refresh Discoveries
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PressManager;
