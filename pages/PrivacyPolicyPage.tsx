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
  const [copiedPackageName, setCopiedPackageName] = useState(false);

  const lagosSections = [
    { id: 'lagos-street-race-privacy', label: '🔒 Lagos Race: Privacy Policy' },
    { id: 'lagos-data-safety', label: '📊 Google Play Data Safety' },
    { id: 'lagos-android-permissions', label: '📱 Android Permissions' },
    { id: 'lagos-monetization-ads', label: '💰 Billing & Ad Standards' },
    { id: 'lagos-families-policy', label: '🧸 Families & Children Policy' },
    { id: 'lagos-app-store', label: '🍎 Apple App Store Disclosures' },
    { id: 'lagos-street-race-terms', label: '📜 Terms of Service' },
    { id: 'lagos-street-race-deletion', label: '🗑️ Data & Account Deletion' },
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
    const hashTarget = location.hash ? location.hash.replace('#', '') : '';
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab') || defaultTab || '';

    if (hashTarget) {
      if (
        hashTarget.includes('lagos') ||
        hashTarget === 'terms' ||
        hashTarget === 'deletion' ||
        hashTarget === 'data-safety' ||
        hashTarget === 'permissions'
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
      if (
        tabParam.includes('lagos') ||
        tabParam === 'terms' ||
        tabParam === 'deletion' ||
        tabParam === 'data-safety' ||
        tabParam === 'permissions'
      ) {
        setActiveTab('lagos');
        const mapTarget: Record<string, string> = {
          terms: 'lagos-street-race-terms',
          'lagos-terms': 'lagos-street-race-terms',
          privacy: 'lagos-street-race-privacy',
          'lagos-privacy': 'lagos-street-race-privacy',
          deletion: 'lagos-street-race-deletion',
          'lagos-deletion': 'lagos-street-race-deletion',
          'data-safety': 'lagos-data-safety',
          'lagos-data-safety': 'lagos-data-safety',
          permissions: 'lagos-android-permissions',
          'lagos-permissions': 'lagos-android-permissions',
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

  const copyPackageName = () => {
    navigator.clipboard.writeText('com.sampidia.lagosstreetrace');
    setCopiedPackageName(true);
    setTimeout(() => setCopiedPackageName(false), 2500);
  };

  const privacySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy, Terms & Android Data Safety | Lagos Street Race & Afigo Ecosystem',
    description:
      'Official Privacy Policy, Google Play Data Safety Disclosures, Android Permissions, Terms of Service, and User Data Deletion Instructions for Lagos Street Race (Android Google Play, Apple App Store, Facebook Instant Games) and Afigo-Sam digital products.',
    publisher: {
      '@type': 'Organization',
      name: 'Afigo Brightpath Technology LTD',
      url: 'https://afigo.sampidia.com',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SEO
        title="Privacy Policy, Terms & Google Play Data Safety | Lagos Street Race"
        description="Official Privacy Policy, Google Play Data Safety Disclosures, Android Runtime Permissions, and User Data Deletion Instructions for Lagos Street Race (Android Google Play, Apple App Store, Meta Platforms) and Afigo-Sam digital ecosystem."
        keywords="Lagos Street Race privacy policy, android data safety, google play developer policy, app store privacy nutrition, com.sampidia.lagosstreetrace, 2077465642893808, Afigo Brightpath Technology LTD, android permissions, google play billing, AdMob, FBInstant, GDPR, COPPA"
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
            <span>Official Legal, Data Safety & Compliance Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Privacy Policy & Terms
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transparent policies, Google Play Data Safety standards, and user data rights for{' '}
            <strong className="text-white">Lagos Street Race (Android, App Store & Meta)</strong> and the{' '}
            <strong className="text-white">Afigo-Sam Digital Ecosystem</strong>.
          </p>

          {/* Quick Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-full font-bold">
              🤖 Google Play Data Safety Verified
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-semibold text-gray-200 border border-white/10">
              🏎️ Android Package: <strong>com.sampidia.lagosstreetrace</strong>
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-semibold text-gray-200 border border-white/10">
              🌐 Meta App ID: <strong>2077465642893808</strong>
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
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded-full font-mono font-bold">
                Play & App Store
              </span>
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
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Android & iOS
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
                <p className="font-bold text-gray-700 mb-1">Developer Support</p>
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
            {/* LAGOS STREET RACE SECTION (ANDROID PLAY STORE, APP STORE & META) */}
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
                      <span className="bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <span>🤖</span>
                        <span>Google Play Store</span>
                      </span>
                      <span className="bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <span>🍎</span>
                        <span>Apple App Store Ready</span>
                      </span>
                      <span className="bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <span>🕹️</span>
                        <span>Meta Instant Games</span>
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-white">
                      Lagos Street Race — Legal, Privacy & Google Play Data Safety
                    </h2>

                    <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                      Comprehensive legal documentation and privacy governance for <strong>Lagos Street Race</strong> across Android (Google Play Store), Apple App Store, and Facebook Instant Games, published by <strong>Afigo Brightpath Technology LTD</strong> in strict accordance with <strong>Google Android Developer Best Practices</strong>.
                    </p>

                    {/* Metadata & Quick Jump Grid */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 font-medium">Android Package Name (Play Store)</p>
                          <p className="font-mono font-bold text-white text-sm">com.sampidia.lagosstreetrace</p>
                        </div>
                        <button
                          onClick={copyPackageName}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-all"
                        >
                          {copiedPackageName ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 font-medium">Meta Application ID</p>
                          <p className="font-mono font-bold text-white text-sm">2077465642893808</p>
                        </div>
                        <button
                          onClick={copyAppId}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-all"
                        >
                          {copiedAppId ? '✓ Copied' : 'Copy'}
                        </button>
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
                        href="#lagos-data-safety"
                        onClick={(e) => scrollToSection(e, 'lagos-data-safety')}
                        className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-xl font-bold transition-all flex items-center gap-1.5 border border-emerald-500/30"
                      >
                        <span>📊 Data Safety Matrix</span>
                        <span>↓</span>
                      </a>
                      <a
                        href="#lagos-android-permissions"
                        onClick={(e) => scrollToSection(e, 'lagos-android-permissions')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 border border-white/10"
                      >
                        <span>📱 Android Permissions</span>
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
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>🗑️ Account Deletion Portal →</span>
                      </a>
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
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                        <span>Google Play Program & App Store Certified</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        Privacy Policy for Lagos Street Race
                      </h2>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-mono">
                      <div><strong>Effective Date:</strong> November 4, 2026</div>
                      <div><strong>Last Updated:</strong> November 6, 2026</div>
                      <div className="text-emerald-600 font-bold">Android Package: com.sampidia.lagosstreetrace</div>
                      <div className="text-red-600 font-bold">Meta App ID: 2077465642893808</div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 text-base">
                    This Privacy Policy explains how <strong>"Lagos Street Race"</strong> ("we", "us", or "our", developed and published by <strong>Afigo Brightpath Technology LTD</strong>) collects, uses, protects, and handles information across all supported editions, including:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 text-xs">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-emerald-900 font-medium">
                      <strong>🤖 Android Version:</strong> Distributed via the Google Play Store under package <code>com.sampidia.lagosstreetrace</code>.
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900 font-medium">
                      <strong>🍎 iOS / App Store Version:</strong> Native distribution via the Apple App Store.
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-900 font-medium">
                      <strong>🕹️ Instant Games Version:</strong> Cross-platform instant play via Facebook Instant Games & Meta Platforms.
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* 1. Information We Access and Collect */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">1</span>
                        Information We Access and Collect
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        We adhere to Google Play’s User Data policies, Apple App Store privacy requirements, and Meta’s Zero-Permission Gaming Profile standards. Depending on the version you play, we access:
                      </p>
                      <ul className="space-y-3.5 text-sm text-gray-700 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Device & Advertising Identifiers:</strong> On Android devices, we may access the Google Advertising ID (AAID/GAID) and anonymous system identifiers. These are used strictly for in-app ad attribution (via Google AdMob), frequency capping, and anti-fraud diagnostics. You can reset or opt out of your Advertising ID at any time in your Android device settings (<em>Settings &gt; Google &gt; Ads</em>).
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Game Progress & Cloud Saves:</strong> We store in-game progress, high scores, distance traveled on Third Mainland Bridge, earned virtual currency ("Lagos Coins"), unlocked vehicles, and custom paint jobs. On Android, this data is backed up using Google Play Games Services and local encrypted SQLite/Shared Preferences. On Meta Platforms, it is synced via <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs">FBInstant.player.setDataAsync</code>.
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Gaming Profile & Leaderboard Information:</strong> Through Google Play Games Services, Apple Game Center, or the Meta Instant Games SDK (<code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs">FBInstant.player</code>), we may access your public Gamer Tag / Facebook Gaming ID, display name, and public avatar strictly to display your ranking on global and friends-only leaderboards.
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Crash & Performance Diagnostics:</strong> We capture anonymized crash stack traces, frame rate bottlenecks, and ANR (Application Not Responding) rates via Google Firebase Crashlytics and Google Play Console vitals to maintain high performance across thousands of Android device models.
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">In-App Purchases Telemetry:</strong> All financial transactions (e.g., buying coin bundles or the VIP Season Pass) are processed directly by the <strong>Google Play In-App Billing API</strong> or <strong>Apple In-App Purchases</strong>. We only receive non-sensitive purchase receipts and token IDs to unlock your digital assets.
                          </div>
                        </li>
                      </ul>
                      <div className="mt-5 pt-4 border-t border-gray-200/70 text-xs text-emerald-800 font-semibold bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200">
                        🛡️ <strong>Zero Sensitive Data Guarantee:</strong> We <u>do not</u> access, collect, or store your real-world physical address, phone number, contacts list, microphone, camera, photos, or credit card numbers.
                      </div>
                    </div>

                    {/* 2. How We Use Your Information */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">2</span>
                        How We Use Your Information
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        We use the information gathered strictly for legitimate operational purposes:
                      </p>
                      <ul className="space-y-2.5 text-sm text-gray-700 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Operate, maintain, and render high-performance 3D street racing across bridge and expressway tracks.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Synchronize and preserve your car fleet, upgrades, and high scores across device reinstalls via Google Play Games Services and Meta Cloud Save.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Display your score and gaming avatar on Third Mainland Bridge leaderboards and cockpit HUDs.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Grant optional voluntary in-game rewards (e.g. "Second Chance" extra lives, nitro recharges, or double coin bonuses) upon completed viewing of rewarded video ads.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Detect, diagnose, and resolve crashes and frame drops across varying Android OS versions and GPU architectures.</span>
                        </li>
                      </ul>
                    </div>

                    {/* 3. Data Sharing and Third Parties */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">3</span>
                        Data Sharing and Third-Party SDKs
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        We only partner with certified, privacy-compliant developer SDKs:
                      </p>
                      <ul className="space-y-3 text-sm text-gray-700 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">No Sale of Personal Data:</strong> We never sell, rent, or trade your personal information, gaming metrics, or device identifiers to data brokers.
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Google LLC (Play Services, Firebase & AdMob):</strong> Provides cloud leaderboards, telemetry, crash analysis, and ad serving in accordance with the{' '}
                            <a
                              href="https://policies.google.com/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 font-semibold underline hover:text-emerald-700"
                            >
                              Google Privacy Policy
                            </a>.
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Meta Platforms, Inc. (Instant Games & Audience Network):</strong> For instant gameplay and rewarded interstitial ads under the{' '}
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
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-gray-900">Apple Inc. (App Store & Game Center):</strong> For iOS builds, authentication, and in-app purchase receipts under the{' '}
                            <a
                              href="https://www.apple.com/legal/privacy/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-semibold underline hover:text-blue-700"
                            >
                              Apple Privacy Policy
                            </a>.
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* 4. Data Retention and Deletion */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">4</span>
                        Data Retention and Deletion (Google Play & GDPR Compliant)
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        In full compliance with <strong>Google Play's Account Deletion Policy</strong> and GDPR Art. 17, players may request complete deletion of their account records, high scores, cloud saves, and associated identifiers at any time.
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        Users do not need to keep the app installed to request deletion. You can initiate a deletion directly via our web portal:
                      </p>
                      <Link
                        to="/delete-account?app=lagos-street-race"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                      >
                        <span>Open Web-Based Account Deletion Request Form</span>
                        <span>→</span>
                      </Link>
                    </div>

                    {/* 5. Children's Privacy & Families Policy */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">5</span>
                        Children's Privacy & Google Play Families Policy
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        Lagos Street Race is designed for a general audience (ages 13 and older). We do not knowingly collect personal data from children under the age of 13 (or under 16 in the European Economic Area).
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        To comply with COPPA, GDPR-K, and Google Play Families guidelines, all in-app advertising SDKs are configured with child-protection flags (<code className="text-xs bg-gray-200 px-1 py-0.5 rounded font-mono">tagForChildDirectedTreatment</code>) ensuring that behavioral profiling and targeted advertisements are disabled if a child user is identified. Parents may contact us at <a href="mailto:admin@sampidia.com" className="text-red-600 font-bold underline">admin@sampidia.com</a> to request immediate record expunction.
                      </p>
                    </div>

                    {/* 6. Contact Us */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 sm:p-7 border border-red-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">6</span>
                        Developer Entity & Legal Contact
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        If you have questions, inquiries, or requests regarding this Privacy Policy, your data rights, or our mobile gaming compliance, please contact:
                      </p>
                      <div className="space-y-2 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">Developer / Entity:</span>
                          <span className="font-medium">Afigo Brightpath Technology LTD</span>
                        </div>
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
                          <span className="font-bold text-gray-900">Website:</span>
                          <a
                            href="https://afigo.sampidia.com"
                            className="text-gray-700 underline hover:text-gray-900"
                          >
                            https://afigo.sampidia.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* 2. GOOGLE PLAY DATA SAFETY SECTION (OFFICIAL DISCLOSURES) */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-data-safety"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                        <span>Google Play Console Compliance</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        Google Play Data Safety Disclosures
                      </h2>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                      Formally Declared for Reviewers
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                    In compliance with the <strong>Google Play Developer Program Policy on User Data</strong>, the table below provides exact disclosures regarding what data is collected, shared, and encrypted within the Android edition of <strong>Lagos Street Race</strong> (<code>com.sampidia.lagosstreetrace</code>):
                  </p>

                  <div className="overflow-x-auto mb-8">
                    <table className="w-full border-collapse bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-200 text-left">
                          <th className="px-4 py-3.5">Data Category</th>
                          <th className="px-4 py-3.5">Specific Data Type</th>
                          <th className="px-4 py-3.5">Purpose</th>
                          <th className="px-4 py-3.5">Collection Type</th>
                          <th className="px-4 py-3.5">Shared with Third Parties?</th>
                          <th className="px-4 py-3.5">Encrypted in Transit?</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        <tr className="hover:bg-gray-50/80">
                          <td className="px-4 py-3.5 font-bold text-gray-900">Device or Other IDs</td>
                          <td className="px-4 py-3.5">Google Advertising ID (AAID/GAID), Android ID</td>
                          <td className="px-4 py-3.5">Analytics, Advertising, Fraud Prevention</td>
                          <td className="px-4 py-3.5">Automatic (AdMob & Play Services)</td>
                          <td className="px-4 py-3.5 text-emerald-700 font-semibold">Yes (Google AdMob)</td>
                          <td className="px-4 py-3.5 text-emerald-700 font-bold">Yes (TLS 1.3)</td>
                        </tr>
                        <tr className="hover:bg-gray-50/80">
                          <td className="px-4 py-3.5 font-bold text-gray-900">App Activity</td>
                          <td className="px-4 py-3.5">Gameplay interactions, high scores, distance, car unlocks</td>
                          <td className="px-4 py-3.5">Core Game Functionality, Cloud Saves, Leaderboards</td>
                          <td className="px-4 py-3.5">Required for online features</td>
                          <td className="px-4 py-3.5">Yes (Google Play Games leaderboards)</td>
                          <td className="px-4 py-3.5 text-emerald-700 font-bold">Yes (HTTPS)</td>
                        </tr>
                        <tr className="hover:bg-gray-50/80">
                          <td className="px-4 py-3.5 font-bold text-gray-900">Financial Info</td>
                          <td className="px-4 py-3.5">Purchase history tokens (Lagos Coins, VIP Passes)</td>
                          <td className="px-4 py-3.5">In-App Purchase fulfillment & entitlement restoration</td>
                          <td className="px-4 py-3.5">Optional (Google Play Billing API)</td>
                          <td className="px-4 py-3.5">Processed by Google Play Billing (No card details seen)</td>
                          <td className="px-4 py-3.5 text-emerald-700 font-bold">Yes (PCI-DSS/Google)</td>
                        </tr>
                        <tr className="hover:bg-gray-50/80">
                          <td className="px-4 py-3.5 font-bold text-gray-900">App Diagnostics</td>
                          <td className="px-4 py-3.5">Crash logs (stack traces), ANRs, frame rate metrics</td>
                          <td className="px-4 py-3.5">Analytics, Bug Fixing & Device Optimization</td>
                          <td className="px-4 py-3.5">Automatic (Firebase Crashlytics)</td>
                          <td className="px-4 py-3.5">Yes (Google Firebase)</td>
                          <td className="px-4 py-3.5 text-emerald-700 font-bold">Yes (HTTPS)</td>
                        </tr>
                        <tr className="hover:bg-gray-50/80">
                          <td className="px-4 py-3.5 font-bold text-gray-900">Location (Coarse)</td>
                          <td className="px-4 py-3.5">Approximate region / country derived from IP address</td>
                          <td className="px-4 py-3.5">Localized leaderboard rankings & regional ads</td>
                          <td className="px-4 py-3.5">Network-derived (No GPS)</td>
                          <td className="px-4 py-3.5">Yes (Ad networks)</td>
                          <td className="px-4 py-3.5 text-emerald-700 font-bold">Yes (TLS 1.3)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Core Google Play Security Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                      <div className="text-emerald-700 font-black text-sm mb-1 flex items-center gap-1.5">
                        <span>🔒</span>
                        <span>Encrypted in Transit</span>
                      </div>
                      <p className="text-emerald-950/80 leading-relaxed">
                        All communications between the Android game client, Google Play Games Services, and our cloud endpoints use TLS 1.3 encryption.
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                      <div className="text-blue-700 font-black text-sm mb-1 flex items-center gap-1.5">
                        <span>🗑️</span>
                        <span>User Data Deletion</span>
                      </div>
                      <p className="text-blue-950/80 leading-relaxed">
                        We provide an active, public web deletion mechanism so users can delete their game data without needing to re-open the app.
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                      <div className="text-amber-700 font-black text-sm mb-1 flex items-center gap-1.5">
                        <span>🚫</span>
                        <span>No Data Sale</span>
                      </div>
                      <p className="text-amber-950/80 leading-relaxed">
                        Personal data, gamer profiles, and device identifiers are strictly never sold to commercial data aggregators or brokers.
                      </p>
                    </div>
                  </div>
                </section>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* 3. ANDROID PERMISSIONS & DEVICE ACCESS DISCLOSURE */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-android-permissions"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                        <span>Android Runtime & Manifest Disclosure</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        Android Permissions & Device Hardware Access
                      </h2>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-full">
                      Zero Sensitive Permissions
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                    In compliance with Google Play Developer Policy guidelines on <strong>Permissions and APIs that Access Sensitive Information</strong>, here is the exhaustive list of permissions requested in the Android Manifest of <strong>Lagos Street Race</strong> and their specific, justified technical use:
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="bg-gray-200 text-gray-900 px-2 py-0.5 rounded font-mono font-bold text-xs">
                            android.permission.INTERNET
                          </code>
                          <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[10px]">Normal</span>
                        </div>
                        <p className="text-gray-600">
                          Enables the game to communicate with Google Play Games Services, download track updates, sync cloud saves, and fetch in-game ads.
                        </p>
                      </div>
                      <span className="text-gray-400 font-medium whitespace-nowrap">Core Networking</span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="bg-gray-200 text-gray-900 px-2 py-0.5 rounded font-mono font-bold text-xs">
                            android.permission.ACCESS_NETWORK_STATE
                          </code>
                          <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[10px]">Normal</span>
                        </div>
                        <p className="text-gray-600">
                          Checks whether the device is connected to Wi-Fi or cellular data before initiating network requests, preventing battery drain and unexpected error popups while offline.
                        </p>
                      </div>
                      <span className="text-gray-400 font-medium whitespace-nowrap">Network Diagnostics</span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="bg-gray-200 text-gray-900 px-2 py-0.5 rounded font-mono font-bold text-xs">
                            com.android.vending.BILLING
                          </code>
                          <span className="text-blue-700 bg-blue-100 font-bold px-2 py-0.5 rounded text-[10px]">Play Billing</span>
                        </div>
                        <p className="text-gray-600">
                          Required by the Google Play In-App Billing Library to securely process purchases of Lagos Coins, vehicle packs, and the VIP Season Pass.
                        </p>
                      </div>
                      <span className="text-gray-400 font-medium whitespace-nowrap">Google Play Commerce</span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="bg-gray-200 text-gray-900 px-2 py-0.5 rounded font-mono font-bold text-xs">
                            android.permission.VIBRATE
                          </code>
                          <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[10px]">Normal</span>
                        </div>
                        <p className="text-gray-600">
                          Provides tactile haptic feedback during races (e.g. wall scrapes, high-speed drifts, and crash collisions). Players can disable vibration in the game settings at any time.
                        </p>
                      </div>
                      <span className="text-gray-400 font-medium whitespace-nowrap">Haptic Immersion</span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="bg-gray-200 text-gray-900 px-2 py-0.5 rounded font-mono font-bold text-xs">
                            android.permission.WAKE_LOCK
                          </code>
                          <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[10px]">Normal</span>
                        </div>
                        <p className="text-gray-600">
                          Prevents the device display from going to sleep or dimming during active gameplay while the player is steering on Third Mainland Bridge.
                        </p>
                      </div>
                      <span className="text-gray-400 font-medium whitespace-nowrap">Display Control</span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="bg-gray-200 text-gray-900 px-2 py-0.5 rounded font-mono font-bold text-xs">
                            android.permission.POST_NOTIFICATIONS
                          </code>
                          <span className="text-purple-700 bg-purple-100 font-bold px-2 py-0.5 rounded text-[10px]">Runtime Opt-In</span>
                        </div>
                        <p className="text-gray-600">
                          On Android 13 (API level 33) and above, this permission requests explicit runtime authorization to deliver optional daily bonuses, event alerts, and leaderboard challenges. Players can deny or revoke this permission at any time.
                        </p>
                      </div>
                      <span className="text-gray-400 font-medium whitespace-nowrap">Push Notifications</span>
                    </div>
                  </div>

                  {/* Explicit Non-Collection Statement */}
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-xs text-red-950">
                    <h4 className="font-bold text-red-900 text-sm mb-2 flex items-center gap-1.5">
                      <span>🚫</span>
                      <span>Permissions NEVER Requested by Lagos Street Race:</span>
                    </h4>
                    <p className="leading-relaxed mb-3">
                      To safeguard user privacy and reduce unnecessary device privileges, the Android build of Lagos Street Race does <strong>NOT</strong> request or include:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-red-900 font-semibold">
                      <div>❌ No ACCESS_FINE_LOCATION</div>
                      <div>❌ No CAMERA</div>
                      <div>❌ No RECORD_AUDIO</div>
                      <div>❌ No READ_CONTACTS</div>
                      <div>❌ No READ_PHONE_STATE</div>
                      <div>❌ No READ_EXTERNAL_STORAGE</div>
                    </div>
                  </div>
                </section>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* 4. BILLING & ADVERTISING POLICY COMPLIANCE */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-monetization-ads"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                        <span>Google Play Monetization & Ads Policy</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        In-App Purchases & Advertising Standards
                      </h2>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
                      Play Billing 100% Compliant
                    </span>
                  </div>

                  <div className="space-y-6 text-sm text-gray-700">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                        <span>💳</span>
                        <span>Google Play In-App Billing Compliance</span>
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3">
                        In accordance with the <strong>Google Play Payments Policy</strong>, all purchases of virtual currency ("Lagos Coins"), car customization liveries, vehicle upgrade tiers, and the VIP Season Pass made on the Android version are conducted exclusively through Google Play's billing system.
                      </p>
                      <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                        <li>All prices and local currency equivalents are clearly displayed in the in-game garage before purchase confirmation.</li>
                        <li>Digital purchases are non-transferable and non-refundable, except as required by Google Play Refund Policies or applicable statutory consumer rights.</li>
                        <li>The developer never handles, stores, or sees your credit card number, CVC, bank credentials, or Google account password.</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                        <span>📢</span>
                        <span>Google Play Ads Policy & Deceptive Ads Prevention</span>
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3">
                        Lagos Street Race strictly adheres to the <strong>Google Play Developer Program Policy on Ads</strong>:
                      </p>
                      <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1.5">
                        <li><strong>No Deceptive Ads:</strong> Advertisements are distinctly labeled and clearly separated from game control interfaces to prevent accidental clicks.</li>
                        <li><strong>Non-Disruptive Interstitials:</strong> Full-screen interstitial ads only trigger during natural breaks in gameplay (e.g. after a race finish or returning to the garage), never during active steering, accelerating, or immediately when the app launches.</li>
                        <li><strong>Voluntary Rewarded Ads:</strong> Watching rewarded video ads (e.g. for a "Second Chance" extra life or double coins) is entirely optional and initiated solely by a voluntary user tap.</li>
                        <li><strong>Certified Ad Networks:</strong> We exclusively integrate Google Mobile Ads SDK (AdMob) and Meta Audience Network, both of which comply with Google Play SDK policies.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* 5. FAMILIES POLICY & CHILDREN'S PRIVACY */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-families-policy"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                        <span>COPPA, GDPR-K & Google Families Policy</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        Families Policy & Children's Privacy
                      </h2>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full">
                      Child Safety First
                    </span>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <p>
                      Lagos Street Race is rated and designed for general audiences (ages 13 and above). We take children's privacy and online safety with the utmost seriousness in compliance with the <strong>Children’s Online Privacy Protection Act (COPPA)</strong>, <strong>EU GDPR Article 8 (GDPR-K)</strong>, and the <strong>Google Play Families Policy</strong>.
                    </p>
                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 space-y-3">
                      <h4 className="font-bold text-purple-900 text-sm">Key Safeguards for Young Audiences:</h4>
                      <ul className="list-disc pl-5 text-xs text-purple-950/80 space-y-1.5">
                        <li><strong>Neutral Age Screening:</strong> If an age gate is presented, it is designed neutrally without pre-selecting age or encouraging false inputs.</li>
                        <li><strong>Ad Personalization Disabled:</strong> If a player indicates they are under 13 (or under 16 in the European Union), the Google Mobile Ads SDK is automatically configured to pass <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">tagForChildDirectedTreatment(true)</code> and <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">tagForUnderAgeOfConsent(true)</code>, disabling all behavioral, remarketing, and interest-based ad tracking.</li>
                        <li><strong>Zero Inappropriate Content:</strong> Ad providers are constrained to family-friendly ad ratings (G or PG equivalent).</li>
                        <li><strong>Parental Rights:</strong> Parents or legal guardians may review, update, or request immediate deletion of any data linked to their child by emailing <a href="mailto:admin@sampidia.com" className="text-purple-700 font-bold underline">admin@sampidia.com</a>.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* 6. APPLE APP STORE PRIVACY NUTRITION LABELS */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-app-store"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                        <span>Apple App Store Privacy Details</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        App Store Privacy Nutrition Labels & ATT
                      </h2>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
                      iOS Compliance
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                    In preparation for iOS and Apple App Store availability, the following declarations align with Apple’s <strong>App Privacy Nutrition Labels</strong> and the <strong>App Tracking Transparency (ATT)</strong> framework:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-sm">
                        <span>🎯</span>
                        <span>Data Used to Track You</span>
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        If granted permission via the iOS App Tracking Transparency prompt: <strong>Identifier for Advertisers (IDFA)</strong>, used exclusively by certified ad networks (AdMob, Meta Audience Network).
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-sm">
                        <span>👤</span>
                        <span>Data Linked to You</span>
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        <strong>User Content & Identifiers:</strong> Game Center Gamer ID, high score rankings, and in-app purchase receipts linked to your player profile for cloud progress restoration.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-sm">
                        <span>📊</span>
                        <span>Data Not Linked to You</span>
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        <strong>Diagnostics & Performance:</strong> Crash logs, launch time, and performance metrics collected in aggregate without identifying individual users.
                      </p>
                    </div>
                  </div>
                </section>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* 7. LAGOS STREET RACE: TERMS OF SERVICE */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-street-race-terms"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <span id="lagos-terms" className="scroll-mt-24 block"></span>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                        <span>User Agreement & EULA</span>
                        <span>•</span>
                        <span>Android & Multi-Platform</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        Terms of Service for Lagos Street Race
                      </h2>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-mono">
                      <div><strong>Effective Date:</strong> November 4, 2026</div>
                      <div><strong>Last Updated:</strong> November 6, 2026</div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-8 text-base">
                    Welcome to <strong>Lagos Street Race</strong>! By downloading, installing, launching, or playing the game on Android (Google Play Store), Apple App Store, Facebook Instant Games, or Meta Platforms, you agree to be bound by these Terms of Service ("Terms").
                  </p>

                  <div className="space-y-8">
                    {/* 1. License to Play */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">1</span>
                        License to Play
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        We grant you a non-exclusive, non-transferable, revocable license to access, install, and play Lagos Street Race solely for your personal, non-commercial entertainment on supported Android, iOS, and Meta platforms.
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
                          <span>All virtual items and currency are licensed, not sold. In-App Purchases on Android are processed via Google Play In-App Billing, on iOS via Apple In-App Purchases, and on Meta via Meta In-App Purchases, subject to respective platform terms.</span>
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
                          <span>Exploit, hack, automate, bot, or reverse-engineer game mechanics or score reporting APIs.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>Post abusive, defamatory, or offensive content via social sharing, custom usernames, or challenge dialogs.</span>
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
                        All assets, 3D vehicle models, sounds, voice lines, shaders, visual designs, and game code in Lagos Street Race are the property of Afigo Brightpath Technology LTD or used under licensed agreement. You may not copy, extract, distribute, decompile, or modify game assets without prior written consent.
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
                {/* 8. USER DATA DELETION INSTRUCTIONS (PLAY & META) */}
                {/* ─────────────────────────────────────────────────────────── */}
                <section
                  id="lagos-street-race-deletion"
                  className="scroll-mt-24 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50"
                >
                  <span id="lagos-deletion" className="scroll-mt-24 block"></span>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                        <span>Google Play Account Deletion & GDPR Art. 17 Compliant</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        User Data Deletion Instructions for Lagos Street Race
                      </h2>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-mono">
                      <div className="text-emerald-600 font-bold">Package: com.sampidia.lagosstreetrace</div>
                      <div className="text-red-600 font-bold">Meta App ID: 2077465642893808</div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-8 text-base">
                    In compliance with the <strong>Google Play Account Deletion Policy</strong>, <strong>Meta Platform Policies</strong>, and global privacy laws (GDPR / CCPA / NDPR), users of <strong>Lagos Street Race</strong> have the unequivocal right to request permanent deletion of all personal data, game progress, cloud saves, and leaderboard entries associated with their account.
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-semibold">
                    You can delete your data using any of the following methods:
                  </p>

                  <div className="space-y-8">
                    {/* Method A: Google Play & Web Deletion Form (Google Play Certified URL) */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 sm:p-8 border border-emerald-200">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="text-lg sm:text-xl font-black text-emerald-950 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            1
                          </span>
                          Method 1: Web-Based Account & Data Deletion Portal (Google Play Official URL)
                        </h3>
                        <span className="text-xs bg-emerald-200/80 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                          Recommended for Android & iOS
                        </span>
                      </div>
                      <p className="text-emerald-900/90 text-sm leading-relaxed mb-4">
                        Google Play policy mandates an accessible web URL where users can request deletion without needing to reinstall the app:
                      </p>
                      <ol className="space-y-2 text-sm text-gray-800 list-decimal pl-5 mb-5">
                        <li>Visit our secure self-service portal: <Link to="/delete-account?app=lagos-street-race" className="text-emerald-700 font-bold underline">https://afigo.sampidia.com/#/delete-account</Link>.</li>
                        <li>Select <strong>Lagos Street Race</strong> from the app dropdown.</li>
                        <li>Enter your email address and your in-game username or Google Play Games display name.</li>
                        <li>Submit the request. Your cloud progression and leaderboard records will be permanently purged within <strong>48 hours</strong>.</li>
                      </ol>
                      <Link
                        to="/delete-account?app=lagos-street-race"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-1.5"
                      >
                        <span>Launch Official Web Deletion Form</span>
                        <span>→</span>
                      </Link>
                    </div>

                    {/* Method B: Automatic Deletion via Facebook Settings (Instant Games) */}
                    <div className="bg-blue-50/70 rounded-2xl p-6 sm:p-8 border border-blue-200">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="text-lg sm:text-xl font-black text-blue-950 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            2
                          </span>
                          Method 2: Automatic Deletion via Facebook Settings (For Instant Games Players)
                        </h3>
                        <span className="text-xs bg-blue-200/80 text-blue-900 font-bold px-2.5 py-1 rounded-full">
                          Instant Callback
                        </span>
                      </div>
                      <p className="text-blue-900/90 text-sm leading-relaxed mb-4">
                        If you play Lagos Street Race via Facebook Instant Games:
                      </p>
                      <ol className="space-y-2.5 text-sm text-gray-800 list-decimal pl-5 mb-5">
                        <li>Log in to your Facebook account on web or mobile app.</li>
                        <li>Navigate to <strong>Settings & Privacy</strong> &gt; <strong>Settings</strong>.</li>
                        <li>In the left menu, click <strong>Apps and Websites</strong> (or <strong>Games</strong>).</li>
                        <li>Find <strong>Lagos Street Race</strong> and click <strong>Remove</strong>.</li>
                        <li>Check the box to <em>"Delete posts, videos or events Lagos Street Race posted on your timeline"</em> and confirm.</li>
                        <li>Facebook immediately revokes token access and dispatches Meta's automated data deletion callback.</li>
                      </ol>
                      <a
                        href="https://www.facebook.com/settings?tab=applications"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-1.5"
                      >
                        <span>Open Facebook Apps & Games Settings</span>
                        <span>↗</span>
                      </a>
                    </div>

                    {/* Method C: Manual Support Request (Email) */}
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            3
                          </span>
                          Method 3: Direct Email to Developer Support
                        </h3>
                        <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2.5 py-1 rounded-full">
                          Direct Assistance
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        You can email our data protection team directly:
                      </p>
                      <ol className="space-y-2.5 text-sm text-gray-800 list-decimal pl-5 mb-5">
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
                          Include your Gamer Tag, Google Play Games profile name, or Facebook Gaming Profile URL.
                        </li>
                        <li>
                          <strong>Confirmation:</strong> All associated database entries will be erased within 48 hours, with confirmation dispatched to your email.
                        </li>
                      </ol>
                      <a
                        href="mailto:admin@sampidia.com?subject=Data%20Deletion%20Request%20-%20Lagos%20Street%20Race&body=Dear%20Support%20Team%2C%0A%0APlease%20permanently%20delete%20all%20gameplay%20data%2C%20cloud%20saves%2C%20and%20leaderboard%20scores%20for%20my%20account%20in%20Lagos%20Street%20Race%20(Package%3A%20com.sampidia.lagosstreetrace%20%2F%20Meta%20App%20ID%3A%202077465642893808).%0A%0AGamer%20Tag%20or%20Profile%20Name%3A%20%0APlatform%20(Android%20%2F%20iOS%20%2F%20Facebook)%3A%20%0A%0AThank%20you."
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-1.5"
                      >
                        <span>Send Pre-Filled Email Request</span>
                        <span>✉️</span>
                      </a>
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
                    Coverage for WordPress Plugins, Themes, Native Android Apps, and Web Services.
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
                        <div className="flex gap-1.5">
                          <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                            Google Play
                          </span>
                          <span className="text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                            App Store
                          </span>
                          <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                            Meta
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed text-justify mb-2">
                        High-speed 3D arcade racing across Nigeria's iconic Third Mainland Bridge and Lagos expressways on Android (Google Play Store), Apple App Store, and Facebook Instant Games.
                      </p>
                      <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                        <li><strong>Google Play Data Safety Compliant:</strong> Uses Google Play Games Services for cloud saving and AdMob for certified voluntary rewarded ads.</li>
                        <li><strong>Zero Sensitive Permissions:</strong> No camera, audio, or precise GPS location required.</li>
                      </ul>
                      <div className="mt-3 flex gap-4">
                        <a
                          href="#lagos-street-race-privacy"
                          onClick={(e) => scrollToSection(e, 'lagos-street-race-privacy')}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          View Full Privacy Policy ↑
                        </a>
                        <a
                          href="#lagos-data-safety"
                          onClick={(e) => scrollToSection(e, 'lagos-data-safety')}
                          className="text-xs text-emerald-600 font-bold hover:underline"
                        >
                          View Play Data Safety Table ↑
                        </a>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">🎲 Naija Ayo Worldwide</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        A traditional strategic board game variant built for Google Android devices.
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                        <li><strong>Offline Architecture:</strong> Standard game modes run completely locally on your hardware.</li>
                        <li><strong>Ad Serving & Diagnostics:</strong> Optional ads rendered via Google AdMob, collecting GAID and crash statistics.</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">🎙️ Afro Short</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        An entertainment hub for motivational audio podcasts and inspirational media.
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                        <li><strong>Account Synchronization:</strong> Optional user registrations allow you to save media feeds and listen logs on encrypted servers.</li>
                        <li><strong>Streaming Telemetry:</strong> Anonymized usage analytics are captured to optimize streaming bandwidth.</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">🛡️ Fake Products Detector</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        A retail safety tool built to scan and verify batch authenticity against public regulatory alert lists (including NAFDAC recall logs).
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                        <li><strong>Query Isolation:</strong> Scanned batch codes are checked in real-time against public registries without recording identities or query logs.</li>
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
                    To comply with Google Play's rigorous <strong>Data Safety policies</strong>, we provide full disclosure on how our native Android applications handle, share, and protect your device and user data.
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
                          <td className="px-4 py-3">Advertising ID (AAID), Android ID</td>
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
                    <h4 className="text-xl font-bold mb-3 text-red-400">📱 Mobile Apps & Games Data Deletion</h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      Users of our mobile applications (Naija Ayo Worldwide, Afro Short, Fake Detector) and games (Lagos Street Race) may submit an immediate removal request. Once verified, your username, email, and preference history are <strong className="text-white">permanently wiped</strong> from our servers within <strong className="text-white">48 hours</strong>.
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
                        <strong className="text-gray-900">Purchase Information:</strong> Transacted through safe digital payment gateways (like Flutterwave, Envato, or Google Play Billing). We keep transaction IDs and licensing emails to check validity, distribute key updates, and support purchases.
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
                      <h4 className="font-bold text-gray-900 mb-2">Google Play Services & AdMob</h4>
                      <p className="leading-relaxed">
                        Provides core Android libraries, game licensing checks, achievements sync, and in-game advertisements. Google processes identifiers and diagnostic logs under their own privacy standards.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">Meta Platforms & Audience Network</h4>
                      <p className="leading-relaxed">
                        Powers Facebook Instant Games infrastructure, player profile displays via <code className="text-[11px] bg-gray-200 px-1 rounded">FBInstant.player</code>, cloud state syncing, and optional rewarded/interstitial advertisements under Meta's platform terms.
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
