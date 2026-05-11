import { useState } from 'react';
import Navigation from './Navigation';
import HeroSlider from './HeroSlider';
import SoundCloudPlayer from './SoundCloudPlayer';
import FeaturedReleases from './FeaturedReleases';
import AboutSection from './AboutSection';
import EPKSection from './EPKSection';
import VideoGallery from './VideoGallery';
import UpcomingEvents from './UpcomingEvents';
import SocialMediaFeed from './SocialMediaFeed';
import Newsletter from './Newsletter';
import Footer from './Footer';
import MusicPlayer from './MusicPlayer';
import ArtistPage from './ArtistPage';
import ContactPage from './ContactPage';
import AdminDashboard from './admin/AdminDashboard';
import Photos from '@/pages/Photos';
import { PastEvents } from './PastEvents';
import StoryOfTheSkull from './StoryOfTheSkull';
import FloatingSocialSidebar from './FloatingSocialSidebar';
import GuestDJsSection from './GuestDJsSection';
import GuestMixApplicationForm from './GuestMixApplicationForm';
import BookingRequestForm from './BookingRequestForm';
import { Mic2, Star, Send } from 'lucide-react';

export type PageType = 'home' | 'releases' | 'radio' | 'press' | 'photos' | 'artist' | 'contact' | 'admin' | 'past-events' | 'skull-story' | 'guest-djs' | 'booking';

const AppLayout = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [bookingEvent, setBookingEvent] = useState<any>(null);

  const handleBookEvent = (event: any) => {
    setBookingEvent(event);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'home' && (
        <>
          <HeroSlider />
          <SoundCloudPlayer />
          <FeaturedReleases setCurrentPage={setCurrentPage} />
          <AboutSection />
          <EPKSection />
          <VideoGallery />
          <UpcomingEvents setCurrentPage={setCurrentPage} onBookEvent={handleBookEvent} />

          
          {/* Guest DJs Section */}
          <section id="guest-djs" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <GuestDJsSection />
            
            {/* Guest Mix Application Form */}
            <div className="mt-16">
              <div className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-black rounded-3xl border border-purple-500/30 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative p-6 sm:p-8 lg:p-12">
                  {/* Header */}
                  <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Mic2 className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400 uppercase tracking-wider text-sm font-semibold">Join Our Show</span>
                      <Mic2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                      Submit Your Guest Mix
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                      Want to be featured on Art of Rave? Submit your guest mix and join the ranks of legendary DJs 
                      who have graced our show. We're always looking for fresh talent!
                    </p>
                  </div>

                  {/* Requirements */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-semibold text-sm">Mix Quality</span>
                      </div>
                      <p className="text-gray-400 text-xs">High-quality MP3 (320kbps), 1-2 hours in length</p>
                    </div>
                    <div className="bg-pink-900/20 rounded-xl p-4 border border-pink-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-pink-400" />
                        <span className="text-white font-semibold text-sm">Tracklist</span>
                      </div>
                      <p className="text-gray-400 text-xs">Complete tracklist in Excel or Word format</p>
                    </div>
                    <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Send className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-semibold text-sm">Voice Over</span>
                      </div>
                      <p className="text-gray-400 text-xs">Optional short intro for the show</p>
                    </div>
                  </div>

                  {/* Application Form */}
                  <div className="max-w-2xl mx-auto">
                    <GuestMixApplicationForm />
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <SocialMediaFeed />
          <Newsletter />
        </>
      )}

      {currentPage === 'releases' && <FeaturedReleases fullPage setCurrentPage={setCurrentPage} />}

      {/* Art of Rave, Press, and Photos now have dedicated routes */}
      {/* Navigation automatically redirects to /art-of-rave, /press, /photos */}

      {currentPage === 'photos' && <Photos />}
      {currentPage === 'artist' && <ArtistPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'past-events' && <PastEvents />}
      {currentPage === 'skull-story' && <StoryOfTheSkull />}
      {currentPage === 'admin' && <AdminDashboard onBack={() => setCurrentPage('home')} />}
      
      {/* Dedicated Guest DJs Page */}
      {currentPage === 'guest-djs' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24">
          <GuestDJsSection />
          
          {/* Guest Mix Application Form */}
          <div className="mt-16">
            <div className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-black rounded-3xl border border-purple-500/30 overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative p-6 sm:p-8 lg:p-12">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Mic2 className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 uppercase tracking-wider text-sm font-semibold">Join Our Show</span>
                    <Mic2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Submit Your Guest Mix
                  </h2>
                  <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Want to be featured on Art of Rave? Submit your guest mix and join the ranks of legendary DJs 
                    who have graced our show. We're always looking for fresh talent!
                  </p>
                </div>

                {/* Requirements */}
                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                  <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-semibold text-sm">Mix Quality</span>
                    </div>
                    <p className="text-gray-400 text-xs">High-quality MP3 (320kbps), 1-2 hours in length</p>
                  </div>
                  <div className="bg-pink-900/20 rounded-xl p-4 border border-pink-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-pink-400" />
                      <span className="text-white font-semibold text-sm">Tracklist</span>
                    </div>
                    <p className="text-gray-400 text-xs">Complete tracklist in Excel or Word format</p>
                  </div>
                  <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Send className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-semibold text-sm">Voice Over</span>
                    </div>
                    <p className="text-gray-400 text-xs">Optional short intro for the show</p>
                  </div>
                </div>

                {/* Application Form */}
                <div className="max-w-2xl mx-auto">
                  <GuestMixApplicationForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Request Form */}
      {currentPage === 'booking' && (
        <BookingRequestForm
          eventId={bookingEvent?.id}
          eventTitle={bookingEvent?.title}
          eventDate={bookingEvent?.event_date}
          eventCountry={bookingEvent?.country}
          onBack={() => {
            setBookingEvent(null);
            setCurrentPage('home');
          }}
        />
      )}


      <Footer />
      <MusicPlayer />
      <FloatingSocialSidebar position="right" />
    </div>
  );
};

export default AppLayout;
