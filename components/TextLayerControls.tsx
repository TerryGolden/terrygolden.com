import { useState } from 'react';
import { Type, Sparkles, Move, Palette, Wand2, Sliders, Zap } from 'lucide-react';
import { TextLayer } from '../../lib/storyRenderer';
import { TextPreset } from '../../data/textPresets';
import { EffectsPanel } from './EffectsPanel';
import { FiltersPanel } from './FiltersPanel';
import AnimationsPanel from './AnimationsPanel';

interface Props {
  layer: TextLayer;
  onUpdate: (updates: Partial<TextLayer>) => void;
  fonts: string[];
  presets: TextPreset[];
}

export default function TextLayerControls({ layer, onUpdate, fonts, presets }: Props) {
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'transform' | 'filters' | 'effects' | 'animations'>('text');


  const applyPreset = (preset: TextPreset) => {
    onUpdate({
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      color: preset.color,
      strokeColor: preset.strokeColor,
      strokeWidth: preset.strokeWidth,
      shadowColor: preset.shadowColor,
      shadowBlur: preset.shadowBlur,
      shadowOffsetX: preset.shadowOffsetX,
      shadowOffsetY: preset.shadowOffsetY
    });
  };

  return (
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-4 border border-green-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Type className="w-4 h-4 text-green-400" />
        <label className="text-sm font-semibold text-green-300">{layer.name}</label>
      </div>

      {/* Tabs */}

      <div className="flex gap-1 mb-3 bg-zinc-800/50 rounded-lg p-1 overflow-x-auto">
        <button onClick={() => setActiveTab('text')} className={`flex-1 py-2 px-2 rounded-md text-[10px] font-semibold transition whitespace-nowrap ${activeTab === 'text' ? 'bg-green-600' : 'hover:bg-zinc-700'}`}>
          <Type className="w-3 h-3 mx-auto mb-0.5" />
          Text
        </button>
        <button onClick={() => setActiveTab('style')} className={`flex-1 py-2 px-2 rounded-md text-[10px] font-semibold transition whitespace-nowrap ${activeTab === 'style' ? 'bg-green-600' : 'hover:bg-zinc-700'}`}>
          <Palette className="w-3 h-3 mx-auto mb-0.5" />
          Style
        </button>
        <button onClick={() => setActiveTab('transform')} className={`flex-1 py-2 px-2 rounded-md text-[10px] font-semibold transition whitespace-nowrap ${activeTab === 'transform' ? 'bg-green-600' : 'hover:bg-zinc-700'}`}>
          <Move className="w-3 h-3 mx-auto mb-0.5" />
          Move
        </button>
        <button onClick={() => setActiveTab('filters')} className={`flex-1 py-2 px-2 rounded-md text-[10px] font-semibold transition whitespace-nowrap ${activeTab === 'filters' ? 'bg-green-600' : 'hover:bg-zinc-700'}`}>
          <Sliders className="w-3 h-3 mx-auto mb-0.5" />
          Filters
        </button>
        <button onClick={() => setActiveTab('effects')} className={`flex-1 py-2 px-2 rounded-md text-[10px] font-semibold transition whitespace-nowrap ${activeTab === 'effects' ? 'bg-green-600' : 'hover:bg-zinc-700'}`}>
          <Wand2 className="w-3 h-3 mx-auto mb-0.5" />
          Effects
        </button>
        <button onClick={() => setActiveTab('animations')} className={`flex-1 py-2 px-2 rounded-md text-[10px] font-semibold transition whitespace-nowrap ${activeTab === 'animations' ? 'bg-green-600' : 'hover:bg-zinc-700'}`}>
          <Zap className="w-3 h-3 mx-auto mb-0.5" />
          Animate
        </button>
      </div>


      {/* Text Tab */}
      {activeTab === 'text' && (
        <div className="space-y-2.5">
          <div>
            <label className="text-[10px] text-gray-400 mb-1.5 block">Quick Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map(preset => (
                <button key={preset.id} onClick={() => applyPreset(preset)} className="py-1.5 px-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-[10px] font-semibold transition flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" /> {preset.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Text</label>
            <textarea value={layer.text} onChange={(e) => onUpdate({ text: e.target.value })} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-2 py-1.5 text-xs text-white resize-none" rows={2} />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Font</label>
            <select value={layer.fontFamily} onChange={(e) => onUpdate({ fontFamily: e.target.value })} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-2 py-1.5 text-xs text-white">
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Size: {layer.fontSize}px</label>
            <input type="range" min="20" max="200" value={layer.fontSize} onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Color</label>
            <input type="color" value={layer.color} onChange={(e) => onUpdate({ color: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1.5 block">Align</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['left', 'center', 'right'] as const).map(align => (
                <button key={align} onClick={() => onUpdate({ alignment: align })} className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition ${layer.alignment === align ? 'bg-green-600' : 'bg-zinc-700'}`}>
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Style Tab */}
      {activeTab === 'style' && (
        <div className="space-y-2.5">
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Stroke Width: {layer.strokeWidth}px</label>
            <input type="range" min="0" max="20" value={layer.strokeWidth} onChange={(e) => onUpdate({ strokeWidth: parseInt(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Stroke Color</label>
            <input type="color" value={layer.strokeColor} onChange={(e) => onUpdate({ strokeColor: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Shadow Blur: {layer.shadowBlur}px</label>
            <input type="range" min="0" max="50" value={layer.shadowBlur} onChange={(e) => onUpdate({ shadowBlur: parseInt(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Shadow Color</label>
            <input type="color" value={layer.shadowColor.startsWith('rgba') ? '#000000' : layer.shadowColor} onChange={(e) => onUpdate({ shadowColor: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer" />
          </div>
        </div>
      )}

      {/* Transform Tab */}
      {activeTab === 'transform' && (
        <div className="space-y-2.5">
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">X: {layer.x}%</label>
            <input type="range" min="0" max="100" value={layer.x} onChange={(e) => onUpdate({ x: parseInt(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Y: {layer.y}%</label>
            <input type="range" min="0" max="100" value={layer.y} onChange={(e) => onUpdate({ y: parseInt(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Scale: {layer.scale}%</label>
            <input type="range" min="20" max="200" value={layer.scale} onChange={(e) => onUpdate({ scale: parseInt(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Rotation: {layer.rotation}°</label>
            <input type="range" min="0" max="360" value={layer.rotation} onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">Opacity: {layer.opacity}%</label>
            <input type="range" min="0" max="100" value={layer.opacity} onChange={(e) => onUpdate({ opacity: parseInt(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1.5 block">Blend</label>
            <select value={layer.blendMode} onChange={(e) => onUpdate({ blendMode: e.target.value })} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-2 py-1.5 text-xs text-white">
              <option value="source-over">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="soft-light">Soft Light</option>
            </select>
          </div>
        </div>
      )}

      {/* Filters Tab */}
      {activeTab === 'filters' && (
        <FiltersPanel 
          filters={layer.filters || []} 
          onFiltersChange={(filters) => onUpdate({ filters })} 
        />
      )}

      {/* Effects Tab */}
      {activeTab === 'effects' && (
        <EffectsPanel 
          effects={layer.effects || []} 
          onUpdateEffects={(effects) => onUpdate({ effects })} 
        />
      )}

      {/* Animations Tab */}
      {activeTab === 'animations' && (
        <AnimationsPanel layer={layer} onUpdate={onUpdate} />
      )}

    </div>
  );
}
