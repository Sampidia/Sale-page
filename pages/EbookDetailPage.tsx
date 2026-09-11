import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { EBOOKS } from '../constants';
import { useCurrency } from '../context/CurrencyContext';
import { trackFBViewContent, trackFBInitiateCheckout, trackFBPurchase } from '../utils/facebookPixel';

const EbookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ebook = EBOOKS.find((b) => b.id === id) || EBOOKS[0];
  const { formatCoursePrice } = useCurrency();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [txRef, setTxRef] = useState('');
  const [error, setError] = useState<string | null>(null);

  const priceInfo = formatCoursePrice(ebook.price);

  useEffect(() => {
    trackFBViewContent({
      id: ebook.id,
      name: ebook.title,
      category: `Ebook ${ebook.category}`,
      value: priceInfo.amount,
      currency: priceInfo.currency,
    });
  }, [ebook.id, ebook.title, ebook.category, priceInfo.amount, priceInfo.currency]);

  const WORKER_BASE = (import.meta as any).env?.VITE_COURSE_WORKER_URL || (import.meta as any).env?.VITE_WORKER_URL || 'https://course.sampidia.com';

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const generatedTxRef = `EBOOK_${ebook.id.toUpperCase()}_${Date.now()}`;
    trackFBInitiateCheckout({
      id: ebook.id,
      name: ebook.title,
      category: `Ebook ${ebook.category}`,
      value: priceInfo.amount,
      currency: priceInfo.currency,
      email,
      customerName: name,
      phone,
    });

    if (ebook.isFree) {
      verifyEbook(generatedTxRef);
      return;
    }

    const flwKey = (import.meta as any).env?.VITE_FLUTTERWAVE_PUBLIC_KEY;
    if (!flwKey) {
      setError('Payment gateway is not configured (VITE_FLUTTERWAVE_PUBLIC_KEY is missing).');
      return;
    }

    if (!(window as any).FlutterwaveCheckout) {
      setError('Payment SDK is not ready. Please wait a moment and try again.');
      return;
    }

    setError(null);

    (window as any).FlutterwaveCheckout({
      public_key: flwKey,
      tx_ref: generatedTxRef,
      amount: priceInfo.amount,
      currency: priceInfo.currency,
      payment_options: 'card, mobilemoney, banktransfer, ussd',
      customer: { email, name, phone_number: phone },
      customizations: {
        title: ebook.title,
        description: `Ebook PDF Download (${ebook.category})`,
        logo: 'https://afigo.sampidia.com/assets/favicon-32x32.png',
      },
      callback: (res: any) => {
        if (res.status === 'successful' || res.status === 'completed' || res.transaction_id || res.tx_ref) {
          verifyEbook(String(res.transaction_id || res.tx_ref || generatedTxRef));
        }
      },
    });
  };

  const verifyEbook = async (validTxRef: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const cleanWorker = WORKER_BASE.replace(/\/+$/, '');
      const res = await fetch(`${cleanWorker}/api/verify-ebook-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: validTxRef,
          ebookId: ebook.id,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          amount: priceInfo.amount,
          currency: priceInfo.currency,
          isFree: ebook.isFree,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment verification failed.');

      setTxRef(data.transactionId || validTxRef);
      setIsPaid(true);

      trackFBPurchase({
        id: ebook.id,
        name: ebook.title,
        category: `Ebook ${ebook.category}`,
        value: priceInfo.amount,
        currency: priceInfo.currency,
        transactionRef: validTxRef,
        email,
        customerName: name,
        phone,
      });
    } catch (err: any) {
      console.error(err);
      if (ebook.isFree) {
        setTxRef(validTxRef);
        setIsPaid(true);
      } else {
        setError(err.message || 'Payment verification failed. If you were debited, please contact support.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#09080e] text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={`${ebook.title} | Afigo-Sam Ebook`}
        description={ebook.description}
        keywords={`${ebook.title}, ${ebook.category} ebook, digital download pdf`}
        ogImage={ebook.ogImage || ebook.cover3DUrl}
      />

      <div className="max-w-5xl mx-auto">
        <Link to="/ebooks" className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1 mb-8">
          <span>← Back to Ebook Library</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column — 3D Display & Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#12101b] border border-slate-800 rounded-3xl p-6 flex items-center justify-center">
              <img src={ebook.cover3DUrl} alt={ebook.title} className="max-h-96 object-contain drop-shadow-2xl" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-800/60 px-3 py-1 rounded-full">
                {ebook.category} Ebook
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-3 mb-2">{ebook.title}</h1>
              <p className="text-slate-400 text-sm font-medium mb-4">{ebook.subtitle}</p>
              <p className="text-slate-300 text-sm leading-relaxed">{ebook.description}</p>
            </div>

            {ebook.sampleExcerpt && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">📖 Sample Excerpt</h3>
                <p className="text-slate-300 text-xs italic leading-relaxed">"{ebook.sampleExcerpt}"</p>
              </div>
            )}
          </div>

          {/* Right Column — Checkout Card */}
          <div className="lg:col-span-5 bg-[#12101b] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {isPaid ? (
              <div className="space-y-4">
                <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs p-4 rounded-2xl space-y-2">
                  <p className="font-bold text-sm">🎉 Access Granted!</p>
                  <p>Ref: <strong>{txRef}</strong>. Download your PDF below:</p>
                </div>

                {ebook.hasPortraitPdf && (
                  <a
                    href={`${WORKER_BASE}/api/download-ebook-pdf?ebookId=${ebook.id}&format=portrait&txId=${txRef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 block text-center"
                  >
                    <span>📱 Download Portrait PDF</span>
                  </a>
                )}

                {ebook.hasLandscapePdf && (
                  <a
                    href={`${WORKER_BASE}/api/download-ebook-pdf?ebookId=${ebook.id}&format=landscape&txId=${txRef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 border border-slate-700 block text-center"
                  >
                    <span>💻 Download Landscape PDF</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs font-semibold">
                    ⚠️ {error}
                  </div>
                )}

                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-bold text-slate-400 uppercase">Price</div>
                  <div className="text-2xl font-black text-white">
                    {ebook.isFree ? 'FREE' : priceInfo.formatted}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samson Afigo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#09080e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. reader@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#09080e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs shadow-lg cursor-pointer transition-all"
                >
                  {isProcessing ? 'Processing...' : (ebook.isFree ? 'Claim Free Ebook Now →' : `Pay ${priceInfo.formatted} & Download →`)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookDetailPage;
