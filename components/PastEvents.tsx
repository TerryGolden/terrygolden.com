import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Music, Star } from 'lucide-react';
import { EventGalleryModal } from './EventGalleryModal';

interface PastEvent {
  id: string;
  title: string;
  venue: string;
  event_date: string;
  location: string;
  event_image_url?: string;
  setlist?: string;
  reviews: Array<{ author: string; rating: number; comment: string }>;
  event_photos: string[];
}


export function PastEvents() {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<PastEvent[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPastEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, selectedYear, selectedLocation]);

  const fetchPastEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_completed', true)
      .order('event_date', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (selectedYear !== 'all') {
      filtered = filtered.filter(e => new Date(e.event_date).getFullYear().toString() === selectedYear);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(e => e.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    setFilteredEvents(filtered);
  };

  const years = Array.from(new Set(events.map(e => new Date(e.event_date).getFullYear().toString())));
  const locations = Array.from(new Set(events.map(e => e.location)));

  const avgRating = (reviews: any[]) => {
    if (!reviews?.length) return 0;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  };


  if (loading) return <div className="pt-24 text-center py-12 bg-black min-h-screen">Loading past events...</div>;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-white">Past <span className="text-[#D4AF37]">Events</span></h1>


      <div className="flex gap-4 mb-8">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredEvents.map(event => (
          <Card key={event.id} className="overflow-hidden">
            {event.event_image_url && (
              <img src={event.event_image_url} alt={event.title} className="w-full h-48 object-cover" />
            )}
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.event_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {event.venue}, {event.location}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {event.setlist && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="w-4 h-4" />
                    <span className="font-semibold">Setlist</span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{event.setlist}</p>
                </div>
              )}

              {event.reviews && event.reviews.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {avgRating(event.reviews)} / 5.0 ({event.reviews.length} reviews)
                    </span>
                  </div>
                </div>
              )}

              {event.event_photos && event.event_photos.length > 0 && (
                <Button onClick={() => setSelectedEvent(event)} variant="outline" className="w-full">
                  View Photos ({event.event_photos.length})
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedEvent && (
        <EventGalleryModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      </div>
    </div>
  );
}

