import { Mail, Download, Trash2, CheckCircle, XCircle, Users } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  confirmed: boolean;
  source: string;
}

interface Props {
  subscribers: Subscriber[];
  stats: { total: number; confirmed: number; unconfirmed: number };
  onDelete: (id: string) => void;
  onExport: () => void;
}

const NewsletterSubscribers = ({ subscribers, stats, onDelete, onExport }: Props) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-[#D4AF37]" />
            <h3 className="text-white font-bold">Total</h3>
          </div>
          <p className="text-3xl font-black text-[#D4AF37]">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-white font-bold">Confirmed</h3>
          </div>
          <p className="text-3xl font-black text-green-400">{stats.confirmed}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-yellow-400" />
            <h3 className="text-white font-bold">Pending</h3>
          </div>
          <p className="text-3xl font-black text-yellow-400">{stats.unconfirmed}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Subscribers</h2>
        <button onClick={onExport} className="px-4 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#F4D03F] transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-black/40 border border-[#D4AF37]/20 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#D4AF37]/10 border-b border-[#D4AF37]/20">
            <tr>
              <th className="px-6 py-4 text-left text-[#D4AF37] font-bold">Email</th>
              <th className="px-6 py-4 text-left text-[#D4AF37] font-bold">Date</th>
              <th className="px-6 py-4 text-left text-[#D4AF37] font-bold">Status</th>
              <th className="px-6 py-4 text-right text-[#D4AF37] font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub.id} className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/5">
                <td className="px-6 py-4 text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {sub.email}
                </td>
                <td className="px-6 py-4 text-gray-400">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {sub.confirmed ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">Confirmed</span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onDelete(sub.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default NewsletterSubscribers;
