import { useState } from 'react';
import { optimizeAndUploadImage, ImageOptimizationResult } from '@/lib/imageOptimization';

export function useImageOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const optimizeImage = async (
    file: File,
    bucket: string = 'optimized-images',
    folder: string = ''
  ): Promise<ImageOptimizationResult | null> => {
    setIsOptimizing(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(20);
      const result = await optimizeAndUploadImage(file, bucket, folder);
      setProgress(100);
      setIsOptimizing(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize image');
      setIsOptimizing(false);
      return null;
    }
  };

  const reset = () => {
    setIsOptimizing(false);
    setProgress(0);
    setError(null);
  };

  return {
    optimizeImage,
    isOptimizing,
    progress,
    error,
    reset,
  };
}