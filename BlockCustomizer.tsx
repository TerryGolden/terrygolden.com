import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmailBlock } from '../EmailTemplateBuilder';

interface BlockCustomizerProps {
  block?: EmailBlock;
  onUpdate: (content: any) => void;
}

export const BlockCustomizer = ({ block, onUpdate }: BlockCustomizerProps) => {
  if (!block) {
    return (
      <div className="w-80 border-l bg-gray-50 p-4">
        <div className="text-center text-gray-400 mt-8">
          <p>Select a block to customize</p>
        </div>
      </div>
    );
  }

  const updateField = (field: string, value: any) => {
    onUpdate({ ...block.content, [field]: value });
  };

  return (
    <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Customize Block</h3>
      <div className="space-y-4">
        {block.type === 'text' && (
          <>
            <div>
              <Label>Text Content</Label>
              <Textarea
                value={block.content.text}
                onChange={(e) => updateField('text', e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label>Alignment</Label>
              <Select value={block.content.align} onValueChange={(v) => updateField('align', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Font Size</Label>
              <Input
                value={block.content.fontSize}
                onChange={(e) => updateField('fontSize', e.target.value)}
                placeholder="16px"
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <Input
                type="color"
                value={block.content.color}
                onChange={(e) => updateField('color', e.target.value)}
              />
            </div>
          </>
        )}

        {block.type === 'image' && (
          <>
            <div>
              <Label>Image URL</Label>
              <Input
                value={block.content.url}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={block.content.alt}
                onChange={(e) => updateField('alt', e.target.value)}
              />
            </div>
            <div>
              <Label>Width</Label>
              <Input
                value={block.content.width}
                onChange={(e) => updateField('width', e.target.value)}
                placeholder="100%"
              />
            </div>
            <div>
              <Label>Alignment</Label>
              <Select value={block.content.align} onValueChange={(v) => updateField('align', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {block.type === 'button' && (
          <>
            <div>
              <Label>Button Text</Label>
              <Input
                value={block.content.text}
                onChange={(e) => updateField('text', e.target.value)}
              />
            </div>
            <div>
              <Label>Link URL</Label>
              <Input
                value={block.content.url}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <Input
                type="color"
                value={block.content.bgColor}
                onChange={(e) => updateField('bgColor', e.target.value)}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <Input
                type="color"
                value={block.content.textColor}
                onChange={(e) => updateField('textColor', e.target.value)}
              />
            </div>
            <div>
              <Label>Alignment</Label>
              <Select value={block.content.align} onValueChange={(v) => updateField('align', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {block.type === 'divider' && (
          <>
            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={block.content.color}
                onChange={(e) => updateField('color', e.target.value)}
              />
            </div>
            <div>
              <Label>Height</Label>
              <Input
                value={block.content.height}
                onChange={(e) => updateField('height', e.target.value)}
                placeholder="1px"
              />
            </div>
          </>
        )}

        {block.type === 'spacer' && (
          <div>
            <Label>Height</Label>
            <Input
              value={block.content.height}
              onChange={(e) => updateField('height', e.target.value)}
              placeholder="20px"
            />
          </div>
        )}
      </div>
    </div>
  );
};
