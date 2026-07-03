import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOBILE_APPS } from '../constants';
import SEO from '../components/SEO';

const MobileAppDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const app = MOBILE_APPS.find(a => a.id === id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!app) {
    return (
      <div className="py-32 text-center bg-gray-50 min-h-[60vh] flex flex-col items-center justify-center">
        <SEO
          title="App Not Found | Afigo-Sam"
          description="The requested mobile application could not be found. Discover Afigo-Sam's premium mobile games, entertainment, and health tools."
        />
        <h1 className="text-3xl font-black text-gray-900 mb-4">App Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the mobile application you're looking for.</p>
        <Link to="/apps" className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl">
          Return to Mobile Apps
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SEO
        title={`${app.name} - Native Mobile App | Afigo-Sam`}
        description={app.description}
        keywords={`${app.name}, mobile app ${app.category.toLowerCase()}, android download, ${app.features.join(', ')}`}
        ogImage={app.imageUrl}
        ogType="website"
      />
      {/* Enhanced Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center text-sm text-gray-400 font-medium">
            <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/apps" className="hover:text-red-600 transition-colors">Mobile Apps</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 truncate max-w-[150px] md:max-w-none">{app.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-red-200">
                <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest">{app.category}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                {app.name}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                {app.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {['Free Download', 'No In-App Purchases', 'Optimized Performance', 'Native Android'].map((badge) => (
                  <span key={badge} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Download Buttons */}
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
                    className="h-32 md:h-40 w-auto object-contain"
                  />
                </a>

                {/* App Store Button - Disabled */}
                <div className="opacity-40 cursor-not-allowed group/store relative inline-block shrink-0">
                  <img
                    src="assets/App Store.webp"
                    alt="Coming soon to App Store"
                    className="h-32 md:h-40 w-auto object-contain"
                  />
                  <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2.5 py-1 rounded shadow-lg opacity-0 group-hover/store:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-[3rem] blur-2xl opacity-20"></div>
              <div className="relative bg-gray-50 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-8 min-h-[300px]">
                <img src={app.imageUrl} alt={app.name} className="w-full h-auto max-h-[450px] object-contain rounded-xl shadow-lg" />
              </div>

              {/* Stats Overlay */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black text-gray-900">5k+</div>
                    <div className="text-xs text-gray-500">Downloads</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900">4.8/5</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900">100%</div>
                    <div className="text-xs text-gray-500">Safe & Ad-free</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">App Features</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Discover the unique capabilities and features that make this application a standout utility on your smartphone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(app.detailedFeatures || []).map((feature, idx) => (
              <div key={idx} className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Showcase */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">App Showcase</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              A glimpse into the clean, intuitive, and modern interface designed for an exceptional mobile user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 max-w-4xl mx-auto">
            {(app.showcaseImages || []).map((shot, idx) => (
              <div
                key={idx}
                className="group relative cursor-pointer"
                onClick={() => setSelectedImage(shot.img)}
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-10 transition duration-700"></div>
                <div className="relative bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                  <img src={shot.img} alt={shot.title} className="w-full h-auto object-cover max-h-[500px]" />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Passcode CTA — only for Naija Ayo Worldwide */}
      {app.id === 'naija-ayo-worldwide' && (
        <section
          style={{
            background: 'linear-gradient(135deg, #09090f 0%, #1d1430 50%, #0d0914 100%)',
            position: 'relative',
            overflow: 'hidden',
            padding: '80px 24px',
          }}
        >
          {/* Background glow orbs */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              left: '-80px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              right: '-60px',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '999px',
                padding: '6px 20px',
                marginBottom: '28px',
              }}
            >
              <span style={{ fontSize: '18px' }}>🏆</span>
              <span
                style={{
                  color: '#fca5a5',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Tournament Season Now Live
              </span>
            </div>

            {/* Heading */}
            <h2
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #ffffff 0%, #fecaca 50%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ready to Compete?<br />Enter the Arena Today.
            </h2>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '18px',
                maxWidth: '560px',
                margin: '0 auto 48px',
                lineHeight: 1.7,
              }}
            >
              Join the Naija Ayo Worldwide tournament, challenge players across Nigeria and beyond, and climb the leaderboard to win exciting cash prizes.
            </p>

            {/* Stats Row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '48px',
              }}
            >
              {[
                { icon: '🎮', value: '10,000+', label: 'Active Players' },
                { icon: '💰', value: '₦5M+', label: 'Prizes Paid Out' },
                { icon: '⚡', value: 'Weekly', label: 'New Challenges' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '16px 28px',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center',
                    minWidth: '130px',
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{stat.icon}</div>
                  <div
                    style={{
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '22px',
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px', fontWeight: 600 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              to={{ pathname: '/get-code', search: '?app=naija-ayo-worldwide' }}
              id="tournament-passcode-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '17px',
                padding: '18px 40px',
                borderRadius: '20px',
                textDecoration: 'none',
                boxShadow: '0 12px 36px rgba(239,68,68,0.4)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 18px 48px rgba(239,68,68,0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 36px rgba(239,68,68,0.4)';
              }}
            >
              <span style={{ fontSize: '20px' }}>🎟️</span>
              Get Tournament Pass Code
            </Link>

            <p style={{ color: '#475569', fontSize: '13px', marginTop: '16px' }}>
              Secure payment via Flutterwave · Instant passcode delivery
            </p>
          </div>
        </section>
      )}

      {/* Target Audience / Use Cases */}
      <section className="py-24 bg-gradient-to-br from-red-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Perfect For</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our mobile apps are developed to address specific user needs and provide the best user engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {(app.perfectFor || []).map((useCase, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{useCase.desc}</p>
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm inline-block">
                  {useCase.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">User Reviews</h2>
            <p className="text-xl text-gray-500">Loved by thousands of users on Android platforms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Absolutely beautiful game. Brings back so many childhood memories with my friends.",
                author: "Tunde O.",
                role: "Naija Ayo Player"
              },
              {
                quote: "Amazing quality videos and music. It is my go-to app for daily wisdom and relaxation.",
                author: "Chioma A.",
                role: "Afro Short Listener"
              },
              {
                quote: "This is a lifesaver in the market. I can scan products and see if they are counterfeit in seconds.",
                author: "Musa B.",
                role: "Fake Detector User"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="text-red-600 text-5xl mb-4">"</div>
                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-500">Everything you need to know about the app</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is this app completely free?",
                a: "Yes! There are no purchase fees or hidden subscription costs. You can download and enjoy all features for free."
              },
              {
                q: "Is there an iOS version coming?",
                a: "Yes, the iOS version is currently in development and will be released on the Apple App Store soon. Stay tuned!"
              },
              {
                q: "How can I report a bug or suggest a feature?",
                a: "You can contact our support team at admin@sampidia.com and our development team will look into your request."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with Account Deletion Button */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Account Management & Privacy
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            We value your privacy. Under GDPR and local data protection regulations, you have full control over your account. You can request to delete your account and all associated personal data from our servers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={app.googlePlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all text-lg shadow-xl shadow-red-900/50"
            >
              Get it on Google Play
            </a>
            <Link
              to={`/delete-account?app=${app.id}`}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-bold rounded-2xl transition-all text-lg"
            >
              Delete My Account
            </Link>
          </div>
        </div>
      </section>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors p-2"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-w-5xl w-full h-auto bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedImage} alt="Full size preview" className="w-full h-auto max-h-[85vh] object-contain mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAppDetailPage;
