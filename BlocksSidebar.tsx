import { Card } from '@/components/ui/card';
import { Type, Image, MousePointer, Minus, Space } from 'lucide-react';

interface BlocksSidebarProps {
  onAddBlock: (type: 'text' | 'image' | 'button' | 'divider' | 'spacer') => void;
}

export const BlocksSidebar = ({ onAddBlock }: BlocksSidebarProps) => {
  const blocks = [
    { type: 'text' as const, icon: Type, label: 'Text', desc: 'Add text content' },
    { type: 'image' as const, icon: Image, label: 'Image', desc: 'Add an image' },
    { type: 'button' as const, icon: MousePointer, label: 'Button', desc: 'Add a CTA button' },
    { type: 'divider' as const, icon: Minus, label: 'Divider', desc: 'Add a divider line' },
    { type: 'spacer' as const, icon: Space, label: 'Spacer', desc: 'Add spacing' }
  ];

  return (
    <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Content Blocks</h3>
      <div className="space-y-2">
        {blocks.map(block => (
          <Card
            key={block.type}
            className="p-3 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
            onClick={() => onAddBlock(block.type)}
          >
            <div className="flex items-start gap-3">
              <block.icon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">{block.label}</div>
                <div className="text-xs text-gray-500">{block.desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
        <p className="font-medium mb-1">How to use:</p>
        <p>Click on any block to add it to your email. Select blocks in the canvas to customize them.</p>
      </div>
    </div>
  );
};
