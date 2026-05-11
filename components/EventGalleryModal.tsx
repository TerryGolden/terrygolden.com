import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface EventGalleryModalProps {
  event: {
    title: string;
    event_photos: string[];
  };
  onClose: () => void;
}

export function EventGalleryModal({ event, onClose }: EventGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % event.event_photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + event.event_photos.length) % event.event_photos.length);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{event.title} - Event Photos</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <img
            src={event.event_photos[currentIndex]}
            alt={`Event photo ${currentIndex + 1}`}
            className="w-full h-[500px] object-contain bg-black rounded-lg"
          />

          {event.event_photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                onClick={prevPhoto}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                onClick={nextPhoto}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                {currentIndex + 1} / {event.event_photos.length}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-6 gap-2 mt-4 max-h-24 overflow-y-auto">
          {event.event_photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Thumbnail ${index + 1}`}
              className={`w-full h-16 object-cover rounded cursor-pointer ${
                index === currentIndex ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
