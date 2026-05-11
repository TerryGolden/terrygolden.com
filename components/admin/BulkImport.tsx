import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, X, Loader2, Upload, Music } from 'lucide-react';

interface AlbumMetadata {
  spotify_id: string;
  name: string;
  artist: string;
  album_type: string;
  release_date: string;
  image_url: string;
  spotify_url: string;
  label: string;
  total_tracks: number;
}

interface ImportResult {
  url: string;
  success: boolean;
  error?: string;
  metadata?: AlbumMetadata;
  saved?: boolean;
}

export function BulkImport() {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState<ImportResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'fetching' | 'saving' | 'complete'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const parseUrls = (text: string): string[] => {
    return text.split(/[\n,]/).map(u => u.trim()).filter(u => u.length > 0);
  };

  const handleFetch = async () => {
    const urlList = parseUrls(urls);
    if (urlList.length === 0) return;
    setLoading(true);
    setPhase('fetching');
    setProgress(0);
    setResults([]);
    setSaveError(null);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-import-albums', {
        body: { urls: urlList }
      });
      if (error) throw error;
      setResults(data.results || []);
      setProgress(50);
      setPhase('complete');
    } catch (err: any) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    const successfulResults = results.filter(r => r.success && r.metadata);
    if (successfulResults.length === 0) return;
    setSaving(true);
    setPhase('saving');
    setSaveError(null);
    
    const albums = successfulResults.map(r => r.metadata);
    
    try {
      const { data, error } = await supabase.functions.invoke('save-releases', {
        body: { albums }
      });
      
      if (error) throw error;
      
      if (data.success) {
        const updatedResults = results.map(r => ({
          ...r,
          saved: r.success && r.metadata ? true : false
        }));
        setResults(updatedResults);
        setProgress(100);
      } else {
        setSaveError(data.error || 'Failed to save');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setSaveError(err.message || 'Failed to save albums');
    } finally {
      setPhase('complete');
      setSaving(false);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const savedCount = results.filter(r => r.saved).length;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Upload className="w-5 h-5 text-purple-500" />
          Bulk Import Albums
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste Spotify album URLs (one per line)&#10;https://open.spotify.com/album/..."
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="min-h-[120px] bg-zinc-800 border-zinc-700 text-white"
          disabled={loading || saving}
        />
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleFetch} disabled={loading || saving || !urls.trim()} className="bg-purple-600 hover:bg-purple-700">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Fetching...</> : `Fetch Metadata (${parseUrls(urls).length})`}
          </Button>
          {results.length > 0 && successCount > 0 && (
            <Button onClick={handleSaveAll} disabled={saving} className="bg-green-600 hover:bg-green-700">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : `Save ${successCount} Albums`}
            </Button>
          )}
        </div>
        {phase !== 'idle' && <Progress value={progress} className="h-2" />}
        {saveError && <div className="text-red-500 text-sm">{saveError}</div>}
        {results.length > 0 && (
          <div className="text-sm text-zinc-400">Found: {successCount}/{results.length} | Saved: {savedCount}</div>
        )}
        {results.length > 0 && (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${r.success ? 'bg-zinc-800' : 'bg-red-900/20'}`}>
                {r.success ? (
                  r.saved ? <Check className="w-5 h-5 text-green-500 shrink-0" /> : <Music className="w-5 h-5 text-purple-500 shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-red-500 shrink-0" />
                )}
                {r.metadata?.image_url && <img src={r.metadata.image_url} alt="" className="w-10 h-10 rounded" />}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{r.metadata?.name || r.url}</p>
                  <p className="text-zinc-400 text-xs truncate">{r.metadata?.artist || r.error}</p>
                </div>
                {r.saved && <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">Saved</span>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BulkImport;
