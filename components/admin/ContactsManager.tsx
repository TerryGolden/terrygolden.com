import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, GripVertical, Mail, Phone, Globe, Radio, Music, Building2, User, Link, MessageCircle } from 'lucide-react';
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

interface Props {
  onBack: () => void;
}

const CATEGORY_OPTIONS = [
  { value: 'press', label: 'Press & PR' },
  { value: 'radio', label: 'Radio' },
  { value: 'demos', label: 'Demos' },
  { value: 'booking', label: 'Worldwide Booking' },
];

const REGION_OPTIONS = [
  { value: 'europe', label: 'Europe & Middle East' },
  { value: 'americas', label: 'North & South America' },
  { value: 'asia', label: 'Asia & Pacific' },
  { value: 'africa', label: 'Africa' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'rest', label: 'Rest of The World' },
];

const COLOR_OPTIONS = [
  { value: 'purple', label: 'Purple', class: 'from-purple-900/20' },
  { value: 'cyan', label: 'Cyan', class: 'from-cyan-900/20' },
  { value: 'pink', label: 'Pink', class: 'from-pink-900/20' },
  { value: 'blue', label: 'Blue', class: 'from-blue-900/20' },
  { value: 'green', label: 'Green', class: 'from-green-900/20' },
  { value: 'orange', label: 'Orange', class: 'from-orange-900/20' },
  { value: 'red', label: 'Red', class: 'from-red-900/20' },
  { value: 'yellow', label: 'Yellow', class: 'from-yellow-900/20' },
  { value: 'indigo', label: 'Indigo', class: 'from-indigo-900/20' },
  { value: 'teal', label: 'Teal', class: 'from-teal-900/20' },
];

const ICON_OPTIONS = [
  { value: 'Mail', label: 'Mail', icon: Mail },
  { value: 'Radio', label: 'Radio', icon: Radio },
  { value: 'Music', label: 'Music', icon: Music },
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'Building2', label: 'Building', icon: Building2 },
  { value: 'User', label: 'User', icon: User },
];

