import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Upload, User, Mail, Instagram, FileText, Music, Mic, Image, 
  CheckCircle, AlertCircle, Loader2, Send, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  name: string;
  email: string;
  instagram_handle: string;
  bio: string;
}

interface FileState {
  press_photo: File | null;
  mix: File | null;
  voiceover: File | null;
  tracklist: File | null;
}

export default function GuestMixApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    instagram_handle: '',
    bio: '',
  });
  const [files, setFiles] = useState<FileState>({
    press_photo: null,
    mix: null,
    voiceover: null,
    tracklist: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const pressPhotoRef = useRef<HTMLInputElement>(null);
  const mixRef = useRef<HTMLInputElement>(null);
  const voiceoverRef = useRef<HTMLInputElement>(null);
  const tracklistRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof FileState) => {
    const file = e.target.files?.[0] || null;
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const removeFile = (fileType: keyof FileState) => {
    setFiles(prev => ({ ...prev, [fileType]: null }));
    // Reset the input
    const refs = {
      press_photo: pressPhotoRef,
      mix: mixRef,
      voiceover: voiceoverRef,
      tracklist: tracklistRef,
    };
    if (refs[fileType].current) {
      refs[fileType].current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('email', formData.email);
      submitFormData.append('instagram_handle', formData.instagram_handle);
      submitFormData.append('bio', formData.bio);
      
      if (files.press_photo) submitFormData.append('press_photo', files.press_photo);
      if (files.mix) submitFormData.append('mix', files.mix);
      if (files.voiceover) submitFormData.append('voiceover', files.voiceover);
      if (files.tracklist) submitFormData.append('tracklist', files.tracklist);

      const { data, error } = await supabase.functions.invoke('submit-guestmix', {
        body: submitFormData,
      });

      if (error) throw error;

      setSubmitStatus('success');
      // Reset form
      setFormData({ name: '', email: '', instagram_handle: '', bio: '' });
      setFiles({ press_photo: null, mix: null, voiceover: null, tracklist: null });
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadBox = ({ 
    label, 
    icon: Icon, 
    accept, 
    fileType, 
    inputRef,
    description 
  }: { 
    label: string; 
    icon: any; 
    accept: string; 
    fileType: keyof FileState;
    inputRef: React.RefObject<HTMLInputElement>;
    description: string;
  }) => {
    const file = files[fileType];
    
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
        <div 
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            file 
              ? 'border-green-500/50 bg-green-900/20' 
              : 'border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-900/10'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(e, fileType)}
            className="hidden"
          />
          
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-green-300 truncate max-w-[150px] sm:max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(fileType);
                }}
                className="p-1 hover:bg-red-600/30 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ) : (
            <div className="py-2">
              <Icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-medium">Click to upload</p>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Submission Received!</h3>
        <p className="text-gray-300 max-w-md mx-auto mb-6">
          Thank you for your guest mix submission! Our team will review it and get back to you soon.
        </p>
        <Button 
          onClick={() => setSubmitStatus('idle')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Submit Another Mix
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Artist / DJ Name *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Your artist name"
            className="bg-zinc-800/50 border-purple-500/30 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="your@email.com"
            className="bg-zinc-800/50 border-purple-500/30 focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Instagram className="w-4 h-4 inline mr-2" />
          Instagram Handle
        </label>
        <Input
          name="instagram_handle"
          value={formData.instagram_handle}
          onChange={handleInputChange}
          placeholder="@yourusername"
          className="bg-zinc-800/50 border-purple-500/30 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Short Bio / About You *
        </label>
        <Textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          required
          placeholder="Tell us about yourself, your style, and your experience as a DJ..."
          rows={4}
          className="bg-zinc-800/50 border-purple-500/30 focus:border-purple-500 resize-none"
        />
      </div>

      {/* File Uploads */}
      <div className="border-t border-purple-500/20 pt-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-400" />
          Upload Your Files
        </h4>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <FileUploadBox
            label="Press Photo"
            icon={Image}
            accept="image/*"
            fileType="press_photo"
            inputRef={pressPhotoRef}
            description="JPG, PNG (max 10MB)"
          />
          
          <FileUploadBox
            label="Mix (MP3) *"
            icon={Music}
            accept="audio/mpeg,audio/mp3,.mp3"
            fileType="mix"
            inputRef={mixRef}
            description="MP3 format (max 200MB)"
          />
          
          <FileUploadBox
            label="Voice Over (Short Intro)"
            icon={Mic}
            accept="audio/*"
            fileType="voiceover"
            inputRef={voiceoverRef}
            description="MP3 or WAV (max 20MB)"
          />
          
          <FileUploadBox
            label="Tracklist *"
            icon={FileText}
            accept=".xlsx,.xls,.doc,.docx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            fileType="tracklist"
            inputRef={tracklistRef}
            description="Excel or Word format"
          />
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Tracklist format: Artist Name - Track Name, Label Name
        </p>
      </div>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-500/50 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !formData.name || !formData.email || !formData.bio}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit Guest Mix Application
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree that your mix may be featured on Art of Rave radio show.
      </p>
    </form>
  );
}
