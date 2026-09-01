import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import { COURSES } from '../constants';

interface PurchasedCourseItem {
  id: string;
  courseId: string;
  format: 'pdf' | 'one-on-one';
  customerName: string;
  transactionId: string;
  purchasedAt: string;
  r2DownloadLink: string;
  receiptLink: string;
  calendlyUrl?: string | null;
}

const WORKER_BASE_URL = (import.meta as any).env?.VITE_COURSE_WORKER_URL || (import.meta as any).env?.VITE_WORKER_URL || 'https://course-worker.sampidiablog.workers.dev';

const CourseDashboard: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'dashboard'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [purchases, setPurchases] = useState<PurchasedCourseItem[]>([]);

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
        title="Student Access Portal | Afigo-Sam Courses"
        description="Access your purchased course PDF blueprints, live 1-on-1 mentorship links, and official payment receipts anytime."
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
              style={{ backgroundImage: `url('assets/student_portal_hero.png')` }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c14] via-[#0d0c14]/40 to-black/60" />

            {/* Top Bar inside Image Panel */}
            <div className="relative z-10 flex items-center justify-end">
              <Link
                to="/courses"
                className="text-[11px] font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/70 transition-all flex items-center space-x-1"
              >
                <span>Back to courses</span>
                <span>→</span>
              </Link>
            </div>

            {/* Bottom Content inside Image Panel */}
            <div className="relative z-10 mt-auto pt-16">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                Master AI & Mobile Engineering
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                Access your masterclass PDF blueprints, 1-on-1 mentorship slots, and official payment receipts anytime.
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
                    Access Student Portal
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Enter your purchase email address to unlock your courses.
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-red-950/80 border border-red-800/80 text-red-300 text-xs p-3.5 rounded-2xl flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleRequestAccess} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Purchase Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">✉️</span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-[#0c0b12] border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-red-950/40 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Access Code...</span>
                      </>
                    ) : (
                      <span>Send 6-Digit Access Code 🔑</span>
                    )}
                  </button>
                </form>

                <div className="pt-6 border-t border-slate-800/80 text-center">
                  <p className="text-xs text-slate-400">
                    Haven't enrolled in a masterclass yet?{' '}
                    <Link to="/courses" className="text-purple-400 font-bold hover:underline">
                      Browse Catalog
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: Enter 6-Digit Code */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                    Enter Verification Code
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    We sent a 6-digit access code to <strong className="text-white">{email}</strong>.
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-red-950/80 border border-red-800/80 text-red-300 text-xs p-3.5 rounded-2xl flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyCode} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                      6-Digit Access Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full bg-[#0c0b12] border border-slate-800 rounded-2xl px-4 py-4 text-center text-2xl font-mono font-extrabold tracking-[10px] text-purple-400 placeholder-slate-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Access Code...</span>
                      </>
                    ) : (
                      <span>Unlock My Masterclasses 🚀</span>
                    )}
                  </button>
                </form>

                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => { setStep('email'); setErrorMessage(''); }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ← Change Email
                  </button>
                  <button
                    onClick={handleRequestAccess}
                    className="text-purple-400 font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Student Purchases Dashboard */}
            {step === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">
                      Welcome, <span className="text-purple-400">{purchases[0]?.customerName || 'Student'}</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      {purchases.length} verified course{purchases.length === 1 ? '' : 's'} linked to {email}
                    </p>
                  </div>
                  <button
                    onClick={() => { setStep('email'); setEmail(''); setCode(''); setPurchases([]); }}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3.5 py-1.5 rounded-full transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {purchases.map((item) => {
                    const courseData = COURSES.find(c => c.id === item.courseId) || COURSES[0];
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
                              {item.format === 'one-on-one' ? '🗓️ 1-on-1 Mentorship' : '📘 PDF Blueprint'}
                            </span>
                            <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                              {courseData.title}
                            </h3>
                          </div>
                          <span className="text-[11px] text-slate-400 shrink-0">{formattedDate}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          <a
                            href={item.r2DownloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all text-center"
                          >
                            <span>📥 Download PDF</span>
                          </a>

                          {item.format === 'one-on-one' && (
                            <a
                              href={item.calendlyUrl || 'https://calendly.com/oghenekaroafigo/meeting'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all text-center"
                            >
                              <span>🗓️ Schedule Live Session</span>
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
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDashboard;
