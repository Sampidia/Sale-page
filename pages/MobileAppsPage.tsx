import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOBILE_APPS } from '../constants';
import { MobileAppCategory } from '../types';
import SEO from '../components/SEO';

type FilterOption = 'All' | MobileAppCategory;

const MobileAppsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const filters: FilterOption[] = ['All', 'Games', 'Health', 'Entertainment', 'Socials', 'Finance', 'Others'];

  const filteredApps = activeFilter === 'All'
    ? MOBILE_APPS
    : MOBILE_APPS.filter(app => app.category === activeFilter);

  const getAppCount = (filter: FilterOption): number => {
    if (filter === 'All') return MOBILE_APPS.length;
    return MOBILE_APPS.filter(a => a.category === filter).length;
  };

  const getCategoryColor = (category: MobileAppCategory): string => {
    const colors = {
      'Games': 'bg-red-600',
      'Health': 'bg-emerald-600',
      'Entertainment': 'bg-purple-600',
      'Socials': 'bg-blue-600',
      'Finance': 'bg-yellow-600',
      'Others': 'bg-gray-600'
    };
    return colors[category];
  };

  const appsItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Afigo-Sam Mobile Applications Directory',
    'description': 'Native Android and web applications created by Afigo-Sam including Naija Ayo Worldwide, Afro Short, and Fake Detector.',
    'itemListElement': MOBILE_APPS.map((app, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'SoftwareApplication',
        'name': app.name,
        'operatingSystem': 'Android',
        'applicationCategory': app.category,
        'description': app.description,
        'author': {
          '@type': 'Person',
          'name': 'Afigo Sam'
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <SEO
        title="Mobile Apps Directory - Traditional Games & Media | Afigo-Sam"
        description="Discover Afigo-Sam's premium mobile app portfolio, including Naija Ayo Worldwide strategy board game, Afro Short inspiring podcasts/media, and Fake Detector product scanner."
        keywords="mancala games, ayo board game android, afro short entertainment, fake product detector nafdac, afigo sam apps"
        ogImage="/assets/Naija Ayo Worldwide banner (1).webp"
        jsonLd={appsItemListSchema}
      />
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-[#0a0e27] to-[#0d1230]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Explore Our <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Mobile Apps</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Premium, feature-rich native applications crafted to deliver entertainment, productivity, and lifestyle value on your phone.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-0 z-40 bg-[#0a0e27] border-b border-gray-800 shadow-lg backdrop-blur-sm bg-opacity-95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filters.map((filter) => {
              const count = getAppCount(filter);
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`
                    px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300
                    ${isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'bg-[#141b3a] text-gray-400 hover:bg-[#1a2347] hover:text-white'
                    }
                  `}
                >
                  {filter}
                  <span className={`ml-2 text-xs ${isActive ? 'text-red-200' : 'text-gray-500'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Apps List Section */}
      <section className="py-16 bg-[#0a0e27]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredApps.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-gray-400 text-sm">
                  Showing <span className="font-semibold text-white">{filteredApps.length}</span> {filteredApps.length === 1 ? 'app' : 'apps'}
                  {activeFilter !== 'All' && <span> in <span className="font-semibold text-white">{activeFilter}</span></span>}
                </p>
              </div>

              <div className="space-y-6">
                {filteredApps.map((app, index) => (
                  <div
                    key={app.id}
                    className="bg-[#141b3a] rounded-2xl overflow-hidden hover:bg-[#1a2347] transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20 border border-gray-800 hover:border-red-600/50 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Left Side - Product Info */}
                      <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                        <div>
                          {/* Category Badge */}
                          <div className="mb-4">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white ${getCategoryColor(app.category)}`}>
                              {app.category}
                            </span>
                          </div>

                          {/* App Name */}
                          <Link to={`/app/${app.id}`}>
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 hover:text-red-400 transition-colors cursor-pointer">
                              {app.name}
                            </h3>
                          </Link>

                          {/* Description */}
                          <p className="text-gray-400 text-base leading-relaxed mb-6 whitespace-pre-line">
                            {app.description}
                          </p>

                          {/* Features */}
                          <ul className="space-y-2 mb-8">
                            {(app.features || []).slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-sm text-gray-400">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* App Download and CTA Buttons */}
                        <div className="space-y-6 pt-4 border-t border-gray-800">
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Google Play Button */}
                            <a
                              href={app.googlePlayUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:scale-105 transition-all inline-block shrink-0"
                            >
                              <img
                                src="assets/Google play.webp"
                                alt="Get it on Google Play"
                                className="h-28 md:h-32 w-auto object-contain"
                              />
                            </a>

                            {/* App Store Button - Disabled */}
                            <div className="opacity-40 cursor-not-allowed group/store relative inline-block shrink-0">
                              <img
                                src="assets/App Store.webp"
                                alt="Coming soon to App Store"
                                className="h-28 md:h-32 w-auto object-contain"
                              />
                              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2.5 py-1 rounded shadow-lg opacity-0 group-hover/store:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider">
                                Coming Soon
                              </span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <Link
                              to={`/app/${app.id}`}
                              className="inline-block px-6 py-3 bg-[#1e295d] text-white font-bold rounded-lg hover:bg-red-600 transition-all shadow-md"
                            >
                              Learn More & Details →
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Product Image */}
                      <Link to={`/app/${app.id}`} className="md:w-2/5 relative overflow-hidden block bg-[#141b3a] flex items-center justify-center p-8 border-t md:border-t-0 md:border-l border-gray-800">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-600/5 z-0"></div>
                        <img
                          src={app.imageUrl}
                          alt={app.name}
                          className="w-full h-auto max-h-[320px] object-contain relative z-10 group-hover:scale-105 transition-all duration-500 rounded-xl"
                        />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#141b3a] rounded-full mb-6">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No {activeFilter} Apps Found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                We are currently cooking up apps in the {activeFilter.toLowerCase()} category. Check back soon or explore other categories!
              </p>
              <button
                onClick={() => setActiveFilter('All')}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
              >
                View All Apps
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#0a0e27] to-[#0d1230] border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Need Custom Mobile Development?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Looking for a customized Android or iOS mobile solution? Our development team can build custom applications tailored to your business needs.
          </p>
          <a
            href="mailto:admin@sampidia.com"
            className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 hover:shadow-xl hover:shadow-red-600/30 transition-all"
          >
            Contact Developer Team
          </a>
        </div>
      </section>
    </div>
  );
};

export default MobileAppsPage;
