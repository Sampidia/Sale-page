import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { BRAIN_LOGO } from '../constants';

interface PrivacyPolicyPageProps {
  defaultTab?: string;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ defaultTab }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'all' | 'lagos' | 'ecosystem'>('all');
  const [copiedAppId, setCopiedAppId] = useState(false);

  const lagosSections = [
    { id: 'lagos-street-race-privacy', label: '🔒 Lagos Race: Privacy Policy' },
    { id: 'lagos-street-race-terms', label: '📜 Lagos Race: Terms of Service' },
    { id: 'lagos-street-race-deletion', label: '🗑️ Lagos Race: Data Deletion' },
  ];

  const ecosystemSections = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'coverage-plugins', label: '2. WordPress Plugins & Themes' },
    { id: 'coverage-apps', label: '3. Mobile Applications' },
    { id: 'data-safety', label: '4. Android Data Safety' },
    { id: 'data-erasure', label: '5. Account & Data Deletion' },
    { id: 'data-collection', label: '6. Information We Collect' },
    { id: 'third-parties', label: '7. Third-Party Services' },
    { id: 'data-protection', label: '8. Security & Protection' },
    { id: 'user-rights', label: '9. GDPR & Global Rights' },
    { id: 'contact', label: '10. Contact Information' },
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
    // Check url hash or query param or defaultTab
    const hashTarget = location.hash ? location.hash.replace('#', '') : '';
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab') || defaultTab || '';

    if (hashTarget) {
      if (
        hashTarget.includes('lagos') ||
        hashTarget === 'terms' ||
        hashTarget === 'deletion'
      ) {
        if (hashTarget === 'lagos-street-race' || hashTarget === 'lagos') {
          setActiveTab('lagos');
        }
      }
      setTimeout(() => {
        const targetEl = document.getElementById(hashTarget);
        if (targetEl) {
          const offset = 100;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 150);
    } else if (tabParam) {
      if (tabParam.includes('lagos') || tabParam === 'terms' || tabParam === 'deletion') {
        setActiveTab('lagos');
        const mapTarget: Record<string, string> = {
          terms: 'lagos-street-race-terms',
          'lagos-terms': 'lagos-street-race-terms',
          privacy: 'lagos-street-race-privacy',
          'lagos-privacy': 'lagos-street-race-privacy',
          deletion: 'lagos-street-race-deletion',
          'lagos-deletion': 'lagos-street-race-deletion',
        };
        const targetId = mapTarget[tabParam] || 'lagos-street-race';
        setTimeout(() => {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            const offset = 100;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 150);
      } else if (tabParam === 'ecosystem') {
        setActiveTab('ecosystem');
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.hash, location.search, defaultTab]);

  const copyAppId = () => {
    navigator.clipboard.writeText('2077465642893808');
    setCopiedAppId(true);
    setTimeout(() => setCopiedAppId(false), 2500);
  };

  const privacySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy & Terms | Lagos Street Race & Afigo Ecosystem',
    description:
      'Official Privacy Policy, Terms of Service, and User Data Deletion Instructions for Lagos Street Race (Meta Instant Game ID: 2077465642893808) and Afigo-Sam digital products.',
    publisher: {
      '@type': 'Organization',
      name: 'Afigo Brightpath Technology LTD',
      url: 'https://afigo.sampidia.com',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SEO
        title="Privacy Policy & Terms | Lagos Street Race & Afigo Ecosystem"
        description="Official Privacy Policy, Terms of Service, and User Data Deletion Instructions for Lagos Street Race (Facebook Instant Games, Application ID: 2077465642893808) and Afigo-Sam digital products."
        keywords="Lagos Street Race privacy policy, Lagos Street Race terms, Lagos Street Race data deletion, facebook instant games privacy, meta audience network, FBInstant, 2077465642893808, Afigo Brightpath Technology LTD, android data safety, GDPR"
        ogImage="/assets/og-preview.png"
        jsonLd={privacySchema}
      />

      {/* Hero Header */}
      <header className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-6 flex justify-center opacity-90">
            {BRAIN_LOGO}
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Official Legal & Privacy Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Privacy Policy & Terms
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transparent policies, terms of service, and user data rights for{' '}
            <strong className="text-white">Lagos Street Race (Facebook Instant Games)</strong> and the{' '}
            <strong className="text-white">Afigo-Sam Digital Ecosystem</strong>.
          </p>

          {/* Quick Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-semibold text-gray-200 border border-white/10">
              🏎️ Lagos Street Race: App ID <strong>2077465642893808</strong>
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-semibold text-gray-200 border border-white/10">
              📅 Effective Date: November 4, 2026
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
              🌟 All Documentation
            </button>
            <button
              onClick={() => setActiveTab('lagos')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'lagos'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>🏎️ Lagos Street Race</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">Meta</span>
            </button>
            <button
              onClick={() => setActiveTab('ecosystem')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'ecosystem'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🌐 Ecosystem General
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
              
              {/* Lagos Street Race Nav Group */}
              <div>
                <div className="flex items-center justify-between mb-3 px-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-red-600">
                    🏎️ Lagos Street Race
                  </h3>
                  <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200">
                    Instant Game
                  </span>
                </div>
                <nav className="space-y-1">
                  {lagosSections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => {
                        if (activeTab === 'ecosystem') setActiveTab('all');
                        scrollToSection(e, sec.id);
                      }}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      {sec.label}
                    </a>
                  ))}
                </nav>
              </div>

              <hr className="border-gray-100" />

              {/* Ecosystem Nav Group */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 px-3">
                  🌐 General Ecosystem
                </h3>
                <nav className="space-y-1">
                  {ecosystemSections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => {
                        if (activeTab === 'lagos') setActiveTab('all');
                        scrollToSection(e, sec.id);
                      }}
                      className="block px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                    >
                      {sec.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Quick Support Badge */}
              <div className="pt-4 border-t border-gray-100 px-3 text-xs text-gray-500">
                <p className="font-bold text-gray-700 mb-1">Support Contact</p>
                <a
                  href="mailto:admin@sampidia.com"
                  className="text-red-600 font-semibold hover:underline block break-all"
                >
                  admin@sampidia.com
                </a>
              </div>
            </div>
          </aside>

          {/* Policy Text (Right) */}
          <main className="col-span-1 lg:col-span-3 space-y-12">

            {/* ========================================================================= */}
            {/* LAGOS STREET RACE SECTION (META PLATFORMS & FACEBOOK INSTANT GAMES) */}
            {/* ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'lagos') && (
              <div id="lagos-street-race" className="scroll-mt-24 space-y-8">
                
                {/* Visual Header Card for Lagos Street Race */}
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl border border-red-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <svg className="w-64 h-64 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                    </svg>
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        Facebook Instant Game
                      </span>
                      <span className="bg-white/10 text-gray-300 text-[11px] font-medium px-3 py-1 rounded-full border border-white/10">
                        Meta Platforms Verified
                      </span>
                      <span className="bg-white/10 text-gray-300 text-[11px] font-medium px-3 py-1 rounded-full border border-white/10">
                        Effective: Nov 4, 2026
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-white">
                      Lagos Street Race — Legal & Compliance Hub
                    </h2>

                    <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                      Official legal documentation for <strong>Lagos Street Race</strong> on Facebook Instant Games and Meta Platforms, published by <strong>Afigo Brightpath Technology LTD</strong>.
                    </p>

                    {/* Metadata & Quick Jump Grid */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 font-medium">Meta Application ID</p>
                          <p className="font-mono font-bold text-white text-sm">2077465642893808</p>
                        </div>
                        <button
                          onClick={copyAppId}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-all"
                        >
                          {copiedAppId ? '✓ Copied' : 'Copy ID'}
                        </button>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 font-medium">Developer & Entity</p>
                          <p className="font-bold text-white text-sm">Afigo Brightpath Technology LTD</p>
                        </div>
                        <a
                          href="mailto:admin@sampidia.com"
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all"
                        >
                          Email Support
                        </a>
                      </div>
                    </div>

                    {/* Quick Section Shortcuts */}
                    <div className="pt-2 flex flex-wrap gap-2 text-xs">
                      <a
                        href="#lagos-street-race-privacy"
                        onClick={(e) => scrollToSection(e, 'lagos-street-race-privacy')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 border border-white/10"
                      >
                        <span>🔒 Privacy Policy</span>
                        <span>↓</span>
                      </a>
                      <a
                        href="#lagos-street-race-terms"
                        onClick={(e) => scrollToSection(e, 'lagos-street-race-terms')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 border border-white/10"
                      >
                        <span>📜 Terms of Service</span>
                        <span>↓</span>
                      </a>
                      <a
                        href="#lagos-street-race-deletion"
                        onClick={(e) => scrollToSection(e, 'lagos-street-race-deletion')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 border border-white/10"
                      >
                        <span>🗑️ Data Deletion Instructions</span>
                        <span>↓</span>
                      </a>
                      <Link
                        to="/delete-account?app=lagos-street-race"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>Self-Service Deletion Form →</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* 1. LAGOS STREET RACE: PRIVACY POLICY */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-street-race-privacy"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <span id="lagos-privacy" className="scroll-mt-24 block"></span>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                        <span>Facebook Instant Games</span>
                        <span>•</span>
                        <span>Meta Platforms</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        Privacy Policy for Lagos Street Race
                      </h2>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-mono">
                      <div><strong>Effective Date:</strong> November 4, 2026</div>
                      <div><strong>Last Updated:</strong> November 4, 2026</div>
                      <div className="text-red-600 font-bold">App ID: 2077465642893808</div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-8 text-base">
                    This Privacy Policy explains how <strong>"Lagos Street Race"</strong> ("we", "us", or "our") collects, uses, and safeguards information when you play our game on Facebook Instant Games and Meta Platforms.
                  </p>

                  <div className="space-y-8">
                    {/* 1. Information We Access and Collect */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">1</span>
                        Information We Access and Collect
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        Lagos Street Race operates on the Facebook Instant Games platform. We adhere to Meta’s Zero-Permission and Gaming Profile guidelines:
                      </p>
                      <ul className="space-y-3 text-sm text-gray-700 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Gaming Profile Information:</strong> Through the Meta Instant Games SDK (<code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs">FBInstant.player</code>), we may access your public Facebook Gaming ID, Gaming Profile name, and Gaming Profile photo strictly for display on in-game leaderboards and cockpit displays.
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Game Progress & Telemetry:</strong> We store in-game progress (including distance traveled, high scores, coins, unlocked vehicles, and customizations). This data is stored using Meta's Cloud Save API (<code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs">FBInstant.player.setDataAsync</code>) and your browser's local storage.
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Advertising & Analytics:</strong> We display in-game ads provided by Meta Audience Network (Rewarded Video and Interstitial Ads). Meta may collect device identifiers and usage metrics in accordance with the{' '}
                            <a
                              href="https://www.facebook.com/privacy/policy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 font-semibold underline hover:text-red-700"
                            >
                              Meta Privacy Policy
                            </a>.
                          </div>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200/70 text-xs text-gray-600 font-semibold bg-white p-3 rounded-xl border border-gray-200">
                        🛡️ <strong>Zero Sensitive Data Policy:</strong> We <u>do not</u> collect or store sensitive personal information such as your phone number, real-world physical address, financial card details, or private contact lists.
                      </div>
                    </div>

                    {/* 2. How We Use Your Information */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">2</span>
                        How We Use Your Information
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        We use the information accessible through Meta strictly to:
                      </p>
                      <ul className="space-y-2.5 text-sm text-gray-700 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Operate, maintain, and provide core game features.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Display your score and gaming avatar on Third Mainland Bridge leaderboards.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Sync and restore your vehicle purchases and unlocked content across sessions via Meta Cloud Storage.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Reward in-game perks (e.g. "Second Chance" extra lives) upon voluntary viewing of Rewarded Ads.</span>
                        </li>
                      </ul>
                    </div>

                    {/* 3. Data Sharing and Third Parties */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">3</span>
                        Data Sharing and Third Parties
                      </h3>
                      <ul className="space-y-3 text-sm text-gray-700 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">No Sale of Data:</strong> We do not sell, rent, or trade your personal data to any third party.
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Meta Platforms:</strong> As an Instant Game, all gameplay data flows through Meta’s secure hosting infrastructure under the{' '}
                            <a
                              href="https://developers.facebook.com/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 font-semibold underline hover:text-red-700"
                            >
                              Meta Platform Terms
                            </a>.
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* 4. Data Retention and Deletion */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">4</span>
                        Data Retention and Deletion
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        Your game progress remains in Meta Cloud Save for as long as you keep the game connected to your Facebook account. You have the right to request deletion of your gameplay data at any time. For detailed instructions, please see our{' '}
                        <a
                          href="#lagos-street-race-deletion"
                          onClick={(e) => scrollToSection(e, 'lagos-street-race-deletion')}
                          className="text-red-600 font-bold underline hover:text-red-700"
                        >
                          User Data Deletion Instructions
                        </a>{' '}
                        below.
                      </p>
                    </div>

                    {/* 5. Children's Privacy */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">5</span>
                        Children's Privacy
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Lagos Street Race is designed for general audiences and does not knowingly collect personal information from children under the age of 13.
                      </p>
                    </div>

                    {/* 6. Contact Us */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 sm:p-7 border border-red-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">6</span>
                        Contact Us
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at:
                      </p>
                      <div className="space-y-2 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">Email:</span>
                          <a
                            href="mailto:admin@sampidia.com"
                            className="text-red-600 font-semibold underline hover:text-red-700"
                          >
                            admin@sampidia.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">Developer/Entity:</span>
                          <span className="font-medium">Afigo Brightpath Technology LTD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* 2. LAGOS STREET RACE: TERMS OF SERVICE */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-street-race-terms"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <span id="lagos-terms" className="scroll-mt-24 block"></span>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                        <span>User Agreement</span>
                        <span>•</span>
                        <span>Facebook Instant Games</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        Terms of Service for Lagos Street Race
                      </h2>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-mono">
                      <div><strong>Effective Date:</strong> November 4, 2026</div>
                      <div><strong>Last Updated:</strong> November 4, 2026</div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-8 text-base">
                    Welcome to <strong>Lagos Street Race</strong>! By launching or playing the game on Facebook Instant Games or Meta Platforms, you agree to be bound by these Terms of Service ("Terms").
                  </p>

                  <div className="space-y-8">
                    {/* 1. License to Play */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">1</span>
                        License to Play
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        We grant you a non-exclusive, non-transferable, revocable license to access and play Lagos Street Race solely for your personal, non-commercial entertainment on supported Meta platforms.
                      </p>
                    </div>

                    {/* 2. Virtual Items and In-Game Currency */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">2</span>
                        Virtual Items and In-Game Currency
                      </h3>
                      <ul className="space-y-2.5 text-sm text-gray-700 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>The game may include virtual currency ("Lagos Coins"), vehicle upgrades, and virtual cosmetic passes ("VIP Season Pass").</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>Virtual items have no real-world monetary value and cannot be redeemed for fiat currency, goods, or real-world services.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>All virtual items and currency are licensed, not sold. If payments are made through Meta In-App Purchases, they are processed directly by Meta and subject to Meta's Payment Terms.</span>
                        </li>
                      </ul>
                    </div>

                    {/* 3. User Conduct */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">3</span>
                        User Conduct
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        When using social features, challenges, and leaderboards, you agree not to:
                      </p>
                      <ul className="space-y-2.5 text-sm text-gray-700 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>Exploit, hack, automate, or reverse-engineer game mechanics or score reporting APIs.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>Post abusive, defamatory, or offensive content via the Facebook Challenge or Messenger share dialogs.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>Interfere with other players' enjoyment or the integrity of global rankings.</span>
                        </li>
                      </ul>
                    </div>

                    {/* 4. Intellectual Property */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">4</span>
                        Intellectual Property
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        All assets, 3D vehicle models, sounds, voice lines, shaders, visual designs, and game code in Lagos Street Race are the property of the developer or used under licensed agreement. You may not copy, extract, distribute, or modify game assets without prior written consent.
                      </p>
                    </div>

                    {/* 5. Disclaimer of Warranties & Limitation of Liability */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">5</span>
                        Disclaimer of Warranties & Limitation of Liability
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Lagos Street Race is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. In no event shall the developer be liable for any indirect, incidental, or consequential damages resulting from your access to or inability to access the game.
                      </p>
                    </div>

                    {/* 6. Governing Law & Contact */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 sm:p-7 border border-red-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">6</span>
                        Governing Law & Contact
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        These Terms are governed by applicable laws. For questions or support, contact:
                      </p>
                      <div className="space-y-2 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">Email:</span>
                          <a
                            href="mailto:admin@sampidia.com"
                            className="text-red-600 font-semibold underline hover:text-red-700"
                          >
                            admin@sampidia.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">Developer/Entity:</span>
                          <span className="font-medium">Afigo Brightpath Technology LTD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* 3. LAGOS STREET RACE: USER DATA DELETION INSTRUCTIONS */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-street-race-deletion"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <span id="lagos-deletion" className="scroll-mt-24 block"></span>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                        <span>GDPR / CCPA / Meta Platform Compliance</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        User Data Deletion Instructions for Lagos Street Race
                      </h2>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-mono">
                      <div className="text-red-600 font-bold">Application ID: 2077465642893808</div>
                      <div><strong>Effective Date:</strong> November 4, 2026</div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-8 text-base">
                    In compliance with Meta Platform Policies and General Data Protection Regulations (GDPR / CCPA), users of <strong>Lagos Street Race</strong> have the right to request the deletion of all personal data, game progress, and leaderboard scores associated with their account.
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Below are the steps to delete your data:
                  </p>

                  <div className="space-y-8">
                    {/* Method 1: Automatic Deletion via Facebook Settings */}
                    <div className="bg-emerald-50/60 rounded-2xl p-6 sm:p-8 border border-emerald-200">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="text-lg sm:text-xl font-black text-emerald-950 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            1
                          </span>
                          Method 1: Automatic Deletion via Facebook Settings (Recommended)
                        </h3>
                        <span className="text-xs bg-emerald-200/70 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                          Instant Callback
                        </span>
                      </div>
                      <p className="text-emerald-900/90 text-sm leading-relaxed mb-4">
                        You can remove Lagos Street Race and revoke its data permissions directly through your Facebook account:
                      </p>
                      <ol className="space-y-3 text-sm text-gray-800 list-decimal pl-5">
                        <li>Log in to your Facebook account on web or mobile.</li>
                        <li>Go to <strong>Settings & Privacy</strong> &gt; <strong>Settings</strong>.</li>
                        <li>In the left navigation menu, select <strong>Apps and Websites</strong> (or <strong>Games</strong>).</li>
                        <li>Locate <strong>Lagos Street Race</strong> in the list of active games.</li>
                        <li>Click <strong>Remove</strong> next to the game.</li>
                        <li>Check the box to <strong>"Delete posts, videos or events Lagos Street Race posted on your timeline"</strong> and click <strong>Remove</strong>.</li>
                        <li>Facebook will immediately revoke the game's access and trigger Meta's automated data deletion callback.</li>
                      </ol>
                      <div className="mt-5 pt-4 border-t border-emerald-200/60 flex flex-wrap gap-3">
                        <a
                          href="https://www.facebook.com/settings?tab=applications"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-1.5"
                        >
                          <span>Open Facebook Apps & Games Settings</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>

                    {/* Method 2: Manual Data Deletion Request */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            2
                          </span>
                          Method 2: Manual Data Deletion Request (Developer Support)
                        </h3>
                        <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2.5 py-1 rounded-full">
                          30-Day Turnaround
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        If you would like us to permanently purge your leaderboard entries, cloud saves, and associated Gaming IDs from our records manually:
                      </p>
                      <ol className="space-y-3 text-sm text-gray-800 list-decimal pl-5 mb-5">
                        <li>
                          Send an email to{' '}
                          <a href="mailto:admin@sampidia.com" className="text-red-600 font-bold underline">
                            admin@sampidia.com
                          </a>.
                        </li>
                        <li>
                          <strong>Subject line:</strong> <code className="bg-gray-200 text-gray-900 px-2 py-0.5 rounded font-mono text-xs">Data Deletion Request - Lagos Street Race</code>
                        </li>
                        <li>
                          Include the following details in your email:
                          <ul className="list-disc pl-5 mt-1.5 space-y-1 text-gray-600 text-xs">
                            <li>Your Facebook Gaming Profile Name (or Facebook Profile URL).</li>
                            <li>Your Meta Player ID (accessible in the in-game settings/garage, if available).</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Resolution Time:</strong> We will verify and permanently delete all stored game data and cloud persistence records within <strong>30 days</strong> of receiving your request, and confirm completion via reply email.
                        </li>
                      </ol>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <a
                          href="mailto:admin@sampidia.com?subject=Data%20Deletion%20Request%20-%20Lagos%20Street%20Race&body=Dear%20Support%20Team%2C%0A%0APlease%20permanently%20delete%20all%20gameplay%20data%2C%20cloud%20saves%2C%20and%20leaderboard%20scores%20for%20my%20account%20in%20Lagos%20Street%20Race%20(Application%20ID%3A%202077465642893808).%0A%0AFacebook%20Gaming%20Profile%20Name%20or%20URL%3A%20%0AMeta%20Player%20ID%20(if%20known)%3A%20%0A%0AThank%20you."
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-1.5"
                        >
                          <span>Send Pre-Filled Deletion Email</span>
                          <span>✉️</span>
                        </a>
                        <Link
                          to="/delete-account?app=lagos-street-race"
                          className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-1.5"
                        >
                          <span>Open Self-Service Portal Form</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* AFIGO-SAM GENERAL ECOSYSTEM PRIVACY POLICY */}
            {/* ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'ecosystem') && (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50 space-y-12">
                <div className="pb-6 border-b border-gray-100">
                  <span className="text-xs font-black uppercase tracking-wider text-red-600">
                    Afigo-Sam Digital Products
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                    Ecosystem General Privacy Policy
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Coverage for WordPress Plugins, Themes, Android Apps, and Web Services.
                  </p>
                </div>

                {/* 1. INTRODUCTION */}
                <section id="introduction" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">1</span>
                    Introduction
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-justify mb-4">
                    At <strong>Afigo-Sam</strong> (collectively referred to as "we", "us", "our", or "Sampidia"), we value your privacy above all else. This Privacy Policy describes how we handle user data across our entire ecosystem, including our premium WordPress plugins, software solutions, responsive themes, and native mobile applications.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-justify">
                    We design our digital items with "privacy by default" principles. This means we avoid collecting personal data unless it is strictly necessary to deliver, verify, or support our services. By deploying our plugins, purchasing our themes, or installing our mobile apps, you consent to the data practices outlined in this policy.
                  </p>
                </section>

                <hr className="border-gray-100" />

                {/* 2. WORDPRESS PLUGINS & THEMES */}
                <section id="coverage-plugins" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">2</span>
                    WordPress Plugins & Themes Coverage
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">🔌 WordPress AI-Powered Automatic Content Generator</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        This plugin runs entirely on <strong>your own self-hosted WordPress server</strong>.
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                        <li><strong>No Server-Side Tracking:</strong> We do not log, harvest, or store your custom AI API keys (OpenAI, Google Gemini, Anthropic Claude, DeepSeek). These credentials are securely encrypted and stored locally in your own database.</li>
                        <li><strong>Content Data Ownership:</strong> Content generation queries are transmitted directly to the respective AI provider APIs via secure HTTPS connections from your server. We have no access to the generated texts, keywords, or scheduling data.</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">🖥️ My Licenses Manager</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        Our software licensing system verifies digital purchase validity to prevent piracy.
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                        <li><strong>Verification Data:</strong> When activating a digital item, our license check sends the license key, domain name, and item identifier to our central server.</li>
                        <li><strong>Strict Purpose:</strong> This data is strictly used to check activation limits and authorize updates. We never track your customer profiles or monitor your database contents.</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">🎨 Booking Theme Pro</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        All availability calendars, booking entries, and user forms are processed locally within your database. Payment gateways (e.g. PayPal, Stripe) operate through secure checkout integrations. No financial data ever passes through or resides on our central systems.
                      </p>
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* 3. MOBILE APPLICATIONS */}
                <section id="coverage-apps" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">3</span>
                    Native Mobile Applications & Games Coverage
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Highlighted Lagos Street Race Card inside Section 3 */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">🏎️ Lagos Street Race</h4>
                        <span className="text-xs bg-red-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                          Facebook Instant Game
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed text-justify mb-2">
                        A high-speed 3D arcade racing experience running on the Facebook Instant Games platform and Meta Platforms.
                      </p>
                      <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                        <li><strong>Meta Zero-Permission Architecture:</strong> Uses <code className="bg-white/80 px-1 py-0.5 rounded text-[11px]">FBInstant.player</code> exclusively to show public gaming avatars and scores on the Third Mainland Bridge leaderboards.</li>
                        <li><strong>Meta Cloud Save:</strong> Progression (unlocked vehicles, customizations, Lagos Coins) is stored using Meta's Cloud Save API and your browser's local cache.</li>
                      </ul>
                      <div className="mt-3">
                        <a
                          href="#lagos-street-race-privacy"
                          onClick={(e) => scrollToSection(e, 'lagos-street-race-privacy')}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          Read Dedicated Lagos Street Race Policy & Terms Above ↑
                        </a>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">🎲 Naija Ayo Worldwide</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        A traditional strategic board game variant built for Google Android devices.
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                        <li><strong>Offline Architecture:</strong> Standard game modes (single-player vs AI and pass-and-play local multiplayer) run completely locally on your hardware.</li>
                        <li><strong>Ad Serving & Diagnostics:</strong> Optional ads might be rendered via Google AdMob, which collects temporary mobile ad identifiers (GAID) and crash statistics. Refer to the Google Services section below.</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">🎙️ Afro Short</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        An entertainment hub for motivational audio podcasts and inspirational media.
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                        <li><strong>Account Synchronization:</strong> Optional user registrations allow you to save media feeds, synchronize listen logs, and store bookmarks securely on our encrypted servers.</li>
                        <li><strong>Streaming Telemetry:</strong> Anonymized usage analytics (e.g. streaming playback events) are captured to improve stream quality and bandwidth allocation.</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">🛡️ Fake Products Detector</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        A retail safety tool built to scan and verify batch authenticity against public regulatory alert lists (including NAFDAC recall logs).
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                        <li><strong>Query Isolation:</strong> Your scanned batch codes and item queries are checked in real-time against public regulatory recall registries. We do not store your queries, and we do not link scan history to your identity.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* 4. ANDROID DATA SAFETY COMPLIANCE */}
                <section id="data-safety" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">4</span>
                    Google Play & Android Data Safety Compliance
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-justify mb-6">
                    To comply with Google Play's rigorous <strong>Data Safety policies</strong>, we provide full disclosure on how our native Android apps handle, share, and protect your device and user data.
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-gray-900 font-bold border-b border-gray-100">
                          <th className="px-4 py-3 text-left">Data Category</th>
                          <th className="px-4 py-3 text-left">Data Collected</th>
                          <th className="px-4 py-3 text-left">Purpose / Usage</th>
                          <th className="px-4 py-3 text-left">Shared with Third Parties?</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-600">
                        <tr>
                          <td className="px-4 py-3 font-semibold text-gray-900">Personal Info</td>
                          <td className="px-4 py-3">Username, Email (optional, e.g. Afro Short login)</td>
                          <td className="px-4 py-3">Account setup, preferences syncing, support communications</td>
                          <td className="px-4 py-3">No. Kept confidential and encrypted.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-gray-900">Identifiers</td>
                          <td className="px-4 py-3">Advertising ID, Android ID</td>
                          <td className="px-4 py-3">Anonymized ad-attribution, anti-fraud, and analytic telemetry</td>
                          <td className="px-4 py-3">Yes, Google Play Services & AdMob.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-gray-900">App Diagnostics</td>
                          <td className="px-4 py-3">Crash logs, performance metrics</td>
                          <td className="px-4 py-3">Fixing software bugs, improving performance and frame rates</td>
                          <td className="px-4 py-3">Yes, Google Firebase Crashlytics.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                    <h4 className="text-red-800 font-black mb-2 flex items-center text-base">
                      <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Data Sharing Statement
                    </h4>
                    <p className="text-red-900/90 text-xs leading-relaxed text-justify">
                      We <strong>never</strong> sell your personal data, email addresses, or advertising identifiers to data brokers, advertising networks (outside of basic Google AdMob SDK execution), or third-party marketing companies. All data handling is encrypted in transit and securely contained.
                    </p>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* 5. ACCOUNT & DATA DELETION */}
                <section id="data-erasure" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">5</span>
                    Right to Erasure, Account Deletion & Deactivation
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-justify mb-6">
                    In strict compliance with GDPR Art. 17 (Right to Erasure) and Google Play Store requirements, we provide transparent, self-service mechanisms for all users to request the deletion or deactivation of their account and associated personal data.
                  </p>

                  {/* Mobile App Deletion */}
                  <div className="bg-[#0a0e27] text-white rounded-3xl p-8 border border-gray-800 relative overflow-hidden shadow-xl mb-6">
                    <div className="absolute top-0 right-0 p-6 opacity-5">{BRAIN_LOGO}</div>
                    <h4 className="text-xl font-bold mb-3 text-red-400">📱 Mobile App & Games Data Deletion</h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      Users of our mobile applications (Naija Ayo Worldwide, Afro Short, Fake Detector) and instant games (Lagos Street Race) may submit an immediate removal request. Once verified, your username, email, and preference history are <strong className="text-white">permanently wiped</strong> from our servers within <strong className="text-white">48 hours</strong> (or within 30 days for Meta records).
                    </p>
                    <Link
                      to="/delete-account"
                      className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/30"
                    >
                      Go to Account Data Deletion →
                    </Link>
                  </div>

                  {/* Portal Account Deactivation */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center border border-red-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 015.636 5.636" /></svg>
                      </span>
                      Student Portal & File Portal Account Deactivation
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Users of the <strong>Student Course Access Portal</strong> or the <strong>Plugin & Asset (File) Portal</strong> may request account deactivation at any time. When a deactivation request is submitted:
                    </p>
                    <ul className="space-y-3 text-sm text-gray-600 mb-5">
                      <li className="flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-0.5">→</span>
                        <span>Your account status is updated from <strong>Active</strong> to <strong>Inactive</strong>.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-0.5">→</span>
                        <span>Any future login attempt using the same email address will return the message: <em className="font-semibold text-gray-800">"Account deactivated/disabled. Please contact support."</em></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-0.5">→</span>
                        <span>All <strong>new accounts</strong> are assigned <strong>Active</strong> status by default upon their first successful portal login.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-0.5">→</span>
                        <span>To <strong>reactivate</strong> a deactivated account, contact our support team at <strong>admin@sampidia.com</strong>. Reactivation is subject to our Terms of Service.</span>
                      </li>
                    </ul>
                    <Link
                      to="/delete-account?type=portal"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all text-sm"
                    >
                      Request Portal Account Deactivation →
                    </Link>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    For any data rights enquiries — including access, portability, correction, or objection requests — please email <strong className="text-gray-600">admin@sampidia.com</strong>. We will respond within <strong className="text-gray-600">72 hours</strong> in compliance with applicable data protection regulations.
                  </p>
                </section>

                <hr className="border-gray-100" />

                {/* 6. INFORMATION WE COLLECT */}
                <section id="data-collection" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">6</span>
                    Information We Collect & Why
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-justify mb-4">
                    We collect minimal datasets to ensure stability, authenticate purchases, and manage optional profiles:
                  </p>
                  <ul className="space-y-4 text-sm text-gray-600 list-none pl-0">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 text-lg font-bold">✓</span>
                      <div>
                        <strong className="text-gray-900">Purchase Information:</strong> Transacted through safe digital payment gateways (like Flutterwave or Envato). We keep transaction IDs, licensing names, and licensing emails to check validity, distribute key updates, and support purchases.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 text-lg font-bold">✓</span>
                      <div>
                        <strong className="text-gray-900">Customer Support Communications:</strong> If you email us at <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">admin@sampidia.com</code>, we retain the email records and content to answer your technical questions.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 text-lg font-bold">✓</span>
                      <div>
                        <strong className="text-gray-900">Telemetry Data:</strong> Crash and performance diagnostic data is processed in aggregate to find issues and ensure compatibility with different version of WordPress, PHP, and Android editions.
                      </div>
                    </li>
                  </ul>
                </section>

                <hr className="border-gray-100" />

                {/* 7. THIRD-PARTY SERVICES */}
                <section id="third-parties" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">7</span>
                    Third-Party Services
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-justify mb-6">
                    Our apps, games, and portals interact with trusted third-party SDKs and service providers to handle payments, prevent spam, deliver emails, and serve relevant ads:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500">
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">Meta Platforms & Audience Network</h4>
                      <p className="leading-relaxed">
                        Powers Facebook Instant Games infrastructure, player profile displays via <code className="text-[11px] bg-gray-200 px-1 rounded">FBInstant.player</code>, cloud state syncing, and optional rewarded/interstitial advertisements under Meta's platform terms.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">Google Play Services & AdMob</h4>
                      <p className="leading-relaxed">
                        Provides core system libraries, game licensing checks, achievements sync, and in-game advertisements. Google processes identifiers and diagnostic logs under their own privacy standards.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">Cloudflare Turnstile & Workers</h4>
                      <p className="leading-relaxed">
                        Turnstile verifies forms (like account deletion requests) as human submissions without collecting cookies or personal details. Cloudflare serverless workers securely route emails through the Resend API without exposing keys.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">Resend Email API</h4>
                      <p className="leading-relaxed">
                        Relays administrative erasure requests safely and privately from our serverless workers directly to our secure operational inbox.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 md:col-span-2">
                      <h4 className="font-bold text-gray-900 mb-2">Flutterwave API</h4>
                      <p className="leading-relaxed">
                        Processes premium plugin payments safely. Card numbers and billing information are fully tokenized and handled inside secure PCI-DSS level 1 interfaces.
                      </p>
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* 8. SECURITY & DATA PROTECTION */}
                <section id="data-protection" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">8</span>
                    Security & Data Protection
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-justify mb-4">
                    We take industry-standard technical measures to protect your information:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 mb-6">
                    <li><strong>Encryption in Transit:</strong> All communications, verification API requests, and licensing handshakes use secure TLS 1.3 encryption protocols.</li>
                    <li><strong>Server Isolation:</strong> Our backend nodes are sandboxed and fully isolated to prevent cross-site contamination or unauthorized access.</li>
                    <li><strong>No Local Retention:</strong> For services like the Fake Products Detector, batch checks are resolved in memory and are never committed to permanent hard disk logs.</li>
                  </ul>
                </section>

                <hr className="border-gray-100" />

                {/* 9. GDPR & GLOBAL USER RIGHTS */}
                <section id="user-rights" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">9</span>
                    GDPR & Global Privacy Rights
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-justify mb-4">
                    No matter where you reside (in the European Union under GDPR, the United States under CCPA, or Nigeria/Africa under the NDPR), we extend the same digital data rights:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/30">
                      <strong>Right to Access:</strong> You can request a clear copy of all personal details we hold regarding your email address or license transactions.
                    </div>
                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/30">
                      <strong>Right to Rectification:</strong> You can request immediate corrections to invalid billing records or support contact listings.
                    </div>
                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/30">
                      <strong>Right to Deletion:</strong> Complete removal of account registers and license tracking logs.
                    </div>
                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/30">
                      <strong>Right to Object:</strong> The right to halt analytical profiling or trigger opt-outs for telemetry collection.
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* 10. CONTACT INFORMATION */}
                <section id="contact" className="scroll-mt-24">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">10</span>
                    Contact Information
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-justify mb-6">
                    If you have any questions about this Privacy Policy, your data handling rights, or our mobile app data safety protocols, please contact our support team:
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900">Afigo Brightpath Technology LTD</h4>
                      <p className="text-sm text-gray-500">Available for privacy inquiries, licensing support, and data requests</p>
                    </div>
                    <a
                      href="mailto:admin@sampidia.com"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md inline-block whitespace-nowrap"
                    >
                      admin@sampidia.com
                    </a>
                  </div>
                </section>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
