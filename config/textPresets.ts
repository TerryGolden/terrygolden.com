export const POPULAR_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Palatino',
  'Garamond',
  'Bookman',
  'Tahoma',
  'Lucida Console'
];

export interface TextPreset {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export const TEXT_PRESETS: TextPreset[] = [
  {
    id: 'bold-white',
    name: 'Bold White',
    fontFamily: 'Arial Black',
    fontSize: 80,
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 4,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowBlur: 10,
    shadowOffsetX: 2,
    shadowOffsetY: 2
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    fontFamily: 'Impact',
    fontSize: 90,
    color: '#FF00FF',
    strokeColor: '#FFFFFF',
    strokeWidth: 2,
    shadowColor: '#FF00FF',
    shadowBlur: 30,
    shadowOffsetX: 0,
    shadowOffsetY: 0
  },
  {
    id: 'elegant',
    name: 'Elegant',
    fontFamily: 'Georgia',
    fontSize: 70,
    color: '#FFD700',
    strokeColor: '#000000',
    strokeWidth: 1,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowBlur: 5,
    shadowOffsetX: 1,
    shadowOffsetY: 1
  },
  {
    id: 'retro',
    name: 'Retro',
    fontFamily: 'Courier New',
    fontSize: 65,
    color: '#FF6B6B',
    strokeColor: '#FFFFFF',
    strokeWidth: 3,
    shadowColor: '#4ECDC4',
    shadowBlur: 15,
    shadowOffsetX: 3,
    shadowOffsetY: 3
  },
  {
    id: 'minimal',
    name: 'Minimal',
    fontFamily: 'Helvetica',
    fontSize: 60,
    color: '#333333',
    strokeColor: 'transparent',
    strokeWidth: 0,
    shadowColor: 'transparent',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0
  },
  {
    id: 'fire',
    name: 'Fire',
    fontFamily: 'Impact',
    fontSize: 85,
    color: '#FF4500',
    strokeColor: '#FFD700',
    strokeWidth: 3,
    shadowColor: '#FF0000',
    shadowBlur: 20,
    shadowOffsetX: 0,
    shadowOffsetY: 0
  }
];
