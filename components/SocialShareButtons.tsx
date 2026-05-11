import { Facebook, Twitter, Share2, Link as LinkIcon, Check, Linkedin, Mail, MessageCircle, Send, Instagram } from 'lucide-react';
import { useState } from 'react';
import InstagramStoryModal from './InstagramStoryModal';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  compact?: boolean;
}

export default function SocialShareButtons({ 
  url, 
  title, 
  description, 
  image,
  hashtags = [],
  compact = false 
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [showAll, setShowAll] = useState(false);


  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareText = encodeURIComponent(description || title);
  const shareImage = image ? encodeURIComponent(image) : '';
  const hashtagString = hashtags.join(',');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  const handleInstagramShare = () => {
    setShowInstagramModal(true);
  };


  const platforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}${hashtagString ? `&hashtags=${hashtagString}` : ''}`,
      color: 'hover:bg-[#1DA1F2]'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: 'hover:bg-[#1877F2]'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      color: 'hover:bg-[#0A66C2]'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      color: 'hover:bg-[#25D366]'
    },
    {
      name: 'Telegram',
      icon: Send,
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
      color: 'hover:bg-[#0088cc]'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${shareTitle}&body=${shareText}%20${shareUrl}`,
      color: 'hover:bg-gray-600'
    }
  ];

  const visiblePlatforms = compact && !showAll ? platforms.slice(0, 3) : platforms;

  return (
    <>
      <InstagramStoryModal
        isOpen={showInstagramModal}
        onClose={() => setShowInstagramModal(false)}
        title={title}
        description={description}
        imageUrl={image}
        url={url}
      />
      
      <div className="flex items-center gap-2 flex-wrap">
        {!compact && <span className="text-sm text-gray-400">Share:</span>}
        
        {/* Instagram Button - First position */}
        <button
          onClick={handleInstagramShare}
          className="p-2 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 transition-all hover:scale-110 relative"
          title="Share on Instagram"
        >
          <Instagram className="w-4 h-4 text-white" />
        </button>

        {visiblePlatforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full bg-gray-800 ${platform.color} transition-all hover:scale-110`}
            title={`Share on ${platform.name}`}
          >
            <platform.icon className="w-4 h-4 text-white" />
          </a>
        ))}

        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all hover:scale-110"
          title="Copy link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <LinkIcon className="w-4 h-4 text-white" />
          )}
        </button>

        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="p-2 rounded-full bg-gray-800 hover:bg-purple-600 transition-all hover:scale-110"
            title="More sharing options"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
        )}

        {compact && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            +{platforms.length - 3} more
          </button>
        )}
      </div>
    </>
  );
}


