import { Loader2, ShieldCheck, RefreshCw, Zap, Clock, CheckCircle, XCircle, Key, AlertTriangle } from 'lucide-react';

interface Props {
  validating: boolean;
  credentialStatus: any;
  onValidate: (forceRefresh?: boolean) => void;
}

const CredentialSection = ({ validating, credentialStatus, onValidate }: Props) => (
  <div className="bg-gray-900/80 backdrop-blur border border-[#D4AF37]/30 rounded-2xl p-6 mb-6 shadow-2xl">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
        <h2 className="text-xl font-bold text-white">Credential Validation</h2>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onValidate(false)} disabled={validating}
          className="px-4 py-2 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#E5C04B] flex items-center gap-2 disabled:opacity-50 text-sm">
          {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Validate
        </button>
        <button onClick={() => onValidate(true)} disabled={validating}
          className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 flex items-center gap-2 disabled:opacity-50 text-sm"
          title="Force a fresh validation with cache-busting">
          <Zap className="w-4 h-4" />
          Force Refresh
        </button>
      </div>
    </div>
    <p className="text-gray-400 text-sm mb-4">Test your Spotify API credentials. Use "Force Refresh" after updating secrets.</p>
    
    {credentialStatus && <CredentialResult status={credentialStatus} />}
  </div>
);

const CredentialResult = ({ status }: { status: any }) => (
  <div className={`rounded-xl p-5 ${status.valid ? 'bg-green-500/10 border border-green-500/40' : 'bg-red-500/10 border border-red-500/40'}`}>
    <div className="flex items-start gap-3">
      {status.valid ? <CheckCircle className="w-6 h-6 text-green-400 mt-0.5" /> : <XCircle className="w-6 h-6 text-red-400 mt-0.5" />}
      <div className="flex-1">
        <p className={`font-bold text-lg ${status.valid ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>
        {status.details && (
          <div className="mt-3 text-sm text-gray-400 space-y-1">
            {Object.entries(status.details).map(([key, val]) => (
              <p key={key}><span className="text-gray-500">{key}:</span> <span className="text-gray-300">{String(val)}</span></p>
            ))}
          </div>
        )}
        {status.diagnostics && <DiagnosticsPanel diagnostics={status.diagnostics} />}
        {!status.valid && <FixInstructions errorType={status.error} />}
      </div>
    </div>
  </div>
);

const DiagnosticsPanel = ({ diagnostics }: { diagnostics: any }) => (
  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <Clock className="w-4 h-4 text-blue-400" />
      <span className="text-blue-400 font-bold text-xs">Instance Diagnostics</span>
    </div>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <p><span className="text-gray-500">Cold Start:</span> <span className={diagnostics.isColdStart ? 'text-green-400' : 'text-yellow-400'}>{diagnostics.isColdStart ? 'Yes (Fresh)' : 'No (Cached)'}</span></p>
      <p><span className="text-gray-500">Instance Age:</span> <span className="text-gray-300">{diagnostics.instanceAgeSeconds}s</span></p>
      <p><span className="text-gray-500">Request #:</span> <span className="text-gray-300">{diagnostics.requestNumber}</span></p>
      <p><span className="text-gray-500">Timestamp:</span> <span className="text-gray-300">{new Date(diagnostics.timestamp).toLocaleTimeString()}</span></p>
    </div>
    {!diagnostics.isColdStart && diagnostics.instanceAgeSeconds > 60 && (
      <p className="text-yellow-400 text-xs mt-2">Instance is cached. If credentials were updated, redeploy the function.</p>
    )}
  </div>
);

const FixInstructions = ({ errorType }: { errorType: string }) => (
  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-3">
    <div className="flex items-center gap-2">
      <Key className="w-4 h-4 text-amber-400" />
      <span className="text-amber-400 font-bold text-sm">How to Fix</span>
    </div>
    <ol className="list-decimal list-inside space-y-1 text-gray-300 text-xs">
      <li>Go to <a href="https://developer.spotify.com/dashboard" target="_blank" className="text-[#1DB954] underline">developer.spotify.com/dashboard</a></li>
      <li>Copy your <strong className="text-white">Client ID</strong> (32-char string)</li>
      <li>Click "Show client secret" and copy it</li>
      <li>Update in <strong className="text-white">Supabase → Edge Functions → Secrets</strong></li>
    </ol>
    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <span className="text-red-400 font-bold text-xs">Must Redeploy After Updating!</span>
      </div>
      <p className="text-gray-300 text-xs">Go to Edge Functions → Click function → Click "Redeploy" button</p>
    </div>
  </div>
);

export default CredentialSection;
