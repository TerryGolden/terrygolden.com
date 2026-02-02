import { useState, useEffect } from 'react';
import { Mail, Phone, Globe, Music, Radio, Send, User, Link, MessageCircle, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BookingContact {
  id: string;
  category: 'press' | 'radio' | 'demos' | 'booking';
  region?: string;
  title: string;
  company_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website_url?: string;
  demo_url?: string;
  gradient_color: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

const ContactPage = () => {
  const [contacts, setContacts] = useState<BookingContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('booking_contacts')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('display_order');

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  };

  const getGradientClass = (color: string) => {
    const colorMap: Record<string, string> = {
      purple: 'from-purple-900/20',
      cyan: 'from-cyan-900/20',
      pink: 'from-pink-900/20',
      blue: 'from-blue-900/20',
      green: 'from-green-900/20',
      orange: 'from-orange-900/20',
      red: 'from-red-900/20',
      yellow: 'from-yellow-900/20',
      indigo: 'from-indigo-900/20',
      teal: 'from-teal-900/20',
    };
    return colorMap[color] || 'from-gray-900/20';
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, typeof Mail> = {
      Mail,
      Radio,
      Music,
      Globe,
      Building2,
      User,
    };
    return iconMap[iconName] || Mail;
  };

  const pressContacts = contacts.filter(c => c.category === 'press');
  const radioContacts = contacts.filter(c => c.category === 'radio');
  const demosContacts = contacts.filter(c => c.category === 'demos');
  const bookingContacts = contacts.filter(c => c.category === 'booking');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#D4AF37] via-yellow-500 to-[#D4AF37] bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            For bookings, press inquiries, and collaborations
          </p>
        </div>

        {/* Press & Radio Section */}
        {(pressContacts.length > 0 || radioContacts.length > 0) && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {pressContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} getGradientClass={getGradientClass} getIconComponent={getIconComponent} />
            ))}
            {radioContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} getGradientClass={getGradientClass} getIconComponent={getIconComponent} />
            ))}
          </div>
        )}

        {/* Demos Section */}
        {demosContacts.map(contact => (
          <div key={contact.id} className={`bg-gradient-to-br ${getGradientClass(contact.gradient_color)} to-black border border-[#D4AF37]/20 rounded-2xl p-8 mb-12 hover:border-[#D4AF37]/40 transition-all`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold text-white">{contact.title}</h2>
            </div>
            {contact.demo_url ? (
              <a 
                href={contact.demo_url}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold rounded-full transition-all"
              >
                <Send className="w-5 h-5" />
                Submit Your Demo
              </a>
            ) : contact.email ? (
              <a 
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold rounded-full transition-all"
              >
                <Send className="w-5 h-5" />
                Submit Your Demo
              </a>
            ) : (
              <a 
                href="https://tstack.app/terrygolden" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold rounded-full transition-all"
              >
                <Send className="w-5 h-5" />
                Submit Your Demo
              </a>
            )}
          </div>
        ))}

        {/* Worldwide Bookings */}
        {bookingContacts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h2 className="text-3xl font-bold text-white">Worldwide Bookings</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookingContacts.map(contact => (
                <BookingCard key={contact.id} contact={contact} getGradientClass={getGradientClass} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

interface ContactCardProps {
  contact: BookingContact;
  getGradientClass: (color: string) => string;
  getIconComponent: (name: string) => typeof Mail;
}

const ContactCard = ({ contact, getGradientClass, getIconComponent }: ContactCardProps) => {
  const IconComponent = getIconComponent(contact.icon_name);
  
  return (
    <div className={`bg-gradient-to-br ${getGradientClass(contact.gradient_color)} to-black border border-[#D4AF37]/20 rounded-2xl p-8 hover:border-[#D4AF37]/40 transition-all`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-[#D4AF37]" />
        </div>
        <h2 className="text-2xl font-bold text-white">{contact.title}</h2>
      </div>
      <div className="space-y-4">
        <div>
          {contact.contact_name && (
            <p className="text-[#D4AF37] font-semibold mb-2">{contact.contact_name}</p>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-[#D4AF37] transition-colors block mb-2">
              {contact.email}
            </a>
          )}
          {contact.whatsapp && (
            <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" />
              WhatsApp: {contact.phone || contact.whatsapp}
            </a>
          )}
          {contact.phone && !contact.whatsapp && (
            <a href={`tel:${contact.phone}`} className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {contact.phone}
            </a>
          )}
          {contact.website_url && (
            <a href={contact.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2 mt-2">
              <Link className="w-4 h-4" />
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

interface BookingCardProps {
  contact: BookingContact;
  getGradientClass: (color: string) => string;
}

const BookingCard = ({ contact, getGradientClass }: BookingCardProps) => {
  return (
    <div className={`bg-gradient-to-br ${getGradientClass(contact.gradient_color)} to-black border border-[#D4AF37]/20 rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-all`}>
      <h3 className="text-xl font-bold text-[#D4AF37] mb-4">{contact.title}</h3>
      <div className="space-y-3">
        {contact.company_name && (
          <p className="text-white font-semibold">{contact.company_name}</p>
        )}
        {contact.contact_name && (
          <p className="text-gray-400">{contact.contact_name}</p>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-[#D4AF37] transition-colors block text-sm">
            {contact.email}
          </a>
        )}
        {contact.whatsapp && (
          <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            {contact.phone || contact.whatsapp}
          </a>
        )}
        {contact.phone && !contact.whatsapp && (
          <a href={`tel:${contact.phone}`} className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            {contact.phone}
          </a>
        )}
        {contact.website_url && (
          <a href={contact.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2 text-sm mt-2">
            <Link className="w-4 h-4" />
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
