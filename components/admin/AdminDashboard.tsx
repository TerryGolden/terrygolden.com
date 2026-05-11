import { useState } from 'react';
import { ArrowLeft, Music, Users, Radio, Settings, ChevronRight, LayoutDashboard, Headphones, Newspaper, Image, Calendar, History, BarChart3, ListMusic, Globe, FolderOpen, Video, Mail, Instagram, Database, Link2, Phone, Key } from 'lucide-react';




import ReleasesManager from './ReleasesManager';
import MixesManager from './MixesManager';
import RadioShowsManager from './RadioShowsManager';
import PressManager from './PressManager';
import PhotosManager from './PhotosManager';
import AlbumManager from './AlbumManager';
import { EventsManager } from './EventsManager';
import { PastEventsManager } from './PastEventsManager';
import RadioAnalytics from './RadioAnalytics';
import ArtOfRaveManager from './ArtOfRaveManager';
import EpisodeTracklistAdmin from './EpisodeTracklistAdmin';
import RadioStationsAdmin from './RadioStationsAdmin';
import VideosManager from './VideosManager';
import NewsletterManager from './NewsletterManager';
import InstagramCredentialTester from './InstagramCredentialTester';
import InstagramCacheManager from './InstagramCacheManager';
import LinkChecker from './LinkChecker';
import ContactsManager from './ContactsManager';
import InstagramTokenManager from './InstagramTokenManager';






interface Props {
  onBack: () => void;
}

