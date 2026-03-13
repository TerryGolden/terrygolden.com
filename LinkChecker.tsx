import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Loader2, 
  Globe, 
  ExternalLink,
  Clock,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface LinkCheckResult {
  id: string;
  station_id: string;
  station_name: string;
  url: string;
  status: 'valid' | 'invalid' | 'pending' | 'unknown';
  status_code: number | null;
  error_message: string | null;
  response_time_ms: number | null;
  last_checked_at: string;
}

interface Station {
  id: string;
  name: string;
  url: string;
  country: string;
}

const LinkChecker = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [results, setResults] = useState<LinkCheckResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'invalid' | 'unknown'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch stations
    const { data: stationsData } = await supabase
      .from('radio_stations')
      .select('id, name, url, country')
      .order('name');
    
    if (stationsData) {
      setStations(stationsData);
    }

    // Fetch existing check results
    const { data: resultsData } = await supabase
      .from('link_check_results')
      .select('*')
      .order('last_checked_at', { ascending: false });
    
    if (resultsData) {
      setResults(resultsData);
    }

    setLoading(false);
  };

  const checkAllLinks = async () => {
    setChecking(true);
    toast({ title: 'Starting link check...', description: 'This may take a few minutes.' });

    try {
      const { data, error } = await supabase.functions.invoke('check-station-links', {
        body: { checkAll: true }
      });

      if (error) throw error;

      toast({ 
        title: 'Link check complete!', 
        description: `Checked ${data.summary.total} stations: ${data.summary.valid} valid, ${data.summary.invalid} broken, ${data.summary.unknown} unknown` 
      });

      // Refresh results
      fetchData();
    } catch (error) {
      console.error('Error checking links:', error);
      toast({ 
        title: 'Error checking links', 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setChecking(false);
    }
  };

  const checkSingleLink = async (stationId: string) => {
    setCheckingIds(prev => new Set(prev).add(stationId));

    try {
      const { data, error } = await supabase.functions.invoke('check-station-links', {
        body: { stationIds: [stationId] }
      });

      if (error) throw error;

      // Update local results
      if (data.results && data.results.length > 0) {
        const newResult = data.results[0];
        setResults(prev => {
          const filtered = prev.filter(r => r.station_id !== stationId);
          return [...filtered, { ...newResult, last_checked_at: new Date().toISOString() }];
        });
      }

      toast({ title: 'Link checked', description: `Status: ${data.results[0]?.status || 'unknown'}` });
    } catch (error) {
      console.error('Error checking link:', error);
      toast({ 
        title: 'Error checking link', 
        variant: 'destructive'
      });
    } finally {
      setCheckingIds(prev => {
        const next = new Set(prev);
        next.delete(stationId);
        return next;
      });
    }
  };

  const getResultForStation = (stationId: string): LinkCheckResult | undefined => {
    return results.find(r => r.station_id === stationId);
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'unknown':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'valid':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Valid</span>;
      case 'invalid':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Broken</span>;
      case 'unknown':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Unknown</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">Not Checked</span>;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter stations
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          station.country?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;

    const result = getResultForStation(station.id);
    if (statusFilter === 'valid') return result?.status === 'valid';
    if (statusFilter === 'invalid') return result?.status === 'invalid';
    if (statusFilter === 'unknown') return result?.status === 'unknown' || !result;

    return true;
  });

  // Calculate summary
  const summary = {
    total: stations.length,
    valid: results.filter(r => r.status === 'valid').length,
    invalid: results.filter(r => r.status === 'invalid').length,
    unknown: results.filter(r => r.status === 'unknown').length,
    notChecked: stations.length - results.length
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Globe className="w-4 h-4" />
            Total Stations
          </div>
          <div className="text-2xl font-bold text-white">{summary.total}</div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
            <CheckCircle2 className="w-4 h-4" />
            Valid Links
          </div>
          <div className="text-2xl font-bold text-green-400">{summary.valid}</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
          <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
            <XCircle className="w-4 h-4" />
            Broken Links
          </div>
          <div className="text-2xl font-bold text-red-400">{summary.invalid}</div>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
          <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
            <AlertCircle className="w-4 h-4" />
            Unknown
          </div>
          <div className="text-2xl font-bold text-yellow-400">{summary.unknown}</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Clock className="w-4 h-4" />
            Not Checked
          </div>
          <div className="text-2xl font-bold text-gray-400">{summary.notChecked}</div>
        </div>
      </div>

      {/* Broken Links Alert */}
      {summary.invalid > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-400">Broken Links Detected</h3>
            <p className="text-sm text-red-300/80">
              {summary.invalid} radio station{summary.invalid > 1 ? 's have' : ' has'} broken or unreachable URLs. 
              Consider updating or removing these stations.
            </p>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white"
            >
              <option value="all">All Stations</option>
              <option value="valid">Valid Only</option>
              <option value="invalid">Broken Only</option>
              <option value="unknown">Unknown/Not Checked</option>
            </select>
          </div>
        </div>
        <Button 
          onClick={checkAllLinks} 
          disabled={checking}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking All Links...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Check All Links
            </>
          )}
        </Button>
      </div>

      {/* Stations List */}
      <div className="space-y-2">
        {filteredStations.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No stations found matching your criteria.
          </div>
        ) : (
          filteredStations.map(station => {
            const result = getResultForStation(station.id);
            const isChecking = checkingIds.has(station.id);

            return (
              <div 
                key={station.id}
                className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border transition-colors ${
                  result?.status === 'invalid' 
                    ? 'bg-red-500/5 border-red-500/30' 
                    : result?.status === 'valid'
                    ? 'bg-green-500/5 border-green-500/30'
                    : 'bg-zinc-800/50 border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(result?.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{station.name}</span>
                      {getStatusBadge(result?.status)}
                      {station.country && (
                        <span className="text-xs text-gray-500">{station.country}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 truncate mt-1">
                      {station.url && station.url !== '#' ? (
                        <a 
                          href={station.url.startsWith('http') ? station.url : `https://${station.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple-400 flex items-center gap-1"
                        >
                          {station.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">No URL provided</span>
                      )}
                    </div>
                    {result && (
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Last checked: {formatDate(result.last_checked_at)}</span>
                        {result.status_code && (
                          <span>HTTP {result.status_code}</span>
                        )}
                        {result.response_time_ms && (
                          <span>{result.response_time_ms}ms</span>
                        )}
                        {result.error_message && result.status === 'invalid' && (
                          <span className="text-red-400">{result.error_message}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => checkSingleLink(station.id)}
                    disabled={isChecking || checking}
                    className="text-gray-400 hover:text-white"
                  >
                    {isChecking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t border-zinc-800">
        <p>Link checks verify that station URLs are accessible and return valid HTTP responses.</p>
        <p className="mt-1">Some stations may block automated requests, resulting in false negatives.</p>
      </div>
    </div>
  );
};

export default LinkChecker;
