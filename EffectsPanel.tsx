import React from 'react';
import { LayerEffect } from '../../types/layerEffects';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

interface EffectsPanelProps {
  effects: LayerEffect[];
  onUpdateEffects: (effects: LayerEffect[]) => void;
}

export const EffectsPanel: React.FC<EffectsPanelProps> = ({ effects, onUpdateEffects }) => {
  const addEffect = (type: string) => {
    let newEffect: LayerEffect;
    
    switch (type) {
      case 'dropShadow':
        newEffect = { type: 'dropShadow', enabled: true, offsetX: 10, offsetY: 10, blur: 15, color: '#000000', opacity: 75 };
        break;
      case 'innerShadow':
        newEffect = { type: 'innerShadow', enabled: true, offsetX: 5, offsetY: 5, blur: 10, color: '#000000', opacity: 50 };
        break;
      case 'outerGlow':
        newEffect = { type: 'outerGlow', enabled: true, blur: 20, color: '#FFFFFF', opacity: 75, spread: 5 };
        break;
      case 'innerGlow':
        newEffect = { type: 'innerGlow', enabled: true, blur: 15, color: '#FFFFFF', opacity: 50, spread: 3 };
        break;
      case 'bevel':
        newEffect = { type: 'bevel', enabled: true, depth: 10, size: 5, soften: 3, angle: 135, altitude: 30, highlightColor: '#FFFFFF', shadowColor: '#000000', highlightOpacity: 75, shadowOpacity: 75 };
        break;
      case 'gradientOverlay':
        newEffect = { type: 'gradientOverlay', enabled: true, angle: 90, colors: ['#FF0080', '#7928CA'], opacity: 75, blendMode: 'overlay' };
        break;
      default:
        return;
    }
    
    onUpdateEffects([...effects, newEffect]);
  };

  const removeEffect = (index: number) => {
    onUpdateEffects(effects.filter((_, i) => i !== index));
  };

  const toggleEffect = (index: number) => {
    const updated = [...effects];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    onUpdateEffects(updated);
  };

  const moveEffect = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= effects.length) return;
    
    const updated = [...effects];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onUpdateEffects(updated);
  };

  const updateEffect = (index: number, updates: Partial<LayerEffect>) => {
    const updated = [...effects];
    updated[index] = { ...updated[index], ...updates } as LayerEffect;
    onUpdateEffects(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-bold text-pink-300 whitespace-nowrap">Add Effect:</Label>
        <Select onValueChange={addEffect}>
          <SelectTrigger className="h-10 text-sm font-semibold flex-1 bg-zinc-700 border-zinc-600">
            <SelectValue placeholder="Choose effect..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dropShadow">Drop Shadow</SelectItem>
            <SelectItem value="innerShadow">Inner Shadow</SelectItem>
            <SelectItem value="outerGlow">Outer Glow</SelectItem>
            <SelectItem value="innerGlow">Inner Glow</SelectItem>
            <SelectItem value="bevel">Bevel</SelectItem>
            <SelectItem value="gradientOverlay">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {effects.length === 0 && (
        <div className="text-center py-6 text-gray-400">
          <p className="text-sm font-semibold">No effects applied</p>
          <p className="text-xs mt-1">Add an effect to get started</p>
        </div>
      )}

      {effects.map((effect, index) => (
        <EffectItem
          key={index}
          effect={effect}
          index={index}
          isFirst={index === 0}
          isLast={index === effects.length - 1}
          onToggle={() => toggleEffect(index)}
          onRemove={() => removeEffect(index)}
          onMoveUp={() => moveEffect(index, 'up')}
          onMoveDown={() => moveEffect(index, 'down')}
          onUpdate={(updates) => updateEffect(index, updates)}
        />
      ))}
    </div>
  );
};

interface EffectItemProps {
  effect: LayerEffect;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdate: (updates: Partial<LayerEffect>) => void;
}

const EffectItem: React.FC<EffectItemProps> = ({
  effect,
  isFirst,
  isLast,
  onToggle,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdate
}) => {
  const getEffectName = () => {
    switch (effect.type) {
      case 'dropShadow': return 'Drop Shadow';
      case 'innerShadow': return 'Inner Shadow';
      case 'outerGlow': return 'Outer Glow';
      case 'innerGlow': return 'Inner Glow';
      case 'bevel': return 'Bevel';
      case 'gradientOverlay': return 'Gradient';
    }
  };

  return (
    <div className={`border-2 border-pink-500/30 rounded-xl p-3 space-y-3 bg-pink-900/20 ${!effect.enabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch checked={effect.enabled} onCheckedChange={onToggle} />
          <span className="text-sm font-bold text-pink-200">{getEffectName()}</span>
        </div>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={onMoveUp} disabled={isFirst} className="h-8 w-8 hover:bg-pink-600/30">
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onMoveDown} disabled={isLast} className="h-8 w-8 hover:bg-pink-600/30">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onRemove} className="h-8 w-8 hover:bg-red-600/30 text-red-400">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {effect.enabled && (
        <div className="space-y-3 pt-2 border-t border-pink-500/20">
          {(effect.type === 'dropShadow' || effect.type === 'innerShadow') && (
            <>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Offset X: {effect.offsetX}px</Label>
                <Slider value={[effect.offsetX]} onValueChange={([v]) => onUpdate({ offsetX: v })} min={-50} max={50} step={1} className="h-2" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Offset Y: {effect.offsetY}px</Label>
                <Slider value={[effect.offsetY]} onValueChange={([v]) => onUpdate({ offsetY: v })} min={-50} max={50} step={1} className="h-2" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Blur: {effect.blur}px</Label>
                <Slider value={[effect.blur]} onValueChange={([v]) => onUpdate({ blur: v })} min={0} max={50} step={1} className="h-2" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Color</Label>
                <input type="color" value={effect.color} onChange={(e) => onUpdate({ color: e.target.value })} className="w-full h-10 rounded-lg border-2 border-pink-500/30" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Opacity: {effect.opacity}%</Label>
                <Slider value={[effect.opacity]} onValueChange={([v]) => onUpdate({ opacity: v })} min={0} max={100} step={1} className="h-2" />
              </div>
            </>
          )}

          {(effect.type === 'outerGlow' || effect.type === 'innerGlow') && (
            <>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Blur: {effect.blur}px</Label>
                <Slider value={[effect.blur]} onValueChange={([v]) => onUpdate({ blur: v })} min={0} max={50} step={1} className="h-2" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Spread: {effect.spread}px</Label>
                <Slider value={[effect.spread]} onValueChange={([v]) => onUpdate({ spread: v })} min={0} max={20} step={1} className="h-2" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Color</Label>
                <input type="color" value={effect.color} onChange={(e) => onUpdate({ color: e.target.value })} className="w-full h-10 rounded-lg border-2 border-pink-500/30" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Opacity: {effect.opacity}%</Label>
                <Slider value={[effect.opacity]} onValueChange={([v]) => onUpdate({ opacity: v })} min={0} max={100} step={1} className="h-2" />
              </div>
            </>
          )}

          {effect.type === 'gradientOverlay' && (
            <>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Angle: {effect.angle}°</Label>
                <Slider value={[effect.angle]} onValueChange={([v]) => onUpdate({ angle: v })} min={0} max={360} step={1} className="h-2" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-pink-300 mb-2 block">Opacity: {effect.opacity}%</Label>
                <Slider value={[effect.opacity]} onValueChange={([v]) => onUpdate({ opacity: v })} min={0} max={100} step={1} className="h-2" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
