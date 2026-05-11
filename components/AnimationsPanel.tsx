import { Play, Clock, Timer } from 'lucide-react';
import { Layer } from '../../lib/storyRenderer';

interface Props {
  layer: Layer;
  onUpdate: (updates: Partial<Layer>) => void;
}

export default function AnimationsPanel({ layer, onUpdate }: Props) {
  const animation = layer.animation || { type: 'none', duration: 1000, delay: 0, easing: 'easeOut' };

  return (
    <div className="space-y-6">
      {/* Animation Type */}
      <div>
        <label className="block text-sm font-bold text-purple-300 mb-3">Animation Type</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'none', label: 'None', icon: '⊘' },
            { value: 'fadeIn', label: 'Fade In', icon: '↗' },
            { value: 'fadeOut', label: 'Fade Out', icon: '↘' },
            { value: 'slideLeft', label: 'Slide Left', icon: '←' },
            { value: 'slideRight', label: 'Slide Right', icon: '→' },
            { value: 'slideUp', label: 'Slide Up', icon: '↑' },
            { value: 'slideDown', label: 'Slide Down', icon: '↓' },
            { value: 'zoomIn', label: 'Zoom In', icon: '⊕' },
            { value: 'zoomOut', label: 'Zoom Out', icon: '⊖' },
            { value: 'bounce', label: 'Bounce', icon: '⤴' },
            { value: 'rotateIn', label: 'Rotate In', icon: '↻' },
            { value: 'rotateOut', label: 'Rotate Out', icon: '↺' }
          ].map(anim => (
            <button
              key={anim.value}
              onClick={() => onUpdate({ animation: { ...animation, type: anim.value as any } })}
              className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                animation.type === anim.value
                  ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                  : 'border-zinc-700 hover:border-zinc-600 text-zinc-300'
              }`}
            >
              <div className="text-xl mb-1">{anim.icon}</div>
              {anim.label}
            </button>
          ))}
        </div>
      </div>

      {animation.type !== 'none' && (
        <>
          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-purple-300 mb-3">
              <Timer className="w-4 h-4" />
              Duration: {animation.duration}ms
            </label>
            <input
              type="range"
              min="100"
              max="3000"
              step="100"
              value={animation.duration}
              onChange={(e) => onUpdate({ animation: { ...animation, duration: parseInt(e.target.value) } })}
              className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Delay */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-purple-300 mb-3">
              <Clock className="w-4 h-4" />
              Delay: {animation.delay}ms
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={animation.delay}
              onChange={(e) => onUpdate({ animation: { ...animation, delay: parseInt(e.target.value) } })}
              className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Easing */}
          <div>
            <label className="block text-sm font-bold text-purple-300 mb-3">Easing</label>
            <div className="grid grid-cols-2 gap-2">
              {['linear', 'easeIn', 'easeOut', 'easeInOut'].map(ease => (
                <button
                  key={ease}
                  onClick={() => onUpdate({ animation: { ...animation, easing: ease as any } })}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                    animation.easing === ease
                      ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                      : 'border-zinc-700 hover:border-zinc-600 text-zinc-300'
                  }`}
                >
                  {ease}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
