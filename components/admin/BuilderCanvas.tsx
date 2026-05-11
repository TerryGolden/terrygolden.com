import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { EmailBlock } from '../EmailTemplateBuilder';

interface BuilderCanvasProps {
  blocks: EmailBlock[];
  selectedBlock: string | null;
  onSelectBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
}

export const BuilderCanvas = ({
  blocks,
  selectedBlock,
  onSelectBlock,
  onDeleteBlock,
  onMoveBlock
}: BuilderCanvasProps) => {
  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4 text-sm text-gray-500 text-center">
          Email Canvas - Click blocks to edit
        </div>
        {blocks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">Your email is empty</p>
            <p className="text-sm">Add content blocks from the sidebar to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map((block, idx) => (
              <Card
                key={block.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedBlock === block.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectBlock(block.id)}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <BlockPreview block={block} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlock(block.id, 'up');
                      }}
                      disabled={idx === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlock(block.id, 'down');
                      }}
                      disabled={idx === blocks.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBlock(block.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BlockPreview = ({ block }: { block: EmailBlock }) => {
  switch (block.type) {
    case 'text':
      return (
        <div
          style={{
            textAlign: block.content.align,
            fontSize: block.content.fontSize,
            color: block.content.color
          }}
        >
          {block.content.text}
        </div>
      );
    case 'image':
      return (
        <div style={{ textAlign: block.content.align }}>
          {block.content.url ? (
            <img
              src={block.content.url}
              alt={block.content.alt}
              style={{ maxWidth: block.content.width }}
            />
          ) : (
            <div className="bg-gray-200 p-8 text-center text-gray-500">
              Image placeholder
            </div>
          )}
        </div>
      );
    case 'button':
      return (
        <div style={{ textAlign: block.content.align }}>
          <a
            href={block.content.url}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: block.content.bgColor,
              color: block.content.textColor,
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            {block.content.text}
          </a>
        </div>
      );
    case 'divider':
      return (
        <hr
          style={{
            border: 'none',
            borderTop: `${block.content.height} solid ${block.content.color}`,
            margin: '10px 0'
          }}
        />
      );
    case 'spacer':
      return <div style={{ height: block.content.height }} />;
  }
};
