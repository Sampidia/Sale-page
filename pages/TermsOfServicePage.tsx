import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { BRAIN_LOGO, EMAIL_MAIN, EMAIL_SUPPORT } from '../constants';

const TermsOfServicePage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'lagos' | 'trader' | 'all'>('all');
  const [copiedAppId, setCopiedAppId] = useState(false);
  const [copiedPackageName, setCopiedPackageName] = useState(false);

  const sections = [
    { id: 'trader-declaration', label: '🏛️ App-Level Trader Status' },
    { id: 'play-compliance', label: '✅ Google Play URL Verification' },
    { id: 'license-scope', label: '1. License to Play & Access' },
    { id: 'virtual-items', label: '2. Virtual Currency & Play Billing' },
    { id: 'user-conduct', label: '3. Fair Play & Anti-Cheat' },
    { id: 'intellectual-property', label: '4. Intellectual Property' },
    { id: 'consumer-rights', label: '5. EEA/UK Consumer Protections' },
    { id: 'disclaimer-liability', label: '6. Warranties & Liability' },
    { id: 'termination-deletion', label: '7. Account & Data Deletion' },
    { id: 'governing-law', label: '8. Governing Law & Contact' },
  ];

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const offset = 100;
          const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.hash]);

  const copyAppId = () => {
    navigator.clipboard.writeText('2077465642893808');
    setCopiedAppId(true);
    setTimeout(() => setCopiedAppId(false), 2500);
  };

  const copyPackageName = () => {
    navigator.clipboard.writeText('com.sampidia.lagosstreetrace');
    setCopiedPackageName(true);
    setTimeout(() => setCopiedPackageName(false), 2500);
  };

  const termsSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service & App-Level Trader Status | Lagos Street Race & Afigo Ecosystem',
    description:
      'Official Terms of Service, App-Level Trader Status declaration under the EU Digital Services Act (DSA), and consumer protection disclosures for Lagos Street Race (Google Play, App Store & Meta).',
    publisher: {
      '@type': 'Organization',
      name: 'Afigo Brightpath Technology LTD',
      url: 'https://afigo.sampidia.com',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SEO
        title="Terms of Service & Trader Status | Lagos Street Race & Afigo Ecosystem"
        description="Official Terms of Service and App-Level Trader Status declaration for Lagos Street Race (Android Google Play, App Store, Meta Platforms) in compliance with Google Developer best practices as of November 2026."
        keywords="Lagos Street Race terms of service, app-level trader status, google play terms of service, digital services act trader declaration, com.sampidia.lagosstreetrace, 2077465642893808, Afigo Brightpath Technology LTD, EEA consumer protection"
        ogImage="/assets/og-preview.png"
        jsonLd={termsSchema}
      />

      {/* Hero Header */}
      <header className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-6 flex justify-center opacity-90">
            {BRAIN_LOGO}
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Google Play Trader Status Declared & Compliant</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Legal terms, in-app billing rules, and verified <strong className="text-white">App-Level Trader Status</strong> for{' '}
            <strong className="text-white">Lagos Street Race</strong> and the{' '}
            <strong className="text-white">Afigo-Sam Digital Ecosystem</strong>.
          </p>

          {/* Quick Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-full font-bold">
              ✓ Declared Trader App (EU / UK Consumer Law Active)
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-semibold text-gray-200 border border-white/10">
              🏎️ App: <strong>Lagos Street Race</strong> (Android & iOS)
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-semibold text-gray-200 border border-white/10">
              📦 Package: <strong>com.sampidia.lagosstreetrace</strong>
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-semibold text-gray-200 border border-white/10">
              📅 Updated: November 6, 2026
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-semibold text-gray-200 border border-white/10">
              🏛️ Entity: Afigo Brightpath Technology LTD
            </span>
          </div>

          {/* View Filter Switcher */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-black/40 backdrop-blur-lg border border-white/10">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🌟 Complete Terms & Disclosures
            </button>
            <button
              onClick={() => setActiveTab('trader')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'trader'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>🏛️ Trader Status Declaration</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">DSA</span>
            </button>
            <button
              onClick={() => setActiveTab('lagos')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'lagos'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🏎️ Lagos Street Race EULA
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Sticky Left Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 p-6 shadow-xl shadow-gray-200/50 space-y-6">
              
              <div>
                <div className="flex items-center justify-between mb-3 px-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600">
                    Google Play Declared
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Nov 2026
                  </span>
                </div>
                <nav className="space-y-1">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => scrollToSection(e, sec.id)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                    >
                      {sec.label}
                    </a>
                  ))}
                </nav>
              </div>

              <hr className="border-gray-100" />

              {/* Related Policies */}
              <div className="px-3 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Related Policies
                </h4>
                <Link
                  to="/privacy-policy"
                  className="block text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors"
                >
                  🔒 Privacy Policy & Data Safety →
                </Link>
                <Link
                  to="/delete-account?app=lagos-street-race"
                  className="block text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors"
                >
                  🗑️ Account & Data Deletion →
                </Link>
              </div>

              {/* Developer Support */}
              <div className="pt-4 border-t border-gray-100 px-3 text-xs text-gray-500">
                <p className="font-bold text-gray-700 mb-1">Developer & Trader Support</p>
                <a
                  href={`mailto:${EMAIL_MAIN}`}
                  className="text-red-600 font-semibold hover:underline block break-all mb-1"
                >
                  {EMAIL_MAIN}
                </a>
                <a
                  href={`mailto:${EMAIL_SUPPORT}`}
                  className="text-gray-500 hover:underline block break-all text-[11px]"
                >
                  {EMAIL_SUPPORT}
                </a>
              </div>
            </div>
          </aside>

          {/* Main Terms Body (Right) */}
          <main className="col-span-1 lg:col-span-3 space-y-12">

            {/* ========================================================================= */}
            {/* APP-LEVEL TRADER STATUS DECLARATION (GOOGLE PLAY CONSOLE & EU DSA) */}
            {/* ========================================================================= */}
            <section
              id="trader-declaration"
              className="scroll-mt-24 bg-gradient-to-br from-emerald-950 via-slate-900 to-black rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl border border-emerald-700/30 relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    EU Digital Services Act (DSA) Compliance
                  </span>
                  <span className="bg-white/10 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                    Google Play Developer Best Practice
                  </span>
                  <span className="bg-white/10 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                    Effective: November 2026
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  App-Level Trader Status & Consumer Rights Declaration
                </h2>

                <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-2xl p-6 backdrop-blur-md space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">⚖️</span>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-200 mb-1">
                        Trader Status Set from Developer Account
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Under relevant international laws, the European Union Digital Services Act (DSA Article 30), and EU Consumer Rights Directive (2011/83/EU), a <strong>trader</strong> is any individual or organization acting for purposes relating to their trade, business, craft, or profession.{' '}
                        <a
                          href="https://support.google.com/googleplay/android-developer/answer/17594752"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 font-bold underline hover:text-emerald-300"
                        >
                          [Learn more from Google Play]
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-emerald-500/20 pt-4 space-y-3">
                    <div className="p-4 bg-emerald-500/15 rounded-xl border border-emerald-400/30">
                      <div className="flex items-center gap-2 text-sm font-black text-emerald-300 mb-1">
                        <span>✅</span>
                        <span>Official Declaration: Yes, my trader status applies to this app</span>
                      </div>
                      <p className="text-xs text-gray-200 leading-relaxed">
                        <strong>Trader status correctly applies to Lagos Street Race</strong> (Package: <code>com.sampidia.lagosstreetrace</code>) and commercial products released under our developer account. Users in the <strong>European Economic Area (EEA)</strong> and the <strong>United Kingdom (UK)</strong> are fully protected by statutory consumer protection laws.
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      <em>Non-trader exemption notice:</em> If a non-trader app declaration were made, users in the EEA and UK would be informed that statutory consumer protection laws do not apply. However, for <strong>Lagos Street Race</strong> and our monetized software portfolio, <strong>trader status is fully confirmed and enforced</strong>.
                    </p>
                  </div>
                </div>

                {/* Trader Verification Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-gray-400 font-medium">Declared Trader / Legal Entity</p>
                    <p className="font-bold text-white text-sm mt-0.5">Afigo Brightpath Technology LTD</p>
                    <p className="text-gray-400 text-[11px] mt-1">Trading as Afigo-Sam & SamPidia</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-gray-400 font-medium">Trader Official Contact</p>
                    <p className="font-bold text-emerald-300 text-sm mt-0.5">{EMAIL_MAIN}</p>
                    <p className="text-gray-400 text-[11px] mt-1">Direct inquiries: {EMAIL_SUPPORT}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-gray-400 font-medium">Android Package (Google Play)</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="font-mono font-bold text-white text-xs">com.sampidia.lagosstreetrace</p>
                      <button
                        onClick={copyPackageName}
                        className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-semibold"
                      >
                        {copiedPackageName ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-gray-400 font-medium">Meta Application ID (Instant Games)</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="font-mono font-bold text-white text-xs">2077465642893808</p>
                      <button
                        onClick={copyAppId}
                        className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-semibold"
                      >
                        {copiedAppId ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* GOOGLE PLAY TERMS OF SERVICE URL SPECIFICATIONS & VERIFICATION */}
            {/* ========================================================================= */}
            <section
              id="play-compliance"
              className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    <span>Google Play Developer Console Specification</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                    Terms of Service URL Compliance Verification
                  </h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  November 2026 Certified
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                Google Play Console displays this Terms of Service URL globally to users on your store listing. This page strictly adheres to every mandatory Google Play Developer Program parameter:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 flex items-start gap-3">
                  <span className="text-emerald-600 text-lg font-bold">✓</span>
                  <div>
                    <strong className="text-emerald-950 font-bold block mb-1">Active, Publicly Accessible HTTPS URL</strong>
                    <p className="text-emerald-900/80 leading-relaxed">
                      Hosted on a secured endpoint with an active SSL certificate: <code className="bg-white/80 px-1 py-0.5 rounded text-[11px] font-mono text-emerald-800">https://afigo.sampidia.com/#/terms-of-service</code>.
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 flex items-start gap-3">
                  <span className="text-emerald-600 text-lg font-bold">✓</span>
                  <div>
                    <strong className="text-emerald-950 font-bold block mb-1">Worldwide Access Without Geofencing</strong>
                    <p className="text-emerald-900/80 leading-relaxed">
                      Accessible globally without geographical restrictions, IP geofencing, firewalls, or mandatory user login/paywalls.
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 flex items-start gap-3">
                  <span className="text-emerald-600 text-lg font-bold">✓</span>
                  <div>
                    <strong className="text-emerald-950 font-bold block mb-1">Standard Non-Editable HTML Webpage</strong>
                    <p className="text-emerald-900/80 leading-relaxed">
                      Rendered on a standard, accessible HTML/React web layout, rather than a PDF, download prompt, or editable doc.
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 flex items-start gap-3">
                  <span className="text-emerald-600 text-lg font-bold">✓</span>
                  <div>
                    <strong className="text-emerald-950 font-bold block mb-1">App-Specific Application</strong>
                    <p className="text-emerald-900/80 leading-relaxed">
                      Explicitly governs <strong>Lagos Street Race</strong> (<code>com.sampidia.lagosstreetrace</code>) and developer portfolio services.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* FULL COMPREHENSIVE TERMS OF SERVICE BODY */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50 space-y-10">

              <div className="pb-6 border-b border-gray-100">
                <span className="text-xs font-black uppercase tracking-wider text-red-600">
                  User License Agreement (EULA) & Terms of Use
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                  Terms of Service for Lagos Street Race & Portfolio
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2 font-mono">
                  <span><strong>Effective:</strong> November 4, 2026</span>
                  <span><strong>Last Updated:</strong> November 6, 2026</span>
                  <span><strong>Publisher:</strong> Afigo Brightpath Technology LTD</span>
                </div>
              </div>

              {/* 1. License to Play & Access */}
              <section id="license-scope" className="scroll-mt-24 space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">1</span>
                  License to Play & Device Compatibility
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  By downloading, installing, accessing, or playing <strong>Lagos Street Race</strong> on Android (Google Play Store), Apple iOS (App Store), or Meta Platforms (Facebook Instant Games), you enter into a legally binding agreement with <strong>Afigo Brightpath Technology LTD</strong> ("we", "us", "our", or "Sampidia").
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span><strong>Limited License:</strong> We grant you a revocable, non-exclusive, non-transferable, non-sublicensable license to install and play the game for personal, non-commercial entertainment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span><strong>Hardware & OS:</strong> You are responsible for ensuring your device meets minimum requirements (Android 8.0+ with OpenGL ES 3.0 or WebGL 2.0 browser engine).</span>
                  </li>
                </ul>
              </section>

              <hr className="border-gray-100" />

              {/* 2. Virtual Items & Google Play In-App Billing */}
              <section id="virtual-items" className="scroll-mt-24 space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">2</span>
                  Virtual Currency, In-Game Assets & Google Play Billing
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  The game may feature virtual currency ("Lagos Coins"), vehicle unlocks, nitro speed canisters, paint customizations, and access passes ("VIP Season Pass"):
                </p>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3 text-xs sm:text-sm text-gray-600">
                  <p>
                    <strong className="text-gray-900">Google Play Payments Policy Compliance:</strong> On Android devices, all payments for digital goods and virtual currency are processed exclusively through the official <strong>Google Play In-App Billing API</strong>. The developer does not process, store, or access credit card details or payment credentials.
                  </p>
                  <p>
                    <strong className="text-gray-900">Virtual Goods are Licensed, Not Sold:</strong> Lagos Coins and virtual assets have no real-world monetary value, accrue no interest, and cannot be redeemed for fiat currency, physical goods, or services outside of Lagos Street Race.
                  </p>
                  <p>
                    <strong className="text-gray-900">Transferability & Expiration:</strong> Virtual items cannot be traded, sold, or transferred between player accounts. All virtual items are tied to your authenticated cloud progress (via Google Play Games Services or Meta Cloud Storage).
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* 3. Fair Play & Anti-Cheat */}
              <section id="user-conduct" className="scroll-mt-24 space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">3</span>
                  User Conduct, Fair Play & Anti-Cheat
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  To maintain integrity across the Third Mainland Bridge leaderboards and fair competition, you agree not to:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Use cheats, memory injectors, automated bots, speed hacks, or modified APKs/AAB binaries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Falsify network packets, intercept score reporting endpoints, or manipulate cloud save records.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Submit abusive, vulgar, or defamatory usernames, avatars, or messages via social share dialogs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>We reserve the immediate right to reset scores, invalidate fraudulent transactions, or ban accounts caught manipulating gameplay telemetry.</span>
                  </li>
                </ul>
              </section>

              <hr className="border-gray-100" />

              {/* 4. Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-24 space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">4</span>
                  Intellectual Property & Asset Protection
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  All 3D vehicle models, sound design, Afrobeat musical arrangements, track geometry, engine sound effects, shaders, UI designs, codebases, and trademark rights associated with <strong>Lagos Street Race</strong> and <strong>Afigo-Sam</strong> are the exclusive property of <strong>Afigo Brightpath Technology LTD</strong> or authorized licensors.
                </p>
                <p className="text-xs text-gray-500">
                  You may not reverse engineer, decompile, extract assets, or distribute derivative versions of the application without prior express written authorization.
                </p>
              </section>

              <hr className="border-gray-100" />

              {/* 5. EEA/UK Consumer Protections */}
              <section id="consumer-rights" className="scroll-mt-24 space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-xs font-bold">5</span>
                  EEA and UK Consumer Protection Rights (Trader Declaration)
                </h3>
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-3">
                  <p>
                    Because <strong>Afigo Brightpath Technology LTD</strong> has confirmed its <strong>Trader Status</strong> on Google Play, consumers residing in the <strong>European Economic Area (EEA)</strong> and the <strong>United Kingdom (UK)</strong> benefit from statutory protections under EU Directive 2011/83/EU and the UK Consumer Rights Act 2015:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-emerald-900">
                    <li>
                      <strong>Right of Withdrawal for Digital Content:</strong> Under EU/UK law, you normally have a 14-day statutory right of withdrawal. However, for immediate digital content delivery (e.g., instant activation of Lagos Coins or VIP Passes), you acknowledge that fulfillment begins immediately upon purchase with your express consent, waiving the right of withdrawal once digital delivery has commenced.
                    </li>
                    <li>
                      <strong>Statutory Conformity:</strong> Digital goods and gameplay features will conform to store descriptions and function as reasonably expected.
                    </li>
                    <li>
                      <strong>Dispute Resolution:</strong> If you have an unresolved dispute, you may contact the developer at <a href={`mailto:${EMAIL_MAIN}`} className="font-bold underline text-emerald-800">{EMAIL_MAIN}</a> or utilize the European Commission’s Online Dispute Resolution (ODR) platform.
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* 6. Disclaimers & Limitation of Liability */}
              <section id="disclaimer-liability" className="scroll-mt-24 space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">6</span>
                  Disclaimer of Warranties & Limitation of Liability
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  Lagos Street Race is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis. To the maximum extent permitted by applicable law, Afigo Brightpath Technology LTD disclaims all warranties, express or implied.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed text-justify">
                  In no event shall the developer, its directors, or affiliates be liable for indirect, incidental, punitive, or consequential damages resulting from device incompatibilities, network latency, gameplay disruptions, or loss of game progress due to local cache clearing or unauthorized third-party interference.
                </p>
              </section>

              <hr className="border-gray-100" />

              {/* 7. Account & Data Deletion */}
              <section id="termination-deletion" className="scroll-mt-24 space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">7</span>
                  Termination & User Account Deletion Rights
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  You may stop playing the game and terminate this agreement at any time. In compliance with <strong>Google Play’s Account Deletion Policy</strong>, you can request the permanent purge of all cloud-saved progress, leaderboard entries, and user IDs without needing to keep the game installed:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/delete-account?app=lagos-street-race"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-1.5"
                  >
                    <span>Launch Web Data Deletion Portal</span>
                    <span>→</span>
                  </Link>
                  <Link
                    to="/privacy-policy"
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Review Privacy Policy & Data Safety</span>
                    <span>→</span>
                  </Link>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* 8. Governing Law & Contact */}
              <section id="governing-law" className="scroll-mt-24 space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">8</span>
                  Governing Law, Jurisdiction & Official Contact
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  These Terms are governed by applicable laws. Where mandatory local consumer protection regulations apply (such as in the EEA or UK), those protections remain fully accessible to you.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900">Afigo Brightpath Technology LTD</h4>
                    <p className="text-xs text-gray-500">Developer Entity & Declared Trader</p>
                    <p className="text-xs text-gray-600 mt-1">Direct support & legal inquiries: <strong className="text-gray-800">{EMAIL_MAIN}</strong></p>
                  </div>
                  <a
                    href={`mailto:${EMAIL_MAIN}?subject=Terms%20of%20Service%20Inquiry%20-%20Lagos%20Street%20Race`}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md inline-block whitespace-nowrap text-xs"
                  >
                    Contact Legal Support
                  </a>
                </div>
              </section>

            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;

