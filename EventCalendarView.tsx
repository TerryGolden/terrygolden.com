import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Globe, Ticket, Send, X } from 'lucide-react';
import SocialShareButtons from './SocialShareButtons';

interface EventCalendarViewProps {
  events: any[];
  onBookEvent?: (event: any) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const EventCalendarView = ({ events, onBookEvent }: EventCalendarViewProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Build a map of date -> events
  const eventsByDate: Record<string, any[]> = {};
  events.forEach((event) => {
    const dateKey = event.event_date; // Already in YYYY-MM-DD format
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Previous month days to fill the grid
  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  const goToPrevMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setSelectedDate(null);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleDateClick = (dateKey: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const dateEvents = eventsByDate[dateKey];
    if (!dateEvents || dateEvents.length === 0) {
      setSelectedDate(null);
      return;
    }

    if (selectedDate === dateKey) {
      setSelectedDate(null);
      return;
    }

    setSelectedDate(dateKey);

    // Calculate popup position relative to calendar container
    if (calendarRef.current) {
      const calendarRect = calendarRef.current.getBoundingClientRect();
      const cellRect = e.currentTarget.getBoundingClientRect();
      
      const cellCenterX = cellRect.left + cellRect.width / 2 - calendarRect.left;
      const cellBottom = cellRect.bottom - calendarRect.top;

      setPopupPosition({
        top: cellBottom + 8,
        left: cellCenterX,
      });
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-calendar-cell]')
      ) {
        setSelectedDate(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimeDisplay = (startTime: string | null, endTime: string | null) => {
    if (!startTime) return null;
    if (endTime) return `${startTime} — ${endTime}`;
    return startTime;
  };

  const isToday = (dateKey: string) => {
    const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
    return dateKey === todayKey;
  };

  const isPast = (dateKey: string) => {
    const d = new Date(dateKey + 'T23:59:59');
    return d < today;
  };

  // Build grid cells
  const cells: { day: number; dateKey: string; isCurrentMonth: boolean }[] = [];

  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    cells.push({ day, dateKey: formatDateKey(y, m, day), isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, dateKey: formatDateKey(currentYear, currentMonth, day), isCurrentMonth: true });
  }

  // Next month fill (to complete the grid to 42 cells = 6 rows)
  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    cells.push({ day, dateKey: formatDateKey(y, m, day), isCurrentMonth: false });
  }

  // If only 5 rows needed, trim
  const totalRows = Math.ceil(cells.length / 7);
  const displayCells = totalRows > 5 && cells.slice(35).every(c => !c.isCurrentMonth)
    ? cells.slice(0, 35)
    : cells;

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  return (
    <div ref={calendarRef} className="relative">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {MONTH_NAMES[currentMonth]} <span className="text-[#D4AF37]">{currentYear}</span>
          </h3>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-xs font-medium rounded-full border border-gray-700 text-gray-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg border border-gray-700 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-gray-400 hover:text-[#D4AF37] transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg border border-gray-700 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-gray-400 hover:text-[#D4AF37] transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-800/30 rounded-xl overflow-hidden border border-gray-800">
        {displayCells.map((cell, idx) => {
          const hasEvents = eventsByDate[cell.dateKey] && eventsByDate[cell.dateKey].length > 0;
          const eventCount = hasEvents ? eventsByDate[cell.dateKey].length : 0;
          const todayCell = isToday(cell.dateKey);
          const pastCell = isPast(cell.dateKey) && cell.isCurrentMonth;
          const isSelected = selectedDate === cell.dateKey;

          return (
            <button
              key={idx}
              data-calendar-cell
              onClick={(e) => handleDateClick(cell.dateKey, e)}
              className={`
                relative flex flex-col items-center justify-start p-1 sm:p-2 min-h-[52px] sm:min-h-[72px] md:min-h-[80px] transition-all duration-200
                ${cell.isCurrentMonth ? 'bg-gray-900/60' : 'bg-gray-950/40'}
                ${hasEvents && cell.isCurrentMonth ? 'cursor-pointer hover:bg-[#D4AF37]/10 hover:ring-1 hover:ring-[#D4AF37]/30' : ''}
                ${isSelected ? 'bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/60' : ''}
                ${!hasEvents ? 'cursor-default' : ''}
              `}
            >
              {/* Day number */}
              <span
                className={`
                  text-sm sm:text-base font-medium w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all
                  ${!cell.isCurrentMonth ? 'text-gray-700' : pastCell ? 'text-gray-600' : 'text-gray-300'}
                  ${todayCell ? 'bg-[#D4AF37] text-black font-bold' : ''}
                  ${isSelected && !todayCell ? 'bg-[#D4AF37]/30 text-[#D4AF37]' : ''}
                `}
              >
                {cell.day}
              </span>

              {/* Event indicators */}
              {hasEvents && cell.isCurrentMonth && (
                <div className="flex flex-col items-center gap-0.5 mt-0.5 w-full">
                  {/* Event dots for mobile */}
                  <div className="flex items-center gap-1 sm:hidden">
                    {eventsByDate[cell.dateKey].slice(0, 3).map((ev: any, i: number) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPast(cell.dateKey) ? 'bg-gray-600' : 'bg-[#D4AF37]'
                        }`}
                      />
                    ))}
                    {eventCount > 3 && (
                      <span className="text-[8px] text-gray-500">+{eventCount - 3}</span>
                    )}
                  </div>

                  {/* Event labels for desktop */}
                  <div className="hidden sm:flex flex-col gap-0.5 w-full px-0.5">
                    {eventsByDate[cell.dateKey].slice(0, 2).map((ev: any, i: number) => (
                      <div
                        key={i}
                        className={`
                          text-[10px] md:text-xs leading-tight truncate rounded px-1 py-0.5 w-full text-left
                          ${isPast(cell.dateKey)
                            ? 'bg-gray-800 text-gray-500'
                            : 'bg-[#D4AF37]/20 text-[#D4AF37] font-medium'
                          }
                        `}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {eventCount > 2 && (
                      <span className="text-[10px] text-gray-500 px-1">+{eventCount - 2} more</span>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Event count legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <span>Upcoming event</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] ring-2 ring-[#D4AF37]/30" />
            <span>Today</span>
          </div>
        </div>
        <span>
          {Object.keys(eventsByDate).filter(k => {
            const [y, m] = k.split('-').map(Number);
            return y === currentYear && m === currentMonth + 1;
          }).length} events this month
        </span>
      </div>

      {/* Event Details Popup */}
      {selectedDate && selectedEvents.length > 0 && (
        <div
          ref={popupRef}
          className="absolute z-50 w-[calc(100%-2rem)] sm:w-[420px] max-h-[400px] overflow-y-auto"
          style={{
            top: popupPosition?.top ?? 0,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Popup Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-semibold text-white">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Events List */}
            <div className="divide-y divide-gray-800">
              {selectedEvents.map((event: any) => {
                const timeDisplay = formatTimeDisplay(event.event_time, event.event_end_time);
                return (
                  <div key={event.id} className="p-4 hover:bg-gray-800/40 transition-colors">
                    <div className="flex gap-3">
                      {/* Event thumbnail */}
                      {event.event_image_url ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700">
                          <img
                            src={event.event_image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-gradient-to-br from-[#D4AF37]/20 to-purple-900/30 flex items-center justify-center border border-gray-700">
                          <Calendar className="w-6 h-6 text-[#D4AF37]/50" />
                        </div>
                      )}

                      {/* Event info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-sm truncate">{event.title}</h4>
                        {event.venue && (
                          <p className="text-gray-400 text-xs mt-0.5 truncate">{event.venue}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
                          {timeDisplay && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#D4AF37]" />
                              {timeDisplay}
                            </span>
                          )}
                          {(event.city || event.location) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#D4AF37]" />
                              {event.city ? `${event.city}` : ''}{event.city && event.location ? ', ' : ''}{event.location || ''}
                            </span>
                          )}
                          {event.country && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-[#D4AF37]" />
                              {event.country}
                            </span>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{event.description}</p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-2.5">
                          {event.ticket_link && (
                            <a
                              href={event.ticket_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#e6c34a] text-black rounded-md font-semibold text-xs transition-all shadow-sm"
                            >
                              <Ticket className="w-3 h-3" />
                              Tickets
                            </a>
                          )}
                          {onBookEvent && (
                            <button
                              onClick={() => onBookEvent(event)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#D4AF37] rounded-md font-semibold text-xs transition-all"
                            >
                              <Send className="w-3 h-3" />
                              Book
                            </button>
                          )}
                        </div>

                        {/* Social share */}
                        <div className="mt-2">
                          <SocialShareButtons
                            url={event.ticket_link || `https://terrygolden.com/events/${event.id}`}
                            title={`${event.title} - Terry Golden Live`}
                            description={`Join Terry Golden at ${event.venue || 'the event'} on ${new Date(event.event_date).toLocaleDateString()}`}
                            compact
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendarView;
