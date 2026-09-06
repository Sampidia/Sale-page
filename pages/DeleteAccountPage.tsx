import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { MOBILE_APPS } from '../constants';
import SEO from '../components/SEO';
import { trackLead } from '../utils/analytics';

const WORKER_BASE_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787';

// ─── Portal Deactivation Sub-Form ───────────────────────────────────────────
const PortalDeactivationForm: React.FC<{ prefillEmail?: string }> = ({ prefillEmail }) => {
  const [email, setEmail] = useState(prefillEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please complete the security verification.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${WORKER_BASE_URL}/api/deactivate-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username: email, // portal uses email as identifier
          appName: 'Student / File Portal',
          token: turnstileToken,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data as any).error || 'Failed to submit deactivation request.');
      }

      trackLead('portal_deactivation_request', email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-green-200">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Account Deactivated</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
          Your portal account for <strong className="text-red-600">{email}</strong> has been marked as inactive.
          You will no longer be able to log in with this email.
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 text-left mb-6">
          <p className="font-semibold mb-1">⚠️ Need access again?</p>
          <p>Contact our support team at <strong>admin@sampidia.com</strong> to reactivate your account.</p>
        </div>
        <Link
          to="/"
          className="inline-block w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all text-sm"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="portal-email" className="block text-sm font-bold text-gray-700 mb-2">
          Portal Email Address
        </label>
        <input
          type="email"
          id="portal-email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-sm"
        />
        <p className="text-xs text-gray-400 mt-1.5">Enter the email you used to access the portal.</p>
      </div>

      <div className="bg-red-50 rounded-xl p-4 border border-red-100 text-xs text-red-800 leading-relaxed">
        <strong>⚠️ This action will deactivate your portal account.</strong> You will no longer be able to log in.
        Your data is not deleted — contact support to reactivate.
      </div>

      {import.meta.env.VITE_TURNSTILE_SITE_KEY ? (
        <div className="flex justify-center overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-2">
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setError('Captcha failed to load. Please refresh.')}
          />
        </div>
      ) : (
        <div className="text-[10px] text-gray-400 text-center p-2 bg-gray-50 rounded-xl border border-gray-100">
          ℹ️ Captcha bypassed: VITE_TURNSTILE_SITE_KEY not configured
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <Link
          to="/"
          className="flex-1 text-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-sm"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            'Deactivate Account'
          )}
        </button>
      </div>
    </form>
  );
};

// ─── Mobile App Deletion Sub-Form ────────────────────────────────────────────
const MobileAppDeletionForm: React.FC<{ initialApp?: string }> = ({ initialApp }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [selectedApp, setSelectedApp] = useState(initialApp || (MOBILE_APPS.length > 0 ? MOBILE_APPS[0].id : ''));
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const currentAppName = MOBILE_APPS.find((a) => a.id === selectedApp)?.name || 'Selected App';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !selectedApp) {
      setError('Please fill in all fields.');
      return;
    }
    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please verify that you are a human via the captcha.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const appName = MOBILE_APPS.find((a) => a.id === selectedApp)?.name || selectedApp;

    try {
      const response = await fetch(WORKER_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, appName, token: turnstileToken }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data as any).error || 'Failed to request account deletion.');
      }

      trackLead('mobile_app_deletion_request', appName);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200 shadow-lg shadow-green-100">
          <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Request Submitted!</h2>
        <p className="text-base text-gray-600 mb-6 font-medium">
          We received your account deletion request for{' '}
          <strong className="text-red-600">{currentAppName}</strong>.
        </p>
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-4 mb-8">
          <div className="flex gap-3 text-sm">
            <span className="text-green-600">✓</span>
            <p className="text-gray-600">A confirmation email has been dispatched to you.</p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-green-600">✓</span>
            <p className="text-gray-600">
              Our team at <strong className="text-gray-800">admin@sampidia.com</strong> has been alerted.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-red-500">⏳</span>
            <p className="text-gray-600">
              Your profile and data will be permanently wiped in <strong>48 hours</strong>.
            </p>
          </div>
        </div>
        <Link
          to="/apps"
          className="inline-block w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all text-sm"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
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
        <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">Username</label>
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
        <label htmlFor="app" className="block text-sm font-bold text-gray-700 mb-2">Select Mobile App</label>
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
        <strong>⚠️ Warning:</strong> This action is irreversible. All of your progress, data, and active licenses
        related to <strong>{currentAppName}</strong> will be permanently deleted after 48 hours.
      </div>

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
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const DeleteAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isPortalMode = searchParams.get('type') === 'portal';
  const prefillEmail = searchParams.get('email') || '';
  const appQuery = searchParams.get('app');

  const pageTitle = isPortalMode ? 'Deactivate Portal Account' : 'Request Mobile App Account Deletion';
  const pageDesc = isPortalMode
    ? 'Submit a request to deactivate your Student or File Portal account. Your account status will be set to inactive.'
    : 'Request the deletion of your account and personal data from any of Afigo-Sam\'s mobile applications.';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={`${pageTitle} | Afigo-Sam`}
        description={pageDesc}
        keywords="delete account, deactivate portal account, data privacy, gdpr data deletion"
        ogImage="/assets/favicon-32x32.png"
      />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100 rounded-full blur-2xl opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-50" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
              {isPortalMode ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 015.636 5.636" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{pageTitle}</h2>
            <p className="text-sm text-gray-500">{pageDesc}</p>
          </div>

          {/* Toggle tabs if neither param is set */}
          {!isPortalMode && !appQuery ? null : null}

          {/* Render the correct form */}
          {isPortalMode ? (
            <PortalDeactivationForm prefillEmail={prefillEmail} />
          ) : (
            <MobileAppDeletionForm initialApp={appQuery && MOBILE_APPS.some((a) => a.id === appQuery) ? appQuery : undefined} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
