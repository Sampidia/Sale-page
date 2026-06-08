import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { MOBILE_APPS } from '../constants';

type TournamentType = 'quick' | 'weekend';

const GetCodePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const appParam = searchParams.get('app');

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [tournamentType, setTournamentType] = useState<TournamentType>('quick');

  // API states
  const [availableSlots, setAvailableSlots] = useState<number | null>(null);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passcode, setPasscode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedApp = MOBILE_APPS.find((a) => a.id === 'naija-ayo-worldwide');

  // Dynamic Flutterwave Script Loader
  useEffect(() => {
    if (appParam === 'naija-ayo-worldwide') {
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        const existingScript = document.querySelector('script[src="https://checkout.flutterwave.com/v3.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [appParam]);

  // Fetch Slots
  const fetchAvailableSlots = async (type: TournamentType) => {
    setCheckingSlots(true);
    setError(null);
    try {
      const workerUrl =
        import.meta.env.VITE_GET_CODE_WORKER_URL ||
        import.meta.env.VITE_CLAIM_PRIZE_WORKER_URL ||
        'http://localhost:8788';

      const res = await fetch(`${workerUrl}/api/slots?tournamentType=${type}`);
      if (!res.ok) {
        throw new Error('Failed to retrieve slot capacity.');
      }
      const data = await res.json();
      setAvailableSlots(data.availableSlots);
    } catch (err: any) {
      console.error(err);
      setAvailableSlots(null);
    } finally {
      setCheckingSlots(false);
    }
  };

  useEffect(() => {
    if (appParam === 'naija-ayo-worldwide') {
      fetchAvailableSlots(tournamentType);
    }
  }, [appParam, tournamentType]);

  // Handle Form Submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    if (availableSlots !== null && availableSlots <= 0) {
      setError('No slots available for this challenge type.');
      return;
    }

    const flwKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
    if (!flwKey) {
      setError('Payment gateway is not configured (VITE_FLUTTERWAVE_PUBLIC_KEY is missing).');
      return;
    }

    if (!(window as any).FlutterwaveCheckout) {
      setError('Payment SDK failed to load. Please refresh and try again.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const amount = tournamentType === 'weekend' ? 500 : 200;

    (window as any).FlutterwaveCheckout({
      public_key: flwKey,
      tx_ref: `NAW_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: amount,
      currency: 'NGN',
      payment_options: 'card, mobilemoney, banktransfer',
      customer: {
        email: email,
        name: username,
      },
      customizations: {
        title: tournamentType === 'weekend' ? 'Naija Ayo Weekend Challenge' : 'Naija Ayo Quick Challenge',
        description: 'Tournament entry passcode purchase',
        logo: 'https://ajo-esusu.sampidia.com/assets/favicon-32x32.png',
      },
      callback: (data: any) => {
        if (data.transaction_id || data.tx_ref) {
          verifyPayment(data.transaction_id || data.tx_ref);
        } else {
          setError('Payment succeeded but no reference was returned.');
          setIsLoading(false);
        }
      },
      onclose: () => {
        setIsLoading(false);
      },
    });
  };

  // Verify Payment via Worker
  const verifyPayment = async (transactionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const workerUrl =
        import.meta.env.VITE_GET_CODE_WORKER_URL ||
        import.meta.env.VITE_CLAIM_PRIZE_WORKER_URL ||
        'http://localhost:8788';

      const res = await fetch(`${workerUrl}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          tournamentType,
          username,
          email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please contact support.');
      }

      setPasscode(data.passcode);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong during payment verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (passcode) {
      navigator.clipboard.writeText(passcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSoldOut = availableSlots !== null && availableSlots <= 0;

  // ─── CASE A: LANDING SELECTOR ───────────────────────────────────────
  if (appParam !== 'naija-ayo-worldwide') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-between">
        <SEO
          title="Tournament Passcodes | Afigo-Sam Games"
          description="Purchase tournament entry passcodes for Afigo-Sam premium mobile games."
          keywords="naija ayo, passcode checkout, buy passcode, ayo challenge ticket"
        />

        <section
          style={{
            background: 'linear-gradient(135deg, #09090e 0%, #171026 50%, #0c0812 100%)',
            flexGrow: 1,
            position: 'relative',
            overflow: 'hidden',
            padding: '80px 24px',
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              right: '-100px',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '999px',
                padding: '6px 18px',
                marginBottom: '24px',
              }}
            >
              <span style={{ fontSize: '18px' }}>🎟️</span>
              <span
                style={{
                  color: '#fca5a5',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Passcode Dispenser
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-black mb-6"
              style={{
                lineHeight: 1.15,
                background: 'linear-gradient(135deg, #fff 30%, #fecaca 70%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Get Your Tournament<br />Entry Passcode
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
              Select one of our active mobile games below to purchase your unique passcode, unlock matches, and compete for weekly leaderboards.
            </p>

            {/* Game Cards Container */}
            <div className="max-w-2xl mx-auto">
              {selectedApp ? (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '28px',
                    padding: '32px',
                    textAlign: 'left',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover:border-red-500/30 group"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* App Thumbnail */}
                    <div className="w-full md:w-1/3 aspect-[16/10] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                      <img
                        src={selectedApp.imageUrl}
                        alt={selectedApp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* App details */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
                          {selectedApp.category}
                        </span>
                        <span className="text-gray-500 text-xs">Android App</span>
                      </div>

                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-red-500 transition-colors">
                        {selectedApp.name}
                      </h3>

                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {selectedApp.description}
                      </p>

                      {/* CTA Actions */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setSearchParams({ app: 'naija-ayo-worldwide' })}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all shadow-lg shadow-red-900/30 flex items-center gap-2"
                        >
                          <span>🎟️</span> Get Passcode
                        </button>
                        <Link
                          to="/app/naija-ayo-worldwide"
                          className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-semibold text-sm px-6 py-3 rounded-2xl transition-all"
                        >
                          View Game Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No active game tournaments available at the moment. Please check back later.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ─── CASE B: CHECKOUT MODE (app = naija-ayo-worldwide) ─────────────
  return (
    <div className="min-h-screen bg-gray-950">
      <SEO
        title="Get Tournament Passcode | Naija Ayo Worldwide"
        description="Buy your passcode for Naija Ayo Worldwide Quick or Weekend Challenges using Flutterwave securely."
        keywords="naija ayo, buy passcode, tournament challenge entry, flutterwave ticket"
      />

      {/* ─── HERO WITH PLAYLIST ────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #09090f 0%, #1d1430 50%, #0d0914 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '64px 24px 72px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            right: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Navigation bar inside Hero */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSearchParams({})}
              className="text-gray-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-1.5"
            >
              <span>←</span> Back to Game Selection
            </button>
            <Link
              to="/app/naija-ayo-worldwide"
              className="text-red-400 hover:text-red-300 transition-colors text-sm font-bold"
            >
              View Game Details
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '999px',
                padding: '6px 16px',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '16px' }}>🏆</span>
              <span
                style={{
                  color: '#fca5a5',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Naija Ayo Worldwide
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                lineHeight: 1.15,
                background: 'linear-gradient(135deg, #fff 0%, #fecaca 50%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Unlock Tournament Arena
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto">
              Ready to take the challenge? Secure your passcode below and climb to the top of the leaderboards!
            </p>
          </div>

          {/* YouTube playlist video */}
          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(239,68,68,0.2), 0 30px 70px rgba(0,0,0,0.6)',
              aspectRatio: '16 / 9',
              background: '#000',
            }}
          >
            <iframe
              id="get-code-youtube-playlist"
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/0FZzqbSk9mc?list=PLDXarGwl_XMwZOI0Bh3Cb6zCriqkvQw9y&rel=0&modestbranding=1&color=white"
              title="Naija Ayo Worldwide — Gameplay & Highlights Playlist"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ display: 'block', width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* ─── CHECKOUT SECTION ──────────────────────────────────────────── */}
      <section
        style={{
          background: '#09080e',
          padding: '64px 24px 96px',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '24px',
              padding: '40px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle glow */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {!isSubmitted ? (
              <div>
                {/* Real-time Slots Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    paddingBottom: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div>
                    <h3 className="text-white font-bold text-lg">Entry Reservation</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Real-time capacity verification</p>
                  </div>
                  <div>
                    {checkingSlots ? (
                      <span className="text-gray-400 text-sm flex items-center gap-1.5 font-semibold">
                        <svg className="animate-spin h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Checking...
                      </span>
                    ) : availableSlots !== null ? (
                      isSoldOut ? (
                        <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wide">
                          🚫 Sold Out
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wide">
                          🎮 {availableSlots} Slots Left
                        </span>
                      )
                    ) : (
                      <span className="text-gray-500 text-xs">Error loading slots</span>
                    )}
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <div
                    style={{
                      background: 'rgba(239,68,68,0.12)',
                      border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '24px',
                      color: '#fca5a5',
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleCheckoutSubmit}>
                  {/* Tournament Option selector */}
                  <fieldset style={{ border: 'none', padding: 0, margin: '0 0 28px 0' }}>
                    <legend
                      style={{
                        color: '#fca5a5',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '14px',
                      }}
                    >
                      🏆 Select Tournament Challenge
                    </legend>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {[
                        { type: 'quick' as TournamentType, label: 'Quick Challenge', price: '₦200' },
                        { type: 'weekend' as TournamentType, label: 'Weekend Challenge', price: '₦500' },
                      ].map((item) => {
                        const isSelected = tournamentType === item.type;
                        return (
                          <label
                            key={item.type}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '16px',
                              borderRadius: '16px',
                              border: isSelected
                                ? '2px solid #ef4444'
                                : '1px solid rgba(255,255,255,0.08)',
                              background: isSelected
                                ? 'rgba(239,68,68,0.08)'
                                : 'rgba(255,255,255,0.02)',
                              cursor: isSoldOut ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              opacity: isSoldOut ? 0.5 : 1,
                            }}
                          >
                            <input
                              type="radio"
                              name="tournamentType"
                              value={item.type}
                              checked={isSelected}
                              disabled={isSoldOut}
                              onChange={() => {
                                setTournamentType(item.type);
                              }}
                              style={{ display: 'none' }}
                            />
                            <span
                              style={{
                                color: isSelected ? '#fff' : '#94a3b8',
                                fontSize: '14px',
                                fontWeight: isSelected ? 800 : 500,
                              }}
                            >
                              {item.label}
                            </span>
                            <span
                              style={{
                                color: isSelected ? '#ef4444' : '#64748b',
                                fontSize: '18px',
                                fontWeight: 900,
                                marginTop: '4px',
                              }}
                            >
                              {item.price}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Player inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                    <div>
                      <label
                        htmlFor="gt-username"
                        style={{
                          display: 'block',
                          color: '#e2e8f0',
                          fontSize: '13px',
                          fontWeight: 700,
                          marginBottom: '8px',
                        }}
                      >
                        Naija Ayo Game Username <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        id="gt-username"
                        type="text"
                        required
                        disabled={isSoldOut}
                        placeholder="e.g. MasterAyo"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.04)',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          opacity: isSoldOut ? 0.5 : 1,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="gt-email"
                        style={{
                          display: 'block',
                          color: '#e2e8f0',
                          fontSize: '13px',
                          fontWeight: 700,
                          marginBottom: '8px',
                        }}
                      >
                        Game Registered Email <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        id="gt-email"
                        type="email"
                        required
                        disabled={isSoldOut}
                        placeholder="e.g. player@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.04)',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          opacity: isSoldOut ? 0.5 : 1,
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <button
                    type="submit"
                    disabled={isLoading || isSoldOut}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '16px',
                      background: isSoldOut
                        ? 'rgba(255,255,255,0.06)'
                        : isLoading
                        ? 'rgba(239,68,68,0.5)'
                        : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                      border: 'none',
                      color: isSoldOut ? '#475569' : '#fff',
                      fontWeight: 800,
                      fontSize: '15px',
                      cursor: isLoading || isSoldOut ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: isLoading || isSoldOut ? 'none' : '0 8px 24px rgba(239,68,68,0.3)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSoldOut ? (
                      '❌ Sold Out'
                    ) : isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Payment...
                      </>
                    ) : (
                      `Purchase Code — ${tournamentType === 'weekend' ? '₦500' : '₦200'}`
                    )}
                  </button>
                </form>
              </div>
            ) : (
              // ── Success State ─────────────────────────────────────
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(16,185,129,0.1)',
                    border: '2px solid rgba(16,185,129,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '36px',
                    boxShadow: '0 0 30px rgba(16,185,129,0.2)',
                  }}
                >
                  🚀
                </div>

                <h2 className="text-2xl font-black text-white mb-2">Purchase Successful!</h2>
                <p className="text-gray-400 text-sm mb-8">
                  We've successfully verified your payment and reserved your tournament entry.
                </p>

                {/* Passcode display container */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px',
                  }}
                >
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">
                    Your Tournament Passcode
                  </span>
                  <div className="font-mono text-3xl font-black text-red-500 tracking-wider select-all mb-4">
                    {passcode}
                  </div>
                  <button
                    onClick={handleCopyToClipboard}
                    className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold text-xs px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5"
                  >
                    {copied ? '✅ Copied!' : '📋 Copy Code'}
                  </button>
                </div>

                {/* Next steps info */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'left',
                    marginBottom: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div className="flex gap-2.5 items-start text-xs text-gray-400">
                    <span>📧</span>
                    <span>An email confirmation containing this passcode has been sent to <strong>{email}</strong>.</span>
                  </div>
                  <div className="flex gap-2.5 items-start text-xs text-gray-400">
                    <span>🎮</span>
                    <span>Open the <strong>Naija Ayo Worldwide</strong> app, enter the tournament lobby, and apply this code to register.</span>
                  </div>
                </div>

                {/* Done button */}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setUsername('');
                    setEmail('');
                    setPasscode(null);
                    setSearchParams({});
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all"
                >
                  Return to Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Keyframe animations and stylesheet */}
      <style>{`
        input::placeholder {
          color: #475569;
        }
      `}</style>
    </div>
  );
};

export default GetCodePage;
