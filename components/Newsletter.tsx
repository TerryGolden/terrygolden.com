import { useState } from 'react';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call newsletter-subscribe edge function
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email }
      });

      if (error) throw error;

      // Trigger welcome workflow for new subscriber
      await supabase.functions.invoke('trigger-workflow', {
        body: { 
          subscriberEmail: email,
          triggerType: 'subscriber_added'
        }
      });

      setSubscribed(true);
      toast.success('Successfully subscribed! Check your email for confirmation.');
      setTimeout(() => { setSubscribed(false); setEmail(''); }, 3000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="py-20 bg-gradient-to-r from-[#D4AF37]/20 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
          Stay in the <span className="text-[#D4AF37]">Loop</span>
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">Get exclusive updates, new releases, and behind-the-scenes content delivered straight to your inbox.</p>
        
        {subscribed ? (
          <div className="text-[#D4AF37] font-semibold text-lg">Thanks for subscribing!</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-6 py-3 bg-black/50 border border-[#D4AF37]/30 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]" disabled={loading} />
            <button type="submit" disabled={loading} className="px-8 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black rounded-full font-bold transition-colors uppercase tracking-wider disabled:opacity-50">
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

        )}
      </div>
    </section>
  );
};

export default Newsletter;
