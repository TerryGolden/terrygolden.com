import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { EventForm } from './EventForm';
import { Trash2, Edit, Calendar, MapPin, Globe, Image as ImageIcon, Clock, AlertCircle } from 'lucide-react';

export function EventsManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (fetchError) {
        console.error('Error fetching events:', fetchError);
        setError(fetchError.message);
      } else {
        setEvents(data || []);
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err?.message || 'Failed to load events');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;

    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) {
      fetchEvents();
    } else {
      alert('Failed to delete event: ' + error.message);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditEvent(null);
    fetchEvents();
  };

  const isPast = (date: string) => new Date(date) < new Date();

  const formatTimeDisplay = (startTime: string | null, endTime: string | null) => {
    if (!startTime) return null;
    if (endTime) return `${startTime} — ${endTime}`;
    return startTime;
  };

  if (showForm) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {editEvent ? 'Edit Event' : 'Add New Event'}
        </h2>
        <EventForm
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditEvent(null);
          }}
          editEvent={editEvent}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Events Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Add event posters, dates, country, and ticket links. Each event includes a "Book Now" button that sends booking requests to booking@terrygolden.com</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Calendar className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 text-sm font-medium">Error loading events</p>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading events...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const timeDisplay = formatTimeDisplay(event.event_time, event.event_end_time);
            return (
              <Card key={event.id} className={`p-4 ${isPast(event.event_date) ? 'opacity-60' : ''}`}>
                <div className="flex gap-4">
                  {/* Event Poster */}
                  <div className="w-36 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {event.event_image_url ? (
                      <img
                        src={event.event_image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-xs">No poster</span>
                      </div>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        {isPast(event.event_date) && (
                          <span className="inline-block text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full mt-1">Past Event</span>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditEvent(event);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      {event.venue && (
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.venue}{event.location ? ` — ${event.location}` : ''}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        {timeDisplay && (
                          <span className="flex items-center gap-1 ml-2 text-blue-600">
                            <Clock className="w-3.5 h-3.5" />
                            {timeDisplay}
                          </span>
                        )}
                      </p>
                      {event.country && (
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          {event.city ? `${event.city}, ` : ''}{event.country}
                        </p>
                      )}
                      {event.ticket_link && (
                        <a href={event.ticket_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline inline-block mt-1">
                          Ticket Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          {events.length === 0 && !error && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No events yet</p>
              <p className="text-gray-400 text-sm mt-1">Add your first event with a poster, date, and country</p>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                Add First Event
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
