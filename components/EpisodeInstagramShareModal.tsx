import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { X, Instagram, Loader2, Check, AlertCircle, Play, Pause, Download, Share2, Music, Clock, Scissors, Volume2, ExternalLink, Users } from 'lucide-react';
import { guestDJsData, GuestDJ } from '@/data/guestDJsData';
import { artOfRaveLogo } from '@/data/siteData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  episodeTitle: string;
  episodeNumber: number;
  coverImageUrl?: string;
  audioUrl?: string;
  mixcloudKey?: string;
  tracklist?: string[];
  tracklistArtists?: string[];
}

type ShareFormat = 'story' | 'feed' | 'reel';
type ClipDuration = 15 | 30 | 60;

interface TemplateStyle {
  id: string;
  name: string;
  gradient: string[];
  textColor: string;
  accentColor: string;
}

const templateStyles: TemplateStyle[] = [
  { id: 'purple-pink', name: 'Purple Vibes', gradient: ['#6B21A8', '#DB2777', '#1F2937'], textColor: '#FFFFFF', accentColor: '#F472B6' },
  { id: 'cyan-blue', name: 'Ocean Wave', gradient: ['#0891B2', '#3B82F6', '#1F2937'], textColor: '#FFFFFF', accentColor: '#67E8F9' },
  { id: 'orange-red', name: 'Fire', gradient: ['#EA580C', '#DC2626', '#1F2937'], textColor: '#FFFFFF', accentColor: '#FDBA74' },
  { id: 'green-teal', name: 'Forest', gradient: ['#059669', '#14B8A6', '#1F2937'], textColor: '#FFFFFF', accentColor: '#6EE7B7' },
  { id: 'dark-gold', name: 'Luxury', gradient: ['#1F2937', '#374151', '#111827'], textColor: '#FFFFFF', accentColor: '#FCD34D' },
];

