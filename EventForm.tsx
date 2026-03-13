import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Upload, Image as ImageIcon, X, Clock, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface EventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editEvent?: any;
}

// Parse stored time string like "7:30 PM" into { hour, minute, period }
function parseTimeString(timeStr: string | null | undefined): { hour: string; minute: string; period: string } {
  if (!timeStr) return { hour: '', minute: '', period: 'PM' };
  
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    return { hour: match[1], minute: match[2], period: match[3].toUpperCase() };
  }
  
  // Try parsing HH:MM (24h) format from old data
  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let h = parseInt(match24[1]);
    const m = match24[2];
    const p = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return { hour: String(h), minute: m, period: p };
  }
  
  return { hour: '', minute: '', period: 'PM' };
}

function formatTimeForSave(hour: string, minute: string, period: string): string | null {
  if (!hour || !minute) return null;
  return `${hour}:${minute} ${period}`;
}

// Convert a File to base64 string
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/xxx;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function EventForm({ onSuccess, onCancel, editEvent }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(editEvent?.event_image_url || '');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startParsed = parseTimeString(editEvent?.event_time);
  const endParsed = parseTimeString(editEvent?.event_end_time);

  const [formData, setFormData] = useState({
    title: editEvent?.title || '',
    venue: editEvent?.venue || '',
    event_date: editEvent?.event_date || '',
    location: editEvent?.location || '',
    city: editEvent?.city || '',
    country: editEvent?.country || '',
    ticket_link: editEvent?.ticket_link || '',
    description: editEvent?.description || '',
  });

  const [startTime, setStartTime] = useState({
    hour: startParsed.hour,
    minute: startParsed.minute,
    period: startParsed.period,
  });

  const [endTime, setEndTime] = useState({
    hour: endParsed.hour,
    minute: endParsed.minute,
    period: endParsed.period,
  });

  const hours = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const minutes = ['', '00', '15', '30', '45'];

  const handleFileSelect = (file: File) => {
    // Accept any image file - no format restrictions
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setUploadStatus('idle');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(editEvent?.event_image_url ? '' : '');
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setUploadStatus('uploading');
    
    try {
      // Convert file to base64
      const base64Data = await fileToBase64(file);
      
      const { data, error: uploadError } = await supabase.functions.invoke('upload-event-image', {
        body: {
          base64Data,
          originalName: file.name,
          fileType: file.type || 'image/jpeg',
        },
      });

      if (uploadError) {
        console.error('Upload function error:', uploadError);
        throw new Error(uploadError.message || 'Upload failed');
      }

      if (data?.error) {
        console.error('Upload returned error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.url) {
        throw new Error('No URL returned from upload');
      }

      setUploadStatus('success');
      return data.url;
    } catch (err: any) {
      setUploadStatus('error');
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = editEvent?.event_image_url || '';

      // Upload image if a new file was selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadErr: any) {
          console.error('Image upload failed:', uploadErr);
          setError(`Poster upload failed: ${uploadErr.message}. Please try again or save without a poster.`);
          setLoading(false);
          return; // Stop - don't save without the poster if user selected one
        }
      }

      // If user cleared the image (no file and no preview), set to null
      if (!imageFile && !preview) {
        imageUrl = '';
      }

      // Build the event time strings (null if not set)
      const eventTime = formatTimeForSave(startTime.hour, startTime.minute, startTime.period);
      const eventEndTime = formatTimeForSave(endTime.hour, endTime.minute, endTime.period);

      const eventData: Record<string, any> = {
        title: formData.title,
        event_date: formData.event_date,
        venue: formData.venue || null,
        location: formData.location || null,
        city: formData.city || null,
        country: formData.country || null,
        ticket_link: formData.ticket_link || null,
        description: formData.description || null,
        event_time: eventTime,
        event_end_time: eventEndTime,
        event_image_url: imageUrl || null,
      };

      if (editEvent) {
        const { error: updateError } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editEvent.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('events')
          .insert([eventData]);
        if (insertError) throw insertError;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving event:', err);
      setError(err?.message || 'Failed to save event. Please check all required fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const TimeSelector = ({
    label,
    time,
    setTime,
  }: {
    label: string;
    time: { hour: string; minute: string; period: string };
    setTime: (t: { hour: string; minute: string; period: string }) => void;
  }) => (
    <div>
      <Label className="font-semibold text-sm text-gray-700 mb-1.5 block">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          {label}
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </span>
      </Label>
      <div className="flex items-center gap-1.5">
        {/* Hour */}
        <select
          value={time.hour}
          onChange={(e) => setTime({ ...time, hour: e.target.value })}
          className="flex h-9 w-[72px] rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h === '' ? 'Hr' : h}
            </option>
          ))}
        </select>

        <span className="text-gray-400 font-bold">:</span>

        {/* Minute */}
        <select
          value={time.minute}
          onChange={(e) => setTime({ ...time, minute: e.target.value })}
          className="flex h-9 w-[72px] rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m === '' ? 'Min' : m}
            </option>
          ))}
        </select>

        {/* AM/PM */}
        <div className="flex rounded-md border border-input overflow-hidden">
          <button
            type="button"
            onClick={() => setTime({ ...time, period: 'AM' })}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              time.period === 'AM'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => setTime({ ...time, period: 'PM' })}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors border-l border-input ${
              time.period === 'PM'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            PM
          </button>
        </div>

        {/* Clear button */}
        {(time.hour || time.minute) && (
          <button
            type="button"
            onClick={() => setTime({ hour: '', minute: '', period: time.period })}
            className="ml-1 p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Clear time"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {/* Preview */}
      {time.hour && time.minute && (
        <p className="text-xs text-blue-600 mt-1 font-medium">
          {time.hour}:{time.minute} {time.period}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 text-sm font-medium">Error saving event</p>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Event Poster Upload */}
      <div>
        <Label className="text-base font-semibold mb-2 block">Event Poster / Image</Label>
        <p className="text-sm text-gray-500 mb-3">Upload a high-quality event poster or flyer in any format (JPG, PNG, WEBP, GIF, BMP, TIFF, SVG, etc.) and any size.</p>
        
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Event poster preview"
              className="max-h-72 w-auto object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {/* File info */}
            {imageFile && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {imageFile.name}
                </span>
                <span className="text-xs text-gray-400">
                  {formatFileSize(imageFile.size)}
                </span>
                {uploadStatus === 'uploading' && (
                  <span className="flex items-center gap-1 text-xs text-blue-600">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                  </span>
                )}
                {uploadStatus === 'success' && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" /> Uploaded
                  </span>
                )}
                {uploadStatus === 'error' && (
                  <span className="flex items-center gap-1 text-xs text-red-600">
                    <AlertTriangle className="w-3 h-3" /> Failed
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.tif,.svg,.heic,.heif,.avif"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Drop your event poster here or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Any image format — Any size
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, WEBP, GIF, BMP, TIFF, SVG, HEIC, AVIF and more
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Event Title */}
      <div>
        <Label className="font-semibold">Event Title *</Label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Tomorrowland 2026"
          className="mt-1"
        />
      </div>

      {/* Venue & Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-semibold">Venue</Label>
          <Input
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            placeholder="e.g. Main Stage"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="font-semibold">Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Boom, Belgium"
            className="mt-1"
          />
        </div>
      </div>

      {/* Date */}
      <div>
        <Label className="font-semibold">Date *</Label>
        <Input
          type="date"
          required
          value={formData.event_date}
          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
          className="mt-1 max-w-xs"
        />
      </div>

      {/* Start Time & End Time — AM/PM selectors */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">Event Time <span className="text-gray-400 font-normal text-xs">(optional)</span></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TimeSelector label="Start Time" time={startTime} setTime={setStartTime} />
          <TimeSelector label="End Time" time={endTime} setTime={setEndTime} />
        </div>
        {/* Time preview */}
        {startTime.hour && startTime.minute && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Event time: <span className="font-semibold text-gray-700">{startTime.hour}:{startTime.minute} {startTime.period}</span>
              {endTime.hour && endTime.minute && (
                <span> — <span className="font-semibold text-gray-700">{endTime.hour}:{endTime.minute} {endTime.period}</span></span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Country & City */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-semibold">Country</Label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="e.g. Belgium"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="font-semibold">City</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g. Boom"
            className="mt-1"
          />
        </div>
      </div>

      {/* Ticket Link */}
      <div>
        <Label className="font-semibold">Ticket Link</Label>
        <Input
          type="url"
          value={formData.ticket_link}
          onChange={(e) => setFormData({ ...formData, ticket_link: e.target.value })}
          placeholder="https://tickets.example.com/event"
          className="mt-1"
        />
        <p className="text-xs text-gray-400 mt-1">Leave empty if tickets are not yet available. A "Book Now" button will always be shown linking to the booking form.</p>
      </div>

      {/* Description */}
      <div>
        <Label className="font-semibold">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the event..."
          className="mt-1"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {uploadStatus === 'uploading' ? 'Uploading poster...' : 'Saving event...'}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {editEvent ? 'Update Event' : 'Add Event'}
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
