import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Save, Code } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { BuilderCanvas } from './BuilderCanvas';
import { BlocksSidebar } from '@/components/BlocksSidebar';
import { BlockCustomizer } from '@/components/BlockCustomizer';
import { generateEmailHTML } from '@/lib/emailHTMLGenerator';

export interface EmailBlock {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer';
  content: any;
}

export const EmailTemplateBuilder = () => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');

  const addBlock = (type: EmailBlock['type']) => {
    const newBlock: EmailBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type)
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlock === id) setSelectedBlock(null);
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const idx = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && idx > 0) || (direction === 'down' && idx < blocks.length - 1)) {
      const newBlocks = [...blocks];
      const swap = direction === 'up' ? idx - 1 : idx + 1;
      [newBlocks[idx], newBlocks[swap]] = [newBlocks[swap], newBlocks[idx]];
      setBlocks(newBlocks);
    }
  };

  const saveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    const html = generateEmailHTML(blocks);
    const { error } = await supabase.from('email_templates').insert({
      name: templateName,
      description: templateDesc,
      subject: `[Subject] ${templateName}`,
      html_content: html,
      category: 'custom',
      is_system: false
    });

    if (error) {
      toast.error('Failed to save template');
    } else {
      toast.success('Template saved successfully!');
      setShowSave(false);
      setTemplateName('');
      setTemplateDesc('');
    }
  };

  const selectedBlockData = blocks.find(b => b.id === selectedBlock);

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <h2 className="text-xl font-bold">Visual Email Builder</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => setShowSave(true)}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <BlocksSidebar onAddBlock={addBlock} />
        <BuilderCanvas
          blocks={blocks}
          selectedBlock={selectedBlock}
          onSelectBlock={setSelectedBlock}
          onDeleteBlock={deleteBlock}
          onMoveBlock={moveBlock}
        />
        <BlockCustomizer
          block={selectedBlockData}
          onUpdate={(content) => selectedBlock && updateBlock(selectedBlock, content)}
        />
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          <div dangerouslySetInnerHTML={{ __html: generateEmailHTML(blocks) }} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSave} onOpenChange={setShowSave}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)"
              value={templateDesc}
              onChange={(e) => setTemplateDesc(e.target.value)}
            />
            <Button onClick={saveTemplate} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function getDefaultContent(type: EmailBlock['type']) {
  switch (type) {
    case 'text': return { text: 'Enter your text here', align: 'left', fontSize: '16px', color: '#333333' };
    case 'image': return { url: '', alt: 'Image', width: '100%', align: 'center' };
    case 'button': return { text: 'Click Here', url: '#', bgColor: '#007bff', textColor: '#ffffff', align: 'center' };
    case 'divider': return { color: '#e0e0e0', height: '1px' };
    case 'spacer': return { height: '20px' };
  }
}
