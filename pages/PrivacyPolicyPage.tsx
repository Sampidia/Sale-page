import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BRAIN_LOGO } from '../constants';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const sections = [
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SEO
        title="Privacy Policy | Afigo-Sam Digital Ecosystem & Mobile Apps"
        description="Comprehensive and transparent privacy policy for Afigo-Sam WordPress plugins, premium themes, and native Android applications. Learn about our Google Play Data Safety compliance, data protection standards, and GDPR account deletion."
        keywords="privacy policy, data safety, android privacy policy, GDPR compliance, account deletion, wordpress plugin security"
        ogImage="/assets/favicon-32x32.png"
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
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Ecosystem Privacy Policy
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transparent data practices, GDPR compliance, and Google Play Data Safety details for all Afigo-Sam products and mobile apps.
          </p>
          <div className="mt-6 inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-sm font-semibold text-gray-300">
            Last Updated: May 27, 2026
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sticky Left Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 p-6 shadow-xl shadow-gray-200/50">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4 px-3">
                On This Page
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={(e) => scrollToSection(e, sec.id)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    {sec.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy Text (Right) */}
          <main className="col-span-1 lg:col-span-3 bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/50 prose prose-red max-w-none">
            
            {/* 1. INTRODUCTION */}
            <section id="introduction" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">1</span>
                Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify mb-4">
                At <strong>Afigo-Sam</strong> (collectively referred to as "we", "us", "our", or "Sampidia"), we value your privacy above all else. This Privacy Policy describes how we handle user data across our entire ecosystem, including our premium WordPress plugins, software solutions, responsive themes, and native mobile applications.
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                We design our digital items with "privacy by default" principles. This means we avoid collecting personal data unless it is strictly necessary to deliver, verify, or support our services. By deploying our plugins, purchasing our themes, or installing our mobile apps, you consent to the data practices outlined in this policy.
              </p>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* 2. WORDPRESS PLUGINS & THEMES */}
            <section id="coverage-plugins" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">2</span>
                WordPress Plugins & Themes Coverage
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">🔌 WordPress AI-Powered Automatic Content Generator</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    This plugin runs entirely on **your own self-hosted WordPress server**. 
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                    <li><strong>No Server-Side Tracking:</strong> We do not log, harvest, or store your custom AI API keys (OpenAI, Google Gemini, Anthropic Claude, DeepSeek). These credentials are securely encrypted and stored locally in your own database.</li>
                    <li><strong>Content Data Ownership:</strong> Content generation queries are transmitted directly to the respective AI provider APIs via secure HTTPS connections from your server. We have no access to the generated texts, keywords, or scheduling data.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">🖥️ My Licenses Manager</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    Our software licensing system verifies digital purchase validity to prevent piracy.
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                    <li><strong>Verification Data:</strong> When activating a digital item, our license check sends the license key, domain name, and item identifier to our central server. </li>
                    <li><strong>Strict Purpose:</strong> This data is strictly used to check activation limits and authorize updates. We never track your customer profiles or monitor your database contents.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">🎨 Booking Theme Pro</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    All availability calendars, booking entries, and user forms are processed locally within your database. Payment gateways (e.g. PayPal, Stripe) operate through secure checkout integrations. No financial data ever passes through or resides on our central systems.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* 3. MOBILE APPLICATIONS */}
            <section id="coverage-apps" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">3</span>
                Native Mobile Applications Coverage
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">🎲 Naija Ayo Worldwide</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    A traditional strategic board game variant built for Google Android devices.
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                    <li><strong>Offline Architecture:</strong> Standard game modes (single-player vs AI and pass-and-play local multiplayer) run completely locally on your hardware.</li>
                    <li><strong>Ad Serving & Diagnostics:</strong> Optional ads might be rendered via Google AdMob, which collects temporary mobile ad identifiers (GAID) and crash statistics. Refer to the Google Services section below.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">🎙️ Afro Short</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    An entertainment hub for motivational audio podcasts and inspirational media.
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                    <li><strong>Account Synchronization:</strong> Optional user registrations allow you to save media feeds, synchronize listen logs, and store bookmarks securely on our encrypted servers.</li>
                    <li><strong>Streaming Telemetry:</strong> Anonymized usage analytics (e.g. streaming playback events) are captured to improve stream quality and bandwidth allocation.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">🛡️ Fake Products Detector</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    A retail safety tool built to scan and verify batch authenticity against public regulatory alert lists (including NAFDAC recall logs).
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-xs text-gray-500 space-y-1">
                    <li><strong>Query Isolation:</strong> Your scanned batch codes and item queries are checked in real-time against public regulatory recall registries. We do not store your queries, and we do not link scan history to your identity.</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* 4. ANDROID DATA SAFETY COMPLIANCE */}
            <section id="data-safety" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">4</span>
                Google Play & Android Data Safety Compliance
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify mb-6">
                To comply with Google Play's rigorous **Data Safety policies**, we provide full disclosure on how our native Android apps handle, share, and protect your device and user data.
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
                  We **never** sell your personal data, email addresses, or advertising identifiers to data brokers, advertising networks (outside of basic Google AdMob SDK execution), or third-party marketing companies. All data handling is encrypted in transit and securely contained.
                </p>
              </div>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* 5. ACCOUNT & DATA DELETION */}
            <section id="data-erasure" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">5</span>
                Right to Erasure & Account Deletion
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify mb-6">
                In strict compliance with GDPR Art. 17 (Right to Erasure) and Google Play Store requirements, we provide an **automatic, transparent method** for all users to request the complete deletion of their account and all associated personal data from our systems.
              </p>
              
              <div className="bg-[#0a0e27] text-white rounded-3xl p-8 border border-gray-800 relative overflow-hidden shadow-xl mb-6">
                <div className="absolute top-0 right-0 p-6 opacity-5">{BRAIN_LOGO}</div>
                <h4 className="text-xl font-bold mb-3 text-red-400">🛡️ Need to Delete Your Mobile Account?</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  You can submit an immediate account removal request through our secure portal. Once submitted and verified, your username, email registers, and preference history are **completely wiped** from our servers within **48 hours**.
                </p>
                <Link
                  to="/delete-account"
                  className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/30"
                >
                  Go to Data Deletion Portal →
                </Link>
              </div>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* 6. INFORMATION WE COLLECT */}
            <section id="data-collection" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">6</span>
                Information We Collect & Why
              </h2>
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
                    <strong className="text-gray-900">Customer Support Communications:</strong> If you email us at `admin@sampidia.com`, we retain the email records and content to answer your technical questions.
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

            <hr className="border-gray-100 my-8" />

            {/* 7. THIRD-PARTY SERVICES */}
            <section id="third-parties" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">7</span>
                Third-Party Services
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify mb-6">
                Our apps and portals interact with trusted third-party SDKs and service providers to handle payments, prevent spam, deliver emails, and serve relevant ads:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500">
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
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">Flutterwave API</h4>
                  <p className="leading-relaxed">
                    Processes premium plugin payments safely. Card numbers and billing information are fully tokenized and handled inside secure PCI-DSS level 1 interfaces.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* 8. SECURITY & DATA PROTECTION */}
            <section id="data-protection" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">8</span>
                Security & Data Protection
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify mb-4">
                We take industry-standard technical measures to protect your information:
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 mb-6">
                <li><strong>Encryption in Transit:</strong> All communications, verification API requests, and licensing handshakes use secure TLS 1.3 encryption protocols.</li>
                <li><strong>Server Isolation:</strong> Our backend nodes are sandboxed and fully isolated to prevent cross-site contamination or unauthorized access.</li>
                <li><strong>No Local Retention:</strong> For services like the Fake Products Detector, batch checks are resolved in memory and are never committed to permanent hard disk logs.</li>
              </ul>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* 9. GDPR & GLOBAL USER RIGHTS */}
            <section id="user-rights" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">9</span>
                GDPR & Global Privacy Rights
              </h2>
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

            <hr className="border-gray-100 my-8" />

            {/* 10. CONTACT INFORMATION */}
            <section id="contact" className="mb-4 scroll-mt-24">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold mr-3 border border-red-100">10</span>
                Contact Information
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify mb-6">
                If you have any questions about this Privacy Policy, your data handling rights, or our mobile app data safety protocols, please contact our support team:
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-gray-900">Afigo-Sam Privacy Team</h4>
                  <p className="text-sm text-gray-500">Available 24/7 for privacy inquiries and data requests</p>
                </div>
                <a
                  href="mailto:admin@sampidia.com"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md inline-block whitespace-nowrap"
                >
                  admin@sampidia.com
                </a>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
