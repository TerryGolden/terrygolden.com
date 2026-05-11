import { Calendar, Newspaper, ExternalLink } from 'lucide-react';
import { usePressItems } from '@/hooks/usePressItems';
import { Link } from 'react-router-dom';

const PressSection = () => {
  const { items, loading } = usePressItems();
  // Items are already sorted by date (newest first) from the hook
  const displayItems = items.slice(0, 3);

  // Format date for display
  const formatDate = (dateStr: string, publishedDate?: string) => {
    if (publishedDate) {
      const date = new Date(publishedDate);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return dateStr;
  };

  if (loading) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black via-purple-950/10 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Newspaper className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Press & <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Latest news and features from top electronic music publications
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {displayItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-b from-purple-900/20 to-black rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="relative h-32 overflow-hidden bg-black/80 flex items-center justify-center p-4">
                <img
                  src={item.image}
                  alt={item.source}
                  className="max-h-full max-w-[80%] object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {item.featured && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-400 text-sm font-medium">{item.source}</span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{item.excerpt}</p>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.date, item.published_date)}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/press"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-full font-semibold transition-colors border border-purple-500/30 hover:border-purple-500/50"
          >
            View All Press Features
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PressSection;