const ContactsManager = ({ onBack }: Props) => {
  const [contacts, setContacts] = useState<BookingContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<BookingContact | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyContact: Omit<BookingContact, 'id'> = {
    category: 'booking',
    region: 'europe',
    title: '',
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    website_url: '',
    demo_url: '',
    gradient_color: 'blue',
    icon_name: 'Globe',
    display_order: 0,
    is_active: true,
  };

  const [formData, setFormData] = useState<Omit<BookingContact, 'id'>>(emptyContact);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('booking_contacts')
      .select('*')
      .order('category')
      .order('display_order');

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    if (editingContact) {
      // Update existing
      const { error } = await supabase
        .from('booking_contacts')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingContact.id);

      if (error) {
        console.error('Error updating contact:', error);
        alert('Failed to update contact');
      } else {
        await fetchContacts();
        setEditingContact(null);
      }
    } else if (isCreating) {
      // Create new
      const maxOrder = Math.max(...contacts.filter(c => c.category === formData.category).map(c => c.display_order), 0);
      const { error } = await supabase
        .from('booking_contacts')
        .insert({
          ...formData,
          display_order: maxOrder + 10,
        });

      if (error) {
        console.error('Error creating contact:', error);
        alert('Failed to create contact');
      } else {
        await fetchContacts();
        setIsCreating(false);
      }
    }
    
    setFormData(emptyContact);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    const { error } = await supabase
      .from('booking_contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    } else {
      await fetchContacts();
    }
  };

  const handleToggleActive = async (contact: BookingContact) => {
    const { error } = await supabase
      .from('booking_contacts')
      .update({ is_active: !contact.is_active })
      .eq('id', contact.id);

    if (error) {
      console.error('Error toggling contact:', error);
    } else {
      await fetchContacts();
    }
  };

  const startEdit = (contact: BookingContact) => {
    setEditingContact(contact);
    setFormData({
      category: contact.category,
      region: contact.region,
      title: contact.title,
      company_name: contact.company_name || '',
      contact_name: contact.contact_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      whatsapp: contact.whatsapp || '',
      website_url: contact.website_url || '',
      demo_url: contact.demo_url || '',
      gradient_color: contact.gradient_color,
      icon_name: contact.icon_name,
      display_order: contact.display_order,
      is_active: contact.is_active,
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingContact(null);
    setFormData(emptyContact);
  };

  const cancelEdit = () => {
    setEditingContact(null);
    setIsCreating(false);
    setFormData(emptyContact);
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

  const groupedContacts = {
    press: contacts.filter(c => c.category === 'press'),
    radio: contacts.filter(c => c.category === 'radio'),
    demos: contacts.filter(c => c.category === 'demos'),
    booking: contacts.filter(c => c.category === 'booking'),
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Phone className="w-8 h-8 text-[#D4AF37]" />
                Contacts Manager
              </h1>
              <p className="text-gray-400">Manage booking contacts and worldwide representatives</p>
            </div>
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Contact
          </button>
        </div>

        {/* Edit/Create Form */}
        {(editingContact || isCreating) && (
          <div className="bg-gray-900/50 border border-[#D4AF37]/30 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {isCreating ? 'Add New Contact' : 'Edit Contact'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as BookingContact['category'] })}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Region (only for bookings) */}
              {formData.category === 'booking' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
                  <select
                    value={formData.region || ''}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="">Select region...</option>
                    {REGION_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Europe & Middle East"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company/Agency Name</label>
                <input
                  type="text"
                  value={formData.company_name || ''}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g., Underwater Agency"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Person</label>
                <input
                  type="text"
                  value={formData.contact_name || ''}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsapp || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+1234567890 (no spaces)"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.website_url || ''}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Demo URL (for demos category) */}
              {formData.category === 'demos' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Demo Submission URL</label>
                  <input
                    type="url"
                    value={formData.demo_url || ''}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    placeholder="https://tstack.app/username"
                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              )}

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Color</label>
                <select
                  value={formData.gradient_color}
                  onChange={(e) => setFormData({ ...formData, gradient_color: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  {COLOR_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all"
              >
                <X className="w-4 h-4 inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4 inline mr-2" />
                {saving ? 'Saving...' : 'Save Contact'}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading contacts...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Press & PR */}
            {groupedContacts.press.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  Press & PR
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {groupedContacts.press.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onEdit={() => startEdit(contact)}
                      onDelete={() => handleDelete(contact.id)}
                      onToggle={() => handleToggleActive(contact)}
                      getGradientClass={getGradientClass}
                      getIconComponent={getIconComponent}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Radio */}
            {groupedContacts.radio.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  Radio
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {groupedContacts.radio.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onEdit={() => startEdit(contact)}
                      onDelete={() => handleDelete(contact.id)}
                      onToggle={() => handleToggleActive(contact)}
                      getGradientClass={getGradientClass}
                      getIconComponent={getIconComponent}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Demos */}
            {groupedContacts.demos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-pink-400" />
                  Demo Submissions
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {groupedContacts.demos.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onEdit={() => startEdit(contact)}
                      onDelete={() => handleDelete(contact.id)}
                      onToggle={() => handleToggleActive(contact)}
                      getGradientClass={getGradientClass}
                      getIconComponent={getIconComponent}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Worldwide Bookings */}
            {groupedContacts.booking.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#D4AF37]" />
                  Worldwide Bookings
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedContacts.booking.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onEdit={() => startEdit(contact)}
                      onDelete={() => handleDelete(contact.id)}
                      onToggle={() => handleToggleActive(contact)}
                      getGradientClass={getGradientClass}
                      getIconComponent={getIconComponent}
                    />
                  ))}
                </div>
              </div>
            )}

            {contacts.length === 0 && (
              <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800">
                <Phone className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No contacts added yet</p>
                <button
                  onClick={startCreate}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold rounded-lg transition-all"
                >
                  Add Your First Contact
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ContactCardProps {
  contact: BookingContact;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  getGradientClass: (color: string) => string;
  getIconComponent: (name: string) => typeof Mail;
}

const ContactCard = ({ contact, onEdit, onDelete, onToggle, getGradientClass, getIconComponent }: ContactCardProps) => {
  const IconComponent = getIconComponent(contact.icon_name);
  
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };
  
  return (
    <div className={`bg-gradient-to-br ${getGradientClass(contact.gradient_color)} to-black border border-[#D4AF37]/20 rounded-xl p-5 ${!contact.is_active ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{contact.title}</h3>
            {contact.region && (
              <span className="text-xs text-gray-500 uppercase">{contact.region}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggle}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${contact.is_active ? 'text-green-400 hover:bg-green-400/20' : 'text-gray-500 hover:bg-gray-500/20'}`}
            title={contact.is_active ? 'Active - Click to hide' : 'Hidden - Click to show'}
          >
            <div className={`w-3 h-3 rounded-full ${contact.is_active ? 'bg-green-400' : 'bg-gray-500'}`} />
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg transition-all cursor-pointer"
            title="Edit contact"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-all cursor-pointer"
            title="Delete contact"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {contact.company_name && (
          <p className="text-white font-medium">{contact.company_name}</p>
        )}
        {contact.contact_name && (
          <p className="text-gray-400 flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            {contact.contact_name}
          </p>
        )}
        {contact.email && (
          <p className="text-gray-400 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            {contact.email}
          </p>
        )}
        {contact.phone && (
          <p className="text-gray-400 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5" />
            {contact.phone}
          </p>
        )}
        {contact.whatsapp && (
          <p className="text-gray-400 flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp: {contact.whatsapp}
          </p>
        )}
        {contact.website_url && (
          <p className="text-gray-400 flex items-center gap-2">
            <Link className="w-3.5 h-3.5" />
            <a href={contact.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] truncate">
              {contact.website_url}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};


export default ContactsManager;
