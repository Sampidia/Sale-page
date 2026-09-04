import React, { useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import SEO from './SEO';
import { COURSES, PRODUCTS } from '../constants';

interface PurchasedCourseItem {
  id: string;
  courseId: string;
  format?: string;
  itemType?: 'course' | 'product';
  customerName?: string;
  transactionId: string;
  purchasedAt: string;
  r2DownloadLink: string;
  receiptLink: string;
  calendlyUrl?: string | null;
  calUrl?: string | null;
  sessionBooked?: boolean;
  rescheduleLink?: string | null;
  noShow?: boolean;
  meetingAttended?: boolean;
  certificateSent?: boolean;
  refundRequested?: boolean;
}

const WORKER_BASE_URL = (import.meta as any).env?.VITE_COURSE_WORKER_URL || (import.meta as any).env?.VITE_WORKER_URL || 'https://course.sampidia.com';

const CourseDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isProductMode = searchParams.get('type') === 'product' || location.pathname === '/my-downloads';
  const [activeTab, setActiveTab] = useState<'all' | 'course' | 'product'>('all');

  const [step, setStep] = useState<'email' | 'otp' | 'dashboard'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [purchases, setPurchases] = useState<PurchasedCourseItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshPurchases = async () => {
    if (!email || isRefreshing) return;
    setIsRefreshing(true);
    try {
      const cleanWorkerUrl = WORKER_BASE_URL.replace(/\/+$/, '');
      const response = await fetch(
        `${cleanWorkerUrl}/api/student-purchases?email=${encodeURIComponent(email.trim())}&token=${encodeURIComponent(sessionToken)}`,
        {
          headers: {
            'X-Session-Token': sessionToken,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.purchases) {
          setPurchases(data.purchases);
        }
      }
    } catch (err) {
      console.error('Failed to refresh purchases:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  // Refund Modal State
  const [refundModalItem, setRefundModalItem] = useState<PurchasedCourseItem | null>(null);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState<string | null>(null);

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalItem || !bankName || !accountNumber || !accountName) {
      alert('Please fill in your Bank Name, Account Number, and Account Name.');
      return;
    }

    setIsSubmittingRefund(true);
    try {
      const res = await fetch(`${WORKER_BASE_URL}/api/request-refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: refundModalItem.transactionId,
          email: email,
          bankName,
          accountNumber,
          accountName,
          refundReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit refund request');

      setRefundSuccessMsg('Refund request submitted successfully! Our team will process it within 3-5 business days.');
      
      // Update local purchase state
      setPurchases(prev => prev.map(p => p.transactionId === refundModalItem.transactionId ? { ...p, refundRequested: true, sessionBooked: false } : p));
    } catch (err: any) {
      alert(err.message || 'Error submitting refund request');
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  // Dynamic Visual & Text Configurations
  const heroImage = isProductMode ? 'assets/product_portal_hero.png' : 'assets/student_portal_hero.png';
  const heroOverlayTitle = isProductMode
    ? 'WordPress themes, plugins, Php Scripts and custom scripts or apps'
    : 'Master AI & Mobile Engineering';
  const heroOverlayDesc = isProductMode
    ? 'Access your purchased plugin ZIP packages, developer documentation, and official payment receipts anytime.'
    : 'Access your masterclass PDF blueprints, 1-on-1 mentorship slots, and official payment receipts anytime.';

  const backLink = isProductMode ? '/products' : '/courses';
  const backLabel = isProductMode ? 'Back to Plugins' : 'Back to courses';

  const portalHeaderTitle = isProductMode ? 'Plugin & Asset Portal' : 'Student Course Access Portal';
  const portalHeaderSubtext = isProductMode
    ? 'Enter your purchase email address to retrieve your product ZIP files, documentation, and receipts.'
    : 'Enter your purchase email address to unlock your courses.';

  // Step 1: Request OTP Access Code
  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${WORKER_BASE_URL}/api/portal/request-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        setErrorMessage(data.error || 'Failed to send access code. Please verify your email.');
        setIsLoading(false);
        return;
      }

      setStep('otp');
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Code and Fetch Purchased Courses
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!code.trim() || code.trim().length < 4) {
      setErrorMessage('Please enter the 6-digit code sent to your email.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${WORKER_BASE_URL}/api/portal/verify-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        setErrorMessage(data.error || 'Invalid or expired code. Please try again.');
        setIsLoading(false);
        return;
      }

      setPurchases(data.purchases || []);
      if (data.sessionToken) {
        setSessionToken(data.sessionToken);
      }
      setStep('dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error verifying access code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={`${portalHeaderTitle} | Afigo-Sam`}
        description={portalHeaderSubtext}
      />

      <div className="min-h-screen bg-[#0a0910] text-slate-100 pt-0 pb-8 sm:py-4 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Main Split Luxury Modal Container */}
        <div className="max-w-5xl w-full bg-[#12111c] border border-slate-800/80 rounded-[32px] overflow-hidden shadow-2xl shadow-purple-950/30 grid grid-cols-1 lg:grid-cols-12 relative z-10">
          
          {/* LEFT HERO ARTWORK PANEL (Figma / Dribbble Style) */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between relative rounded-[28px] overflow-hidden min-h-[300px] lg:min-h-[480px] m-2">
            {/* Background Image Layer */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: `url('${heroImage}')` }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c14] via-[#0d0c14]/40 to-black/60" />

            {/* Top Bar inside Image Panel */}
            <div className="relative z-10 flex items-center justify-end">
              <Link
                to={backLink}
                className="text-[11px] font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/70 transition-all flex items-center space-x-1"
              >
                <span>{backLabel}</span>
                <span>→</span>
              </Link>
            </div>

            {/* Bottom Content inside Image Panel */}
            <div className="relative z-10 mt-auto pt-16">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                {heroOverlayTitle}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {heroOverlayDesc}
              </p>

              {/* Slider Pagination Pills */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-1.5 bg-purple-500 rounded-full" />
                <div className="w-2 h-1.5 bg-slate-700 rounded-full" />
                <div className="w-2 h-1.5 bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>

          {/* RIGHT FORM / DASHBOARD PANEL */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#13111c]">
            
            {/* STEP 1: Email Access Request */}
            {step === 'email' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                    {portalHeaderTitle}
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {portalHeaderSubtext}
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-red-950/60 border border-red-800/80 p-3.5 rounded-2xl text-xs text-red-300 font-medium">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleRequestAccess} className="space-y-4">
                  <div>
                    <label htmlFor="portal-email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Purchase Email Address
                    </label>
                    <input
                      id="portal-email"
                      type="email"
                      required
                      placeholder="e.g. student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#09080e] border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-red-950/40 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Sending 6-Digit Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Access Code</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[11px] text-slate-400 text-center">
                  🔒 Passwordless Verification · A 6-digit access code will be sent to your email.
                </p>
              </div>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800/50 px-2.5 py-1 rounded-full">
                    Step 2 of 2
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3 mb-2">
                    Enter Access Code
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    We sent a 6-digit code to <strong className="text-purple-300">{email}</strong>.
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-red-950/60 border border-red-800/80 p-3.5 rounded-2xl text-xs text-red-300 font-medium">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label htmlFor="portal-code" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      6-Digit Access Code
                    </label>
                    <input
                      id="portal-code"
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#09080e] border border-slate-800 rounded-2xl px-4 py-3.5 text-center text-xl font-mono tracking-[8px] text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-red-950/40 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Unlocking Dashboard...</span>
                      </>
                    ) : (
                      <>
                        <span>Unlock Access Portal</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => { setStep('email'); setErrorMessage(''); }}
                    className="hover:text-slate-200 transition-colors"
                  >
                    ← Change Email
                  </button>
                  <button
                    onClick={handleRequestAccess}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Resend Code 🔄
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Student Purchases Dashboard */}
            {step === 'dashboard' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">
                      Welcome, <span className="text-purple-400">{purchases[0]?.customerName || 'Customer'}</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      {purchases.length} verified purchase{purchases.length === 1 ? '' : 's'} linked to {email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRefreshPurchases}
                      disabled={isRefreshing}
                      title="Refresh purchases & booking status"
                      aria-label="Refresh status"
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-full transition-all cursor-pointer disabled:opacity-50"
                    >
                      <svg
                        className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => { setStep('email'); setEmail(''); setCode(''); setSessionToken(''); setPurchases([]); }}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3.5 py-1.5 rounded-full transition-colors font-medium cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Tab Filter Pills */}
                {purchases.length > 0 && (
                  <div className="flex items-center space-x-2 pb-1">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}`}
                    >
                      All ({purchases.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('course')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'course' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}`}
                    >
                      📘 Masterclasses ({purchases.filter(p => (p.itemType || 'course') === 'course').length})
                    </button>
                    <button
                      onClick={() => setActiveTab('product')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'product' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}`}
                    >
                      🔌 Plugins & Assets ({purchases.filter(p => p.itemType === 'product').length})
                    </button>
                  </div>
                )}

                <div className="space-y-4 max-h-[70vh] sm:max-h-[460px] overflow-y-auto pr-1">
                  {purchases
                    .filter(p => activeTab === 'all' || (activeTab === 'product' ? p.itemType === 'product' : (p.itemType || 'course') === 'course'))
                    .map((item) => {
                      const courseData = COURSES.find(c => c.id === item.courseId);
                      const productData = PRODUCTS.find(p => p.id === item.courseId);
                      const title = item.itemType === 'product'
                        ? (productData?.name || 'WordPress Plugin & Digital Product')
                        : (courseData?.title || 'Masterclass Blueprint');

                      const formattedDate = item.purchasedAt
                        ? new Date(item.purchasedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Verified Order';

                      return (
                        <div
                          key={item.id || item.transactionId}
                          className="bg-[#0c0b12] border border-slate-800/90 hover:border-purple-500/40 rounded-2xl p-5 transition-all space-y-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800/50 px-2.5 py-0.5 rounded-full">
                                {item.itemType === 'product' ? '🔌 Plugin Package' : (item.format === 'one-on-one' ? '🗓️ 1-on-1 Mentorship' : '📘 PDF Blueprint')}
                              </span>
                              <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                                {title}
                              </h3>
                            </div>
                            <span className="text-[11px] text-slate-400 shrink-0">{formattedDate}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                            {item.itemType === 'product' ? (
                              <a
                                href={item.r2DownloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all text-center"
                              >
                                <span>📥 Download Plugin ZIP</span>
                              </a>
                            ) : item.format === 'one-on-one' ? (
                              <div className="col-span-1 sm:col-span-2 space-y-2">
                                {item.refundRequested ? (
                                  <div className="bg-red-950/80 border border-red-800/60 text-red-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 text-center">
                                    <span>🔴 Refund Request Pending (3-5 Business Days)</span>
                                  </div>
                                ) : item.meetingAttended ? (
                                  <div className="space-y-2">
                                    <div className="bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 text-center">
                                      <span>🎓 Mentorship Session Completed</span>
                                    </div>
                                    <a
                                      href={`${WORKER_BASE_URL}/api/certificate?txId=${encodeURIComponent(item.transactionId)}&email=${encodeURIComponent(email)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all text-center w-full"
                                    >
                                      <span>📜 Download Certificate of Attendance</span>
                                    </a>
                                  </div>
                                ) : item.noShow ? (
                                  <div className="space-y-2">
                                    <div className="bg-red-950/80 border border-red-800/60 text-red-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 text-center">
                                      <span>⚠️ Missed Session</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <a
                                        href={item.calUrl || item.calendlyUrl || `${WORKER_BASE_URL}/api/cal-redirect?txId=${encodeURIComponent(item.transactionId)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex-1 text-center"
                                      >
                                        🗓️ Re-book
                                      </a>
                                      <button
                                        onClick={() => { setRefundModalItem(item); setRefundSuccessMsg(null); }}
                                        className="bg-slate-800 hover:bg-slate-700 text-red-300 font-bold py-2 px-3 rounded-xl text-xs border border-slate-700 flex-1 text-center"
                                      >
                                        💸 Request Refund
                                      </button>
                                    </div>
                                  </div>
                                ) : item.sessionBooked ? (() => {
                                    const meetingTime = item.meetingStartTime ? new Date(item.meetingStartTime).getTime() : null;
                                    const now = Date.now();
                                    const hoursLeft = meetingTime ? (meetingTime - now) / (1000 * 3600) : 999;
                                    const isRescheduleLocked = hoursLeft < 12;
                                    const isCancelLocked = hoursLeft < 24;
                                    const reschedUrl = item.rescheduleLink || item.calUrl || `${WORKER_BASE_URL}/api/cal-redirect?txId=${encodeURIComponent(item.transactionId)}`;
                                    const bookingBaseUrl = reschedUrl.replace('/reschedule/', '/booking/');
                                    const cancelUrl = bookingBaseUrl.includes('?') ? `${bookingBaseUrl}&cancel=true` : `${bookingBaseUrl}?cancel=true`;

                                    return (
                                      <div className="space-y-2">
                                        <div className="bg-amber-950/80 border border-amber-800/60 text-amber-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 text-center">
                                          <span>✅ Session Scheduled</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                          {isRescheduleLocked ? (
                                            <span className="bg-slate-800 text-slate-500 font-bold py-2.5 px-3 rounded-xl text-xs text-center flex-1 cursor-not-allowed border border-slate-700">
                                              🔒 Reschedule Locked
                                            </span>
                                          ) : (
                                            <a
                                              href={reschedUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all text-center flex-1 shadow-lg shadow-purple-950/40"
                                            >
                                              <span>🔄 Reschedule</span>
                                            </a>
                                          )}

                                          {isCancelLocked ? (
                                            <span className="bg-slate-800 text-slate-500 font-bold py-2.5 px-3 rounded-xl text-xs text-center flex-1 cursor-not-allowed border border-slate-700">
                                              🔒 Cancel Locked
                                            </span>
                                          ) : (
                                            <a
                                              href={cancelUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="bg-red-700 hover:bg-red-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all text-center flex-1"
                                            >
                                              <span>❌ Cancel Booking</span>
                                            </a>
                                          )}
                                        </div>
                                        {isRescheduleLocked ? (
                                          <p className="text-[11px] text-red-400 font-medium text-center">
                                            ⚠️ Rescheduling and Cancellation is locked because your meeting starts in less than 24 hours. Support: admin@afigo.sampidia.com
                                          </p>
                                        ) : isCancelLocked ? (
                                          <p className="text-[11px] text-amber-400 font-medium text-center">
                                            ⚠️ Cancellation is locked because your meeting starts in less than 24 hours. Support: admin@afigo.sampidia.com
                                          </p>
                                        ) : (
                                          <p className="text-[11px] text-slate-400 font-medium text-center">
                                            💡 Click Reschedule to change meeting platform (Google Meet ↔ CalVideo) or select a new date & time
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })() : (
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <a
                                      href={item.calUrl || item.calendlyUrl || `${WORKER_BASE_URL}/api/cal-redirect?txId=${encodeURIComponent(item.transactionId)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all text-center flex-1"
                                    >
                                      <span>🗓️ Schedule Live Session</span>
                                    </a>
                                    <button
                                      onClick={() => { setRefundModalItem(item); setRefundSuccessMsg(null); }}
                                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold py-2 px-3 rounded-xl text-xs border border-slate-800 transition-all text-center"
                                    >
                                      💸 Request Refund
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <a
                                href={item.r2DownloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all text-center"
                              >
                                <span>📥 Download PDF</span>
                              </a>
                            )}

                            <a
                              href={item.receiptLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-slate-800 transition-all text-center"
                            >
                              <span>📄 Printable Receipt</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {purchases.length > 1 && (
                  <p className="text-[11px] text-slate-400 text-right pt-1 font-medium">
                    Scroll to view all purchases ↓
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Refund Request Modal ─────────────────────────────────────────── */}
      {refundModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setRefundModalItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span>💸</span> Request Refund
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Submit your payout details below for purchase ref <strong>{refundModalItem.transactionId}</strong>. Our team will review and process your refund within 3–5 business days.
            </p>

            {refundSuccessMsg ? (
              <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs p-4 rounded-xl space-y-3">
                <p className="font-bold">{refundSuccessMsg}</p>
                <button
                  onClick={() => setRefundModalItem(null)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs w-full"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleRefundSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bank / Mobile Money Provider Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Access Bank, Kuda, M-Pesa, MTN MoMo"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account / Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account Holder Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samson Afigo"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Refund (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Schedule conflict / change of plans"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundModalItem(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRefund}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex-1"
                  >
                    {isSubmittingRefund ? 'Submitting...' : 'Submit Refund Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDashboard;
