import { useRef, useCallback } from 'react';
import { Layer } from '../lib/storyRenderer';

interface TouchGestureHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

interface UseTouchGesturesProps {
  layers: Layer[];
  activeLayerId: string | null;
  onUpdateLayer: (updates: Partial<Layer>) => void;
  onSelectLayer: (id: string) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export function useTouchGestures({
  layers,
  activeLayerId,
  onUpdateLayer,
  onSelectLayer,
  canvasWidth,
  canvasHeight
}: UseTouchGesturesProps): TouchGestureHandlers {
  const gestureState = useRef({
    initialDistance: 0,
    initialAngle: 0,
    initialScale: 100,
    initialRotation: 0,
    initialX: 0,
    initialY: 0,
    lastTouchX: 0,
    lastTouchY: 0,
    isGesturing: false
  });

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (touch1: Touch, touch2: Touch) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer) return;

    if (e.touches.length === 1) {
      gestureState.current.lastTouchX = e.touches[0].clientX;
      gestureState.current.lastTouchY = e.touches[0].clientY;
      gestureState.current.initialX = activeLayer.x;
      gestureState.current.initialY = activeLayer.y;
    } else if (e.touches.length === 2) {
      gestureState.current.isGesturing = true;
      gestureState.current.initialDistance = getDistance(e.touches[0], e.touches[1]);
      gestureState.current.initialAngle = getAngle(e.touches[0], e.touches[1]);
      gestureState.current.initialScale = activeLayer.scale;
      gestureState.current.initialRotation = activeLayer.rotation;
    }
  }, [layers, activeLayerId]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer) return;

    if (e.touches.length === 1 && !gestureState.current.isGesturing) {
      const deltaX = e.touches[0].clientX - gestureState.current.lastTouchX;
      const deltaY = e.touches[0].clientY - gestureState.current.lastTouchY;
      const moveScale = canvasWidth / window.innerWidth;
      
      onUpdateLayer({
        x: Math.max(0, Math.min(100, activeLayer.x + (deltaX * moveScale * 0.1))),
        y: Math.max(0, Math.min(100, activeLayer.y + (deltaY * moveScale * 0.1)))
      });
      
      gestureState.current.lastTouchX = e.touches[0].clientX;
      gestureState.current.lastTouchY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const currentAngle = getAngle(e.touches[0], e.touches[1]);
      
      const scaleChange = currentDistance / gestureState.current.initialDistance;
      const newScale = Math.max(10, Math.min(500, gestureState.current.initialScale * scaleChange));
      
      const angleDelta = currentAngle - gestureState.current.initialAngle;
      const newRotation = (gestureState.current.initialRotation + angleDelta) % 360;
      
      onUpdateLayer({
        scale: newScale,
        rotation: newRotation
      });
    }
  }, [layers, activeLayerId, onUpdateLayer, canvasWidth]);

  const onTouchEnd = useCallback(() => {
    gestureState.current.isGesturing = false;
  }, []);

  return { onTouchStart, onTouchMove, onTouchEnd };
}
