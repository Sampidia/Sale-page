import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';

interface CertVerificationResult {
  valid: boolean;
  certId?: string;
  studentName?: string;
  courseTitle?: string;
  issueDate?: string;
  verificationStatus?: string;
  issuer?: string;
  message?: string;
}

const VerifyCertificatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [certIdInput, setCertIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertVerificationResult | null>(null);
  const [searchedId, setSearchedId] = useState('');

  const workerUrl =
    import.meta.env.VITE_WORKER_URL ||
    'https://course-payment-worker.karopidia.workers.dev';

  const verifyCertificate = async (idToVerify: string) => {
    const cleanId = idToVerify.trim();
    if (!cleanId) return;

    setLoading(true);
    setResult(null);
    setSearchedId(cleanId);

    try {
      const response = await fetch(
        `${workerUrl}/api/verify-certificate?certId=${encodeURIComponent(cleanId)}`
      );
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setResult({
        valid: false,
        message: 'Unable to connect to verification server. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlId = searchParams.get('id') || searchParams.get('certId') || searchParams.get('txId');
    if (urlId) {
      setCertIdInput(urlId);
      verifyCertificate(urlId);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCertificate(certIdInput);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SEO
        title="Verify Certificate of Attendance | Afigo-Sam Technology"
        description="Verify the authenticity of an official Afigo-Sam Technology Certificate of Attendance by Certificate ID."
        keywords="verify certificate, certificate lookup, afigo sam certificate, official credential verification"
        ogImage="/assets/favicon-32x32.png"
      />

      {/* ─── HERO HEADER ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 py-16 px-4">
        {/* Background glow orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
            <span>📜</span> Official Credential Verification
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 font-serif">
            Verify Certificate Authenticity
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Enter a Certificate ID below to confirm the authenticity, recipient details, and completion record of an official Afigo-Sam Technology certificate.
          </p>

          {/* ─── SEARCH BAR FORM ────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                placeholder="Enter Certificate ID (e.g. CERT-10475254)"
                className="w-full px-5 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-medium tracking-wide shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !certIdInput.trim()}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-600/25 border border-amber-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>🔍 Verify Credential</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* ─── RESULT DISPLAY SECTION ───────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        {loading && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center shadow-2xl">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <h3 className="text-lg font-bold text-white mb-2">Querying D1 Credential Ledger...</h3>
            <p className="text-slate-400 text-sm">Verifying session record for ID: <span className="text-amber-400 font-mono font-semibold">{searchedId}</span></p>
          </div>
        )}

        {!loading && result && (
          <div>
            {result.valid ? (
              /* ── VALID / AUTHENTIC CERTIFICATE CARD ── */
              <div className="bg-slate-900/90 border-2 border-amber-500/50 rounded-2xl p-8 md:p-10 shadow-2xl shadow-amber-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Badge Header */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-400">
                    ✓
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold tracking-wider uppercase mb-1">
                      Official & Verified Credential
                    </span>
                    <h2 className="text-xl font-bold text-white font-serif">Authentic Certificate of Attendance</h2>
                  </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Awarded To</div>
                    <div className="text-xl font-bold text-amber-400 font-serif">{result.studentName}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Certificate ID</div>
                    <div className="text-base font-mono font-bold text-slate-200">{result.certId}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Program / Course</div>
                    <div className="text-sm font-semibold text-slate-200">{result.courseTitle}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Date Issued</div>
                    <div className="text-sm font-semibold text-slate-200">{result.issueDate}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Issuing Authority</div>
                    <div className="text-sm font-semibold text-slate-200">{result.issuer || 'Afigo-Sam Technology'}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Session Status</div>
                    <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                      <span>✅</span> Mentorship Call Attended & Granted
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Verified directly against D1 Database Ledger
                  </span>
                  <Link
                    to="/courses"
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 underline transition-colors"
                  >
                    Explore Mentorship Programs →
                  </Link>
                </div>
              </div>
            ) : (
              /* ── INVALID / UNVERIFIED CERTIFICATE CARD ── */
              <div className="bg-slate-900/90 border border-red-500/40 rounded-2xl p-8 md:p-10 shadow-2xl text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl text-red-400 mx-auto mb-4">
                  ✕
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Unverified Credential</h3>
                <p className="text-red-400 text-sm font-medium mb-6">
                  {result.message || `No authentic certificate found for ID: ${searchedId}`}
                </p>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
                  Official certificates are awarded automatically upon completion of live 1-on-1 mentorship sessions. Please double check that the Certificate ID was entered correctly (e.g. <span className="font-mono text-slate-300">CERT-10475254</span>).
                </div>
                <button
                  onClick={() => {
                    setResult(null);
                    setCertIdInput('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  Try Another ID
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && !result && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-base font-bold text-slate-300 mb-1">Tamper-Proof Verification</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
              Each official certificate issued by Afigo-Sam Technology features a unique Certificate ID mapped directly to our D1 database. Enter a Certificate ID above to verify authenticity.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default VerifyCertificatePage;
