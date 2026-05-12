import { useRef, useEffect, useState } from 'react';
import { Layer } from '@/lib/storyRenderer';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { Move, RotateCw, ZoomIn, Maximize2 } from 'lucide-react';
import GestureTutorial from '@/components/GestureTutorial';

interface Props {
  previewImage: string | null;
  layers: Layer[];
  activeLayerId: string | null;
  onUpdateLayer: (updates: Partial<Layer>) => void;
  onSelectLayer: (id: string) => void;
  generating: boolean;
}

export default function InteractiveCanvas({
  previewImage,
  layers,
  activeLayerId,
  onUpdateLayer,
  onSelectLayer,
  generating
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gestureInfo, setGestureInfo] = useState<{ type: string; value: string } | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 1080, height: 1920 });
  const [lastTap, setLastTap] = useState<{ time: number; layerId: string | null }>({ time: 0, layerId: null });

  const touchHandlers = useTouchGestures({
    layers,
    activeLayerId,
    onUpdateLayer: (updates) => {
      onUpdateLayer(updates);
      if (updates.scale) setGestureInfo({ type: 'scale', value: `${Math.round(updates.scale)}%` });
      if (updates.rotation !== undefined) setGestureInfo({ type: 'rotate', value: `${Math.round(updates.rotation)}°` });
      if (updates.x !== undefined || updates.y !== undefined) setGestureInfo({ type: 'move', value: 'Moving' });
      setTimeout(() => setGestureInfo(null), 1000);
    },
    onSelectLayer,
    canvasWidth: containerSize.width,
    canvasHeight: containerSize.height
  });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleDoubleTap = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer || layer.type !== 'image') return;

    // Auto-fill the story canvas - center and scale to cover
    onUpdateLayer({
      x: 50,
      y: 50,
      scale: 150, // Scale to fill the story canvas
      rotation: 0
    });

    setGestureInfo({ type: 'fill', value: 'Auto-filled' });
    setTimeout(() => setGestureInfo(null), 1500);
  };

  const handleTap = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
      
      for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        if (!layer.visible) continue;
        
        const layerSize = 30;
        if (x >= layer.x - layerSize && x <= layer.x + layerSize &&
            y >= layer.y - layerSize && y <= layer.y + layerSize) {
          
          // Check for double tap
          const now = Date.now();
          if (now - lastTap.time < 300 && lastTap.layerId === layer.id) {
            handleDoubleTap(layer.id);
          } else {
            setLastTap({ time: now, layerId: layer.id });
            onSelectLayer(layer.id);
          }
          break;
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <GestureTutorial />
      <div
        ref={containerRef}
        className="relative bg-zinc-800 rounded-2xl overflow-hidden aspect-[9/16] w-full max-w-[280px] md:max-w-md border-2 border-zinc-700 shadow-2xl touch-none"
        {...touchHandlers}
        onTouchStart={(e) => { handleTap(e); touchHandlers.onTouchStart(e); }}
      >
        {generating ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : previewImage ? (
          <>
            <img src={previewImage} alt="Preview" className="w-full h-full object-cover pointer-events-none" />
            {activeLayerId && (
              <div className="absolute inset-0 pointer-events-none">
                {layers.filter(l => l.visible).map(layer => (
                  <div
                    key={layer.id}
                    className={`absolute border-2 rounded-lg transition-all ${
                      layer.id === activeLayerId ? 'border-pink-500' : 'border-transparent'
                    }`}
                    style={{
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      width: '60px',
                      height: '60px',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>
            )}
            {layers.length > 0 && !activeLayerId && /mobile/i.test(navigator.userAgent) && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-purple-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-white text-xs font-semibold shadow-lg animate-pulse">
                Tap a layer to edit
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
            Generating...
          </div>
        )}

        
        {gestureInfo && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-white font-bold shadow-lg animate-in fade-in zoom-in duration-200">
            {gestureInfo.type === 'scale' && <ZoomIn className="w-4 h-4" />}
            {gestureInfo.type === 'rotate' && <RotateCw className="w-4 h-4" />}
            {gestureInfo.type === 'move' && <Move className="w-4 h-4" />}
            {gestureInfo.type === 'fill' && <Maximize2 className="w-4 h-4" />}
            <span>{gestureInfo.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
