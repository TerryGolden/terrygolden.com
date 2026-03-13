import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, Download, Music } from 'lucide-react';
import { toast } from 'sonner';

const ArtOfRaveManager = () => {
  const [syncing, setSyncing] = useState(false);
  const [limit, setLimit] = useState(20);
  const [importTracklists, setImportTracklists] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const syncEpisodes = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-mixcloud-v2', {
        body: { limit, saveToDb: true, importTracklists }
      });
      if (error) throw error;
      if (data?.success) {
        setStats(data);
        const msg = importTracklists 
          ? `Synced ${data.savedCount} new, ${data.updatedCount} updated, ${data.tracklistsImported || 0} tracklists imported`
          : `Synced ${data.savedCount} new, ${data.updatedCount} updated`;
        toast.success(msg);
      } else {
        throw new Error(data?.error || 'Sync failed');
      }
    } catch (error: any) {
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Art of Rave Episodes</h2>
        <p className="text-gray-400">Sync episodes and tracklists from Mixcloud</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Episodes to Sync</label>
            <Input type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value) || 20)} min="1" max="100" className="max-w-xs" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="importTracklists" checked={importTracklists} onCheckedChange={(c) => setImportTracklists(!!c)} />
            <label htmlFor="importTracklists" className="text-sm">Auto-import tracklists from Mixcloud (when available)</label>
          </div>
          <Button onClick={syncEpisodes} disabled={syncing} className="bg-purple-600 hover:bg-purple-700">
            {syncing ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Syncing...</> : <><Download className="w-4 h-4 mr-2" />Sync from Mixcloud</>}
          </Button>
          {stats && (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
              <p className="text-green-400 font-semibold mb-2">Sync Complete!</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>Episodes fetched: {stats.count}</li>
                <li>New episodes: {stats.savedCount}</li>
                <li>Updated: {stats.updatedCount}</li>
                {importTracklists && <li className="text-cyan-400"><Music className="w-3 h-3 inline mr-1" />Tracklists imported: {stats.tracklistsImported || 0}</li>}
              </ul>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 p-6">
        <h3 className="text-lg font-semibold mb-3">Tracklist Auto-Import</h3>
        <div className="text-sm text-gray-400 space-y-2">
          <p>When enabled, the sync will automatically import tracklists from Mixcloud for episodes that have them.</p>
          <p>Episodes with manually added tracklists will NOT be overwritten.</p>
          <p className="text-cyan-400">Imported tracklists are marked with source: "mixcloud"</p>
        </div>
      </Card>
    </div>
  );
};

export default ArtOfRaveManager;
