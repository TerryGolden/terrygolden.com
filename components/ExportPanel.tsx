import { useState } from 'react';
import { Download, Share2, Image, Film } from 'lucide-react';

interface ExportSettings {
  width: number;
  height: number;
  format: 'png' | 'jpeg' | 'webp' | 'gif' | 'mp4';
  quality: number;
}

interface Props {
  onExport: (settings: ExportSettings) => void;
  disabled?: boolean;
}

const PRESETS = [
  { name: 'Story', width: 1080, height: 1920, icon: '📱' },
  { name: 'Square', width: 1080, height: 1080, icon: '⬛' },
  { name: 'Portrait', width: 1080, height: 1350, icon: '📐' },
  { name: 'Landscape', width: 1080, height: 566, icon: '🖼️' },
];

export default function ExportPanel({ onExport, disabled }: Props) {
  const [settings, setSettings] = useState<ExportSettings>({
    width: 1080,
    height: 1920,
    format: 'png',
    quality: 92,
  });
  const [expanded, setExpanded] = useState(false);

  const handleExport = () => {
    if (settings.format === 'gif' || settings.format === 'mp4') {
      alert('Animated GIF and Video export coming soon! For now, export as PNG/JPEG and use external tools to create animations.');
      return;
    }
    onExport(settings);
  };

  return (
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl border border-green-500/30 overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between font-semibold text-green-300 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Settings
        </div>
        <span className="text-xs text-gray-400">{settings.width}×{settings.height} • {settings.format.toUpperCase()}</span>
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-3">
          <div>
            <label className="text-xs font-semibold text-green-300 mb-2 block">Size</label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => setSettings({ ...settings, width: preset.width, height: preset.height })}
                  className={`p-2 rounded-lg border-2 transition-all text-left ${
                    settings.width === preset.width && settings.height === preset.height
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <div className="text-sm mb-0.5">{preset.icon}</div>
                  <div className="text-[10px] font-semibold">{preset.name}</div>
                  <div className="text-[9px] text-gray-400">{preset.width}×{preset.height}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-green-300 mb-2 block">Format</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {(['png', 'jpeg', 'webp'] as const).map(format => (
                <button
                  key={format}
                  onClick={() => setSettings({ ...settings, format })}
                  className={`py-2 px-2 rounded-lg font-semibold text-xs transition-all ${
                    settings.format === format
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['gif', 'mp4'] as const).map(format => (
                <button
                  key={format}
                  onClick={() => setSettings({ ...settings, format })}
                  className={`py-2 px-2 rounded-lg font-semibold text-xs transition-all relative ${
                    settings.format === format
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  <Film className="w-3 h-3 inline mr-1" />
                  {format.toUpperCase()}
                  <span className="text-[8px] block text-yellow-400">Soon</span>
                </button>
              ))}
            </div>
          </div>

          {settings.format !== 'png' && settings.format !== 'gif' && settings.format !== 'mp4' && (
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Quality: {settings.quality}%</label>
              <input
                type="range"
                min="60"
                max="100"
                value={settings.quality}
                onChange={(e) => setSettings({ ...settings, quality: parseInt(e.target.value) })}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      <div className="p-4 pt-2">
        <button
          onClick={handleExport}
          disabled={disabled}
          className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          Download / Share
        </button>
      </div>
    </div>
  );
}
