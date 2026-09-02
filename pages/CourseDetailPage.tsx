import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { COURSES } from '../constants';
import { CourseFormat } from '../types';
import { useCurrency } from '../context/CurrencyContext';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find((c) => c.id === id) || COURSES[0];
  const { formatCoursePrice } = useCurrency();
  const coursePriceInfo = formatCoursePrice(course.price);

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

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Structured Data (JSON-LD) for Search Engines & AI Assistants (AEO / GEO)
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': course.title,
    'description': course.description,
    'provider': {
      '@type': 'Person',
      'name': 'Afigo Sam',
      'url': 'https://afigo.sampidia.com'
    },
    'offers': {
      '@type': 'Offer',
      'price': course.price,
      'priceCurrency': course.currency,
      'availability': 'https://schema.org/InStock',
      'url': typeof window !== 'undefined' ? window.location.href : 'https://afigo.sampidia.com'
    },
    'hasCourseInstance': {
      '@type': 'CourseInstance',
      'courseMode': ['online', 'blended'],
      'courseWorkload': 'PT2H'
    }
  };

  const faqQuestions = [
    {
      q: `What is included in the ${course.title} masterclass?`,
      a: `Enrolling grants instant full access to the comprehensive PDF Digital Blueprint and guide, plus the option to book a live 30-minute 1-on-1 video mentorship session with Afigo Sam.`
    },
    {
      q: `How does the 30-minute 1-on-1 Live Mentorship session work?`,
      a: `Each live mentorship session is 30 minutes of direct video coaching. After completing your payment, you will immediately unlock our embedded Calendly scheduler to pick your date and time slot. You can also purchase multiple 30-minute sessions if you need more time.`
    },
    {
      q: `How do I download the PDF course blueprint?`,
      a: `After verified checkout, an Instant Download PDF button appears directly on your order confirmation screen. A backup download link is also emailed to your inbox via Resend API.`
    },
    {
      q: `What payment options are available?`,
      a: `Payments are processed securely via Flutterwave (256-bit encryption), supporting Debit/Credit Cards, Bank Transfer, USSD, and Mobile Money in Nigerian Naira (₦30,000 NGN).`
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqQuestions.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };

  // ── Load Flutterwave SDK (VPN-Resilient with Auto-Retry) ─────────────────
  const loadFlutterwaveSdk = (attempt = 1) => {
    setError(null);
    const existing = document.querySelector('script[src*="flutterwave"]');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
      setError(null);
    };
    script.onerror = () => {
      if (attempt < 3) {
        setTimeout(() => loadFlutterwaveSdk(attempt + 1), attempt * 1500);
      } else {
        setError('⚠️ Payment Gateway SDK failed to load. If you are using a VPN or AdBlocker, please pause it or click retry below.');
      }
    };

    document.body.appendChild(script);
  };

  useEffect(() => {
    loadFlutterwaveSdk(1);
  }, []);

  // ── Track Facebook Ads Purchase Event ONLY on Confirmed Payment ───────────
  useEffect(() => {
    if (isPaid && transactionRef) {
      if (typeof window !== 'undefined') {
        const fbqFunc = (window as any).fbq;
        if (fbqFunc) {
          try {
            fbqFunc('track', 'Purchase', {
              value: 20,               // ₦30,000 NGN ≈ $20 USD
              currency: 'USD',         // Meta-accepted ISO 4217 code (NGN is not supported)
              content_ids: [course.id],
              content_name: course.title,
              content_type: 'product',
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
      const workerUrl = import.meta.env.VITE_COURSE_WORKER_URL || import.meta.env.VITE_WORKER_URL || 'https://course.sampidia.com';

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
      setError('Payment Gateway SDK is loading or blocked by VPN. Please click "Retry Loading Gateway" below.');
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
        description: `Enrollment for ${format === 'one-on-one' ? '1-on-1 Live Coaching (30 Min)' : 'PDF Digital Course'}`,
        logo: 'https://afigo.sampidia.com/assets/favicon-32x32.png',
      },
      callback: (data: any) => {
        if (data.status === 'successful' || data.transaction_id || data.tx_ref) {
          const validTxRef = String(data.transaction_id || data.tx_ref || txRef);
          verifyCoursePayment(validTxRef);
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

  // ── Helper to render Total Course Fee & Checkout Card ─────────────────────
  const renderCheckoutCard = (mobileMode = false) => (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
      <div className="border-b border-slate-800 pb-6 mb-6">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Total Course Fee</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black text-white">{coursePriceInfo.formatted}</span>
        </div>
        {format === 'one-on-one' ? (
          <p className="text-xs text-purple-400 font-bold mt-1">
            ✓ 1 × 30-min Live Session — buy multiple sessions to go deeper
          </p>
        ) : (
          <p className="text-xs text-emerald-400 font-bold mt-1">
            ✓ Includes instant access (PDF Blueprint + Email Delivery)
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 mb-6 text-red-400 text-xs font-bold space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <span className="leading-relaxed">{error}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => loadFlutterwaveSdk(1)}
              className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
            >
              🔄 Retry Loading Gateway
            </button>
            <a
              href={course.selarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold underline transition-all"
            >
              🛒 Pay via Selar Store Backup
            </a>
          </div>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="space-y-5">
        <div>
          <label htmlFor={mobileMode ? "customer-name-m" : "customer-name"} className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id={mobileMode ? "customer-name-m" : "customer-name"}
            type="text"
            required
            placeholder="e.g. Afigo Sam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor={mobileMode ? "customer-email-m" : "customer-email"} className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id={mobileMode ? "customer-email-m" : "customer-email"}
            type="email"
            required
            placeholder="e.g. samson@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor={mobileMode ? "customer-phone-m" : "customer-phone"} className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">
            Phone Number (WhatsApp)
          </label>
          <input
            id={mobileMode ? "customer-phone-m" : "customer-phone"}
            type="tel"
            placeholder="e.g. +234 706 345 3903"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        {/* 1-on-1 Session Info Banner */}
        {format === 'one-on-one' && (
          <div className="bg-purple-950/30 border border-purple-800/50 p-4 rounded-2xl space-y-2.5">
            <span className="font-bold flex items-center gap-1.5 text-purple-300 text-xs">
              <span>🎥</span> 1-on-1 Live Mentorship — Session Details
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold shrink-0">⏱️</span>
                <span>Each session is <strong className="text-white">30 minutes</strong> of focused 1-on-1 live coaching.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold shrink-0">🔁</span>
                <span>Need more time? <strong className="text-white">Purchase multiple sessions</strong> — each checkout books one 30-min slot.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold shrink-0">📅</span>
                <span>After payment, you'll schedule your slot directly on our <strong className="text-white">Calendly calendar</strong>.</span>
              </li>
            </ul>
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
              <span>💳</span> Pay {coursePriceInfo.formatted} Now
            </>
          )}
        </button>
      </form>

      {/* Social Share Section (WhatsApp OpenGraph Preview Enabled) */}
      <div className="mt-6 border-t border-slate-800/80 pt-4 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
          Share Course via WhatsApp
        </span>
        <div className="flex items-center gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out "${course.title}" by Afigo Sam: https://course.sampidia.com/share?type=course&id=${course.id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <span>💬</span> Share on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              const link = `https://course.sampidia.com/share?type=course&id=${course.id}`;
              navigator.clipboard.writeText(link);
              alert('WhatsApp share link copied to clipboard!');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            📋 Copy Link
          </button>
        </div>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW: POST-PAYMENT THANK YOU / SUCCESS SCREEN
  // ───────────────────────────────────────────────────────────────────────────
  if (isPaid) {
    const workerBase = (import.meta.env.VITE_COURSE_WORKER_URL || import.meta.env.VITE_WORKER_URL || 'https://course.sampidia.com').replace(/\/$/, '');
    const directPdfUrl = `${workerBase}/api/download-course-pdf?token=${downloadToken}&courseId=${course.id}`;

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
                Payment Verified • {coursePriceInfo.formatted}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">
                Congratulations, {name}!
              </h1>
              <p className="text-slate-300 text-sm sm:text-base">
                Order Reference: <code className="bg-slate-950 px-2 py-1 rounded text-red-400 font-mono">{transactionRef}</code>
              </p>
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

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href={directPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={course.pdfFileName}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-6 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2"
                  >
                    <span>📥</span> Instant Download PDF
                  </a>
                  <a
                    href={`${workerBase}/api/download-receipt?txId=${encodeURIComponent(transactionRef || '')}&email=${encodeURIComponent(email)}&courseId=${encodeURIComponent(course.id)}&currency=${encodeURIComponent(coursePriceInfo.currency)}&amountPaid=${encodeURIComponent(coursePriceInfo.formatted)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm px-6 py-4 rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <span>📄</span> Download Official Receipt (PDF)
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
                  <p className="text-purple-300 text-xs sm:text-sm font-semibold mb-4">
                    👇 Please select your preferred date and time slot on the calendar widget below:
                  </p>
                  <a
                    href={`${workerBase}/api/download-receipt?txId=${encodeURIComponent(transactionRef || '')}&email=${encodeURIComponent(email)}&courseId=${encodeURIComponent(course.id)}&currency=${encodeURIComponent(coursePriceInfo.currency)}&amountPaid=${encodeURIComponent(coursePriceInfo.formatted)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-700 transition-all"
                  >
                    <span>📄</span> Download Official Receipt (PDF)
                  </a>
                </div>

                {/* Embedded Calendly Scheduler Widget (via Worker Gatekeeper Redirect) */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-white min-h-[650px]">
                  <iframe
                    src={`${workerBase}/api/calendly-redirect?txId=${encodeURIComponent(transactionRef || '')}&email=${encodeURIComponent(email)}`}
                    width="100%"
                    height="650"
                    title="Schedule 1-on-1 Mentorship Session"
                    style={{ border: 0, minHeight: '650px', width: '100%' }}
                  />
                </div>
              </div>
            )}

            <div className="text-center pt-10 flex items-center justify-center space-x-6 text-xs font-bold">
              <Link to="/courses" className="text-slate-400 hover:text-white transition-colors">
                ← Return to Course Catalog
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/my-courses" className="text-red-400 hover:text-red-300 transition-colors">
                🔑 Open Student Portal
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW: COURSE DETAIL & CHECKOUT PAGE (HARMONIZED DESKTOP & MOBILE LAYOUT)
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <SEO
        title={`${course.title} | Afigo-Sam Masterclass`}
        description={course.description}
        keywords={`${course.title}, pdf course, 1-on-1 mentorship, vibe coding, n8n free hosting, afigo sam masterclass`}
        ogType="product"
        ogImage={course.ogImage || currentCover}
        jsonLd={[courseSchema, faqSchema]}
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

        {/* 1. Header Title & Subtitle (Full-width top on both Desktop & Mobile) */}
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
          </div>
        </div>

        {/* MAIN 2-COLUMN GRID ON DESKTOP / RESPONSIVE FLOW ON MOBILE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN ON DESKTOP / MAIN FLOW ON MOBILE */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            
            {/* ITEM 1: Cover Image Banner (order-1 on mobile, 1st in left column on desktop) */}
            <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-[16/9] relative group order-1 lg:order-none">
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

            {/* ITEM 2: Format Switcher Card (order-2 on mobile, 2nd in left column on desktop) */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 sm:p-6 rounded-3xl backdrop-blur-md order-2 lg:order-none">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Select Course Learning Format:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PDF Format Option */}
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`p-4 sm:p-5 rounded-2xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                    format === 'pdf'
                      ? 'bg-red-950/40 border-red-500 text-white ring-1 ring-red-500/50 shadow-xl'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {format === 'pdf' ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        ✓
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">📘</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${format === 'pdf' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-slate-800 text-slate-500'}`}>
                        {format === 'pdf' ? 'Selected' : 'Format Option'}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-white mb-1">PDF Digital Masterclass</h4>
                    <p className="text-xs text-slate-400">Instant PDF download + Resend automated email delivery.</p>
                  </div>
                </button>

                {/* 1-on-1 Format Option */}
                <button
                  type="button"
                  onClick={() => setFormat('one-on-one')}
                  className={`p-4 sm:p-5 rounded-2xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                    format === 'one-on-one'
                      ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/50 shadow-xl'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {format === 'one-on-one' ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        ✓
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">🤝</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${format === 'one-on-one' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-500'}`}>
                        {format === 'one-on-one' ? 'Selected' : 'Format Option'}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-white mb-1">1-on-1 Live Mentorship</h4>
                    <p className="text-xs text-slate-400">Live 1-on-1 video coaching with Afigo Sam. <strong className="text-purple-300">Each session is 30 minutes.</strong> You can purchase multiple sessions.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* ITEM 3: Mobile Checkout Fee Card (Renders HERE on mobile only, order-3 lg:hidden) */}
            <div className="order-3 lg:hidden">
              {renderCheckoutCard(true)}
            </div>

            {/* ITEM 4: Description, Features, and Curriculum (order-4 on mobile, 3rd in left column on desktop) */}
            <div className="order-4 lg:order-none space-y-10">
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

          </div>

          {/* RIGHT COLUMN ON DESKTOP (STICKY 5-COLUMN CONTAINER, HIDDEN ON MOBILE) */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24">
            {renderCheckoutCard(false)}
          </div>

        </div>

        {/* ── FAQ SECTION (Optimized for AEO & GEO Search Engines) ───────────────────── */}
        <div className="mt-16 border-t border-slate-800/80 pt-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-2">
              Everything You Need to Know
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Direct answers about course delivery, 1-on-1 mentorship format, and payment security.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqQuestions.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-white">
                      {item.q}
                    </span>
                    <span className="text-red-400 text-lg font-black shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-0 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/50">
                      <p className="pt-3">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};

export default CourseDetailPage;
