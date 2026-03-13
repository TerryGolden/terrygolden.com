import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useState } from 'react';

interface AlbumShareModalProps {
  album: any;
  open: boolean;
  onClose: () => void;
}

export function AlbumShareModal({ album, open, onClose }: AlbumShareModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/album/${album.id}`;
  const embedUrl = `${baseUrl}/album/${album.id}/embed`;
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const text = `Check out this photo album: ${album.name}`;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Album: {album.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="space-y-4">
            <div>
              <Label>Shareable Link</Label>
              <div className="flex gap-2 mt-2">
                <Input value={shareUrl} readOnly />
                <Button onClick={() => copyToClipboard(shareUrl, 'link')}>
                  {copied === 'link' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="embed" className="space-y-4">
            <div>
              <Label>Embed Code</Label>
              <div className="flex gap-2 mt-2">
                <Input value={embedCode} readOnly />
                <Button onClick={() => copyToClipboard(embedCode, 'embed')}>
                  {copied === 'embed' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Copy this code to embed the album on your website</p>
            </div>
          </TabsContent>
          <TabsContent value="social" className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={() => shareOnSocial('facebook')} className="flex-1">
                <Facebook className="mr-2 h-4 w-4" /> Facebook
              </Button>
              <Button onClick={() => shareOnSocial('twitter')} className="flex-1">
                <Twitter className="mr-2 h-4 w-4" /> Twitter
              </Button>
              <Button onClick={() => shareOnSocial('linkedin')} className="flex-1">
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
