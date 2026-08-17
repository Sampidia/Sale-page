import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, BRAIN_LOGO, EMAIL_MAIN, EMAIL_SUPPORT, FIVERR_URL, UPWORK_URL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      
      if (location.pathname === '/') {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-red-50 p-1.5 rounded-lg group-hover:bg-red-100 transition-colors">
                {BRAIN_LOGO}
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Afigo<span className="text-red-600">-Sam</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-7">
              {NAV_ITEMS.map((item) => {
                const isExternal = item.href.startsWith('http') || item.href.startsWith('mailto:');
                const isHash = item.href.startsWith('/#');

                if (isExternal) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                    >
                      {item.label}
                    </a>
                  );
                }

                if (isHash) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-all shadow-sm shadow-red-600/20"
              >
                Hire Me
              </a>
            </div>

            {/* Hamburger Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-50 focus:outline-none transition-all duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  <span
                    className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out origin-center ${
                      isMenuOpen ? 'absolute top-[9px] rotate-45' : ''
                    }`}
                  />
                  <span
                    className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                      isMenuOpen ? 'opacity-0 scale-x-0' : ''
                    }`}
                  />
                  <span
                    className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out origin-center ${
                      isMenuOpen ? 'absolute top-[9px] -rotate-45' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 bg-white/95 backdrop-blur-md ${
            isMenuOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
          id="mobile-menu"
        >
          <div className="px-4 pt-2 pb-6 space-y-1.5 shadow-inner">
            {NAV_ITEMS.map((item) => {
              const isExternal = item.href.startsWith('http') || item.href.startsWith('mailto:');
              const isHash = item.href.startsWith('/#');
              const itemClasses = "block px-4 py-2.5 rounded-xl text-base font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200";
              
              if (isExternal) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={itemClasses}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              }

              if (isHash) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={itemClasses}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      handleNavClick(e, item.href);
                    }}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={itemClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 px-4">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-red-600 text-white px-5 py-3 rounded-full text-base font-bold hover:bg-red-700 transition-all shadow-md block"
                onClick={() => setIsMenuOpen(false)}
              >
                Hire Me on Fiverr
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4 group inline-flex">
                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 group-hover:border-red-500 transition-colors">
                  {BRAIN_LOGO}
                </div>
                <span className="text-xl font-extrabold text-white">
                  Oghenekaro <span className="text-red-500">Samson Afigo</span>
                </span>
              </Link>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-4">
                Full-Stack Web & Mobile Developer, Published n8n AI Workflow Creator, and M.Sc. Industrial Chemist. Founder of Afigo-Sam Technology & Co-Founder of SamPidia.
              </p>
              <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400">
                <a href={FIVERR_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Fiverr Pro</a>
                <span>•</span>
                <a href={UPWORK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Upwork</a>
                <span>•</span>
                <a href="https://portfolio.sampidia.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">portfolio.sampidia.com</a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Quick Navigation</h4>
              <ul className="space-y-2.5 text-sm">
                {NAV_ITEMS.map((item) => {
                  const isHash = item.href.startsWith('/#');
                  if (isHash) {
                    return (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={item.label}>
                      <Link to={item.href} className="text-slate-400 hover:text-red-400 transition-colors">{item.label}</Link>
                    </li>
                  );
                })}
                <li>
                  <Link to="/privacy-policy" className="text-slate-400 hover:text-red-400 transition-colors">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Direct Contact</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">Available for custom web dev, AI automations, and tech consultation.</p>
              <a href={`mailto:${EMAIL_MAIN}`} className="text-red-400 font-semibold text-sm block hover:underline mb-1">
                {EMAIL_MAIN}
              </a>
              <a href={`mailto:${EMAIL_SUPPORT}`} className="text-slate-400 text-xs block hover:underline">
                {EMAIL_SUPPORT}
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} Oghenekaro Samson Afigo. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Powered by Afigo-Sam Technology & SamPidia</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
