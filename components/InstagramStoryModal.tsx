import { useState, useEffect, useRef } from 'react';
import { X, Instagram, Download, Eye, Loader2, Sparkles, Upload, Image as ImageIcon, Layers, Trash2, ChevronUp, ChevronDown, EyeOff, Plus, Type, Share2, Sliders, Wand2, Undo2, Redo2 } from 'lucide-react';

import { storyTemplates, StoryTemplate } from '../data/instagramTemplates';
import { renderStoryToCanvas, Layer, ImageLayer, TextLayer } from '../lib/storyRenderer';
import { POPULAR_FONTS, TEXT_PRESETS } from '../data/textPresets';
import ImageLayerControls from './story/ImageLayerControls';
import TextLayerControls from './story/TextLayerControls';
import LayersList from './story/LayersList';
import InteractiveCanvas from './story/InteractiveCanvas';
import ExportPanel from './story/ExportPanel';
import TimelinePreview from './story/TimelinePreview';
import { useHistory } from '../hooks/useHistory';





interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

export default function InstagramStoryModal({ isOpen, onClose, title, description }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate>(storyTemplates[0]);
  const [generating, setGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  
  // Use history hook for undo/redo
  const { state: layers, setState: setLayers, undo, redo, canUndo, canRedo } = useHistory<Layer[]>([]);

  const activeLayer = layers.find(l => l.id === activeLayerId);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, undo, redo]);

  useEffect(() => {
    if (isOpen) generatePreview();
  }, [isOpen, selectedTemplate, title, description, layers]);


  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newLayer: ImageLayer = {
          type: 'image',
          id: Date.now().toString(),
          name: `Image ${layers.filter(l => l.type === 'image').length + 1}`,
          file: file,
          url: event.target?.result as string,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          filter: 'none',
          visible: true,
          blendMode: 'source-over',
          opacity: 100,
          effects: [],
          filters: []
        };
        setLayers([...layers, newLayer]);
        setActiveLayerId(newLayer.id);
        setShowControls(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const triggerImageUpload = () => {
    uploadInputRef.current?.click();
  };


  const addTextLayer = () => {
    const newLayer: TextLayer = {
      type: 'text',
      id: Date.now().toString(),
      name: `Text ${layers.filter(l => l.type === 'text').length + 1}`,
      text: 'Your Text Here',
      fontFamily: 'Arial Black',
      fontSize: 80,
      color: '#FFFFFF',
      alignment: 'center',
      strokeColor: '#000000',
      strokeWidth: 4,
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      x: 50,
      y: 50,
      scale: 100,
      rotation: 0,
      visible: true,
      blendMode: 'source-over',
      opacity: 100,
      effects: [],
      filters: []
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
    setShowControls(true);
  };

  const updateLayer = (updates: Partial<Layer>) => {
    if (!activeLayerId) return;
    setLayers(layers.map(l => l.id === activeLayerId ? { ...l, ...updates } : l));
  };

  const deleteLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
    if (activeLayerId === id) setActiveLayerId(layers[0]?.id || null);
  };

  const toggleVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    const idx = layers.findIndex(l => l.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === layers.length - 1)) return;
    const newLayers = [...layers];
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newLayers[idx], newLayers[newIdx]] = [newLayers[newIdx], newLayers[idx]];
    setLayers(newLayers);
  };

  const generatePreview = async (width = 1080, height = 1920) => {
    setGenerating(true);
    setTimeout(async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
      await renderStoryToCanvas(canvas, selectedTemplate, title, description, layers);
      setPreviewImage(canvas.toDataURL());
      setGenerating(false);
    }, 300);
  };

  const handleExport = async (settings: { width: number; height: number; format: string; quality: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = settings.width;
    canvas.height = settings.height;
    await renderStoryToCanvas(canvas, selectedTemplate, title, description, layers);
    
    const mimeType = `image/${settings.format}`;
    const quality = settings.quality / 100;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    if (navigator.share && /mobile/i.test(navigator.userAgent)) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `story-${Date.now()}.${settings.format}`, { type: mimeType });
        await navigator.share({ files: [file], title: 'Instagram Story' });
        return;
      } catch (err) {
        console.log('Share failed, falling back to download');
      }
    }
    
    const link = document.createElement('a');
    link.download = `story-${Date.now()}.${settings.format}`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden">
      <div className="bg-gradient-to-br from-zinc-900 to-black w-full h-full md:rounded-3xl md:max-w-7xl md:h-[95vh] md:my-8 border-0 md:border-2 border-purple-500/30 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-purple-500/20 bg-zinc-900/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
              <Instagram className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Story Creator</h2>
              <p className="text-xs text-gray-400 hidden md:block">{title}</p>
            </div>
          </div>
          
          {/* Undo/Redo Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 mr-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`p-2 rounded-lg transition-all ${canUndo ? 'hover:bg-zinc-800 text-purple-400 hover:text-purple-300' : 'text-zinc-600 cursor-not-allowed'}`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-5 h-5" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`p-2 rounded-lg transition-all ${canRedo ? 'hover:bg-zinc-800 text-purple-400 hover:text-purple-300' : 'text-zinc-600 cursor-not-allowed'}`}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-5 h-5" />
              </button>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition">
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Preview - Top on mobile, Right on desktop */}
          <div className="md:order-2 md:w-1/2 lg:w-2/5 p-4 bg-zinc-900/50 flex flex-col items-center justify-center">
            <InteractiveCanvas
              previewImage={previewImage}
              layers={layers}
              activeLayerId={activeLayerId}
              onUpdateLayer={updateLayer}
              onSelectLayer={(id) => { setActiveLayerId(id); setShowControls(true); }}
              generating={generating}
            />
          </div>

          {/* Controls - Bottom on mobile, Left on desktop */}
          <div className="md:order-1 md:w-1/2 lg:w-3/5 overflow-y-auto pb-20 md:pb-4">
            <div className="p-4 space-y-4">
              {/* Template Selection - Collapsed on mobile */}
              <details className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/30 overflow-hidden">
                <summary className="p-4 cursor-pointer flex items-center gap-2 font-semibold text-purple-300">
                  <Sparkles className="w-4 h-4" />
                  Templates
                </summary>
                <div className="p-4 pt-0 grid grid-cols-3 gap-2">
                  {storyTemplates.map(template => (
                    <button key={template.id} onClick={() => setSelectedTemplate(template)} className={`p-3 rounded-xl border-2 transition-all text-left ${selectedTemplate.id === template.id ? 'border-pink-500 bg-gradient-to-br from-pink-500/20 to-purple-500/20' : 'border-zinc-700'}`}>
                      <div className="text-2xl mb-1">{template.thumbnail}</div>
                      <div className="text-[10px] font-semibold text-white">{template.name}</div>
                    </button>
                  ))}
                </div>
              </details>

              <LayersList
                layers={layers}
                activeLayerId={activeLayerId}
                onSelectLayer={(id) => { setActiveLayerId(id); setShowControls(true); }}
                onToggleVisibility={toggleVisibility}
                onMoveLayer={moveLayer}
                onDeleteLayer={deleteLayer}
                onAddImageLayer={triggerImageUpload}
              />

              <TimelinePreview layers={layers} />





              {showControls && activeLayer && activeLayer.type === 'image' && (
                <ImageLayerControls layer={activeLayer} onUpdate={updateLayer} />
              )}

              {showControls && activeLayer && activeLayer.type === 'text' && (
                <TextLayerControls layer={activeLayer} onUpdate={updateLayer} fonts={POPULAR_FONTS} presets={TEXT_PRESETS} />
              )}

              <ExportPanel onExport={handleExport} disabled={!previewImage} />
            </div>
          </div>
        </div>


        {/* Mobile Bottom Action Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 via-zinc-900 to-zinc-900/95 border-t-2 border-purple-500/30 backdrop-blur-lg p-3 shadow-2xl z-50">
          <div className="flex items-center justify-around gap-2 max-w-2xl mx-auto">
            {/* Mobile Undo/Redo */}
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`py-3 px-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 ${canUndo ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`py-3 px-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 ${canRedo ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
            >
              <Redo2 className="w-5 h-5" />
            </button>
            
            <button onClick={triggerImageUpload} className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </button>

            <button onClick={addTextLayer} className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
              <Type className="w-5 h-5" />
              <span>Text</span>
            </button>
            {activeLayer && (
              <button onClick={() => setShowControls(!showControls)} className={`py-3 px-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 ${showControls ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-zinc-700'}`}>
                <Sliders className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Hidden file input for image uploads */}
        <input 
          ref={uploadInputRef} 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden" 
        />
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
