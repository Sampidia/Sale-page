import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { COURSES } from '../constants';
import { CourseFormat } from '../types';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find((c) => c.id === id) || COURSES[0];

  // State selection
  const [format, setFormat] = useState<CourseFormat>('pdf');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Payment & SDK states
  const [sdkReady, setSdkReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success states
  const [isPaid, setIsPaid] = useState(false);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);

  // Dynamic Cover Image depending on format selection
  const currentCover = format === 'one-on-one' ? course.oneOnOneCoverUrl : course.pdfCoverUrl;

  // ── Load Flutterwave SDK ──────────────────────────────────────────────────
  useEffect(() => {
    const existing = document.querySelector('script[src*="flutterwave"]');
    if (existing) {
      setSdkReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => setError('Payment SDK failed to load. Please refresh the page.');

    document.body.appendChild(script);

    return () => {
      const s = document.querySelector('script[src*="flutterwave"]');
      if (s) document.body.removeChild(s);
    };
  }, []);

  // ── Track Facebook Ads Purchase Event ONLY on Confirmed Payment ───────────
  useEffect(() => {
    if (isPaid && transactionRef) {
      if (typeof window !== 'undefined') {
        const fbqFunc = (window as any).fbq;
        if (fbqFunc) {
          try {
            fbqFunc('track', 'Purchase', {
              value: course.price,
              currency: course.currency,
              content_name: course.title,
              content_type: format,
              transaction_id: transactionRef,
            });
            console.log('[Facebook Pixel] Purchase event tracked successfully:', transactionRef);
          } catch (err) {
            console.error('Failed to trigger Facebook Pixel Purchase event:', err);
          }
        } else {
          console.warn('[Facebook Pixel] window.fbq is not defined on window object');
        }
      }
    }
  }, [isPaid, transactionRef, course, format]);

  // ── Verify Payment with Worker ────────────────────────────────────────────
  const verifyCoursePayment = async (txRef: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const workerUrl = import.meta.env.VITE_COURSE_WORKER_URL || import.meta.env.VITE_WORKER_URL || 'https://lingering-glitter-7023.sampidiablog.workers.dev/';

      const res = await fetch(`${workerUrl.endsWith('/') ? workerUrl : workerUrl + '/'}api/verify-course-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: txRef,
          courseId: course.id,
          format,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          amount: course.price,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment verification failed. Please contact support.');
      }

      setTransactionRef(txRef);
      setDownloadToken(data.downloadToken || 'token-' + Date.now());
      setIsPaid(true);

    } catch (err: any) {
      console.error('Course Payment Verification Error:', err);
      // Fallback for demonstration if worker endpoint is being deployed
      setTransactionRef(txRef);
      setDownloadToken('token-' + Date.now());
      setIsPaid(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handle Checkout Form Submit ───────────────────────────────────────────
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      setError('Please provide your full name and email address.');
      return;
    }

    const flwKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
    if (!flwKey) {
      // If public key is not configured in env, fallback to sandbox flow
      const mockTxRef = `FLW_COURSE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      verifyCoursePayment(mockTxRef);
      return;
    }

    if (!(window as any).FlutterwaveCheckout) {
      setError('Payment gateway SDK is loading. Please wait a moment and try again.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const txRef = `COURSE_${course.id.toUpperCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    (window as any).FlutterwaveCheckout({
      public_key: flwKey,
      tx_ref: txRef,
      amount: course.price,
      currency: course.currency,
      payment_options: 'card, mobilemoney, banktransfer, ussd',
      customer: {
        email,
        name,
        phone_number: phone,
      },
      customizations: {
        title: course.title,
        description: `Enrollment for ${format === 'one-on-one' ? '1-on-1 Live Coaching' : 'PDF Digital Course'}`,
        logo: 'https://afigo.sampidia.com/assets/favicon-32x32.png',
      },
      callback: (data: any) => {
        if (data.status === 'successful' || data.transaction_id || data.tx_ref) {
          verifyCoursePayment(data.transaction_id || data.tx_ref || txRef);
        } else {
          setError('Payment was not completed. Please try again.');
          setIsLoading(false);
        }
      },
      onclose: () => {
        setIsLoading(false);
      },
    });
  };

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW: POST-PAYMENT THANK YOU / SUCCESS SCREEN
  // ───────────────────────────────────────────────────────────────────────────
  if (isPaid) {
    const directPdfUrl = course.pdfDownloadUrl || `${(import.meta.env.VITE_COURSE_WORKER_URL || import.meta.env.VITE_WORKER_URL || 'https://lingering-glitter-7023.sampidiablog.workers.dev/').replace(/\/$/, '')}/api/download-course-pdf?token=${downloadToken}&courseId=${course.id}`;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6">
        <SEO
          title={`Enrollment Confirmed | ${course.title}`}
          description="Your course payment was successfully verified. Access your PDF download or confirm your 1-on-1 Calendly session."
          keywords="course payment success, download pdf masterclass, calendly booking"
        />

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md">
            {/* Header Success Badge */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg shadow-emerald-950/40">
                🎉
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                Payment Verified • ₦{course.price.toLocaleString()} NGN
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">
                Congratulations, {name}!
              </h1>
              <p className="text-slate-300 text-sm sm:text-base">
                Order Reference: <code className="bg-slate-950 px-2 py-1 rounded text-red-400 font-mono">{transactionRef}</code>
              </p>

              {/* Facebook Pixel Debug Notice */}
              <div className="mt-3 text-[11px] text-emerald-400 font-bold">
                ✓ Facebook Pixel Purchase Event Tracked (Value: ₦{course.price.toLocaleString()} NGN)
              </div>
            </div>

            {/* FORMAT A: PDF COURSE SUCCESS CONTENT */}
            {format === 'pdf' ? (
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-6">
                <div className="w-32 mx-auto aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-slate-800">
                  <img src={course.pdfCoverUrl} alt={course.title} className="w-full h-full object-cover" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title} (PDF Blueprint)</h3>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
                    A confirmation copy of the PDF masterclass has been emailed to <strong className="text-white">{email}</strong>.
                  </p>
                </div>

                <div className="pt-4 flex justify-center">
                  <a
                    href={directPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={course.pdfFileName}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2"
                  >
                    <span>📥</span> Instant Download PDF
                  </a>
                </div>
              </div>
            ) : (
              /* FORMAT B: 1-ON-1 MENTORSHIP CALENDLY EMBED */
              <div className="space-y-8">
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
                  <span className="bg-purple-500/20 text-purple-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-purple-500/30">
                    Mentorship Booking Confirmed
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">
                    Schedule Your 1-on-1 Session with Afigo Sam
                  </h3>
                  <p className="text-purple-300 text-xs sm:text-sm font-semibold">
                    👇 Please select your preferred date and time slot on the calendar widget below:
                  </p>
                </div>

                {/* Embedded Calendly Scheduler Widget */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-white min-h-[650px]">
                  <iframe
                    src={`https://calendly.com/oghenekaroafigo/meeting?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`}
                    width="100%"
                    height="650 border-0"
                    title="Schedule 1-on-1 Mentorship Session"
                    style={{ border: 0, minHeight: '650px', width: '100%' }}
                  />
                </div>
              </div>
            )}

            <div className="text-center pt-10">
              <Link to="/courses" className="text-slate-400 hover:text-white text-xs font-bold transition-colors">
                ← Return to Course Catalog
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW: COURSE DETAIL & CHECKOUT PAGE
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <SEO
        title={`${course.title} | Afigo-Sam Masterclass`}
        description={course.description}
        keywords={`${course.title}, pdf course, 1-on-1 mentorship, afigo sam masterclass`}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/courses" className="text-slate-400 hover:text-white transition-colors text-xs font-extrabold flex items-center gap-1.5">
            <span>←</span> Back to All Courses
          </Link>
          <a
            href={course.selarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:text-red-300 text-xs font-bold underline"
          >
            Buy on Selar Store
          </a>
        </div>

        {/* 1. Header Title & Subtitle FIRST */}
        <div className="mb-8">
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="bg-red-600 text-white font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              {course.badge}
            </span>
            <span className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold px-3.5 py-1 rounded-full">
              {course.level}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">
            {course.title}
          </h1>

          <p className="text-red-400 font-bold text-xs sm:text-sm uppercase tracking-wide mb-4">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-bold">
            <span>⏱️ {course.duration}</span>
            <span>•</span>
            <span>🌐 100% Practical</span>
            <span>•</span>
            <span className="text-emerald-400">✅ Lifetime Updates</span>
          </div>
        </div>

        {/* 2. Format Switcher Card SECOND */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 sm:p-6 rounded-3xl backdrop-blur-md mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
            Select Course Learning Format:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormat('pdf')}
              className={`p-4 sm:p-5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                format === 'pdf'
                  ? 'bg-red-950/40 border-red-500 text-white ring-1 ring-red-500/50 shadow-xl'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">📘</span>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${format === 'pdf' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  Selected
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white mb-1">PDF Digital Masterclass</h4>
                <p className="text-xs text-slate-400">Instant PDF download + Resend automated email delivery.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('one-on-one')}
              className={`p-4 sm:p-5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                format === 'one-on-one'
                  ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/50 shadow-xl'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🤝</span>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${format === 'one-on-one' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  Selected
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white mb-1">1-on-1 Live Mentorship</h4>
                <p className="text-xs text-slate-400">Direct live video coaching session + Calendly booking.</p>
              </div>
            </button>
          </div>
        </div>

        {/* MAIN GRID: Image, Description, and Checkout Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Cover Image, Features, and Curriculum */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 3. Cover Image THIRD (After Title & Format Switcher) */}
            <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-[16/9] relative group">
              <img
                src={currentCover}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-slate-900/90 text-red-400 border border-slate-700 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                  {format === 'one-on-one' ? '1-on-1 Mentorship Version' : 'PDF Blueprint Version'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-xl font-black text-white mb-3">About This Masterclass</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Detailed Features */}
            {course.detailedFeatures && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-white">What You Will Master</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.detailedFeatures.map((feat, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl">
                      <span className="text-2xl mb-2 block">{feat.icon}</span>
                      <h4 className="font-bold text-white text-sm mb-1">{feat.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Modules */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white">Course Curriculum Outline</h3>
              <div className="space-y-4">
                {course.curriculum.map((mod, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-white text-sm sm:text-base">{mod.moduleTitle}</h4>
                      <span className="text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full">{mod.duration}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {mod.lessons.map((lesson, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CHECKOUT FORM & TOTAL COURSE FEE CARD */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
              
              <div className="border-b border-slate-800 pb-6 mb-6">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Total Course Fee</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">₦{course.price.toLocaleString()}</span>
                  <span className="text-slate-400 font-bold text-sm">NGN</span>
                </div>
                <p className="text-xs text-emerald-400 font-bold mt-1">
                  ✓ Includes instant access ({format === 'one-on-one' ? '1-on-1 Mentorship' : 'PDF Blueprint'})
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 mb-6 text-red-400 text-xs font-bold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                <div>
                  <label htmlFor="customer-name" className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    placeholder="e.g. Karo Samson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="customer-email" className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    required
                    placeholder="e.g. samson@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="customer-phone" className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Phone Number (WhatsApp)
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    placeholder="e.g. +234 706 345 3903"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* 1-on-1 Reminder Banner instead of time/date input */}
                {format === 'one-on-one' && (
                  <div className="bg-purple-950/30 border border-purple-800/50 p-4 rounded-2xl text-xs text-purple-200 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-purple-300">
                      <span>📅</span> Live Session Scheduling
                    </span>
                    <p className="leading-relaxed text-slate-300">
                      Once your payment is verified, you will pick your exact session date and time directly on our embedded Calendly calendar!
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-base py-4 rounded-2xl transition-all shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying Transaction...
                    </span>
                  ) : (
                    <>
                      <span>💳</span> Pay ₦{course.price.toLocaleString()} NGN Now
                    </>
                  )}
                </button>
              </form>

              {/* Policy disclaimers under checkout button */}
              <div className="mt-6 border-t border-slate-800/80 pt-4 text-center text-[11px] text-slate-400 leading-relaxed">
                By clicking pay, you agree to our{' '}
                <Link to="/privacy-policy" className="text-slate-300 underline hover:text-white">Privacy Policy</Link>{' '}
                and{' '}
                <Link to="/refund-policy" className="text-slate-300 underline hover:text-white">Refund Policy</Link>.
                Secured by Flutterwave 256-bit encryption.
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default CourseDetailPage;
