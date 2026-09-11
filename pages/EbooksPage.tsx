import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { EBOOKS } from '../constants';
import { Ebook, EbookCategory } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { trackFBViewContent, trackFBInitiateCheckout, trackFBPurchase, trackFBLead } from '../utils/facebookPixel';

const EbooksPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedBookForFreeClaim, setSelectedBookForFreeClaim] = useState<Ebook | null>(null);
  const [selectedBookForModal, setSelectedBookForModal] = useState<Ebook | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Form states for Free Ebook Claim
  const [claimName, setClaimName] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);
  const [claimDownloadToken, setClaimDownloadToken] = useState<string>('');
  const [claimError, setClaimError] = useState<string | null>(null);

  // Form states for Paid Ebook Checkout
  const [selectedBookForPaidCheckout, setSelectedBookForPaidCheckout] = useState<Ebook | null>(null);
  const [paidName, setPaidName] = useState('');
  const [paidEmail, setPaidEmail] = useState('');
  const [paidPhone, setPaidPhone] = useState('');
  const [isProcessingPaid, setIsProcessingPaid] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [paidTxRef, setPaidTxRef] = useState('');
  const [paidError, setPaidError] = useState<string | null>(null);

  const { formatProductPrice } = useCurrency();

  const categories: string[] = ['All', 'Free', 'Kids', 'Tech', 'Finance', 'Science'];

  const filteredEbooks = EBOOKS.filter((b) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Free') return b.isFree || b.price === 0;
    return b.category === activeCategory;
  }).sort((a, b) => {
    const aComingSoon = a.comingSoon ? 1 : 0;
    const bComingSoon = b.comingSoon ? 1 : 0;
    return aComingSoon - bComingSoon;
  });

  // ── Track FB ViewContent on Page Load ────────────────────────────────────
  useEffect(() => {
    trackFBViewContent({
      id: 'ebooks-catalog',
      name: 'Ebook Digital Library & Catalog',
      category: 'Ebooks',
      value: 0,
      currency: 'NGN',
    });
  }, []);

  const WORKER_BASE = import.meta.env.VITE_COURSE_WORKER_URL || import.meta.env.VITE_WORKER_URL || 'https://course.sampidia.com';

  // ── Handle Free Ebook Claim Submit ────────────────────────────────────────
  const handleFreeClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForFreeClaim || !claimName || !claimEmail) return;

    setIsSubmittingClaim(true);
    setClaimError(null);

    try {
      const cleanWorker = WORKER_BASE.replace(/\/+$/, '');
      const res = await fetch(`${cleanWorker}/api/verify-ebook-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: `FREE_CLAIM_${selectedBookForFreeClaim.id.toUpperCase()}_${Date.now()}`,
          ebookId: selectedBookForFreeClaim.id,
          customerName: claimName,
          customerEmail: claimEmail,
          amount: 0,
          currency: 'NGN',
          isFree: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process free claim.');

      setClaimDownloadToken(data.downloadToken || 'token-demo');
      setClaimSuccess(true);

      // Track FB Lead Event for Free Claims
      trackFBLead({
        id: selectedBookForFreeClaim.id,
        name: selectedBookForFreeClaim.title,
        category: `Ebook ${selectedBookForFreeClaim.category}`,
      });
    } catch (err: any) {
      console.error('Free claim error:', err);
      setClaimError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  // ── Handle Paid Ebook Flutterwave Checkout ────────────────────────────────
  const handlePaidCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForPaidCheckout || !paidName || !paidEmail) return;

    const book = selectedBookForPaidCheckout;
    const priceInfo = formatProductPrice(book.price);
    const txRef = `EBOOK_${book.id.toUpperCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    trackFBInitiateCheckout({
      id: book.id,
      name: book.title,
      category: `Ebook ${book.category}`,
      value: priceInfo.amount,
      currency: priceInfo.currency,
      email: paidEmail,
      customerName: paidName,
      phone: paidPhone,
    });

    const flwKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

    if (!flwKey) {
      setPaidError('Payment gateway configuration is missing (VITE_FLUTTERWAVE_PUBLIC_KEY). Please contact support.');
      return;
    }

    if (!(window as any).FlutterwaveCheckout) {
      setPaidError('Payment gateway SDK is loading or blocked. Please disconnect VPN or refresh the page and try again.');
      return;
    }

    setPaidError(null);
    setIsProcessingPaid(true);

    (window as any).FlutterwaveCheckout({
      public_key: flwKey,
      tx_ref: txRef,
      amount: priceInfo.amount,
      currency: priceInfo.currency,
      payment_options: 'card, mobilemoney, banktransfer, ussd',
      customer: {
        email: paidEmail,
        name: paidName,
        phone_number: paidPhone,
      },
      customizations: {
        title: book.title,
        description: `Digital Ebook Download (${book.category})`,
        logo: 'https://afigo.sampidia.com/assets/favicon-32x32.png',
      },
      callback: (response: any) => {
        if (response.status === 'successful' || response.status === 'completed' || response.transaction_id || response.tx_ref) {
          const validTxRef = String(response.transaction_id || response.tx_ref || txRef);
          verifyPaidEbook(validTxRef, book);
        } else {
          setPaidError('Payment was not completed. Please try again.');
          setIsProcessingPaid(false);
        }
      },
      onclose: () => {
        setIsProcessingPaid(false);
      },
    });
  };

  const verifyPaidEbook = async (txRef: string, book: Ebook) => {
    setIsProcessingPaid(true);
    setPaidError(null);
    const priceInfo = formatProductPrice(book.price);

    try {
      const cleanWorker = WORKER_BASE.replace(/\/+$/, '');
      const res = await fetch(`${cleanWorker}/api/verify-ebook-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: txRef,
          ebookId: book.id,
          customerName: paidName,
          customerEmail: paidEmail,
          customerPhone: paidPhone,
          amount: priceInfo.amount,
          currency: priceInfo.currency,
          isFree: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment verification failed.');

      setPaidTxRef(data.transactionId || txRef);
      setPaidSuccess(true);

      // Track FB Purchase Event
      trackFBPurchase({
        id: book.id,
        name: book.title,
        category: `Ebook ${book.category}`,
        value: priceInfo.amount,
        currency: priceInfo.currency,
        transactionRef: txRef,
        email: paidEmail,
        customerName: paidName,
        phone: paidPhone,
      });
    } catch (err: any) {
      console.error('Paid Ebook Verify Error:', err);
      setPaidError(err.message || 'Payment verification failed. If you were debited, please contact support.');
    } finally {
      setIsProcessingPaid(false);
    }
  };

  return (
    <div className="bg-[#09080e] text-slate-100 min-h-screen">
      <SEO
        title="Ebook Collection & Digital Guides | Afigo-Sam"
        description="Explore our library of illustrated children's books, AI engineering guides, financial blueprints, and scientific research PDFs."
        keywords="Ada's Golden Thread, children books, AI ebooks, prompt engineering pdf, financial freedom guide, green nanotechnology ebook"
      />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-slate-800/80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-red-950/80 text-red-300 border border-red-800/60 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4">
            <span>📚 DIGITAL LIBRARY & EBOOKS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Discover Empowering Stories & Technical Blueprints
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Explore illustrated storybooks for young minds, enterprise AI agent guides, financial monetization blueprints, and M.Sc. scientific research.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl sm:max-w-3xl mx-auto bg-slate-900/90 border border-slate-800/90 p-2 rounded-2xl backdrop-blur-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat === 'Free' ? '🎁 Free' : cat === 'Kids' ? '🧒 Kids' : cat === 'Tech' ? '💻 Tech' : cat === 'Finance' ? '📈 Finance' : cat === 'Science' ? '🔬 Science' : '✨ All Books'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3-COLUMN EBOOK GRID SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEbooks.map((book) => {
            const priceInfo = formatProductPrice(book.price);
            const isFeatured = book.id === 'adas-golden-thread';
            const isComingSoon = !!book.comingSoon;

            return (
              <div
                key={book.id}
                className={`bg-[#12101b] border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 group relative overflow-hidden shadow-xl ${
                  isComingSoon
                    ? 'border-slate-800/50 opacity-60 grayscale-[30%] cursor-not-allowed'
                    : isFeatured
                    ? 'border-amber-500/50 shadow-amber-950/20 hover:-translate-y-1'
                    : 'border-slate-800/80 hover:border-red-500/40 hover:-translate-y-1'
                }`}
              >
                {/* Coming Soon Overlay Banner */}
                {isComingSoon && (
                  <div className="absolute inset-0 z-20 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-slate-900/95 border border-slate-700 text-amber-400 font-extrabold px-4 py-2 rounded-2xl text-xs shadow-2xl flex items-center space-x-2 backdrop-blur-md">
                      <span>🔒 Coming Soon</span>
                    </div>
                  </div>
                )}

                {/* Featured Glow */}
                {isFeatured && !isComingSoon && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      book.category === 'Kids' ? 'bg-amber-950/80 text-amber-300 border-amber-800/60' :
                      book.category === 'Tech' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60' :
                      book.category === 'Finance' ? 'bg-red-950/80 text-red-300 border-red-800/60' :
                      'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                    }`}>
                      {book.category}
                    </span>

                    {book.badge && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full">
                        ⭐ {book.badge}
                      </span>
                    )}
                  </div>

                  {/* 3D Cover Image Display */}
                  <div
                    onClick={() => {
                      if (isComingSoon) return;
                      setSelectedBookForModal(book);
                      setActiveImageIndex(0);
                    }}
                    className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800/80 p-3 mb-5 flex items-center justify-center ${
                      isComingSoon ? 'cursor-not-allowed' : 'group-hover:border-slate-700 cursor-pointer'
                    }`}
                  >
                    <img
                      src={book.cover3DUrl}
                      alt={book.title}
                      className={`w-full h-full object-contain drop-shadow-xl ${
                        isComingSoon ? '' : 'group-hover:scale-105 transition-transform duration-500'
                      }`}
                    />
                    {!isComingSoon && (
                      <div className="absolute bottom-2 right-2 bg-slate-900/90 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700 backdrop-blur-md">
                        🔍 Preview Gallery
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-amber-400 transition-colors">
                    {book.title}
                  </h3>

                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 mb-5">
                    {book.description}
                  </p>

                  {/* Format Indicator Pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-6 pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-semibold text-slate-400">PDF Formats:</span>
                    {book.hasPortraitPdf && (
                      <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-bold">
                        📱 Portrait
                      </span>
                    )}
                    {book.hasLandscapePdf && (
                      <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-bold">
                        💻 Landscape
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 ml-auto">{book.pagesCount} Pages</span>
                  </div>
                </div>

                {/* Price & CTA Action Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Price</div>
                    {isComingSoon ? (
                      <span className="text-sm font-black text-slate-500 uppercase tracking-wide">
                        COMING SOON
                      </span>
                    ) : book.isFree ? (
                      <span className="text-lg font-black text-emerald-400 uppercase tracking-wide">
                        FREE
                      </span>
                    ) : (
                      <span className="text-lg font-black text-white">
                        {priceInfo.formatted}
                      </span>
                    )}
                  </div>

                  {isComingSoon ? (
                    <button
                      disabled
                      className="bg-slate-800 text-slate-500 font-extrabold py-3 px-5 rounded-2xl text-xs border border-slate-700/50 flex items-center space-x-1.5 cursor-not-allowed"
                    >
                      <span>🔒 Coming Soon</span>
                    </button>
                  ) : book.isFree ? (
                    <button
                      onClick={() => { setSelectedBookForFreeClaim(book); setClaimSuccess(false); setClaimError(null); }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-5 rounded-2xl text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>🎁 Get for Free</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { setSelectedBookForPaidCheckout(book); setPaidSuccess(false); setPaidError(null); }}
                      className="bg-red-600 hover:bg-red-500 text-white font-extrabold py-3 px-5 rounded-2xl text-xs transition-all shadow-lg shadow-red-950/50 flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>🛒 Buy Now</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FREE CLAIM MODAL ─────────────────────────────────────────────────── */}
      {selectedBookForFreeClaim && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13111d] border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setSelectedBookForFreeClaim(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">🎁</span>
              <div>
                <h3 className="text-lg font-bold text-white">Claim Free Ebook Download</h3>
                <p className="text-xs text-slate-400">{selectedBookForFreeClaim.title}</p>
              </div>
            </div>

            {claimSuccess ? (
              <div className="space-y-4 pt-2">
                <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs p-4 rounded-2xl space-y-2">
                  <p className="font-bold text-sm">🎉 Free Claim Verified!</p>
                  <p>We've registered your free download. You can download your PDF files below or access them anytime in your student portal.</p>
                </div>

                <div className="space-y-2 pt-2">
                  {selectedBookForFreeClaim.hasPortraitPdf && (
                    <a
                      href={`${WORKER_BASE}/api/download-ebook-pdf?ebookId=${selectedBookForFreeClaim.id}&format=portrait&token=${claimDownloadToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                    >
                      <span>📱 Download Portrait PDF</span>
                    </a>
                  )}

                  {selectedBookForFreeClaim.hasLandscapePdf && (
                    <a
                      href={`${WORKER_BASE}/api/download-ebook-pdf?ebookId=${selectedBookForFreeClaim.id}&format=landscape&token=${claimDownloadToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all border border-slate-700"
                    >
                      <span>💻 Download Landscape PDF</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedBookForFreeClaim(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs border border-slate-800 mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleFreeClaimSubmit} className="space-y-4 pt-2">
                {claimError && (
                  <div className="bg-red-950/60 border border-red-800/80 p-3 rounded-xl text-xs text-red-300">
                    ⚠️ {claimError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samson Afigo"
                    value={claimName}
                    onChange={(e) => setClaimName(e.target.value)}
                    className="w-full bg-[#09080e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. reader@example.com"
                    value={claimEmail}
                    onChange={(e) => setClaimEmail(e.target.value)}
                    className="w-full bg-[#09080e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingClaim}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  {isSubmittingClaim ? 'Processing Free Claim...' : 'Claim Free Ebook Now →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── PAID CHECKOUT MODAL ──────────────────────────────────────────────── */}
      {selectedBookForPaidCheckout && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13111d] border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setSelectedBookForPaidCheckout(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h3 className="text-lg font-bold text-white">Purchase Ebook</h3>
                <p className="text-xs text-slate-400">{selectedBookForPaidCheckout.title}</p>
              </div>
            </div>

            {paidSuccess ? (
              <div className="space-y-4 pt-2">
                <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs p-4 rounded-2xl space-y-2">
                  <p className="font-bold text-sm">🎉 Purchase Confirmed!</p>
                  <p>Transaction reference: <strong>{paidTxRef}</strong>. Download your PDFs below:</p>
                </div>

                <div className="space-y-2 pt-2">
                  {selectedBookForPaidCheckout.hasPortraitPdf && (
                    <a
                      href={`${WORKER_BASE}/api/download-ebook-pdf?ebookId=${selectedBookForPaidCheckout.id}&format=portrait&txId=${paidTxRef}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                    >
                      <span>📱 Download Portrait PDF</span>
                    </a>
                  )}

                  {selectedBookForPaidCheckout.hasLandscapePdf && (
                    <a
                      href={`${WORKER_BASE}/api/download-ebook-pdf?ebookId=${selectedBookForPaidCheckout.id}&format=landscape&txId=${paidTxRef}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all border border-slate-700"
                    >
                      <span>💻 Download Landscape PDF</span>
                    </a>
                  )}

                  <a
                    href={`${WORKER_BASE}/api/download-receipt?txId=${encodeURIComponent(paidTxRef)}&email=${encodeURIComponent(paidEmail)}&courseId=${selectedBookForPaidCheckout.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 border border-slate-800"
                  >
                    <span>📄 Printable Official Receipt</span>
                  </a>
                </div>

                <button
                  onClick={() => setSelectedBookForPaidCheckout(null)}
                  className="w-full bg-slate-900 text-slate-400 font-bold py-2 px-4 rounded-xl text-xs border border-slate-800"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaidCheckoutSubmit} className="space-y-4 pt-2">
                {paidError && (
                  <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs font-semibold">
                    ⚠️ {paidError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samson Afigo"
                    value={paidName}
                    onChange={(e) => setPaidName(e.target.value)}
                    className="w-full bg-[#09080e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. buyer@example.com"
                    value={paidEmail}
                    onChange={(e) => setPaidEmail(e.target.value)}
                    className="w-full bg-[#09080e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 903 717 2693"
                    value={paidPhone}
                    onChange={(e) => setPaidPhone(e.target.value)}
                    className="w-full bg-[#09080e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPaid}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-red-950/50"
                >
                  {isProcessingPaid ? 'Processing Checkout...' : `Pay ${formatProductPrice(selectedBookForPaidCheckout.price).formatted.replace(/\s[A-Z]{3}$/, '')} Now →`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── IMAGE PREVIEW GALLERY MODAL ──────────────────────────────────────── */}
      {selectedBookForModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#13111d] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setSelectedBookForModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-4">{selectedBookForModal.title} — Artwork Gallery</h3>

            <div className="aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-4 mb-4">
              <img
                src={activeImageIndex === 0 ? selectedBookForModal.cover3DUrl : selectedBookForModal.coverFlatUrl}
                alt={selectedBookForModal.title}
                className="max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setActiveImageIndex(0)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  activeImageIndex === 0 ? 'bg-red-600 text-white border-red-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                3D Book Mockup
              </button>
              <button
                onClick={() => setActiveImageIndex(1)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  activeImageIndex === 1 ? 'bg-red-600 text-white border-red-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                2D Cover Artwork
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbooksPage;
