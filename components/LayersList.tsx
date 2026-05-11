import { Eye, EyeOff, ChevronUp, ChevronDown, Trash2, Plus, Image as ImageIcon, Type, Layers } from 'lucide-react';
import { Layer } from '../../lib/storyRenderer';

interface Props {
  layers: Layer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onDeleteLayer: (id: string) => void;
  onAddImageLayer: () => void;
  onAddTextLayer: () => void;
}

export default function LayersList({
  layers,
  activeLayerId,
  onSelectLayer,
  onToggleVisibility,
  onMoveLayer,
  onDeleteLayer,
  onAddImageLayer,
  onAddTextLayer
}: Props) {
  return (
    <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl p-4 border border-orange-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-400" />
          <label className="text-sm font-semibold text-orange-300">Layers</label>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={onAddImageLayer} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 rounded-lg text-xs font-semibold flex items-center gap-1 transition">
            <ImageIcon className="w-3 h-3" /> Image
          </button>
          <button onClick={onAddTextLayer} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 rounded-lg text-xs font-semibold flex items-center gap-1 transition">
            <Type className="w-3 h-3" /> Text
          </button>
        </div>
      </div>
      
      {layers.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-3">No layers yet. Use the buttons below to add content.</p>
      ) : (
        <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto">
          {layers.map((layer, idx) => (
            <div key={layer.id} className={`p-2 rounded-lg border-2 transition ${activeLayerId === layer.id ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
              <div className="flex items-center gap-2">
                <button onClick={() => onSelectLayer(layer.id)} className="flex-1 flex items-center gap-2 text-left min-w-0">
                  {layer.type === 'image' ? (
                    layer.url ? (
                      <img src={layer.url} alt={layer.name} className="w-10 h-10 rounded object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-zinc-700 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )
                  ) : (
                    <div className="w-10 h-10 rounded bg-zinc-700 flex items-center justify-center shrink-0">
                      <Type className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{layer.name}</div>
                    <div className="text-[10px] text-gray-400">{layer.type === 'image' ? 'Image' : 'Text'} #{idx + 1}</div>
                  </div>
                </button>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={() => onToggleVisibility(layer.id)} className="p-1.5 hover:bg-zinc-700 rounded transition">
                    {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-gray-500" />}
                  </button>
                  <button onClick={() => onMoveLayer(layer.id, 'up')} disabled={idx === 0} className="p-1.5 hover:bg-zinc-700 rounded transition disabled:opacity-30">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onMoveLayer(layer.id, 'down')} disabled={idx === layers.length - 1} className="p-1.5 hover:bg-zinc-700 rounded transition disabled:opacity-30">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDeleteLayer(layer.id)} className="p-1.5 hover:bg-red-600 rounded transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
