import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description: string;
  subject_template: string;
  html_content: string;
  category: string;
  is_system: boolean;
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('is_system', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      welcome: 'bg-blue-100 text-blue-800',
      announcement: 'bg-purple-100 text-purple-800',
      event: 'bg-pink-100 text-pink-800',
      digest: 'bg-green-100 text-green-800',
      custom: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.custom;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Email Templates</h3>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setPreviewTemplate(template)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Preview
                </Button>
                <Button
                  onClick={() => onSelectTemplate(template)}
                  size="sm"
                  className="flex-1"
                >
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div dangerouslySetInnerHTML={{ __html: previewTemplate?.html_content || '' }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
