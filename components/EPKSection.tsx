import { Download, FileText, Mail, Calendar, Music2, Image } from 'lucide-react';
import { Button } from './ui/button';

const EPKSection = () => {
  const epkLink = "https://www.dropbox.com/scl/fi/rv7rmfj7i8tpd05u5t7vj/EPK-Terry-Golden-2025.pdf?rlkey=6ovowvng1dhwnedawlbtm3z81&dl=1";
  
  const epkFeatures = [
    { icon: FileText, label: 'Full Biography', description: 'Comprehensive artist story' },
    { icon: Music2, label: 'Discography', description: 'Complete release history' },
    { icon: Image, label: 'Press Photos', description: 'High-res promotional images' },
    { icon: Calendar, label: 'Tour Dates', description: 'Upcoming performances' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-purple-950/10 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-purple-400 uppercase tracking-wider text-sm font-semibold">Press Kit</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Electronic <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Press Kit</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Download the complete EPK with biography, discography, press photos, and booking information
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-cyan-900/20 rounded-3xl p-8 md:p-12 border border-purple-500/30 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {epkFeatures.map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-900/40 rounded-2xl flex items-center justify-center border border-purple-500/30 group-hover:border-purple-400/60 group-hover:bg-purple-800/40 transition-all">
                  <feature.icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-white font-semibold mb-1">{feature.label}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => window.open(epkLink, '_blank')}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all group"
            >
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Download EPK 2025
            </Button>
            
            <Button 
              onClick={() => window.location.href = 'mailto:booking@terrygolden.com'}
              variant="outline"
              className="border-purple-500/50 hover:border-purple-400 text-white px-8 py-6 text-lg rounded-xl hover:bg-purple-900/30 transition-all"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact for Booking
            </Button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            For press inquiries and booking requests, please download the EPK or contact us directly
          </p>
        </div>
      </div>
    </section>
  );
};

export default EPKSection;
