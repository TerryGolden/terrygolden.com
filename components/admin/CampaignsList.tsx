import { Send, BarChart3, TrendingUp, MousePointer, Calendar } from 'lucide-react';

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

interface Props {
  campaigns: Campaign[];
  onNewCampaign: () => void;
}

const CampaignsList = ({ campaigns, onNewCampaign }: Props) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-500/20 text-green-400';
      case 'sending': return 'bg-blue-500/20 text-blue-400';
      case 'scheduled': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Email Campaigns</h2>
        <button onClick={onNewCampaign} className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all flex items-center gap-2">
          <Send className="w-5 h-5" />
          New Campaign
        </button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-gradient-to-br from-black/60 to-black/40 border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/40 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{campaign.subject}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              {campaign.sent_at && (
                <div className="text-right text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {new Date(campaign.sent_at).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#D4AF37]/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs text-gray-400">Sent</span>
                </div>
                <p className="text-2xl font-black text-[#D4AF37]">{campaign.total_sent || 0}</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Opens</span>
                </div>
                <p className="text-2xl font-black text-blue-400">{campaign.total_opens || 0}</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MousePointer className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Clicks</span>
                </div>
                <p className="text-2xl font-black text-green-400">{campaign.total_clicks || 0}</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Rate</span>
                </div>
                <p className="text-2xl font-black text-purple-400">
                  {campaign.total_sent > 0 ? Math.round((campaign.total_opens / campaign.total_sent) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Send className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">No campaigns yet</p>
          <p className="text-sm">Create your first email campaign to get started</p>
        </div>
      )}
    </>
  );
};

export default CampaignsList;
