import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { usePressItems } from '@/hooks/usePressItems';
import { ExternalLink, Calendar, Newspaper, Download, Mail, FileText, Music2, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Press = () => {
  const { items, featuredItem, loading } = usePressItems();
  const epkLink = "https://www.dropbox.com/scl/fi/rv7rmfj7i8tpd05u5t7vj/EPK-Terry-Golden-2025.pdf?rlkey=6ovowvng1dhwnedawlbtm3z81&dl=1";

  const epkFeatures = [
    { icon: FileText, label: 'Full Biography', description: 'Comprehensive artist story' },
    { icon: Music2, label: 'Discography', description: 'Complete release history' },
    { icon: Image, label: 'Press Photos', description: 'High-res promotional images' },
    { icon: Calendar, label: 'Tour Dates', description: 'Upcoming performances' },
  ];

  // Format date for display
  const formatDate = (dateStr: string, publishedDate?: string) => {
    if (publishedDate) {
      const date = new Date(publishedDate);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return dateStr;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Newspaper className="w-6 h-6 text-purple-400" />
              <span className="text-purple-400 uppercase tracking-wider text-sm font-semibold">Media Coverage</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Press & <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Features</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Latest news, interviews, and features from top electronic music publications
            </p>
          </div>

          {/* EPK Section */}
          <div className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-cyan-900/20 rounded-3xl p-8 md:p-12 border border-purple-500/30 backdrop-blur-sm mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Electronic Press Kit</h2>
              <p className="text-gray-400">Download the complete EPK with biography, discography, and press photos</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {epkFeatures.map((feature, i) => (
                <div key={i} className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 bg-purple-900/40 rounded-xl flex items-center justify-center border border-purple-500/30 group-hover:border-purple-400/60 transition-all">
                    <feature.icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm">{feature.label}</h3>
                  <p className="text-gray-500 text-xs">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open(epkLink, '_blank')} 
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/30"
              >
                <Download className="w-5 h-5 mr-2" />Download EPK 2025
              </Button>
              <Button 
                onClick={() => window.location.href = 'mailto:booking@terrygolden.com'} 
                variant="outline" 
                className="border-purple-500/50 hover:border-purple-400 text-white px-8 py-6 text-lg rounded-xl hover:bg-purple-900/30"
              >
                <Mail className="w-5 h-5 mr-2" />Contact for Booking
              </Button>
            </div>
          </div>

          {/* Press Section Title */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Featured In</h2>
            <p className="text-gray-400 mt-2">As seen in leading electronic music publications • Newest first</p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
              <p className="text-gray-400">Loading press features...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No press items available</div>
          ) : (
            <>
              {/* Featured Item (if exists) */}
              {featuredItem && (
                <a 
                  href={featuredItem.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block mb-8 group"
                >
                  <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/30 rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-400/50 transition-all hover:shadow-xl hover:shadow-purple-500/20">
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 md:h-auto bg-black/60 flex items-center justify-center p-8">
                        <img 
                          src={featuredItem.image} 
                          alt={featuredItem.source} 
                          className="max-h-32 max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="md:w-2/3 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">Featured</span>
                          <span className="text-purple-400 font-medium">{featuredItem.source}</span>
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors mb-3">
                          {featuredItem.title}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-2">{featuredItem.excerpt}</p>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featuredItem.date, featuredItem.published_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              )}

              {/* Press Grid - Sorted by date (newest first) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {items
                  .filter(item => !item.featured || item.id !== featuredItem?.id)
                  .map((item) => (
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
            </>
          )}

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-2xl p-8 md:p-12 text-center border border-purple-500/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Press Inquiries</h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              For interviews, features, and press materials, please contact the management team.
            </p>
            <a 
              href="mailto:press@terrygolden.com" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-colors"
            >
              <Mail className="w-5 h-5" />Contact Press Team
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Press;
