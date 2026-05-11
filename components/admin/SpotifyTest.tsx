import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Music, Disc3, Key, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BulkImport } from './BulkImport';
import { ArtistSync } from './ArtistSync';

const SpotifyTest = () => {
  const [url, setUrl] = useState('https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy');
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [tokenResult, setTokenResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'artists'>('single');

  const testToken = async () => {
    setTokenLoading(true);
    setTokenResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('spotify-auth-v2', {});
      if (fnError) throw new Error(fnError.message);
      setTokenResult(data);
    } catch (err: any) {
      setTokenResult({ success: false, error: err.message });
    } finally {
      setTokenLoading(false);
    }
  };

  const testFetch = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('fetch-spotify-album', {
        body: { spotifyUrl: url }
      });
      if (fnError) throw new Error(fnError.message);
      if (!data.success) throw new Error(data.error || 'Failed to fetch');
      setResult(data.metadata);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Disc3 className="w-10 h-10 text-[#1DB954]" />
          <h1 className="text-4xl font-bold text-white">Spotify Album Manager</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'single' 
                ? 'bg-[#1DB954] text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Single Import
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'bulk' 
                ? 'bg-purple-600 text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Bulk Import
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'artists' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Artist Sync
          </button>
        </div>


        {activeTab === 'single' ? (
          <>
            {/* Token Test Section */}
            <div className="bg-gray-900/80 backdrop-blur border border-[#1DB954]/30 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Key className="w-6 h-6 text-[#1DB954]" />
                Step 1: Get Access Token
              </h2>
              <button onClick={testToken} disabled={tokenLoading}
                className="px-6 py-3 bg-[#1DB954] text-white font-bold rounded-xl hover:bg-[#1ed760] flex items-center gap-2 disabled:opacity-50">
                {tokenLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                Request Token
              </button>
              {tokenResult && (
                <div className={`mt-4 p-4 rounded-xl ${tokenResult.success ? 'bg-[#1DB954]/10 border border-[#1DB954]/40' : 'bg-red-500/10 border border-red-500/40'}`}>
                  {tokenResult.success ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#1DB954]" />
                        <span className="text-[#1DB954] font-bold">{tokenResult.message}</span>
                      </div>
                      <p className="text-gray-400 text-sm">Token Type: <span className="text-white">{tokenResult.token_type}</span></p>
                      <p className="text-gray-400 text-sm">Expires In: <span className="text-white">{tokenResult.expires_in}s</span></p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400">{tokenResult.error}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Album Fetch Section */}
            <div className="bg-gray-900/80 backdrop-blur border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Music className="w-6 h-6 text-[#1DB954]" />
                Step 2: Fetch Album Metadata
              </h2>
              <div className="flex gap-3">
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-black/60 border border-gray-700 rounded-xl px-5 py-4 text-white focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 focus:outline-none"
                  placeholder="https://open.spotify.com/album/..." />
                <button onClick={testFetch} disabled={loading}
                  className="px-8 py-4 bg-[#1DB954] text-white font-bold rounded-xl hover:bg-[#1ed760] flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#1DB954]/30">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Music className="w-5 h-5" />}
                  Fetch
                </button>
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-5 flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 font-bold">{error}</p>
                </div>
              )}
              {result && (
                <div className="bg-[#1DB954]/10 border border-[#1DB954]/40 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <CheckCircle className="w-6 h-6 text-[#1DB954]" />
                    <span className="text-[#1DB954] font-bold text-lg">Success!</span>
                  </div>
                  <div className="flex gap-6">
                    {result.artwork_url && <img src={result.artwork_url} alt="Album" className="w-32 h-32 rounded-xl shadow-xl" />}
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-white">{result.title}</p>
                      <p className="text-lg text-[#D4AF37]">{result.artist}</p>
                      <div className="flex gap-6 mt-3 text-sm">
                        <p><span className="text-gray-500">Release:</span> <span className="text-gray-300">{result.release_date}</span></p>
                        <p><span className="text-gray-500">Label:</span> <span className="text-gray-300">{result.label}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'bulk' ? (
          <BulkImport />
        ) : (
          <ArtistSync />
        )}

      </div>
    </div>
  );
};

export default SpotifyTest;
