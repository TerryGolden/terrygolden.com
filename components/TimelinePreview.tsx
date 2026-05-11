import { Layer } from '../../lib/storyRenderer';
import { Play, Clock } from 'lucide-react';

interface Props {
  layers: Layer[];
  onSeek?: (time: number) => void;
}

export default function TimelinePreview({ layers, onSeek }: Props) {
  // Calculate total duration
  const maxDuration = layers.reduce((max, layer) => {
    if (!layer.animation || layer.animation.type === 'none') return max;
    const endTime = layer.animation.delay + layer.animation.duration;
    return Math.max(max, endTime);
  }, 3000);

  return (
    <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-2xl border border-purple-500/30 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Play className="w-5 h-5 text-purple-400" />
        <h3 className="font-bold text-purple-300">Animation Timeline</h3>
        <span className="ml-auto text-xs text-zinc-400">{maxDuration}ms</span>
      </div>

      <div className="space-y-2">
        {layers.filter(l => l.animation && l.animation.type !== 'none').map(layer => {
          const anim = layer.animation!;
          const startPercent = (anim.delay / maxDuration) * 100;
          const widthPercent = (anim.duration / maxDuration) * 100;

          return (
            <div key={layer.id} className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-zinc-300 truncate flex-1">{layer.name}</span>
                <span className="text-xs text-zinc-500">{anim.type}</span>
              </div>
              
              <div className="h-8 bg-zinc-800/50 rounded-lg relative overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`
                  }}
                >
                  <span className="text-xs font-bold text-white opacity-75">{anim.duration}ms</span>
                </div>
              </div>
            </div>
          );
        })}

        {layers.filter(l => l.animation && l.animation.type !== 'none').length === 0 && (
          <div className="text-center py-8 text-zinc-500 text-sm">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No animations added yet
          </div>
        )}
      </div>
    </div>
  );
}
