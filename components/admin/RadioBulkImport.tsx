import { useState } from 'react';
import { Upload, Loader2, CheckCircle, XCircle, X, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { radioEpisodesData } from '@/data/radioEpisodesData';

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

const RadioBulkImport = ({ onClose, onComplete }: Props) => {
  const [importing, setImporting] = useState(false);
  const [parsingTracklists, setParsingTracklists] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [complete, setComplete] = useState(false);
  const [tracklistsData, setTracklistsData] = useState<any>({});

  const parseTracklists = async () => {
    setParsingTracklists(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-dropbox-tracklists', {
        body: { folderPath: '' }
      });

      if (error) throw error;

      if (data?.success && data?.tracklists) {
        setTracklistsData(data.tracklists);
        return data.tracklists;
      }
      return {};
    } catch (error) {
      console.error('Error parsing tracklists:', error);
      return {};
    } finally {
      setParsingTracklists(false);
    }
  };

  const handleBulkImport = async () => {
    setImporting(true);
    setResults([]);
    
    // First, parse tracklists from .docx files
    const tracklists = await parseTracklists();
    
    const importResults: any[] = [];
    const baseUrl = 'https://www.dropbox.com/scl/fo/9mvcraiygd1jrx03e90dc';
    const rlkey = 'snxswbmg6aeb3rqobr7gfjvev';

    for (const ep of radioEpisodesData) {
      try {
        const artworkUrl = `${baseUrl}/${ep.folder}/Episode%20${ep.ep}/TG${ep.ep}.jpg?rlkey=${rlkey}&dl=1`;
        const audioUrl = `${baseUrl}/${ep.folder}/Episode%20${ep.ep}/Art%20of%20Rave%20%23${ep.ep}.mp3?rlkey=${rlkey}&dl=1`;
        
        // Use parsed tracklist if available, otherwise use placeholder
        const tracklist = tracklists[ep.ep.toString()] || ['Track listing available in episode'];
        
        const { error } = await supabase.from('radio_episodes').upsert({
          episode_number: ep.ep,
          title: ep.title,
          air_date: ep.date,
          audio_url: audioUrl,
          cover_image_url: artworkUrl,
          description: 'Weekly electronic music show',
          tracklist: tracklist,
          display_order: ep.ep - 177,
          is_published: true,
        }, { onConflict: 'episode_number' });

        importResults.push({ 
          ep: ep.ep, 
          title: ep.title, 
          success: !error, 
          error: error?.message,
          tracklistParsed: !!tracklists[ep.ep.toString()]
        });
      } catch (err: any) {
        importResults.push({ ep: ep.ep, title: ep.title, success: false, error: err.message });
      }
    }

    setResults(importResults);
    setImporting(false);
    setComplete(true);
    setTimeout(() => onComplete(), 1500);
  };


  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-purple-500/30">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Bulk Import Episodes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!importing && !complete && (
            <div className="text-center py-8">
              <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Import {radioEpisodesData.length} episodes (177-192) from Dropbox</p>
              <p className="text-sm text-gray-400 mb-6 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Automatically extracts tracklists from .docx files
              </p>
              <button onClick={handleBulkImport} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold">
                Start Import with Tracklist Parsing
              </button>
            </div>
          )}

          {parsingTracklists && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 animate-pulse text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300">Parsing tracklists from Word documents...</p>
              <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
            </div>
          )}

          {importing && !parsingTracklists && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300">Importing episodes with tracklists...</p>
            </div>
          )}

          {complete && results.length > 0 && (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  {r.success ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                  <div className="flex-1">
                    <p className="text-white">Episode {r.ep}: {r.title}</p>
                    {r.tracklistParsed && <p className="text-xs text-green-400">✓ Tracklist parsed from document</p>}
                    {r.error && <p className="text-xs text-red-400">{r.error}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default RadioBulkImport;
