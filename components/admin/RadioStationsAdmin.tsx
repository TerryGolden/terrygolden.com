import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Radio, Globe, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { RadioStation } from '@/types/radioStation';
import { useToast } from '@/hooks/use-toast';
import StationForm from './StationForm';

const RadioStationsAdmin = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchStations(); }, []);

  const fetchStations = async () => {
    const { data } = await supabase.from('radio_stations').select('*').order('name');
    if (data) setStations(data);
    setLoading(false);
  };

  const deleteStation = async (id: string) => {
    if (!confirm('Delete this station?')) return;
    await supabase.from('radio_stations').delete().eq('id', id);
    toast({ title: 'Station deleted' });
    fetchStations();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('radio_stations').update({ active: !active }).eq('id', id);
    fetchStations();
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Globe className="w-6 h-6" /> Radio Stations ({stations.length})</h2>
        <Button onClick={() => { setShowForm(true); setEditingId(null); }}><Plus className="w-4 h-4 mr-2" /> Add Station</Button>
      </div>
      {showForm && <StationForm station={editingId ? stations.find(s => s.id === editingId) : undefined} onClose={() => { setShowForm(false); setEditingId(null); }} onSave={() => { setShowForm(false); setEditingId(null); fetchStations(); }} />}
      <div className="grid gap-3">
        {stations.map(s => (
          <div key={s.id} className={`flex items-center justify-between p-4 rounded-lg border ${s.active ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-900/50 border-zinc-800 opacity-60'}`}>
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-purple-400" />
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-400">{s.schedule} at {s.time} • {s.country} ({s.timezone})</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => toggleActive(s.id, s.active)} title={s.active ? 'Deactivate' : 'Activate'}>{s.active ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}</Button>
              <Button variant="ghost" size="sm" onClick={() => { setEditingId(s.id); setShowForm(true); }}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => deleteStation(s.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioStationsAdmin;
