import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Loader2, Check, ExternalLink, AlertCircle } from 'lucide-react';
import { safeInvokeFunction } from '@/lib/supabase';
import { toast } from 'sonner';
import { handleSpotifyClick, isMobileDevice, SOCIAL_LINKS } from '@/lib/socialMediaUtils';

interface SpotifyAuthButtonProps {
  onSuccess: (token: string) => void;
  showAlternative?: boolean;
}

export const SpotifyAuthButton = ({ onSuccess, showAlternative = true }: SpotifyAuthButtonProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    
    if (token && expiry && Date.now() < parseInt(expiry)) {
      setIsAuthenticated(true);
      onSuccess(token);
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      setAuthError('Spotify authorization was denied');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (code) {
      handleCallback(code);
    }
  }, []);

  const handleCallback = async (code: string) => {
    setLoading(true);
    try {
      const redirectUri = window.location.origin + '/art-of-rave';
      
      const { data, error } = await safeInvokeFunction('spotify-callback', {
        body: { code, redirectUri }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.accessToken) {
        // Store token with expiry
        const expiryTime = Date.now() + (data.expiresIn || 3600) * 1000;
        localStorage.setItem('spotify_access_token', data.accessToken);
        localStorage.setItem('spotify_token_expiry', expiryTime.toString());
        
        setIsAuthenticated(true);
        onSuccess(data.accessToken);
        toast.success('Successfully connected to Spotify!');
      }
    } catch (err: any) {
      console.error('Spotify callback error:', err);
      setAuthError('Failed to complete Spotify authentication');
      setShowFallback(true);
    } finally {
      setLoading(false);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    setAuthError(null);
    
    try {
      const redirectUri = window.location.origin + '/art-of-rave';

      // Use safe invoke to prevent errors when edge function is not available
      const { data, error } = await safeInvokeFunction('spotify-auth-url', {
        body: { redirectUri }
      });

      if (error) {
        console.warn('Spotify auth not available:', error.message);
        setAuthError('Spotify connection is not available at the moment');
        setShowFallback(true);
        setLoading(false);
        return;
      }
      
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setAuthError('Could not get Spotify authorization URL');
        setShowFallback(true);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setAuthError('Failed to connect to Spotify');
      setShowFallback(true);
      setLoading(false);
    }
  };

  const handleSpotifyOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSpotifyClick(e, SOCIAL_LINKS.spotify.webUrl);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    setIsAuthenticated(false);
    toast.success('Disconnected from Spotify');
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400 text-sm">
          <Check className="w-4 h-4" />
          <span>Spotify Connected</span>
        </div>
        <Button
          onClick={handleDisconnect}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white text-xs"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          onClick={handleAuth} 
          disabled={loading}
          variant="outline" 
          size="sm" 
          className="gap-2 bg-green-600/20 border-green-600/50 hover:bg-green-600/30 text-green-400"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          )}
          Connect Spotify
        </Button>
        
        {showAlternative && (showFallback || authError) && (
          <Button
            onClick={handleSpotifyOpen}
            variant="outline"
            size="sm"
            className="gap-2 text-gray-400 hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
            Open Spotify
          </Button>
        )}
      </div>
      
      {authError && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-900/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{authError}</span>
        </div>
      )}
      
      {showFallback && !authError && (
        <p className="text-xs text-gray-500">
          {isMobileDevice() 
            ? 'Tap "Open Spotify" to listen in the Spotify app'
            : 'Click "Open Spotify" to listen on Spotify'}
        </p>
      )}
    </div>
  );
};
