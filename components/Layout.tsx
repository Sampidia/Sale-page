
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS, BRAIN_LOGO } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
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

            <div className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => {
                const isExternal = item.href.startsWith('http') || item.href.startsWith('mailto:');
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
              <Link
                to="/products"
                className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-all shadow-sm"
              >
                Get Started
              </Link>
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

        {/* Mobile Dropdown Menu with transition animations */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 bg-white/95 backdrop-blur-md ${
            isMenuOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
          id="mobile-menu"
        >
          <div className="px-4 pt-2 pb-6 space-y-2 shadow-inner">
            {NAV_ITEMS.map((item) => {
              const isExternal = item.href.startsWith('http') || item.href.startsWith('mailto:');
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
              <Link
                to="/products"
                className="w-full text-center bg-red-600 text-white px-5 py-3 rounded-full text-base font-bold hover:bg-red-700 transition-all shadow-md block"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4 group inline-flex">
                <div className="bg-white p-1 rounded-lg border border-gray-200 group-hover:border-red-200 transition-colors">
                  {BRAIN_LOGO}
                </div>
                <span className="text-xl font-extrabold text-gray-900">
                  Afigo<span className="text-red-600">-Sam</span>
                </span>
              </Link>
              <p className="text-gray-500 max-w-sm">
                Empowering WordPress sites with cutting-edge AI, management tools, and premium themes.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const isExternal = item.href.startsWith('http') || item.href.startsWith('mailto:');
                  return (
                    <li key={item.label}>
                      {isExternal ? (
                        <a href={item.href} className="text-gray-500 hover:text-red-600 transition-colors">{item.label}</a>
                      ) : (
                        <Link to={item.href} className="text-gray-500 hover:text-red-600 transition-colors">{item.label}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Contact</h4>
              <p className="text-gray-500 text-sm">Need help? Reach out to our 24/7 support team.</p>
              <a href="mailto:admin@sampidia.com" className="text-red-600 font-semibold text-sm mt-2 block">admin@sampidia.com</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Afigo-Sam. All rights reserved. Built for professional creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
