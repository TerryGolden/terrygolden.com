import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import { PastEventForm } from './PastEventForm';

interface Event {
  id: string;
  title: string;
  venue: string;
  date: string;
  location: string;
  is_completed: boolean;
  setlist?: string;
  reviews: any[];
  event_photos: string[];
}

export function PastEventsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const markAsCompleted = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ is_completed: true })
      .eq('id', eventId);

    if (!error) {
      fetchEvents();
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (!error) {
      fetchEvents();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Past Events Manager</h2>
      </div>

      <div className="grid gap-4 mb-8">
        <h3 className="text-xl font-semibold">Upcoming Events (Mark as Completed)</h3>
        {events.filter(e => !e.is_completed).map(event => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} - {event.venue}, {event.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsCompleted(event.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Completed
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        <h3 className="text-xl font-semibold">Completed Events</h3>
        {events.filter(e => e.is_completed).map(event => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {event.title}
                    <Badge variant="secondary">Completed</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} - {event.venue}, {event.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingEvent(event)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Content
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteEvent(event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Setlist:</span>{' '}
                  {event.setlist ? 'Added' : 'Not added'}
                </div>
                <div>
                  <span className="font-semibold">Reviews:</span>{' '}
                  {event.reviews?.length || 0}
                </div>
                <div>
                  <span className="font-semibold">Photos:</span>{' '}
                  {event.event_photos?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingEvent && (
        <PastEventForm
          event={editingEvent}
          onClose={() => {
            setEditingEvent(null);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}
