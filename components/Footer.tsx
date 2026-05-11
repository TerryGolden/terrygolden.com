import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import logoConfig from '../config/logoConfig';
import SocialMediaBar from './SocialMediaBar';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');



  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { data, error: subError } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email }
      });

      if (subError) throw subError;

      if (data.error) {
        setError(data.error);
      } else {
        setMessage(data.message);
        setEmail('');
      }
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black border-t border-[#D4AF37]/20 py-12 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img 
              src={logoConfig.light} 
              alt="Terry Golden" 
              className="h-16 w-auto object-contain mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Electronic music producer & DJ. Creator of Art of Rave radio show.
            </p>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/releases" className="block text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">Latest Releases</Link>
              <Link to="/art-of-rave" className="block text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">Art of Rave</Link>
              <Link to="/press" className="block text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">Press & Media</Link>
            </div>

          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 bg-white/5 border border-[#D4AF37]/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
              </button>
              {message && <p className="text-green-400 text-xs">{message}</p>}
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#D4AF37]/10">
          <h4 className="text-[#D4AF37] font-bold mb-6 uppercase tracking-wider text-center md:text-left">Connect</h4>
          <SocialMediaBar />
        </div>

        <div className="mt-8 pt-8 border-t border-[#D4AF37]/10 text-center text-gray-500 text-sm">
          © 2025 Terry Golden. All rights reserved.
        </div>
      </div>
    </footer>

  );
};

export default Footer;