const AdminDashboard = ({ onBack }: Props) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (activeSection === 'releases') {
    return <ReleasesManager onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === 'mixes') {
    return <MixesManager onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === 'radio') {
    return <RadioShowsManager onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === 'press') {
    return <PressManager onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === 'photos') {
    return <PhotosManager onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === 'albums') {
    return <AlbumManager onBack={() => setActiveSection(null)} />;
  }


  if (activeSection === 'events') {
    return <EventsManager />;
  }

  if (activeSection === 'past-events') {
    return <PastEventsManager />;
  }

  if (activeSection === 'analytics') {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                Radio Analytics
              </h1>
              <p className="text-gray-400">Track episode performance and listener engagement</p>
            </div>
          </div>
          <RadioAnalytics />
        </div>
      </div>
    );
  }

  if (activeSection === 'art-of-rave') {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Radio className="w-8 h-8 text-purple-400" />
                Art of Rave Manager
              </h1>
              <p className="text-gray-400">Sync episodes from Mixcloud</p>
            </div>
          </div>
          <ArtOfRaveManager />
        </div>
      </div>
    );
  }

  if (activeSection === 'tracklists') {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <ListMusic className="w-8 h-8 text-cyan-400" />
                Tracklist Manager
              </h1>
              <p className="text-gray-400">Add and edit tracklists for Art of Rave episodes</p>
            </div>
          </div>
          <EpisodeTracklistAdmin />
        </div>
      </div>
    );
  }

  if (activeSection === 'radio-stations') {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Globe className="w-8 h-8 text-cyan-400" />
                Radio Stations
              </h1>
              <p className="text-gray-400">Manage stations broadcasting Art of Rave</p>
            </div>
          </div>
          <RadioStationsAdmin />
        </div>
      </div>
    );
  }

  if (activeSection === 'videos') {
    return <VideosManager onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === 'newsletter') {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Mail className="w-8 h-8 text-[#D4AF37]" />
                Newsletter Manager
              </h1>
              <p className="text-gray-400">Manage email subscribers and send newsletters</p>
            </div>
          </div>
          <NewsletterManager />
        </div>
      </div>
    );
  }

  if (activeSection === 'instagram') {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Instagram className="w-8 h-8 text-pink-500" />
                Instagram API Setup
              </h1>
              <p className="text-gray-400">Configure and test your Instagram Business API credentials</p>
            </div>
          </div>
          <InstagramCredentialTester />
        </div>
      </div>
    );
  }

  if (activeSection === 'instagram-cache') {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Database className="w-8 h-8 text-cyan-500" />
                Instagram Feed Cache
              </h1>
              <p className="text-gray-400">Manage Instagram feed caching and performance</p>
            </div>
          </div>
          <InstagramCacheManager />
        </div>
      </div>
    );
  }

  if (activeSection === 'link-checker') {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Link2 className="w-8 h-8 text-emerald-400" />
                Link Checker
              </h1>
              <p className="text-gray-400">Verify radio station URLs are working</p>
            </div>
          </div>
          <LinkChecker />
        </div>
      </div>
    );
  }

  if (activeSection === 'contacts') {
    return <ContactsManager onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === 'instagram-token') {
    return <InstagramTokenManager onBack={() => setActiveSection(null)} />;
  }

  const sections = [
    { id: 'releases', title: 'Releases Manager', desc: 'Edit, delete, reorder, and feature releases', icon: Music, color: '#D4AF37' },
    { id: 'contacts', title: 'Contacts Manager', desc: 'Manage booking contacts and worldwide reps', icon: Phone, color: '#22C55E' },
    { id: 'mixes', title: 'SoundCloud Mixes', desc: 'Choose and reorder your mixes', icon: Headphones, color: '#FF5500' },
    { id: 'videos', title: 'Video Gallery', desc: 'Manage YouTube and video content', icon: Video, color: '#FF0000' },
    { id: 'newsletter', title: 'Newsletter', desc: 'Manage email subscribers and campaigns', icon: Mail, color: '#D4AF37' },
    { id: 'instagram-token', title: 'Instagram Token', desc: 'Refresh or update Instagram access token', icon: Key, color: '#F59E0B', highlight: true },
    { id: 'instagram', title: 'Instagram Setup', desc: 'Configure Instagram Business API credentials', icon: Instagram, color: '#E4405F' },
    { id: 'instagram-cache', title: 'Instagram Cache', desc: 'Manage feed caching and refresh data', icon: Database, color: '#06B6D4' },
    { id: 'art-of-rave', title: 'Art of Rave', desc: 'Sync episodes from Mixcloud', icon: Radio, color: '#8B5CF6' },
    { id: 'tracklists', title: 'Tracklist Manager', desc: 'Add tracklists with Spotify/Beatport links', icon: ListMusic, color: '#06B6D4' },
    { id: 'radio-stations', title: 'Radio Stations', desc: 'Manage worldwide radio stations', icon: Globe, color: '#22D3EE' },
    { id: 'link-checker', title: 'Link Checker', desc: 'Verify radio station URLs are working', icon: Link2, color: '#10B981' },
    { id: 'press', title: 'Press Features', desc: 'Add and manage press coverage', icon: Newspaper, color: '#8B5CF6' },
    { id: 'photos', title: 'Press Photos', desc: 'Upload and organize gallery photos', icon: Image, color: '#EC4899' },
    { id: 'albums', title: 'Photo Albums', desc: 'Organize photos into collections', icon: FolderOpen, color: '#F97316' },
    { id: 'events', title: 'Events Manager', desc: 'Add and manage upcoming shows', icon: Calendar, color: '#10B981' },
    { id: 'past-events', title: 'Past Events', desc: 'Manage completed shows and post-event content', icon: History, color: '#F59E0B' },
    { id: 'radio', title: 'Radio Shows', desc: 'Manage radio episodes', icon: Radio, color: '#FF6B6B' },
    { id: 'analytics', title: 'Radio Analytics', desc: 'Track plays, downloads, and listener engagement', icon: BarChart3, color: '#8B5CF6' },
    { id: 'artists', title: 'Artists', desc: 'Manage artist profiles', icon: Users, color: '#1DB954', disabled: true },
    { id: 'settings', title: 'Settings', desc: 'Site configuration', icon: Settings, color: '#6B7280', disabled: true },
  ];


















  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3" style={{ fontFamily: 'Cinzel, serif' }}>
              <LayoutDashboard className="w-8 h-8 text-[#D4AF37]" />
              <span className="text-[#D4AF37]">Admin</span> Dashboard
            </h1>
            <p className="text-gray-400">Manage your website content</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => !section.disabled && setActiveSection(section.id)}
              disabled={section.disabled}
              className={`flex items-center gap-4 p-6 rounded-xl border text-left transition-all ${
                section.disabled 
                  ? 'bg-gray-900/50 border-gray-800 opacity-50 cursor-not-allowed'
                  : section.highlight
                    ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-amber-500/40 hover:border-amber-500/70 hover:bg-amber-500/15 ring-1 ring-amber-500/20'
                    : 'bg-gradient-to-r from-[#D4AF37]/5 to-transparent border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10'
              }`}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${section.color}20` }}>
                <section.icon className="w-7 h-7" style={{ color: section.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-lg">{section.title}</h3>
                  {section.highlight && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                      ACTION NEEDED
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{section.desc}</p>
                {section.disabled && <span className="text-xs text-gray-500">Coming soon</span>}
              </div>
              {!section.disabled && <ChevronRight className="w-5 h-5 text-[#D4AF37]" />}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
