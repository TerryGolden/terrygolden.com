import { useState, useEffect } from 'react';
import { 
  Instagram, RefreshCw, Shield, ShieldAlert, ShieldCheck, Clock, 
  Key, ExternalLink, Copy, CheckCircle2, XCircle, AlertTriangle, 
  Loader2, ChevronDown, ChevronUp, ArrowLeft, Eye, EyeOff, 
  Calendar, User, Image, Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface TokenStatus {
  status: 'valid' | 'expired' | 'no_token' | 'unknown';
  message: string;
  tokenSource?: string;
  daysUntilExpiry?: number | null;
  validation?: {
    valid: boolean;
    expiresAt: string | null;
    scopes: string[];
    error: string | null;
  };
  accountInfo?: {
    username: string;
    name: string;
    followers_count: number;
    media_count: number;
    profile_picture_url?: string;
  } | null;
  stored?: {
    lastRefreshed: string;
    expiresAt: string;
    username: string;
    isValid: boolean;
  } | null;
  envConfigured?: boolean;
}

interface Props {
  onBack: () => void;
}

export default function InstagramTokenManager({ onBack }: Props) {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newToken, setNewToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkTokenStatus();
  }, []);

  const checkTokenStatus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('refresh-instagram-token', {
        body: { action: 'check' }
      });

      if (error) throw error;
      setTokenStatus(data as TokenStatus);
    } catch (err: any) {
      console.error('Token check failed:', err);
      setTokenStatus({
        status: 'unknown',
        message: 'Could not check token status: ' + (err.message || 'Unknown error')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('refresh-instagram-token', {
        body: { action: 'refresh' }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: 'Token Refreshed',
          description: data.message,
        });
        await checkTokenStatus();
      } else {
        toast({
          title: 'Refresh Failed',
          description: data?.error || 'Could not refresh token',
          variant: 'destructive',
        });
        if (data?.hint) {
          setShowGuide(true);
        }
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Refresh request failed',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateToken = async () => {
    if (!newToken.trim()) {
      toast({
        title: 'Missing Token',
        description: 'Please paste your new access token',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('refresh-instagram-token', {
        body: { action: 'update', newToken: newToken.trim() }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: 'Token Updated',
          description: data.message,
        });
        setNewToken('');
        await checkTokenStatus();
      } else {
        toast({
          title: 'Update Failed',
          description: data?.error || 'Could not update token',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Update request failed',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = () => {
    if (!tokenStatus) return 'gray';
    switch (tokenStatus.status) {
      case 'valid': 
        if (tokenStatus.daysUntilExpiry !== null && tokenStatus.daysUntilExpiry !== undefined && tokenStatus.daysUntilExpiry < 14) return 'yellow';
        return 'green';
      case 'expired': return 'red';
      case 'no_token': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = () => {
    const color = getStatusColor();
    switch (color) {
      case 'green': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'yellow': return <ShieldAlert className="w-6 h-6 text-yellow-400" />;
      case 'red': return <ShieldAlert className="w-6 h-6 text-red-400" />;
      default: return <Shield className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const color = getStatusColor();
    const labels: Record<string, string> = {
      green: 'Active',
      yellow: 'Expiring Soon',
      red: 'Expired',
      gray: 'Unknown'
    };
    const bgColors: Record<string, string> = {
      green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30',
      gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${bgColors[color]}`}>
        <span className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-emerald-400 animate-pulse' : color === 'yellow' ? 'bg-yellow-400' : color === 'red' ? 'bg-red-400' : 'bg-gray-400'}`} />
        {labels[color]}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Key className="w-5 h-5 text-white" />
              </div>
              Instagram Token Manager
            </h1>
            <p className="text-gray-400 mt-1">Manage your Instagram API access token for @terrygoldenmusic</p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Token Status Card */}
            <div className={`rounded-xl border p-6 ${
              getStatusColor() === 'green' ? 'bg-emerald-500/5 border-emerald-500/20' :
              getStatusColor() === 'yellow' ? 'bg-yellow-500/5 border-yellow-500/20' :
              getStatusColor() === 'red' ? 'bg-red-500/5 border-red-500/20' :
              'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon()}
                  <div>
                    <h2 className="text-xl font-bold text-white">Token Status</h2>
                    <p className="text-gray-400 text-sm">{tokenStatus?.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge()}
                  <button
                    onClick={checkTokenStatus}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    title="Refresh status"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Zap className="w-3 h-3" />
                    Source
                  </div>
                  <p className="text-white font-medium text-sm capitalize">
                    {tokenStatus?.tokenSource || 'N/A'}
                  </p>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Calendar className="w-3 h-3" />
                    Expires In
                  </div>
                  <p className={`font-medium text-sm ${
                    tokenStatus?.daysUntilExpiry !== null && tokenStatus?.daysUntilExpiry !== undefined
                      ? tokenStatus.daysUntilExpiry > 14 ? 'text-emerald-400' : tokenStatus.daysUntilExpiry > 0 ? 'text-yellow-400' : 'text-red-400'
                      : 'text-gray-400'
                  }`}>
                    {tokenStatus?.daysUntilExpiry !== null && tokenStatus?.daysUntilExpiry !== undefined
                      ? tokenStatus.daysUntilExpiry > 0 ? `${tokenStatus.daysUntilExpiry} days` : 'Expired'
                      : 'Unknown'}
                  </p>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Clock className="w-3 h-3" />
                    Last Refreshed
                  </div>
                  <p className="text-white font-medium text-sm">
                    {tokenStatus?.stored?.lastRefreshed 
                      ? new Date(tokenStatus.stored.lastRefreshed).toLocaleDateString()
                      : 'Never'}
                  </p>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Shield className="w-3 h-3" />
                    Env Secret
                  </div>
                  <p className={`font-medium text-sm ${tokenStatus?.envConfigured ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tokenStatus?.envConfigured ? 'Configured' : 'Missing'}
                  </p>
                </div>
              </div>

              {/* Account Info */}
              {tokenStatus?.accountInfo && (
                <div className="mt-4 bg-black/20 rounded-lg p-4 flex items-center gap-4">
                  {tokenStatus.accountInfo.profile_picture_url ? (
                    <img 
                      src={tokenStatus.accountInfo.profile_picture_url} 
                      alt={tokenStatus.accountInfo.username}
                      className="w-12 h-12 rounded-full border-2 border-pink-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold">@{tokenStatus.accountInfo.username}</p>
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-gray-400 text-sm">{tokenStatus.accountInfo.name}</p>
                  </div>
                  <div className="flex gap-6 text-center">
                    <div>
                      <p className="text-white font-bold">{tokenStatus.accountInfo.followers_count?.toLocaleString()}</p>
                      <p className="text-gray-500 text-xs">Followers</p>
                    </div>
                    <div>
                      <p className="text-white font-bold">{tokenStatus.accountInfo.media_count?.toLocaleString()}</p>
                      <p className="text-gray-500 text-xs">Posts</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Expiry Warning */}
              {tokenStatus?.validation?.expiresAt && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Token expires: {formatDate(tokenStatus.validation.expiresAt)}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Refresh Token */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Refresh Token</h3>
                    <p className="text-gray-500 text-xs">Extend expiry by 60 days</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Attempt to refresh the current long-lived token. Works if the token hasn't expired yet.
                </p>
                <button
                  onClick={handleRefreshToken}
                  disabled={refreshing || tokenStatus?.status === 'no_token'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-all"
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Refresh Current Token
                    </>
                  )}
                </button>
              </div>

              {/* Test Feed */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Image className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Test Feed</h3>
                    <p className="text-gray-500 text-xs">Verify feed is loading</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Force refresh the Instagram feed cache to verify the token is working correctly.
                </p>
                <button
                  onClick={async () => {
                    try {
                      const { data, error } = await supabase.functions.invoke('fetch-instagram-feed', {
                        body: { forceRefresh: true }
                      });
                      if (error) throw error;
                      if (data?.data?.length > 0) {
                        toast({
                          title: 'Feed Working',
                          description: `Successfully loaded ${data.data.length} posts from Instagram (source: ${data.tokenSource || 'unknown'})`,
                        });
                      } else if (data?.tokenExpired) {
                        toast({
                          title: 'Token Expired',
                          description: 'The Instagram token is expired. Please update it below.',
                          variant: 'destructive',
                        });
                      } else {
                        toast({
                          title: 'No Posts Found',
                          description: data?.error || 'Could not fetch Instagram posts',
                          variant: 'destructive',
                        });
                      }
                    } catch (err: any) {
                      toast({
                        title: 'Test Failed',
                        description: err.message,
                        variant: 'destructive',
                      });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  Test Instagram Feed
                </button>
              </div>
            </div>

            {/* Update Token Section */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Key className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Update Access Token</h3>
                  <p className="text-gray-400 text-sm">Paste a new token from the Meta Developer Portal</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value)}
                    placeholder="Paste your new long-lived access token here..."
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pr-20 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30 font-mono text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {newToken && (
                      <button
                        onClick={() => copyToClipboard(newToken)}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleUpdateToken}
                  disabled={updating || !newToken.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white rounded-lg font-bold transition-all"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validating & Saving...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Validate & Save New Token
                    </>
                  )}
                </button>

                <p className="text-gray-500 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  The token will be validated against the Instagram API, automatically exchanged for a long-lived token if needed, and saved to the database. The feed will immediately start using the new token.
                </p>
              </div>
            </div>

            {/* How to Get a New Token Guide */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">How to Generate a New Token</h3>
                    <p className="text-gray-400 text-sm">Step-by-step guide for the Meta Developer Portal</p>
                  </div>
                </div>
                {showGuide ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {showGuide && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="border-t border-white/10 pt-4" />
                  
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">1</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Open Meta Graph API Explorer</h4>
                      <p className="text-gray-400 text-sm mb-2">Go to the Meta Developer Portal's Graph API Explorer tool.</p>
                      <a
                        href="https://developers.facebook.com/tools/explorer/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Graph API Explorer
                      </a>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">2</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Select Your App</h4>
                      <p className="text-gray-400 text-sm">Choose your Facebook/Meta app from the dropdown at the top of the page. This should be the app connected to the @terrygoldenmusic Instagram Business account.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">3</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Add Required Permissions</h4>
                      <p className="text-gray-400 text-sm mb-2">Click "Add a Permission" and select these:</p>
                      <div className="flex flex-wrap gap-2">
                        {['instagram_basic', 'instagram_content_publish', 'instagram_manage_comments', 'pages_show_list', 'pages_read_engagement', 'instagram_business_basic'].map(perm => (
                          <span key={perm} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-mono">{perm}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">4</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Generate Access Token</h4>
                      <p className="text-gray-400 text-sm">Click "Generate Access Token" and authorize the app. You'll receive a short-lived token (valid for ~1 hour).</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">5</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Exchange for Long-Lived Token</h4>
                      <p className="text-gray-400 text-sm mb-2">Use the Access Token Debugger to exchange your short-lived token for a long-lived one (valid for 60 days).</p>
                      <a
                        href="https://developers.facebook.com/tools/accesstoken/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Access Token Debugger
                      </a>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">6</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Paste Token Above</h4>
                      <p className="text-gray-400 text-sm">Copy the long-lived token and paste it in the "Update Access Token" field above. The system will automatically validate it, exchange it for a long-lived token if needed, and save it.</p>
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-yellow-400 font-semibold text-sm">Pro Tip: Set a Reminder</h4>
                        <p className="text-yellow-400/70 text-sm mt-1">
                          Long-lived tokens expire every 60 days. Set a calendar reminder to refresh the token before it expires. 
                          You can refresh it anytime using the "Refresh Token" button above — as long as it hasn't expired yet.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Also update Supabase secret */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-blue-400 font-semibold text-sm">Optional: Update Supabase Secret</h4>
                        <p className="text-blue-400/70 text-sm mt-1">
                          The token saved here works immediately. For extra reliability, also update the <code className="bg-blue-500/20 px-1 rounded">INSTAGRAM_ACCESS_TOKEN</code> secret in your Supabase Dashboard under Project Settings &gt; Edge Functions &gt; Manage Secrets.
                        </p>
                        <a
                          href="https://supabase.com/dashboard"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors mt-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open Supabase Dashboard
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced: Token Scopes */}
            {tokenStatus?.validation?.scopes && tokenStatus.validation.scopes.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Advanced Details</h3>
                      <p className="text-gray-400 text-sm">Token scopes, permissions, and debug info</p>
                    </div>
                  </div>
                  {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {showAdvanced && (
                  <div className="px-6 pb-6 space-y-4">
                    <div className="border-t border-white/10 pt-4" />
                    <div>
                      <h4 className="text-gray-400 text-sm font-medium mb-2">Token Scopes / Permissions</h4>
                      <div className="flex flex-wrap gap-2">
                        {tokenStatus.validation.scopes.map(scope => (
                          <span key={scope} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono">
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                    {tokenStatus.validation.expiresAt && (
                      <div>
                        <h4 className="text-gray-400 text-sm font-medium mb-1">Exact Expiration</h4>
                        <p className="text-white font-mono text-sm">{formatDate(tokenStatus.validation.expiresAt)}</p>
                      </div>
                    )}
                    {tokenStatus.stored && (
                      <div>
                        <h4 className="text-gray-400 text-sm font-medium mb-1">Database Record</h4>
                        <pre className="bg-black/30 rounded-lg p-3 text-xs text-gray-300 font-mono overflow-auto">
                          {JSON.stringify(tokenStatus.stored, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
