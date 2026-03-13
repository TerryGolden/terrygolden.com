import { LayerEffect } from '../types/layerEffects';

export function applyLayerEffects(
  ctx: CanvasRenderingContext2D,
  effects: LayerEffect[],
  x: number,
  y: number,
  width: number,
  height: number
): void {
  effects.forEach(effect => {
    if (!effect.enabled) return;

    switch (effect.type) {
      case 'dropShadow':
        ctx.shadowColor = effect.color;
        ctx.shadowBlur = effect.blur;
        ctx.shadowOffsetX = effect.offsetX;
        ctx.shadowOffsetY = effect.offsetY;
        ctx.globalAlpha = effect.opacity / 100;
        break;
      
      case 'outerGlow':
        ctx.shadowColor = effect.color;
        ctx.shadowBlur = effect.blur + effect.spread;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalAlpha = effect.opacity / 100;
        break;
    }
  });
}

export function applyGradientOverlay(
  ctx: CanvasRenderingContext2D,
  effect: LayerEffect,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  if (effect.type !== 'gradientOverlay' || !effect.enabled) return;

  const angle = (effect.angle * Math.PI) / 180;
  const x1 = x - (Math.cos(angle) * width) / 2;
  const y1 = y - (Math.sin(angle) * height) / 2;
  const x2 = x + (Math.cos(angle) * width) / 2;
  const y2 = y + (Math.sin(angle) * height) / 2;

  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  effect.colors.forEach((color, i) => {
    gradient.addColorStop(i / (effect.colors.length - 1), color);
  });

  ctx.save();
  ctx.globalCompositeOperation = effect.blendMode as GlobalCompositeOperation;
  ctx.globalAlpha = effect.opacity / 100;
  ctx.fillStyle = gradient;
  ctx.fillRect(x - width / 2, y - height / 2, width, height);
  ctx.restore();
}
