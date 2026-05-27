import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { MOBILE_APPS } from '../constants';
import SEO from '../components/SEO';

const DeleteAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Pre-fill selected app based on query param
  useEffect(() => {
    const appQuery = searchParams.get('app');
    if (appQuery && MOBILE_APPS.some(a => a.id === appQuery)) {
      setSelectedApp(appQuery);
    } else if (MOBILE_APPS.length > 0) {
      setSelectedApp(MOBILE_APPS[0].id);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !selectedApp) {
      setError('Please fill in all fields.');
      return;
    }

    // Verify Turnstile has completed if site key is configured
    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please verify that you are a human via the captcha.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const appName = MOBILE_APPS.find(a => a.id === selectedApp)?.name || selectedApp;

    try {
      // Retrieve the Cloudflare Worker URL from Vite environment variables or fallback
      const workerUrl = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787';

      console.log('Sending account deletion email request to Cloudflare Worker...', {
        email,
        username,
        appName
      });

      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          appName,
          token: turnstileToken // Send token for server-side verification
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as any).error || 'Failed to request account deletion.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting deletion request:', err);
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentAppName = MOBILE_APPS.find(a => a.id === selectedApp)?.name || 'Selected App';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Request Mobile App Account Deletion | Afigo-Sam"
        description="Request the deletion of your account and personal data from any of Afigo-Sam's mobile applications (Naija Ayo Worldwide, Afro Short, Fake Detector) securely."
        keywords="delete mobile app account, data privacy removal request, gdpr data deletion request, ayo game account delete"
        ogImage="/assets/favicon-32x32.png"
      />
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 relative overflow-hidden transition-all">
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-50"></div>

        {!isSubmitted ? (
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Delete My Account</h2>
              <p className="text-sm text-gray-500">
                Please enter your credentials below to initiate the account and data deletion process.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-sm"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  required
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-sm"
                />
              </div>

              <div>
                <label htmlFor="app" className="block text-sm font-bold text-gray-700 mb-2">
                  Select Mobile App
                </label>
                <select
                  id="app"
                  required
                  value={selectedApp}
                  onChange={(e) => setSelectedApp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-sm"
                >
                  {MOBILE_APPS.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name} ({app.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-xs text-amber-800 leading-relaxed">
                <strong>⚠️ Warning:</strong> This action is irreversible. All of your progress, data, and active licenses related to <strong>{currentAppName}</strong> will be permanently deleted after 48 hours.
              </div>

              {/* Cloudflare Turnstile Captcha Widget */}
              {import.meta.env.VITE_TURNSTILE_SITE_KEY ? (
                <div className="flex justify-center my-4 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-2">
                  <Turnstile
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setError('Turnstile captcha failed to load. Please refresh.')}
                  />
                </div>
              ) : (
                <div className="text-[10px] text-gray-400 text-center my-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                  ℹ️ Captcha bypassed: VITE_TURNSTILE_SITE_KEY is not configured in .env.local
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <Link
                  to="/apps"
                  className="flex-1 text-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-sm"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-55"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="relative z-10 text-center py-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200 shadow-lg shadow-green-100">
              <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-3">Request Submitted!</h2>
            <p className="text-base text-gray-600 mb-6 font-medium">
              We have received your account deletion request for <strong className="text-red-600">{currentAppName}</strong>.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-4 mb-8">
              <div className="flex gap-3 text-sm">
                <span className="text-green-600">✓</span>
                <p className="text-gray-600">
                  A verification email has been dispatched notifying you of this request.
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-green-600">✓</span>
                <p className="text-gray-600">
                  Our system administration team at <strong className="text-gray-800">admin@sampidia.com</strong> has been alerted.
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-red-500">⏳</span>
                <p className="text-gray-600">
                  Your profile and data will be permanently wiped out in <strong>48 hours</strong>.
                </p>
              </div>
            </div>

            <Link
              to="/apps"
              className="inline-block w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg text-sm"
            >
              Back to Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountPage;
