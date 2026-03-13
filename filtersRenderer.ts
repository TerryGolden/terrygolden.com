import { LayerFilter } from '../types/layerFilters';

export function applyFiltersToCanvas(
  canvas: HTMLCanvasElement,
  filters: LayerFilter[]
): HTMLCanvasElement {
  const filteredCanvas = document.createElement('canvas');
  filteredCanvas.width = canvas.width;
  filteredCanvas.height = canvas.height;
  const ctx = filteredCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  ctx.drawImage(canvas, 0, 0);

  filters.forEach(filter => {
    if (!filter.enabled) return;

    switch (filter.type) {
      case 'gaussianBlur':
        applyGaussianBlur(ctx, filteredCanvas.width, filteredCanvas.height, filter.radius);
        break;
      case 'motionBlur':
        applyMotionBlur(ctx, filteredCanvas.width, filteredCanvas.height, filter.distance, filter.angle);
        break;
      case 'noise':
        applyNoise(ctx, filteredCanvas.width, filteredCanvas.height, filter.amount, filter.monochrome);
        break;
      case 'sharpen':
        applySharpen(ctx, filteredCanvas.width, filteredCanvas.height, filter.amount);
        break;
      case 'colorCorrection':
        applyColorCorrection(ctx, filteredCanvas.width, filteredCanvas.height, filter);
        break;
    }
  });

  return filteredCanvas;
}

function applyGaussianBlur(ctx: CanvasRenderingContext2D, width: number, height: number, radius: number) {
  if (radius <= 0) return;
  ctx.filter = `blur(${radius}px)`;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  tempCtx.drawImage(ctx.canvas, 0, 0);
  ctx.filter = 'none';
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(tempCanvas, 0, 0);
}

function applyMotionBlur(ctx: CanvasRenderingContext2D, width: number, height: number, distance: number, angle: number) {
  if (distance <= 0) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  tempCtx.putImageData(imageData, 0, 0);
  
  ctx.globalAlpha = 0.3;
  const steps = Math.min(10, Math.floor(distance / 5));
  const rad = (angle * Math.PI) / 180;
  const dx = (Math.cos(rad) * distance) / steps;
  const dy = (Math.sin(rad) * distance) / steps;
  
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i <= steps; i++) {
    ctx.drawImage(tempCanvas, dx * i, dy * i);
  }
  ctx.globalAlpha = 1;
}

function applyNoise(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number, monochrome: boolean) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const intensity = amount / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * intensity;
    if (monochrome) {
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    } else {
      data[i] += (Math.random() - 0.5) * 255 * intensity;
      data[i + 1] += (Math.random() - 0.5) * 255 * intensity;
      data[i + 2] += (Math.random() - 0.5) * 255 * intensity;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function applySharpen(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = amount / 20;
  const kernel = [0, -factor, 0, -factor, 1 + 4 * factor, -factor, 0, -factor, 0];
  
  const tempData = new Uint8ClampedArray(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += tempData[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        data[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, sum));
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyColorCorrection(ctx: CanvasRenderingContext2D, width: number, height: number, filter: any) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    
    // Brightness
    r += filter.brightness * 2.55;
    g += filter.brightness * 2.55;
    b += filter.brightness * 2.55;
    
    // Contrast
    const contrastFactor = (259 * (filter.contrast + 100)) / (100 * (259 - filter.contrast));
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;
    
    // Saturation
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
    const satFactor = 1 + filter.saturation / 100;
    r = gray + (r - gray) * satFactor;
    g = gray + (g - gray) * satFactor;
    b = gray + (b - gray) * satFactor;
    
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
  ctx.putImageData(imageData, 0, 0);
}
