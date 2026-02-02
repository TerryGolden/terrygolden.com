# Image Optimization System Guide

## Overview
Automatic image optimization system that converts uploaded images to modern WebP format, generates multiple responsive sizes, and serves them with proper caching headers for faster loading.

## Features
- ✅ Automatic WebP conversion (85% quality)
- ✅ Multiple responsive sizes (150px, 400px, 800px, 1200px, 1920px)
- ✅ Lazy loading with blur-up effect
- ✅ Progressive loading skeleton
- ✅ CDN-ready with cache headers (1 year cache)
- ✅ Responsive srcset generation

## How to Use

### 1. Upload Images in Admin
```tsx
import { ImageUploadWithOptimization } from '@/components/admin/ImageUploadWithOptimization';

<ImageUploadWithOptimization
  bucket="optimized-images"
  folder="events"
  onUploadComplete={(urls) => {
    console.log('Optimized URLs:', urls);
    // Save URLs to database
  }}
/>
```

### 2. Display Optimized Images
```tsx
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  images={optimizedImageArray}
  alt="Event photo"
  className="w-full h-64"
  priority={false} // true for above-fold images
/>
```

### 3. Manual Optimization
```tsx
import { useImageOptimization } from '@/hooks/useImageOptimization';

const { optimizeImage, isOptimizing, progress, error } = useImageOptimization();

const handleUpload = async (file: File) => {
  const result = await optimizeImage(file, 'my-bucket', 'folder');
  if (result) {
    console.log('Optimized images:', result.webp);
  }
};
```

## Generated Sizes
- **thumbnail**: 150px width
- **small**: 400px width (mobile)
- **medium**: 800px width (tablet)
- **large**: 1200px width (desktop)
- **xlarge**: 1920px width (large screens)

## Performance Benefits
- 60-80% smaller file sizes with WebP
- Faster page loads with lazy loading
- Better UX with blur-up effect
- Reduced bandwidth costs
- Improved SEO scores

## Storage Structure
```
optimized-images/
  ├── events/
  │   ├── event_123_thumbnail.webp
  │   ├── event_123_small.webp
  │   ├── event_123_medium.webp
  │   └── event_123_large.webp
  └── press/
      └── photo_456_xlarge.webp
```

## Cache Headers
All images served with: `Cache-Control: public, max-age=31536000, immutable`
