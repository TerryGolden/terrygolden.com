import { useState } from 'react';
import { useImageOptimization } from '@/hooks/useImageOptimization';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

interface ImageUploadProps {
  bucket?: string;
  folder?: string;
  onUploadComplete?: (urls: string[]) => void;
}

export function ImageUploadWithOptimization({ 
  bucket = 'optimized-images', 
  folder = '',
  onUploadComplete 
}: ImageUploadProps) {
  const { optimizeImage, isOptimizing, progress, error } = useImageOptimization();
  const [result, setResult] = useState<any>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const optimizationResult = await optimizeImage(file, bucket, folder);
    if (optimizationResult) {
      setResult(optimizationResult);
      const urls = optimizationResult.webp.map(img => img.url);
      onUploadComplete?.(urls);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isOptimizing}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isOptimizing ? 'Optimizing...' : 'Upload Image'}
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {isOptimizing && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-gray-500">Optimizing and uploading...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <XCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert>
          <CheckCircle className="w-4 h-4" />
          <AlertDescription>
            Image optimized! Generated {result.webp.length} sizes
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}