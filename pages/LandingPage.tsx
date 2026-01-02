
import React from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, BRAIN_LOGO } from '../constants';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hero-pattern">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <Link 
              to="/product/ai-content-generator" 
              className="inline-flex items-center space-x-2 text-red-600 font-bold hover:text-red-700 transition-colors mb-6 border-b-2 border-red-100 hover:border-red-600 pb-1"
            >
              <span>Explore our #1 AI Plugin</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full mb-8 border border-red-100">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest">New: AI Content V2.0 Out Now</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Premium <span className="gradient-text">WordPress</span> Solutions for Pros.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Elevate your website with powerful plugins, templates, and scripts designed for performance, SEO, and massive scaling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={scrollToProducts}
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black hover:shadow-2xl transition-all text-lg"
              >
                Browse Plugins
              </button>
              <Link 
                to="/product/ai-content-generator"
                className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 hover:shadow-2xl hover:shadow-red-200 transition-all text-lg shadow-sm"
              >
                Get AI Generator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Available Plugins & Themes
              </h2>
              <p className="text-gray-500">
                Explore our curated list of high-performance WordPress tools, built to handle millions of visitors.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm font-semibold text-gray-400">
              <span>Verified Secure</span>
              <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
              <span>24/7 Support</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-red-600 w-12 h-12 flex items-center justify-center rounded-2xl shadow-xl shadow-red-200 mb-8">
                {BRAIN_LOGO}
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">Built for Scaling Content</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our AI-Powered Automatic Content Generator doesn't just write; it optimizes. By utilizing the world's best LLMs, we ensure your site stays fresh, relevant, and authoritative.
              </p>
              <ul className="space-y-4">
                {['Multi-Model Architecture', 'Auto-SEO Checkpoint', 'Plagiarism Resistant'].map((f) => (
                  <li key={f} className="flex items-center space-x-3 text-gray-700 font-medium">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://picsum.photos/seed/tech/800/600" 
                alt="Productivity Dashboard" 
                className="relative rounded-[2rem] shadow-2xl border border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gray-900 rounded-[3rem] py-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             {BRAIN_LOGO}
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to automate your blog?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join 1,000+ publishers using our AI-Powered Content Generator to drive millions of page views.
          </p>
          <Link 
            to="/product/ai-content-generator"
            className="inline-block px-10 py-5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all text-xl shadow-xl shadow-red-900/40"
          >
            Get It Now for $25
          </Link>
          <p className="mt-6 text-sm text-gray-500">Limited time offer. Normal price $49.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
