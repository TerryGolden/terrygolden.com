import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { RadioStation } from '@/types/radioStation';
import { useToast } from '@/hooks/use-toast';

interface Props {
  station?: RadioStation;
  onClose: () => void;
  onSave: () => void;
}

const StationForm = ({ station, onClose, onSave }: Props) => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: station?.name || '',
    schedule: station?.schedule || 'Every Saturday',
    time: station?.time || '20:00',
    repeat: station?.repeat || 'Weekly',
    country: station?.country || '',
    timezone: station?.timezone || 'GMT+00:00',
    url: station?.url || '',
    latitude: station?.latitude?.toString() || '',
    longitude: station?.longitude?.toString() || '',
    active: station?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) };
    
    if (station?.id) {
      await supabase.from('radio_stations').update(data).eq('id', station.id);
      toast({ title: 'Station updated' });
    } else {
      await supabase.from('radio_stations').insert(data);
      toast({ title: 'Station added' });
    }
    setSaving(false);
    onSave();
  };

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{station ? 'Edit Station' : 'Add New Station'}</h3>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-400">Station Name *</label><Input value={form.name} onChange={e => update('name', e.target.value)} required /></div>
          <div><label className="text-sm text-gray-400">Country *</label><Input value={form.country} onChange={e => update('country', e.target.value)} required /></div>
          <div><label className="text-sm text-gray-400">Schedule</label><Input value={form.schedule} onChange={e => update('schedule', e.target.value)} placeholder="Every Saturday" /></div>
          <div><label className="text-sm text-gray-400">Time</label><Input value={form.time} onChange={e => update('time', e.target.value)} placeholder="20:00" /></div>
          <div><label className="text-sm text-gray-400">Repeat</label><Input value={form.repeat} onChange={e => update('repeat', e.target.value)} placeholder="Weekly" /></div>
          <div><label className="text-sm text-gray-400">Timezone</label><Input value={form.timezone} onChange={e => update('timezone', e.target.value)} placeholder="GMT+00:00" /></div>
          <div><label className="text-sm text-gray-400">Latitude *</label><Input type="number" step="any" value={form.latitude} onChange={e => update('latitude', e.target.value)} required /></div>
          <div><label className="text-sm text-gray-400">Longitude *</label><Input type="number" step="any" value={form.longitude} onChange={e => update('longitude', e.target.value)} required /></div>
        </div>
        <div><label className="text-sm text-gray-400">Website URL</label><Input value={form.url} onChange={e => update('url', e.target.value)} placeholder="https://" /></div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={e => update('active', e.target.checked)} className="w-4 h-4" />
          <label className="text-sm">Active (visible on map)</label>
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}{station ? 'Update' : 'Add'} Station</Button>
        </div>
      </form>
    </div>
  );
};

export default StationForm;
