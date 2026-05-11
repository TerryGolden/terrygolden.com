import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';

interface TestResult {
  step: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

export default function InstagramCredentialTester() {
  const [accessToken, setAccessToken] = useState('');
  const [accountId, setAccountId] = useState('');
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const testCredentials = async () => {
    setTesting(true);
    setResults([]);

    const newResults: TestResult[] = [];

    // Test 1: Verify Access Token
    try {
      newResults.push({ step: 'Validating Access Token', status: 'pending', message: 'Checking token validity...' });
      setResults([...newResults]);

      const tokenDebugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`;
      const tokenResponse = await fetch(tokenDebugUrl);
      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        newResults[0] = { step: 'Access Token', status: 'error', message: tokenData.error.message };
        setResults([...newResults]);
        setTesting(false);
        return;
      }

      newResults[0] = {
        step: 'Access Token',
        status: 'success',
        message: 'Token is valid',
        details: {
          valid: tokenData.data.is_valid,
          expiresAt: tokenData.data.expires_at ? new Date(tokenData.data.expires_at * 1000).toLocaleString() : 'Never',
          scopes: tokenData.data.scopes,
        },
      };
      setResults([...newResults]);
    } catch (error: any) {
      newResults[0] = { step: 'Access Token', status: 'error', message: error.message };
      setResults([...newResults]);
      setTesting(false);
      return;
    }

    // Test 2: Fetch Account Info
    try {
      newResults.push({ step: 'Instagram Account', status: 'pending', message: 'Fetching account info...' });
      setResults([...newResults]);

      const accountUrl = `https://graph.facebook.com/v18.0/${accountId}?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${accessToken}`;
      const accountResponse = await fetch(accountUrl);
      const accountData = await accountResponse.json();

      if (accountData.error) {
        newResults[1] = { step: 'Instagram Account', status: 'error', message: accountData.error.message };
        setResults([...newResults]);
        setTesting(false);
        return;
      }

      newResults[1] = {
        step: 'Instagram Account',
        status: 'success',
        message: `Connected to @${accountData.username}`,
        details: accountData,
      };
      setResults([...newResults]);
    } catch (error: any) {
      newResults[1] = { step: 'Instagram Account', status: 'error', message: error.message };
      setResults([...newResults]);
      setTesting(false);
      return;
    }

    // Test 3: Fetch Media
    try {
      newResults.push({ step: 'Media Access', status: 'pending', message: 'Testing media permissions...' });
      setResults([...newResults]);

      const mediaUrl = `https://graph.facebook.com/v18.0/${accountId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=3&access_token=${accessToken}`;
      const mediaResponse = await fetch(mediaUrl);
      const mediaData = await mediaResponse.json();

      if (mediaData.error) {
        newResults[2] = { step: 'Media Access', status: 'error', message: mediaData.error.message };
        setResults([...newResults]);
        setTesting(false);
        return;
      }

      newResults[2] = {
        step: 'Media Access',
        status: 'success',
        message: `Successfully fetched ${mediaData.data?.length || 0} posts`,
        details: mediaData.data,
      };
      setResults([...newResults]);
    } catch (error: any) {
      newResults[2] = { step: 'Media Access', status: 'error', message: error.message };
      setResults([...newResults]);
    }

    setTesting(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Instagram API Credentials</CardTitle>
          <CardDescription>
            Test your Instagram Business API setup. Need help?{' '}
            <a
              href="/INSTAGRAM_API_SETUP_GUIDE.md"
              target="_blank"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              View Setup Guide <ExternalLink className="w-3 h-3" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder="Enter your long-lived access token"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountId">Instagram Business Account ID</Label>
            <Input
              id="accountId"
              placeholder="Enter your Instagram account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
          </div>

          <Button
            onClick={testCredentials}
            disabled={!accessToken || !accountId || testing}
            className="w-full"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <Alert key={index} variant={result.status === 'error' ? 'destructive' : 'default'}>
                <div className="flex items-start gap-3">
                  {result.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {result.status === 'error' && <XCircle className="w-5 h-5" />}
                  {result.status === 'pending' && <Loader2 className="w-5 h-5 animate-spin" />}
                  <div className="flex-1">
                    <div className="font-semibold">{result.step}</div>
                    <AlertDescription>{result.message}</AlertDescription>
                    {result.details && (
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
