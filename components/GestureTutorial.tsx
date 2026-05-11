import { useState, useEffect } from 'react';
import { X, Move, RotateCw, ZoomIn, Hand, Maximize2 } from 'lucide-react';

export default function GestureTutorial() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenGestureTutorial');
    if (!hasSeenTutorial && /mobile/i.test(navigator.userAgent)) {
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenGestureTutorial', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-6 max-w-sm border-2 border-pink-500/50 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Hand className="w-6 h-6" />
            Touch Gestures
          </h3>
          <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-black/30 rounded-xl p-3">
            <Move className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-white text-sm">Drag to Move</p>
              <p className="text-xs text-gray-300">Use one finger to reposition layers</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-black/30 rounded-xl p-3">
            <ZoomIn className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-white text-sm">Pinch to Scale</p>
              <p className="text-xs text-gray-300">Use two fingers to resize layers</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-black/30 rounded-xl p-3">
            <RotateCw className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-white text-sm">Rotate</p>
              <p className="text-xs text-gray-300">Twist two fingers to rotate layers</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-black/30 rounded-xl p-3 border-2 border-yellow-500/50">
            <Maximize2 className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-white text-sm">Double-Tap to Fill</p>
              <p className="text-xs text-gray-300">Quickly tap twice to auto-fill the canvas</p>
            </div>
          </div>
        </div>
        
        <button onClick={handleClose} className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all active:scale-95 shadow-lg">
          Got it!
        </button>
      </div>
    </div>
  );
}
