import { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Move, RotateCw, Layers as LayersIcon, Wand2, Sliders, Zap } from 'lucide-react';
import { ImageLayer } from '../../lib/storyRenderer';
import { EffectsPanel } from './EffectsPanel';
import { FiltersPanel } from './FiltersPanel';
import AnimationsPanel from './AnimationsPanel';

interface Props {
  layer: ImageLayer;
  onUpdate: (updates: Partial<ImageLayer>) => void;
}

export default function ImageLayerControls({ layer, onUpdate }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'transform' | 'filters' | 'effects' | 'animations'>('transform');


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({ file, url: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-3 md:p-4 border border-blue-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-400" />
          <label className="text-sm md:text-base font-bold text-blue-300">{layer.name}</label>
        </div>
      </div>
      
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 md:py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition mb-3 active:scale-95 shadow-lg">
        <Upload className="w-5 h-5" />
        {layer.url ? 'Change Image' : 'Upload Image'}
      </button>
      
      {layer.url && (
        <>
          {/* Tabs - Larger and more visible on mobile */}
          <div className="flex gap-1 mb-4 bg-zinc-800/70 rounded-xl p-1.5 overflow-x-auto">
            <button onClick={() => setActiveTab('transform')} className={`flex-1 py-3 px-2 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center gap-1 min-w-[70px] ${activeTab === 'transform' ? 'bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg' : 'hover:bg-zinc-700'}`}>
              <Move className="w-5 h-5" />
              <span className="text-xs">Transform</span>
            </button>
            <button onClick={() => setActiveTab('filters')} className={`flex-1 py-3 px-2 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center gap-1 min-w-[70px] ${activeTab === 'filters' ? 'bg-gradient-to-br from-purple-600 to-purple-500 shadow-lg' : 'hover:bg-zinc-700'}`}>
              <Sliders className="w-5 h-5" />
              <span className="text-xs">Filters</span>
            </button>
            <button onClick={() => setActiveTab('effects')} className={`flex-1 py-3 px-2 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center gap-1 min-w-[70px] ${activeTab === 'effects' ? 'bg-gradient-to-br from-pink-600 to-pink-500 shadow-lg' : 'hover:bg-zinc-700'}`}>
              <Wand2 className="w-5 h-5" />
              <span className="text-xs">Effects</span>
            </button>
            <button onClick={() => setActiveTab('animations')} className={`flex-1 py-3 px-2 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center gap-1 min-w-[70px] ${activeTab === 'animations' ? 'bg-gradient-to-br from-orange-600 to-orange-500 shadow-lg' : 'hover:bg-zinc-700'}`}>
              <Zap className="w-5 h-5" />
              <span className="text-xs">Animate</span>
            </button>
          </div>


          {/* Transform Tab */}
          {activeTab === 'transform' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-blue-300 mb-1.5 block">Position X: {layer.x}%</label>
                <input type="range" min="0" max="100" value={layer.x} onChange={(e) => onUpdate({ x: parseInt(e.target.value) })} className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-300 mb-1.5 block">Position Y: {layer.y}%</label>
                <input type="range" min="0" max="100" value={layer.y} onChange={(e) => onUpdate({ y: parseInt(e.target.value) })} className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-300 mb-1.5 block">Scale: {layer.scale}%</label>
                <input type="range" min="20" max="200" value={layer.scale} onChange={(e) => onUpdate({ scale: parseInt(e.target.value) })} className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-300 mb-1.5 block">Rotation: {layer.rotation}°</label>
                <input type="range" min="0" max="360" value={layer.rotation} onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) })} className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-300 mb-1.5 block">Opacity: {layer.opacity}%</label>
                <input type="range" min="0" max="100" value={layer.opacity} onChange={(e) => onUpdate({ opacity: parseInt(e.target.value) })} className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
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

        </>
      )}
    </div>
  );
}
