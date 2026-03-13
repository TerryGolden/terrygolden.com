import { useState } from 'react';
import { OptimizedImage as OptimizedImageType } from '@/lib/imageOptimization';

interface OptimizedImageProps {
  images: OptimizedImageType[];
  alt: string;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({ images, alt, className = '', priority = false }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!images || images.length === 0) return null;

  // Sort images by width
  const sortedImages = [...images].sort((a, b) => a.width - b.width);
  
  // Use largest as default src
  const defaultSrc = sortedImages[sortedImages.length - 1]?.url || '';
  
  // Generate srcset
  const srcSet = sortedImages
    .map(img => `${img.url} ${img.width}w`)
    .join(', ');

  const sizes = '(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1920px';

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" />
      )}
      <img
        src={defaultSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
      />
    </div>
  );
}