import { useState } from 'react';
import { Send, Eye, Calendar, Loader2, X, BookTemplate, Save, Palette } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import TemplateLibrary from './TemplateLibrary';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CampaignComposerProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CampaignComposer = ({ onClose, onSuccess }: CampaignComposerProps) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [sending, setSending] = useState(false);

  const handleSelectTemplate = (template: any) => {
    setSubject(template.subject_template || '');
    setContent(template.html_content || '');
    setShowTemplates(false);
    toast.success('Template loaded successfully');
  };

  const handleSaveAsTemplate = async () => {
    if (!templateName || !content) {
      toast.error('Please provide template name and content');
      return;
    }

    try {
      const { error } = await supabase
        .from('email_templates')
        .insert({
          name: templateName,
          description: templateDesc,
          subject_template: subject,
          html_content: content,
          category: 'custom',
          is_system: false
        });

      if (error) throw error;
      toast.success('Template saved successfully');
      setShowSaveTemplate(false);
      setTemplateName('');
      setTemplateDesc('');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };


  const handleSend = async (isDraft = false) => {
    if (!subject || !content) {
      alert('Please fill in subject and content');
      return;
    }

    setSending(true);
    try {
      // Create campaign record
      const { data: campaign, error: campaignError } = await supabase
        .from('email_campaigns')
        .insert({
          subject,
          content,
          status: isDraft ? 'draft' : (scheduledFor ? 'scheduled' : 'sending'),
          scheduled_for: scheduledFor || null
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      if (!isDraft) {
        // Send via edge function
        const { data, error } = await supabase.functions.invoke('send-bulk-newsletter', {
          body: {
            campaignId: campaign.id,
            subject,
            content,
            scheduledFor: scheduledFor || null
          }
        });

        if (error) throw error;
        alert(`Campaign ${scheduledFor ? 'scheduled' : 'sent'} successfully! ${data.sent || 0} emails sent.`);
      } else {
        alert('Campaign saved as draft');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send campaign');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-black">Create Campaign</h2>
          <button onClick={onClose} className="text-black hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Actions */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <BookTemplate className="w-5 h-5" />
              Choose Template
            </button>
            <button
              onClick={() => {
                toast.info('Navigate to Template Builder tab to create visual templates');
              }}
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Palette className="w-5 h-5" />
              Visual Builder
            </button>
            <button
              onClick={() => setShowSaveTemplate(true)}
              disabled={!content}
              className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Save as Template
            </button>
          </div>


          <div>
            <label className="block text-[#D4AF37] font-bold mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white"
              placeholder="Enter email subject..."
            />
          </div>

          <div>
            <label className="block text-[#D4AF37] font-bold mb-2">Email Content (HTML)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white h-64 font-mono text-sm"
              placeholder="<h1>Your HTML content here...</h1>"
            />
          </div>

          <div>
            <label className="block text-[#D4AF37] font-bold mb-2">Schedule Send (Optional)</label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={() => handleSend(true)}
              disabled={sending}
              className="flex-1 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSend(false)}
              disabled={sending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : scheduledFor ? <Calendar className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              {scheduledFor ? 'Schedule' : 'Send Now'}
            </button>
          </div>

          {showPreview && (
            <div className="border-2 border-[#D4AF37]/30 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-bold mb-4 text-black">Preview:</h3>
              <div className="border-b pb-2 mb-4">
                <p className="text-sm text-gray-600">Subject:</p>
                <p className="font-bold text-black">{subject || '(No subject)'}</p>
              </div>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}
        </div>
      </div>


      {/* Template Library Modal */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose Email Template</DialogTitle>
          </DialogHeader>
          <TemplateLibrary onSelectTemplate={handleSelectTemplate} />
        </DialogContent>
      </Dialog>

      {/* Save Template Modal */}
      <Dialog open={showSaveTemplate} onOpenChange={setShowSaveTemplate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Template Name</label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., My Custom Newsletter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={templateDesc}
                onChange={(e) => setTemplateDesc(e.target.value)}
                placeholder="Brief description of this template..."
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowSaveTemplate(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveAsTemplate} className="flex-1">
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default CampaignComposer;
