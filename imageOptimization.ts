import { supabase } from './supabase';

export interface OptimizedImage {
  size: string;
  width: number;
  url: string;
  path: string;
}

export interface ImageOptimizationResult {
  original: OptimizedImage;
  optimized: OptimizedImage[];
  webp: OptimizedImage[];
}

const SIZES = [
  { name: 'thumbnail', width: 150 },
  { name: 'small', width: 400 },
  { name: 'medium', width: 800 },
  { name: 'large', width: 1200 },
  { name: 'xlarge', width: 1920 },
];

async function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      }, 'image/webp', 0.85);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function optimizeAndUploadImage(
  file: File,
  bucket: string = 'optimized-images',
  folder: string = ''
): Promise<ImageOptimizationResult> {
  const timestamp = Date.now();
  const baseName = file.name.split('.')[0].replace(/[^a-zA-Z0-9-]/g, '_');
  const path = folder ? `${folder}/` : '';

  const results: ImageOptimizationResult = {
    original: {} as OptimizedImage,
    optimized: [],
    webp: [],
  };

  // Upload original
  const originalPath = `${path}${baseName}_${timestamp}_original.${file.name.split('.').pop()}`;
  const { error: origError } = await supabase.storage
    .from(bucket)
    .upload(originalPath, file, {
      cacheControl: '31536000',
      upsert: false,
    });

  if (origError) throw origError;

  const { data: { publicUrl: origUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(originalPath);

  results.original = {
    size: 'original',
    width: 0,
    url: origUrl,
    path: originalPath,
  };

  // Generate and upload optimized sizes
  for (const size of SIZES) {
    const resizedBlob = await resizeImage(file, size.width);
    const webpPath = `${path}${baseName}_${timestamp}_${size.name}.webp`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(webpPath, resizedBlob, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: false,
      });

    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(webpPath);

      results.webp.push({
        size: size.name,
        width: size.width,
        url: publicUrl,
        path: webpPath,
      });
    }
  }

  return results;
}