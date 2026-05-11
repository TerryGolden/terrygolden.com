import { Palette } from 'lucide-react';
import { themes } from './AudioVisualizer';
import { useState } from 'react';

interface Props {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export const VisualizerControls = ({ currentTheme, onThemeChange }: Props) => {
  const [showThemes, setShowThemes] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowThemes(!showThemes)}
        className="p-2 hover:bg-zinc-800 rounded-full transition"
        title="Change visualizer theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {showThemes && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/95 border border-[#D4AF37]/20 rounded-lg p-3 min-w-[200px]">
          <div className="text-xs font-semibold text-[#D4AF37] mb-2">Visualizer Themes</div>
          <div className="space-y-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme.id);
                  setShowThemes(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                  currentTheme === theme.id
                    ? 'bg-[#D4AF37] text-black font-semibold'
                    : 'hover:bg-zinc-800 text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span>{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
