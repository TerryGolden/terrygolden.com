import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LayerFilter } from '@/types/layerFilters';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

interface FiltersPanelProps {
  filters: LayerFilter[];
  onFiltersChange: (filters: LayerFilter[]) => void;
}

export function FiltersPanel({ filters, onFiltersChange }: FiltersPanelProps) {
  const addFilter = (type: LayerFilter['type']) => {
    const newFilter: LayerFilter = {
      id: Date.now().toString(),
      type,
      enabled: true,
      ...(type === 'gaussianBlur' && { radius: 10 }),
      ...(type === 'motionBlur' && { distance: 20, angle: 0 }),
      ...(type === 'noise' && { amount: 50, monochrome: false }),
      ...(type === 'sharpen' && { amount: 50 }),
      ...(type === 'colorCorrection' && { brightness: 0, contrast: 0, saturation: 0, hue: 0 }),
    } as LayerFilter;
    onFiltersChange([...filters, newFilter]);
  };

  const updateFilter = (id: string, updates: Partial<LayerFilter>) => {
    onFiltersChange(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  };

  const moveFilter = (id: string, direction: 'up' | 'down') => {
    const index = filters.findIndex(f => f.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === filters.length - 1)) return;
    const newFilters = [...filters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFilters[index], newFilters[targetIndex]] = [newFilters[targetIndex], newFilters[index]];
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-bold text-purple-300 whitespace-nowrap">Add Filter:</Label>
        <Select onValueChange={(value) => addFilter(value as LayerFilter['type'])}>
          <SelectTrigger className="h-10 text-sm font-semibold flex-1 bg-zinc-700 border-zinc-600">
            <SelectValue placeholder="Choose filter..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gaussianBlur">Gaussian Blur</SelectItem>
            <SelectItem value="motionBlur">Motion Blur</SelectItem>
            <SelectItem value="noise">Noise</SelectItem>
            <SelectItem value="sharpen">Sharpen</SelectItem>
            <SelectItem value="colorCorrection">Color Correction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filters.length === 0 && (
        <div className="text-center py-6 text-gray-400">
          <p className="text-sm font-semibold">No filters applied</p>
          <p className="text-xs mt-1">Add a filter to get started</p>
        </div>
      )}

      {filters.map((filter) => (
        <div key={filter.id} className="border-2 border-purple-500/30 rounded-xl p-3 space-y-3 bg-purple-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch checked={filter.enabled} onCheckedChange={(enabled) => updateFilter(filter.id, { enabled })} />
              <span className="text-sm font-bold text-purple-200 capitalize">{filter.type.replace(/([A-Z])/g, ' $1')}</span>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => moveFilter(filter.id, 'up')} className="h-8 w-8 hover:bg-purple-600/30"><ChevronUp className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => moveFilter(filter.id, 'down')} className="h-8 w-8 hover:bg-purple-600/30"><ChevronDown className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => removeFilter(filter.id)} className="h-8 w-8 hover:bg-red-600/30 text-red-400"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>

          {filter.enabled && (
            <div className="space-y-3 pt-2 border-t border-purple-500/20">
              {filter.type === 'gaussianBlur' && (
                <div><Label className="text-xs font-semibold text-purple-300 mb-2 block">Radius: {filter.radius}px</Label><Slider value={[filter.radius]} onValueChange={([v]) => updateFilter(filter.id, { radius: v })} min={0} max={50} className="h-2" /></div>
              )}
              {filter.type === 'motionBlur' && (<>
                <div><Label className="text-xs font-semibold text-purple-300 mb-2 block">Distance: {filter.distance}px</Label><Slider value={[filter.distance]} onValueChange={([v]) => updateFilter(filter.id, { distance: v })} min={0} max={100} className="h-2" /></div>
                <div><Label className="text-xs font-semibold text-purple-300 mb-2 block">Angle: {filter.angle}°</Label><Slider value={[filter.angle]} onValueChange={([v]) => updateFilter(filter.id, { angle: v })} min={0} max={360} className="h-2" /></div>
              </>)}
              {filter.type === 'noise' && (<>
                <div><Label className="text-xs font-semibold text-purple-300 mb-2 block">Amount: {filter.amount}%</Label><Slider value={[filter.amount]} onValueChange={([v]) => updateFilter(filter.id, { amount: v })} min={0} max={100} className="h-2" /></div>
                <div className="flex items-center gap-3"><Switch checked={filter.monochrome} onCheckedChange={(v) => updateFilter(filter.id, { monochrome: v })} /><Label className="text-xs font-semibold text-purple-300">Monochrome</Label></div>
              </>)}
              {filter.type === 'sharpen' && (
                <div><Label className="text-xs font-semibold text-purple-300 mb-2 block">Amount: {filter.amount}%</Label><Slider value={[filter.amount]} onValueChange={([v]) => updateFilter(filter.id, { amount: v })} min={0} max={100} className="h-2" /></div>
              )}
              {filter.type === 'colorCorrection' && (<>
                <div><Label className="text-xs font-semibold text-purple-300 mb-2 block">Brightness: {filter.brightness}</Label><Slider value={[filter.brightness]} onValueChange={([v]) => updateFilter(filter.id, { brightness: v })} min={-100} max={100} className="h-2" /></div>
                <div><Label className="text-xs font-semibold text-purple-300 mb-2 block">Contrast: {filter.contrast}</Label><Slider value={[filter.contrast]} onValueChange={([v]) => updateFilter(filter.id, { contrast: v })} min={-100} max={100} className="h-2" /></div>
                <div><Label className="text-xs font-semibold text-purple-300 mb-2 block">Saturation: {filter.saturation}</Label><Slider value={[filter.saturation]} onValueChange={([v]) => updateFilter(filter.id, { saturation: v })} min={-100} max={100} className="h-2" /></div>
                <div><Label className="text-xs font-semibold text-purple-300 mb-2 block">Hue: {filter.hue}°</Label><Slider value={[filter.hue]} onValueChange={([v]) => updateFilter(filter.id, { hue: v })} min={-180} max={180} className="h-2" /></div>
              </>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
