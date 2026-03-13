export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'bold' | 'creative' | 'professional';
  thumbnail: string;
  layout: 'center' | 'top' | 'bottom' | 'split' | 'corner' | 'overlay';
  textPosition: { x: number; y: number };
  titleSize: number;
  descSize: number;
  titleColor: string;
  descColor: string;
  alignment: 'left' | 'center' | 'right';
  gradient: { colors: string[]; direction: 'vertical' | 'horizontal' | 'diagonal' };
  decorations?: 'shapes' | 'lines' | 'dots' | 'frame' | 'none';
}

export const storyTemplates: StoryTemplate[] = [
  {
    id: 'minimal-center',
    name: 'Minimal Center',
    description: 'Clean centered text',
    category: 'minimal',
    thumbnail: '📱',
    layout: 'center',
    textPosition: { x: 540, y: 960 },
    titleSize: 70,
    descSize: 35,
    titleColor: '#FFFFFF',
    descColor: '#E5E7EB',
    alignment: 'center',
    gradient: { colors: ['#1F2937', '#111827'], direction: 'vertical' },
    decorations: 'none'
  },
  {
    id: 'bold-top',
    name: 'Bold Top',
    description: 'Large text at top',
    category: 'bold',
    thumbnail: '🔝',
    layout: 'top',
    textPosition: { x: 540, y: 300 },
    titleSize: 85,
    descSize: 40,
    titleColor: '#FFFFFF',
    descColor: '#D1D5DB',
    alignment: 'center',
    gradient: { colors: ['#7C3AED', '#EC4899', '#F59E0B'], direction: 'diagonal' },
    decorations: 'lines'
  },
  {
    id: 'creative-split',
    name: 'Split Screen',
    description: 'Divided layout',
    category: 'creative',
    thumbnail: '⚡',
    layout: 'split',
    textPosition: { x: 540, y: 1400 },
    titleSize: 65,
    descSize: 32,
    titleColor: '#FFFFFF',
    descColor: '#F3F4F6',
    alignment: 'center',
    gradient: { colors: ['#0EA5E9', '#8B5CF6'], direction: 'vertical' },
    decorations: 'shapes'
  },
  {
    id: 'corner-badge',
    name: 'Corner Badge',
    description: 'Text in corner',
    category: 'creative',
    thumbnail: '📍',
    layout: 'corner',
    textPosition: { x: 120, y: 250 },
    titleSize: 60,
    descSize: 30,
    titleColor: '#FFFFFF',
    descColor: '#E5E7EB',
    alignment: 'left',
    gradient: { colors: ['#6366F1', '#8B5CF6', '#D946EF'], direction: 'diagonal' },
    decorations: 'dots'
  },
  {
    id: 'overlay-dark',
    name: 'Dark Overlay',
    description: 'Text with backdrop',
    category: 'professional',
    thumbnail: '🎯',
    layout: 'overlay',
    textPosition: { x: 540, y: 960 },
    titleSize: 75,
    descSize: 38,
    titleColor: '#FFFFFF',
    descColor: '#F9FAFB',
    alignment: 'center',
    gradient: { colors: ['#0F172A', '#1E293B'], direction: 'vertical' },
    decorations: 'frame'
  },
  {
    id: 'geometric',
    name: 'Geometric',
    description: 'Shapes and patterns',
    category: 'creative',
    thumbnail: '🔷',
    layout: 'center',
    textPosition: { x: 540, y: 1100 },
    titleSize: 68,
    descSize: 34,
    titleColor: '#FFFFFF',
    descColor: '#E0E7FF',
    alignment: 'center',
    gradient: { colors: ['#14B8A6', '#06B6D4', '#0EA5E9'], direction: 'horizontal' },
    decorations: 'shapes'
  }
];
