import { StoryTemplate } from '../data/instagramTemplates';
import { LayerEffect } from '../types/layerEffects';
import { LayerFilter } from '../types/layerFilters';
import { applyLayerEffects, applyGradientOverlay } from './effectsRenderer';
import { applyFiltersToCanvas } from './filtersRenderer';




export interface BaseLayer {
  id: string;
  name: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  visible: boolean;
  blendMode: string;
  opacity: number;
  effects: LayerEffect[];
  filters: LayerFilter[];
  animation?: {
    type: 'none' | 'fadeIn' | 'fadeOut' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'zoomIn' | 'zoomOut' | 'bounce' | 'rotateIn' | 'rotateOut';
    duration: number; // in milliseconds
    delay: number; // in milliseconds
    easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  };
}




export interface ImageLayer extends BaseLayer {
  type: 'image';
  file: File | null;
  url: string | null;
  filter: string;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export type Layer = ImageLayer | TextLayer;

export async function renderStoryToCanvas(
  canvas: HTMLCanvasElement,
  template: StoryTemplate,
  title: string,
  description?: string,
  layers: Layer[] = []
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = 1080;
  canvas.height = 1920;

  const gradient = template.gradient.direction === 'vertical'
    ? ctx.createLinearGradient(0, 0, 0, 1920)
    : template.gradient.direction === 'horizontal'
    ? ctx.createLinearGradient(0, 0, 1080, 0)
    : ctx.createLinearGradient(0, 0, 1080, 1920);

  template.gradient.colors.forEach((color, i) => {
    gradient.addColorStop(i / (template.gradient.colors.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);

  drawDecorations(ctx, template.decorations);

  for (const layer of layers) {
    if (layer.visible) {
      if (layer.type === 'image' && layer.url) {
        await drawImageLayer(ctx, layer);
      } else if (layer.type === 'text') {
        drawTextLayer(ctx, layer);
      }
    }
  }

  ctx.fillStyle = template.titleColor;
  ctx.font = `bold ${template.titleSize}px Arial`;
  ctx.textAlign = template.alignment;
  
  const xPos = template.alignment === 'center' ? 540 : template.alignment === 'left' ? 100 : 980;
  wrapText(ctx, title, xPos, template.textPosition.y, 900, template.titleSize + 20);

  if (description) {
    ctx.font = `${template.descSize}px Arial`;
    ctx.fillStyle = template.descColor;
    wrapText(ctx, description, xPos, template.textPosition.y + 120, 900, template.descSize + 15);
  }
}

async function drawImageLayer(ctx: CanvasRenderingContext2D, layer: ImageLayer): Promise<void> {
  if (!layer.url) return;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const x = (layer.x / 100) * 1080;
      const y = (layer.y / 100) * 1920;
      const maxSize = 400;
      const size = (layer.scale / 100) * maxSize;

      // Create temporary canvas for layer content
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = size;
      tempCanvas.height = size;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return resolve();

      // Draw image to temp canvas
      tempCtx.drawImage(img, 0, 0, size, size);

      // Apply smart filters
      let filteredCanvas = tempCanvas;
      if (layer.filters && layer.filters.length > 0) {
        filteredCanvas = applyFiltersToCanvas(tempCanvas, layer.filters);
      }

      ctx.save();
      
      // Apply effects before drawing
      if (layer.effects && layer.effects.length > 0) {
        applyLayerEffects(ctx, layer.effects, x, y, size, size);
      }
      
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;
      ctx.globalAlpha = layer.opacity / 100;
      
      if (layer.filter !== 'none') {
        switch (layer.filter) {
          case 'grayscale': ctx.filter = 'grayscale(100%)'; break;
          case 'sepia': ctx.filter = 'sepia(100%)'; break;
          case 'brightness': ctx.filter = 'brightness(150%)'; break;
          case 'contrast': ctx.filter = 'contrast(150%)'; break;
          case 'blur': ctx.filter = 'blur(5px)'; break;
        }
      }

      ctx.translate(x, y);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.drawImage(filteredCanvas, -size / 2, -size / 2, size, size);
      
      // Apply gradient overlay after drawing
      if (layer.effects) {
        layer.effects.forEach(effect => {
          if (effect.type === 'gradientOverlay') {
            applyGradientOverlay(ctx, effect, 0, 0, size, size);
          }
        });
      }
      
      ctx.restore();
      resolve();
    };
    img.onerror = () => resolve();
    img.src = layer.url;
  });
}



function drawTextLayer(ctx: CanvasRenderingContext2D, layer: TextLayer): void {
  const x = (layer.x / 100) * 1080;
  const y = (layer.y / 100) * 1920;
  const fontSize = (layer.fontSize * layer.scale) / 100;

  ctx.save();
  
  // Apply effects before drawing
  if (layer.effects && layer.effects.length > 0) {
    applyLayerEffects(ctx, layer.effects, x, y, fontSize * 5, fontSize * 2);
  }
  
  ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;
  ctx.globalAlpha = layer.opacity / 100;
  
  ctx.font = `bold ${fontSize}px ${layer.fontFamily}`;
  ctx.textAlign = layer.alignment;
  
  if (layer.shadowBlur > 0) {
    ctx.shadowColor = layer.shadowColor;
    ctx.shadowBlur = layer.shadowBlur;
    ctx.shadowOffsetX = layer.shadowOffsetX;
    ctx.shadowOffsetY = layer.shadowOffsetY;
  }
  
  ctx.translate(x, y);
  ctx.rotate((layer.rotation * Math.PI) / 180);
  
  if (layer.strokeWidth > 0) {
    ctx.strokeStyle = layer.strokeColor;
    ctx.lineWidth = layer.strokeWidth;
    ctx.strokeText(layer.text, 0, 0);
  }
  
  ctx.fillStyle = layer.color;
  ctx.fillText(layer.text, 0, 0);
  
  ctx.restore();
}


function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  words.forEach((word, i) => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = word + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, x, currentY);
}

function drawDecorations(ctx: CanvasRenderingContext2D, type?: string) {
  if (!type || type === 'none') return;
  
  ctx.globalAlpha = 0.3;
  if (type === 'shapes') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(100, 100, 200, 200);
    ctx.beginPath();
    ctx.arc(900, 1700, 150, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'lines') {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(980, 200);
    ctx.stroke();
  } else if (type === 'dots') {
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1080, Math.random() * 1920, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'frame') {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 10;
    ctx.strokeRect(50, 50, 980, 1820);
  }
  ctx.globalAlpha = 1;
}
