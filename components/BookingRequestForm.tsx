import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Calendar, MapPin, User, Mail, Phone, Building2, Music, DollarSign, MessageSquare, ArrowLeft, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BookingRequestFormProps {
  eventId?: string;
  eventTitle?: string;
  eventDate?: string;
  eventCountry?: string;
  onBack?: () => void;
}

const BookingRequestForm = ({ eventId, eventTitle, eventDate, eventCountry, onBack }: BookingRequestFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    eventDate: eventDate || '',
    eventType: '',
    venue: '',
    country: eventCountry || '',
    city: '',
    budget: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const eventTypes = [
    'Festival',
    'Club Night',
    'Private Event',
    'Corporate Event',
    'Music Conference',
    'Radio Show',
    'Livestream',
    'Other',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSending(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-booking-request', {
        body: {
          ...formData,
          eventId,
          eventTitle,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setSent(true);
    } catch (err: any) {
      console.error('Booking request error:', err);
      setError('Failed to send your request. Please try emailing booking@terrygolden.com directly.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Request Sent!</h2>
            <p className="text-gray-400 text-lg mb-2">
              Thank you for your booking inquiry.
            </p>
            <p className="text-gray-500 mb-8">
              We'll get back to you at <span className="text-[#D4AF37]">{formData.email}</span> as soon as possible.
            </p>
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#e6c34a] text-black rounded-lg font-semibold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Events
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
            <Music className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">Booking Request</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Book <span className="text-[#D4AF37]">Terry Golden</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Fill out the form below and we'll get back to you with availability and details.
          </p>
          {eventTitle && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm">Inquiring about: <strong className="text-white">{eventTitle}</strong></span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#D4AF37]" />
              Contact Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Company / Organization</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              Event Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                >
                  <option value="">Select type...</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Event Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Venue</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Venue name"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Budget Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g. $5,000 - $10,000"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              Your Message
            </h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell us about your event, expected attendance, and any special requirements..."
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all text-sm resize-none"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#e6c34a] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all duration-300 uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Booking Request
                </>
              )}
            </button>
            <p className="text-gray-500 text-xs text-center sm:text-left">
              Or email directly: <a href="mailto:booking@terrygolden.com" className="text-[#D4AF37] hover:underline">booking@terrygolden.com</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingRequestForm;
