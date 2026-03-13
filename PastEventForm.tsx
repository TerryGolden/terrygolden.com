import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

interface PastEventFormProps {
  event: any;
  onClose: () => void;
}

export function PastEventForm({ event, onClose }: PastEventFormProps) {
  const [setlist, setSetlist] = useState(event.setlist || '');
  const [reviews, setReviews] = useState(event.reviews || []);
  const [eventPhotos, setEventPhotos] = useState(event.event_photos || []);
  const [uploading, setUploading] = useState(false);
  const [newReview, setNewReview] = useState({ author: '', rating: 5, comment: '' });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('eventId', event.id);

      const { data, error } = await supabase.functions.invoke('upload-event-image', {
        body: formData,
      });

      if (!error && data?.url) {
        uploadedUrls.push(data.url);
      }
    }

    setEventPhotos([...eventPhotos, ...uploadedUrls]);
    setUploading(false);
  };

  const addReview = () => {
    if (newReview.author && newReview.comment) {
      setReviews([...reviews, { ...newReview }]);
      setNewReview({ author: '', rating: 5, comment: '' });
    }
  };

  const removeReview = (index: number) => {
    setReviews(reviews.filter((_: any, i: number) => i !== index));
  };

  const removePhoto = (index: number) => {
    setEventPhotos(eventPhotos.filter((_: string, i: number) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('events')
      .update({
        setlist,
        reviews,
        event_photos: eventPhotos,
      })
      .eq('id', event.id);

    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Past Event Content - {event.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Setlist</Label>
            <Textarea
              value={setlist}
              onChange={(e) => setSetlist(e.target.value)}
              placeholder="Enter setlist (one song per line)"
              rows={8}
            />
          </div>

          <div>
            <Label>Event Photos</Label>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {eventPhotos.map((photo: string, index: number) => (
                <div key={index} className="relative">
                  <img src={photo} alt={`Event ${index + 1}`} className="w-full h-24 object-cover rounded" />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Fan Reviews</Label>
            <div className="space-y-4 mt-2">
              {reviews.map((review: any, index: number) => (
                <div key={index} className="border p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{review.author}</p>
                      <p className="text-sm text-yellow-500">{'★'.repeat(review.rating)}</p>
                      <p className="text-sm mt-1">{review.comment}</p>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeReview(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border p-3 rounded-lg space-y-2">
                <Input
                  placeholder="Reviewer name"
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                />
                <select
                  className="w-full border rounded px-3 py-2"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{n} Stars</option>
                  ))}
                </select>
                <Textarea
                  placeholder="Review comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={3}
                />
                <Button type="button" onClick={addReview} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Review
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
