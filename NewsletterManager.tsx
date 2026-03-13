import { useState, useEffect } from 'react';
import { Users, Send, Loader2, Palette, Workflow } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import NewsletterSubscribers from './NewsletterSubscribers';
import CampaignsList from './CampaignsList';
import CampaignComposer from './CampaignComposer';
import { EmailTemplateBuilder } from './EmailTemplateBuilder';
import WorkflowBuilder from './WorkflowBuilder';
import WorkflowAnalytics from './WorkflowAnalytics';



interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  confirmed: boolean;
  source: string;
}

interface Campaign {
  id: string;
  subject: string;
  status: string;
  sent_at: string;
  total_recipients: number;
  total_sent: number;
  total_opens: number;
  total_clicks: number;
}

const NewsletterManager = () => {
  const [view, setView] = useState<'subscribers' | 'campaigns' | 'builder' | 'workflows'>('subscribers');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);


  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, unconfirmed: 0 });
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadSubscribers(), loadCampaigns()]);
    setLoading(false);
  };

  const loadSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .is('unsubscribed_at', null)
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
      
      const confirmed = data?.filter(s => s.confirmed).length || 0;
      setStats({
        total: data?.length || 0,
        confirmed,
        unconfirmed: (data?.length || 0) - confirmed
      });
    } catch (error) {
      console.error('Error loading subscribers:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subscriber?')) return;
    try {
      await supabase.from('newsletter_subscribers').delete().eq('id', id);
      loadSubscribers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Date', 'Confirmed', 'Source'],
      ...subscribers.map(s => [s.email, new Date(s.subscribed_at).toLocaleDateString(), s.confirmed ? 'Yes' : 'No', s.source])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-black/40 border border-[#D4AF37]/20 rounded-lg p-1">
        <button onClick={() => setView('subscribers')} className={`flex-1 px-4 py-2 rounded font-bold transition-all ${view === 'subscribers' ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black' : 'text-gray-400 hover:text-white'}`}>
          <Users className="w-4 h-4 inline mr-2" />Subscribers
        </button>
        <button onClick={() => setView('campaigns')} className={`flex-1 px-4 py-2 rounded font-bold transition-all ${view === 'campaigns' ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black' : 'text-gray-400 hover:text-white'}`}>
          <Send className="w-4 h-4 inline mr-2" />Campaigns
        </button>
        <button onClick={() => setView('workflows')} className={`flex-1 px-4 py-2 rounded font-bold transition-all ${view === 'workflows' ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black' : 'text-gray-400 hover:text-white'}`}>
          <Workflow className="w-4 h-4 inline mr-2" />Workflows
        </button>
        <button onClick={() => setView('builder')} className={`flex-1 px-4 py-2 rounded font-bold transition-all ${view === 'builder' ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black' : 'text-gray-400 hover:text-white'}`}>
          <Palette className="w-4 h-4 inline mr-2" />Template Builder
        </button>
      </div>


      {view === 'subscribers' && (
        <NewsletterSubscribers subscribers={subscribers} stats={stats} onDelete={handleDelete} onExport={exportToCSV} />
      )}
      
      {view === 'campaigns' && (
        <CampaignsList campaigns={campaigns} onNewCampaign={() => setShowComposer(true)} />
      )}
      
      {view === 'builder' && (
        <EmailTemplateBuilder />
      )}

      {view === 'workflows' && (
        <WorkflowBuilder />
      )}


      {showComposer && <CampaignComposer onClose={() => setShowComposer(false)} onSuccess={() => { loadCampaigns(); setShowComposer(false); }} />}
    </div>
  );

};

export default NewsletterManager;
