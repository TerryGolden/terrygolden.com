import { useState, useEffect } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageType } from './AppLayout';
import logoConfig from '../config/logoConfig';

interface NavigationProps {
  currentPage?: PageType;
  setCurrentPage?: (page: PageType) => void;
}

const Navigation = ({ currentPage, setCurrentPage }: NavigationProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { page: 'home' as PageType, label: 'Home', route: '/' },
    { page: 'artist' as PageType, label: 'About', route: '/' },
    { page: 'releases' as PageType, label: 'Releases', route: '/releases' },
    { page: 'radio' as PageType, label: 'Art of Rave', route: '/art-of-rave' },
    { page: 'skull-story' as PageType, label: 'The Skull', route: '/' },
    { page: 'press' as PageType, label: 'Press', route: '/press' },
    { page: 'photos' as PageType, label: 'Photos', route: '/photos' },
    { page: 'contact' as PageType, label: 'Contact', route: '/' },
  ];

  const routerOnlyPages = ['/art-of-rave', '/releases', '/press', '/photos'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNav = (page: PageType, route: string) => {
    setIsOpen(false);

    if (routerOnlyPages.includes(route)) {
      navigate(route);
      window.scrollTo(0, 0);
      return;
    }

    if (setCurrentPage) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    } else {
      navigate(route);
      window.scrollTo(0, 0);
    }
  };

  const isActive = (page: PageType, route: string) => {
    if (routerOnlyPages.includes(route)) {
      return location.pathname === route;
    }
    return currentPage === page;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-xl shadow-lg shadow-black/20'
            : 'bg-black/70 backdrop-blur-md'
        }`}
      >
        {/* Thin gold accent line at very top */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNav('home', '/')}
              className="flex items-center group"
            >
              <img
                src={logoConfig.light}
                alt="Terry Golden"
                className="h-9 md:h-10 w-auto object-contain transition-all duration-300 group-hover:brightness-125"
              />
            </button>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const active = isActive(link.page, link.route);
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNav(link.page, link.route)}
                    className="relative px-3 py-2 group"
                  >
                    <span
                      className={`text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-300 ${
                        active
                          ? 'text-[#D4AF37]'
                          : 'text-white/70 group-hover:text-white'
                      }`}
                    >
                      {link.label}
                    </span>
                    {/* Underline indicator */}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] rounded-full transition-all duration-300 ${
                        active
                          ? 'w-5'
                          : 'w-0 group-hover:w-5'
                      }`}
                    />
                  </button>
                );
              })}

              {/* Divider */}
              <div className="w-[1px] h-4 bg-white/10 mx-2" />

              {/* Admin gear */}
              <button
                onClick={() => handleNav('admin', '/')}
                className="p-2 text-white/30 hover:text-[#D4AF37] transition-colors duration-300"
                title="Admin"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors z-50 relative"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Bottom border */}
        <div className="h-[1px] w-full bg-white/[0.06]" />
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 bg-black/95 backdrop-blur-xl z-40 lg:hidden transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Gold accent */}
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37]/10 to-transparent" />

        <div className="flex flex-col h-full pt-20 pb-8 px-6 overflow-y-auto">
          <div className="space-y-1">
            {links.map((link, index) => {
              const active = isActive(link.page, link.route);
              return (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page, link.route)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    animation: isOpen
                      ? `navSlideIn 0.35s ease-out ${index * 0.04}s both`
                      : 'none',
                  }}
                >
                  {active && (
                    <span className="w-1 h-4 bg-[#D4AF37] rounded-full mr-3 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium tracking-wide uppercase">
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-4 h-[1px] bg-white/[0.06]" />

          {/* Admin link */}
          <button
            onClick={() => handleNav('admin', '/')}
            className="flex items-center gap-3 px-4 py-3 text-white/30 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-all duration-200"
            style={{
              animation: isOpen
                ? `navSlideIn 0.35s ease-out ${links.length * 0.04}s both`
                : 'none',
            }}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Admin</span>
          </button>

          {/* Bottom branding */}
          <div className="mt-auto pt-6">
            <div className="px-4">
              <img
                src={logoConfig.light}
                alt="Terry Golden"
                className="h-7 w-auto object-contain opacity-30"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes navSlideIn {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;
