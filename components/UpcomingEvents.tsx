import { useState, useEffect } from 'react';
import { Calendar, MapPin, Ticket, Clock, History, Globe, Send, List, LayoutGrid } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SocialShareButtons from './SocialShareButtons';
import EventCalendarView from './EventCalendarView';
import { PageType } from './AppLayout';

interface UpcomingEventsProps {
  setCurrentPage?: (page: PageType) => void;
  onBookEvent?: (event: any) => void;
}

// Convert "7:30 PM" to 24h for countdown calculation
function parseAmPmTo24h(timeStr: string): { hours: number; minutes: number } | null {
  if (!timeStr) return null;
  
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const period = match[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return { hours: h, minutes: m };
  }
  
  // Fallback: try HH:MM (24h)
  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    return { hours: parseInt(match24[1]), minutes: parseInt(match24[2]) };
  }
  
  return null;
}

const UpcomingEvents = ({ setCurrentPage, onBookEvent }: UpcomingEventsProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Fetch upcoming events for list view (limit 6)
    const { data: upcomingData, error: upcomingError } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', todayStr)
      .order('event_date', { ascending: true })
      .limit(6);

    if (!upcomingError && upcomingData) {
      setEvents(upcomingData);
    }

    // Fetch ALL events for calendar view (no limit, broader range)
    const { data: allData, error: allError } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (!allError && allData) {
      setAllEvents(allData);
    }

    setLoading(false);
  };

  const getCountdown = (date: string, time: string | null) => {
    let eventDate: Date;
    
    if (time) {
      const parsed = parseAmPmTo24h(time);
      if (parsed) {
        eventDate = new Date(`${date}T${String(parsed.hours).padStart(2, '0')}:${String(parsed.minutes).padStart(2, '0')}:00`);
      } else {
        eventDate = new Date(`${date}T00:00:00`);
      }
    } else {
      eventDate = new Date(`${date}T00:00:00`);
    }
    
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();

    if (diff < 0) return 'Event Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const formatTimeDisplay = (startTime: string | null, endTime: string | null) => {
    if (!startTime) return null;
    if (endTime) return `${startTime} — ${endTime}`;
    return startTime;
  };

  const handleBookNow = (event: any) => {
    if (onBookEvent) {
      onBookEvent(event);
    }
  };

  if (loading) return null;
  if (events.length === 0 && allEvents.length === 0) return null;

  return (
    <section id="events" className="py-20 bg-gradient-to-b from-black to-purple-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with View Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Upcoming <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-400 bg-clip-text text-transparent">Shows</span>
            </h2>
            <p className="text-gray-400">Catch Terry Golden live at these events</p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-900/80 rounded-xl border border-gray-700 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${viewMode === 'list'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${viewMode === 'calendar'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="mb-8">
            <EventCalendarView events={allEvents} onBookEvent={handleBookNow} />
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="grid gap-6">
            {events.map((event) => {
              const timeDisplay = formatTimeDisplay(event.event_time, event.event_end_time);
              return (
                <div
                  key={event.id}
                  className="bg-gradient-to-r from-gray-900/80 to-black rounded-2xl border border-gray-800 hover:border-[#D4AF37]/40 transition-all duration-300 overflow-hidden group"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Event Poster / Image */}
                    <div className="md:w-64 lg:w-72 flex-shrink-0">
                      {event.event_image_url ? (
                        <div className="relative h-48 md:h-full w-full overflow-hidden">
                          <img
                            src={event.event_image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 md:bg-gradient-to-l md:from-transparent md:to-transparent" />
                          {/* Countdown overlay */}
                          <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-[#D4AF37]/30">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-[#D4AF37]" />
                              <span className="text-[#D4AF37] text-xs font-bold">{getCountdown(event.event_date, event.event_time)}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 md:h-full w-full bg-gradient-to-br from-[#D4AF37]/20 to-purple-900/30 flex items-center justify-center relative">
                          <div className="text-center">
                            <Calendar className="w-12 h-12 text-[#D4AF37]/60 mx-auto mb-2" />
                            <p className="text-[#D4AF37]/60 text-xs font-medium uppercase tracking-wider">Event</p>
                          </div>
                          {/* Countdown overlay even without image */}
                          <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-[#D4AF37]/30">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-[#D4AF37]" />
                              <span className="text-[#D4AF37] text-xs font-bold">{getCountdown(event.event_date, event.event_time)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                          {event.title}
                        </h3>
                        {event.venue && (
                          <p className="text-gray-400 text-sm mb-3">{event.venue}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                          <span className="flex items-center gap-1.5 text-gray-300">
                            <Calendar className="w-4 h-4 text-[#D4AF37]" />
                            {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {timeDisplay && (
                            <span className="flex items-center gap-1.5 text-gray-300">
                              <Clock className="w-4 h-4 text-[#D4AF37]" />
                              {timeDisplay}
                            </span>
                          )}
                          {(event.city || event.location) && (
                            <span className="flex items-center gap-1.5 text-gray-300">
                              <MapPin className="w-4 h-4 text-[#D4AF37]" />
                              {event.city ? `${event.city}, ` : ''}{event.location}
                            </span>
                          )}
                          {event.country && (
                            <span className="flex items-center gap-1.5 text-gray-300">
                              <Globe className="w-4 h-4 text-[#D4AF37]" />
                              {event.country}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-gray-500 text-sm mt-3 line-clamp-2">{event.description}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          {event.ticket_link && (
                            <a
                              href={event.ticket_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#e6c34a] text-black rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#D4AF37]/10 hover:shadow-[#D4AF37]/30"
                            >
                              <Ticket className="w-4 h-4" />
                              Get Tickets
                            </a>
                          )}
                          <button
                            onClick={() => handleBookNow(event)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg font-semibold text-sm transition-all"
                          >
                            <Send className="w-4 h-4" />
                            Book Now
                          </button>
                        </div>
                        <div className="flex-shrink-0">
                          <SocialShareButtons
                            url={event.ticket_link || `https://terrygolden.com/events/${event.id}`}
                            title={`${event.title} - Terry Golden Live`}
                            description={`Join Terry Golden at ${event.venue || 'the event'} in ${event.location || ''}${event.country ? `, ${event.country}` : ''} on ${new Date(event.event_date).toLocaleDateString()}`}
                            compact
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {setCurrentPage && (
          <div className="text-center mt-10">
            <button
              onClick={() => setCurrentPage('past-events')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 text-gray-300 hover:text-[#D4AF37] rounded-lg font-semibold transition-all"
            >
              <History className="w-5 h-5" />
              View Past Events
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
