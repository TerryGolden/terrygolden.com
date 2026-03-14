import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video } from '@/data/videoData';

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{video.title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
          {video.youtubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : video.videoUrl ? (
            <video
              controls
              autoPlay
              className="w-full h-full"
              poster={video.thumbnail}
            >
              <source src={video.videoUrl} type="video/quicktime" />
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-300">{video.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{video.views} views</span>
            <span>•</span>
            <span>{video.releaseDate}</span>
            <span>•</span>
            <span>{video.duration}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
