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

      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors mb-6 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800"
            >
              <span>← Back to Masterclasses</span>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Student Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Access Portal</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Enter your purchase email address to retrieve your masterclass PDF blueprints, 1-on-1 mentorship slots, and official receipts.
            </p>
          </div>

          {/* STEP 1: Request Email Access */}
          {step === 'email' && (
            <div className="max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-red-950/20">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-950/60 border border-red-500/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  🔑
                </div>
                <h2 className="text-xl font-bold text-white">Passwordless Verification</h2>
                <p className="text-xs text-slate-400 mt-1">We will send a 6-digit access code to your email.</p>
              </div>

              {errorMessage && (
                <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-3.5 rounded-xl mb-6 text-center">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleRequestAccess} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Purchase Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <span>Send Access Code 🔑</span>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  Haven't enrolled yet?{' '}
                  <Link to="/courses" className="text-red-400 font-semibold hover:underline">
                    Explore Masterclasses
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Enter OTP Code */}
          {step === 'otp' && (
            <div className="max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-red-950/20">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  📩
                </div>
                <h2 className="text-xl font-bold text-white">Enter 6-Digit Code</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sent to <strong className="text-slate-200">{email}</strong>
                </p>
              </div>

              {errorMessage && (
                <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-3.5 rounded-xl mb-6 text-center">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold tracking-[8px] text-red-400 placeholder-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <span>Unlock My Courses 🚀</span>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-800 text-center flex items-center justify-between text-xs">
                <button
                  onClick={() => { setStep('email'); setErrorMessage(''); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ← Change Email
                </button>
                <button
                  onClick={handleRequestAccess}
                  className="text-red-400 font-semibold hover:underline"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Student Purchases Dashboard */}
          {step === 'dashboard' && (
            <div className="space-y-8">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Welcome back, <span className="text-red-400">{purchases[0]?.customerName || email}</span>!
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Showing {purchases.length} verified purchase{purchases.length === 1 ? '' : 's'} linked to <span className="text-slate-300 font-mono">{email}</span>
                  </p>
                </div>
                <button
                  onClick={() => { setStep('email'); setEmail(''); setCode(''); setPurchases([]); }}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-colors font-medium"
                >
                  🔒 Sign Out
                </button>
              </div>

              {/* Purchases Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchases.map((item) => {
                  const courseData = COURSES.find(c => c.id === item.courseId) || COURSES[0];
                  const formattedDate = item.purchasedAt
                    ? new Date(item.purchasedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Recently Purchased';

                  return (
                    <div
                      key={item.id || item.transactionId}
                      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl"
                    >
                      <div className="p-6">
                        {/* Course Badge & Date */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-950/80 text-red-400 border border-red-800/50 px-3 py-1 rounded-full">
                            {item.format === 'one-on-one' ? '🗓️ 1-on-1 Mentorship' : '📘 Masterclass PDF'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {formattedDate}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                          {courseData.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-6">
                          {courseData.subtitle || courseData.description}
                        </p>

                        {/* Actions */}
                        <div className="space-y-3">
                          <a
                            href={item.r2DownloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-950/40"
                          >
                            <span>📥 Download PDF Blueprint</span>
                          </a>

                          {item.format === 'one-on-one' && (
                            <a
                              href={item.calendlyUrl || 'https://calendly.com/oghenekaroafigo/meeting'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-purple-950/40"
                            >
                              <span>🗓️ Schedule Live Session (Calendly)</span>
                            </a>
                          )}

                          <a
                            href={item.receiptLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all border border-slate-700/60"
                          >
                            <span>📄 View Official Receipt (PDF)</span>
                          </a>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="bg-slate-950/60 px-6 py-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Ref: <strong className="text-slate-300 font-mono">{item.transactionId}</strong></span>
                        <span className="text-emerald-400 font-semibold">✓ Access Guaranteed</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseDashboard;