const EpisodeInstagramShareModal = ({ 
  isOpen, 
  onClose, 
  episodeTitle, 
  episodeNumber, 
  coverImageUrl, 
  audioUrl,
  mixcloudKey,
  tracklist = [],
  tracklistArtists = []
}: Props) => {
  const [shareFormat, setShareFormat] = useState<ShareFormat>('story');
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle>(templateStyles[0]);
  const [clipDuration, setClipDuration] = useState<ClipDuration>(30);
  const [generating, setGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showWaveform, setShowWaveform] = useState(true);
  const [includeTracklist, setIncludeTracklist] = useState(false);
  const [includeArtists, setIncludeArtists] = useState(true);
  const [showMixcloudPlayer, setShowMixcloudPlayer] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coverImageRef = useRef<HTMLImageElement | null>(null);
  const djImageRef = useRef<HTMLImageElement | null>(null);
  const logoImageRef = useRef<HTMLImageElement | null>(null);

  // Find the featured DJ for this episode
  const featuredDJ = useMemo((): GuestDJ | undefined => {
    return guestDJsData.find(dj => 
      dj.episodes.some(ep => ep.episodeNumber === episodeNumber)
    );
  }, [episodeNumber]);

  // Extract unique artists from tracklist (if not provided separately)
  const uniqueArtists = useMemo(() => {
    if (tracklistArtists && tracklistArtists.length > 0) {
      return [...new Set(tracklistArtists)].slice(0, 8);
    }
    // Try to extract from tracklist strings (format: "Artist - Track")
    const artists = tracklist
      .map(track => {
        const parts = track.split(' - ');
        return parts[0]?.trim();
      })
      .filter(Boolean);
    return [...new Set(artists)].slice(0, 8);
  }, [tracklist, tracklistArtists]);

  // Get Mixcloud embed URL
  const mixcloudEmbedUrl = useMemo(() => {
    if (mixcloudKey) {
      return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=${encodeURIComponent(mixcloudKey)}`;
    }
    // Try to extract from audioUrl if it's a Mixcloud URL
    if (audioUrl && audioUrl.includes('mixcloud.com')) {
      const match = audioUrl.match(/mixcloud\.com(\/[^?]+)/);
      if (match) {
        return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=${encodeURIComponent(match[1])}`;
      }
    }
    return null;
  }, [mixcloudKey, audioUrl]);

  // Get dimensions based on format
  const getDimensions = (format: ShareFormat) => {
    switch (format) {
      case 'story':
      case 'reel':
        return { width: 1080, height: 1920 };
      case 'feed':
        return { width: 1080, height: 1080 };
    }
  };

  // Helper function to draw rounded rectangles
  const roundRect = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }, []);

  // Draw waveform visualization
  const drawWaveform = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
    const bars = 60;
    const barWidth = w / bars - 2;
    
    ctx.fillStyle = color;
    
    for (let i = 0; i < bars; i++) {
      const seed = (i * 7 + episodeNumber * 13) % 100;
      const heightPercent = 0.2 + (Math.sin(seed * 0.1) * 0.5 + 0.5) * 0.8;
      const barHeight = h * heightPercent;
      const barX = x + i * (barWidth + 2);
      const barY = y + (h - barHeight) / 2;
      
      ctx.globalAlpha = 0.6 + heightPercent * 0.4;
      roundRect(ctx, barX, barY, barWidth, barHeight, 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [episodeNumber, roundRect]);

  // Generate preview image
  const generatePreview = useCallback(() => {
    setGenerating(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = getDimensions(shareFormat);
      canvas.width = width;
      canvas.height = height;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      selectedStyle.gradient.forEach((color, index) => {
        gradient.addColorStop(index / (selectedStyle.gradient.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle pattern overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let i = 0; i < height; i += 4) {
        ctx.fillRect(0, i, width, 2);
      }

      const isStoryFormat = shareFormat === 'story' || shareFormat === 'reel';
      const centerX = width / 2;

      if (isStoryFormat) {
        // ============ STORY/REEL FORMAT ============
        
        // Top section - Logo and branding
        const logoSize = 120;
        const logoY = 80;
        
        if (logoImageRef.current) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImageRef.current, centerX - logoSize / 2, logoY, logoSize, logoSize);
          ctx.restore();
          
          ctx.strokeStyle = selectedStyle.accentColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(centerX, logoY + logoSize / 2, logoSize / 2 + 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Show title
        ctx.fillStyle = selectedStyle.textColor;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ART OF RAVE', centerX, logoY + logoSize + 50);

        // Episode number badge
        ctx.fillStyle = selectedStyle.accentColor;
        const badgeY = logoY + logoSize + 70;
        const badgeWidth = 200;
        const badgeHeight = 50;
        roundRect(ctx, centerX - badgeWidth / 2, badgeY, badgeWidth, badgeHeight, 25);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`EPISODE ${episodeNumber}`, centerX, badgeY + 35);

        // Cover image section
        const coverSize = 420;
        const coverY = badgeY + badgeHeight + 40;
        
        if (coverImageRef.current) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 40;
          ctx.shadowOffsetY = 20;
          
          ctx.save();
          roundRect(ctx, centerX - coverSize / 2, coverY, coverSize, coverSize, 30);
          ctx.clip();
          ctx.drawImage(coverImageRef.current, centerX - coverSize / 2, coverY, coverSize, coverSize);
          ctx.restore();
          
          ctx.shadowColor = 'transparent';
          
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 3;
          roundRect(ctx, centerX - coverSize / 2, coverY, coverSize, coverSize, 30);
          ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          roundRect(ctx, centerX - coverSize / 2, coverY, coverSize, coverSize, 30);
          ctx.fill();
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.font = '80px Arial';
          ctx.fillText('🎵', centerX, coverY + coverSize / 2 + 30);
        }

        // Featured DJ section
        let currentY = coverY + coverSize + 30;
        
        if (featuredDJ) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          roundRect(ctx, 60, currentY, width - 120, 140, 20);
          ctx.fill();

          ctx.fillStyle = selectedStyle.accentColor;
          ctx.font = 'bold 22px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('FEATURING', 100, currentY + 30);

          ctx.fillStyle = selectedStyle.textColor;
          ctx.font = 'bold 44px Arial';
          ctx.fillText(featuredDJ.name.toUpperCase(), 100, currentY + 80);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '24px Arial';
          ctx.fillText(`${featuredDJ.country} • ${featuredDJ.genres[0]}`, 100, currentY + 115);

          if (djImageRef.current) {
            const djImgSize = 100;
            const djImgX = width - 100 - djImgSize;
            const djImgY = currentY + 20;
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(djImgX + djImgSize / 2, djImgY + djImgSize / 2, djImgSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(djImageRef.current, djImgX, djImgY, djImgSize, djImgSize);
            ctx.restore();
            
            ctx.strokeStyle = selectedStyle.accentColor;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(djImgX + djImgSize / 2, djImgY + djImgSize / 2, djImgSize / 2 + 2, 0, Math.PI * 2);
            ctx.stroke();
          }
          
          currentY += 160;
        }

        // ============ ARTISTS SECTION (1 artist per line, bigger text) ============
        if (includeArtists && uniqueArtists.length > 0) {
          const artistLineHeight = 48;
          const maxArtistsToShow = Math.min(uniqueArtists.length, 8);
          const artistSectionHeight = 70 + (maxArtistsToShow * artistLineHeight);
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          roundRect(ctx, 60, currentY, width - 120, artistSectionHeight, 20);
          ctx.fill();
          
          ctx.fillStyle = selectedStyle.accentColor;
          ctx.font = 'bold 26px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('ARTISTS IN THIS EPISODE', 100, currentY + 40);
          
          // Draw artist names - ONE PER LINE with bigger text
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.font = 'bold 32px Arial';
          
          uniqueArtists.slice(0, maxArtistsToShow).forEach((artist, i) => {
            const artistY = currentY + 85 + (i * artistLineHeight);
            const truncatedArtist = artist.length > 30 ? artist.substring(0, 28) + '...' : artist;
            ctx.fillText(`• ${truncatedArtist}`, 100, artistY);
          });
          
          if (uniqueArtists.length > maxArtistsToShow) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = 'italic 24px Arial';
            ctx.fillText(`+ ${uniqueArtists.length - maxArtistsToShow} more artists`, 100, currentY + artistSectionHeight - 15);
          }
          
          currentY += artistSectionHeight + 15;
        }


        // Audio waveform visualization
        if (showWaveform) {
          const waveY = currentY + 10;
          drawWaveform(ctx, 80, waveY, width - 160, 70, selectedStyle.accentColor);
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${clipDuration}s AUDIO PREVIEW`, centerX, waveY + 95);
          
          currentY = waveY + 110;
        }

        // Tracklist preview (if enabled)
        if (includeTracklist && tracklist.length > 0) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          roundRect(ctx, 60, currentY + 10, width - 120, 200, 20);
          ctx.fill();
          
          ctx.fillStyle = selectedStyle.accentColor;
          ctx.font = 'bold 22px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('TRACKLIST PREVIEW', 100, currentY + 45);
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = '20px Arial';
          const displayTracks = tracklist.slice(0, 4);
          displayTracks.forEach((track, i) => {
            const truncatedTrack = track.length > 40 ? track.substring(0, 37) + '...' : track;
            ctx.fillText(`${i + 1}. ${truncatedTrack}`, 100, currentY + 80 + i * 32);
          });
          
          if (tracklist.length > 4) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = 'italic 18px Arial';
            ctx.fillText(`+ ${tracklist.length - 4} more tracks`, 100, currentY + 80 + 4 * 32);
          }
        }

        // Bottom CTA
        const ctaY = height - 100;
        ctx.fillStyle = selectedStyle.textColor;
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SWIPE UP TO LISTEN', centerX, ctaY);
        
        ctx.strokeStyle = selectedStyle.accentColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - 20, ctaY + 30);
        ctx.lineTo(centerX, ctaY + 50);
        ctx.lineTo(centerX + 20, ctaY + 30);
        ctx.stroke();

      } else {
        // ============ FEED FORMAT (Square) ============
        
        const coverSize = 650;
        const coverY = 80;
        
        if (coverImageRef.current) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 40;
          ctx.shadowOffsetY = 20;
          
          ctx.save();
          roundRect(ctx, centerX - coverSize / 2, coverY, coverSize, coverSize, 30);
          ctx.clip();
          ctx.drawImage(coverImageRef.current, centerX - coverSize / 2, coverY, coverSize, coverSize);
          ctx.restore();
          
          ctx.shadowColor = 'transparent';
        }

        const overlayGradient = ctx.createLinearGradient(0, coverY + coverSize - 200, 0, coverY + coverSize);
        overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        ctx.fillStyle = overlayGradient;
        ctx.save();
        roundRect(ctx, centerX - coverSize / 2, coverY, coverSize, coverSize, 30);
        ctx.clip();
        ctx.fillRect(centerX - coverSize / 2, coverY, coverSize, coverSize);
        ctx.restore();

        ctx.fillStyle = selectedStyle.accentColor;
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`EPISODE ${episodeNumber}`, centerX - coverSize / 2 + 30, coverY + coverSize - 80);
        
        ctx.fillStyle = selectedStyle.textColor;
        ctx.font = 'bold 40px Arial';
        const title = episodeTitle.length > 25 ? episodeTitle.substring(0, 22) + '...' : episodeTitle;
        ctx.fillText(title, centerX - coverSize / 2 + 30, coverY + coverSize - 35);

        const bottomY = coverY + coverSize + 30;
        
        if (logoImageRef.current) {
          const logoSize = 70;
          ctx.save();
          ctx.beginPath();
          ctx.arc(90, bottomY + 45, logoSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImageRef.current, 55, bottomY + 10, logoSize, logoSize);
          ctx.restore();
        }

        ctx.fillStyle = selectedStyle.textColor;
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('ART OF RAVE', 145, bottomY + 40);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '22px Arial';
        ctx.fillText('Weekly Radio Show by Terry Golden', 145, bottomY + 70);

        // Show artists in feed format
        if (includeArtists && uniqueArtists.length > 0) {
          ctx.fillStyle = selectedStyle.accentColor;
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'right';
          ctx.fillText('FEATURING:', width - 60, bottomY + 35);
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = '18px Arial';
          const artistText = uniqueArtists.slice(0, 3).join(', ');
          const truncatedArtists = artistText.length > 35 ? artistText.substring(0, 32) + '...' : artistText;
          ctx.fillText(truncatedArtists, width - 60, bottomY + 60);
          
          if (uniqueArtists.length > 3) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillText(`+ ${uniqueArtists.length - 3} more`, width - 60, bottomY + 82);
          }
        } else if (featuredDJ) {
          ctx.fillStyle = selectedStyle.accentColor;
          ctx.font = 'bold 26px Arial';
          ctx.textAlign = 'right';
          ctx.fillText(`ft. ${featuredDJ.name}`, width - 60, bottomY + 55);
        }

        if (showWaveform) {
          drawWaveform(ctx, 60, bottomY + 100, width - 120, 50, selectedStyle.accentColor);
        }
      }

      setPreviewImage(canvas.toDataURL('image/png'));
      setGenerating(false);
    }, 300);
  }, [shareFormat, selectedStyle, showWaveform, includeTracklist, includeArtists, clipDuration, episodeNumber, episodeTitle, featuredDJ, tracklist, uniqueArtists, roundRect, drawWaveform]);

  // Preload images
  useEffect(() => {
    if (!isOpen) return;

    if (coverImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        coverImageRef.current = img;
        generatePreview();
      };
      img.src = coverImageUrl;
    }

    if (featuredDJ?.imageUrl) {
      const djImg = new Image();
      djImg.crossOrigin = 'anonymous';
      djImg.onload = () => {
        djImageRef.current = djImg;
        generatePreview();
      };
      djImg.src = featuredDJ.imageUrl;
    }

    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = () => {
      logoImageRef.current = logoImg;
      generatePreview();
    };
    logoImg.src = artOfRaveLogo;

    generatePreview();
  }, [isOpen, coverImageUrl, featuredDJ, generatePreview]);

  // Regenerate preview when options change
  useEffect(() => {
    if (isOpen) {
      generatePreview();
    }
  }, [isOpen, shareFormat, selectedStyle, showWaveform, includeTracklist, includeArtists, clipDuration, generatePreview]);

  if (!isOpen) return null;

  const handleExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setGenerating(true);
    setResult(null);

    const { width, height } = getDimensions(shareFormat);
    canvas.width = width;
    canvas.height = height;
    
    // Wait for preview to generate
    await new Promise(resolve => setTimeout(resolve, 600));
    generatePreview();
    
    // Wait for canvas to be fully rendered
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create blob'));
        }, 'image/png', 1.0);
      });

      const filename = `art-of-rave-ep${episodeNumber}-${shareFormat}.png`;

      // Try native share on mobile devices first
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        try {
          const file = new File([blob], filename, { type: 'image/png' });
          await navigator.share({ 
            files: [file], 
            title: `Art of Rave Episode ${episodeNumber}`,
            text: featuredDJ ? `Check out this episode featuring ${featuredDJ.name}!` : 'Check out this episode!'
          });
          setResult({ success: true, message: 'Shared successfully!' });
          setGenerating(false);
          return;
        } catch (err) {
          console.log('Native share failed, falling back to download');
        }
      }

      // Fallback: Create download link with blob URL
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      
      // Append to body for better browser compatibility
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

      setResult({ success: true, message: 'Image downloaded! Open Instagram and upload from your gallery.' });
    } catch (error) {
      console.error('Export failed:', error);
      setResult({ success: false, message: 'Download failed. Please try again.' });
    } finally {
      setGenerating(false);
    }
  };


  const openMixcloud = () => {
    if (audioUrl) {
      window.open(audioUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-500/20 sticky top-0 bg-zinc-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center shadow-lg">
              <Instagram className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Share Episode
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">Episode {episodeNumber} • {episodeTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 grid lg:grid-cols-2 gap-6">
          {/* Controls Column */}
          <div className="space-y-5 order-2 lg:order-1">
            {/* Featured DJ Info */}
            {featuredDJ && (
              <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-4 border border-purple-500/30">
                <div className="flex items-center gap-4">
                  {featuredDJ.imageUrl && (
                    <img 
                      src={featuredDJ.imageUrl} 
                      alt={featuredDJ.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />
                  )}
                  <div>
                    <p className="text-xs text-purple-400 uppercase tracking-wider">Featured Artist</p>
                    <h3 className="text-xl font-bold text-white">{featuredDJ.name}</h3>
                    <p className="text-sm text-gray-400">{featuredDJ.country} • {featuredDJ.genres[0]}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Artists in Episode */}
            {uniqueArtists.length > 0 && (
              <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                <label className="text-sm font-semibold text-purple-300 mb-3 block flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Artists in This Episode ({uniqueArtists.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {uniqueArtists.slice(0, 8).map((artist, idx) => (
                    <span key={idx} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                      {artist}
                    </span>
                  ))}
                  {uniqueArtists.length > 8 && (
                    <span className="text-xs text-gray-500">+{uniqueArtists.length - 8} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Format Selection */}
            <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
              <label className="text-sm font-semibold text-purple-300 mb-3 block flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'story', label: 'Story', ratio: '9:16' },
                  { id: 'feed', label: 'Feed', ratio: '1:1' },
                  { id: 'reel', label: 'Reel', ratio: '9:16' }
                ].map(format => (
                  <button
                    key={format.id}
                    onClick={() => setShareFormat(format.id as ShareFormat)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      shareFormat === format.id
                        ? 'border-pink-500 bg-gradient-to-br from-pink-500/20 to-purple-500/20 scale-105'
                        : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="text-sm font-semibold">{format.label}</div>
                    <div className="text-xs text-gray-500">{format.ratio}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
              <label className="text-sm font-semibold text-purple-300 mb-3 block">Color Theme</label>
              <div className="flex flex-wrap gap-2">
                {templateStyles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedStyle.id === style.id ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${style.gradient[0]}, ${style.gradient[1]})`
                    }}
                    title={style.name}
                  />
                ))}
              </div>
            </div>

            {/* Audio Preview Section */}
            <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
              <label className="text-sm font-semibold text-purple-300 mb-3 block flex items-center gap-2">
                <Music className="w-4 h-4" />
                Listen to Episode
              </label>
              
              {mixcloudEmbedUrl ? (
                <div className="space-y-3">
                  {showMixcloudPlayer ? (
                    <div className="rounded-lg overflow-hidden">
                      <iframe 
                        width="100%" 
                        height="60" 
                        src={mixcloudEmbedUrl}
                        frameBorder="0"
                        allow="autoplay"
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowMixcloudPlayer(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Play Episode</span>
                    </button>
                  )}
                  
                  <button
                    onClick={openMixcloud}
                    className="w-full py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in Mixcloud</span>
                  </button>
                  
                  <p className="text-xs text-gray-500">
                    Tip: Play the audio while screen recording for Instagram Reels
                  </p>
                </div>
              ) : audioUrl ? (
                <div className="space-y-3">
                  <button
                    onClick={openMixcloud}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Listen on Mixcloud</span>
                  </button>
                  <p className="text-xs text-gray-500">
                    Open the episode on Mixcloud to listen while creating your Instagram content
                  </p>
                </div>
              ) : (
                <div className="text-sm text-gray-400 bg-zinc-700/50 rounded-lg p-3 text-center">
                  <Music className="w-5 h-5 mx-auto mb-2 opacity-50" />
                  No audio available for this episode
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700 space-y-3">
              <label className="text-sm font-semibold text-purple-300 mb-3 block">Template Options</label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWaveform}
                  onChange={(e) => setShowWaveform(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  Show Audio Waveform
                </span>
              </label>
              
              {uniqueArtists.length > 0 && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeArtists}
                    onChange={(e) => setIncludeArtists(e.target.checked)}
                    className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    Include Artists ({uniqueArtists.length})
                  </span>
                </label>
              )}
              
              {tracklist.length > 0 && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTracklist}
                    onChange={(e) => setIncludeTracklist(e.target.checked)}
                    className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-400" />
                    Include Tracklist Preview ({tracklist.length} tracks)
                  </span>
                </label>
              )}
            </div>

            {/* Result Message */}
            {result && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
                result.success 
                  ? 'bg-green-900/40 text-green-300 border border-green-500/30' 
                  : 'bg-red-900/40 text-red-300 border border-red-500/30'
              }`}>
                {result.success ? <Check className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <span className="text-sm font-medium">{result.message}</span>
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={generating || !previewImage}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30"
            >
              {generating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  Download for Instagram
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Download the image and share it to your Instagram Story, Feed, or Reels
            </p>
          </div>

          {/* Preview Column */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-300">Live Preview</label>
              <button 
                onClick={generatePreview} 
                disabled={generating} 
                className="text-xs text-purple-400 flex items-center gap-1 hover:text-purple-300 transition"
              >
                {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                Refresh
              </button>
            </div>
            
            <div className={`bg-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-zinc-700 shadow-xl ${
              shareFormat === 'feed' ? 'aspect-square' : 'aspect-[9/16]'
            } max-h-[600px]`}>
              {generating ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
                  <p className="text-gray-400 text-sm">Generating preview...</p>
                </div>
              ) : previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <p className="text-gray-500">Generating...</p>
              )}
            </div>
            
            {/* Quick Tips */}
            <div className="mt-4 bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
              <h4 className="text-sm font-semibold text-purple-300 mb-2">Tips for Instagram</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Stories: Add music sticker with the episode audio</li>
                <li>• Reels: Screen record while playing the audio preview</li>
                <li>• Feed: Add episode link in your bio</li>
                {featuredDJ && <li>• Tag @{featuredDJ.socialLinks.instagram?.split('/').pop() || featuredDJ.name.toLowerCase().replace(/\s+/g, '')} in your post!</li>}
                {uniqueArtists.length > 0 && <li>• Tag the featured artists to increase engagement!</li>}
              </ul>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default EpisodeInstagramShareModal;
