import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import SEO from '../components/SEO';

type Currency = 'NGN' | 'GHS' | 'KES' | 'Others';

const CURRENCIES: { value: Currency; label: string; flag: string }[] = [
  { value: 'NGN', label: 'NGN — Nigerian Naira', flag: '🇳🇬' },
  { value: 'GHS', label: 'GHS — Ghanaian Cedi', flag: '🇬🇭' },
  { value: 'KES', label: 'KES — Kenyan Shilling', flag: '🇰🇪' },
  { value: 'Others', label: 'Others', flag: '🌍' },
];

const ClaimPrizePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [otherInstructions, setOtherInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleCurrencyChange = (val: Currency) => {
    setCurrency(val);
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    setOtherInstructions('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !currency) {
      setError('Please fill in all required fields.');
      return;
    }

    if (currency !== 'Others') {
      if (!bankName || !accountNumber || !accountName) {
        setError('Please fill in all payment details.');
        return;
      }
    } else {
      if (!otherInstructions) {
        setError('Please provide your payment instructions.');
        return;
      }
    }

    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please verify that you are human via the captcha.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const workerUrl =
        import.meta.env.VITE_CLAIM_PRIZE_WORKER_URL || 'http://localhost:8788';

      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          currency,
          bankName: currency !== 'Others' ? bankName : undefined,
          accountNumber: currency !== 'Others' ? accountNumber : undefined,
          accountName: currency !== 'Others' ? accountName : undefined,
          otherInstructions: currency === 'Others' ? otherInstructions : undefined,
          token: turnstileToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as any).error || 'Failed to submit prize claim.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting prize claim:', err);
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <SEO
        title="Claim Your Prize | Afigo-Sam Games"
        description="Won a tournament? Submit your prize claim and receive your payout directly to your bank or mobile money account."
        keywords="claim prize, game tournament payout, win money, naija ayo prize claim"
        ogImage="/assets/favicon-32x32.png"
      />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
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
            background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '64px 24px 72px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(139,92,246,0.2)',
              border: '1px solid rgba(139,92,246,0.5)',
              borderRadius: '999px',
              padding: '6px 16px',
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '18px' }}>🏆</span>
            <span
              style={{
                color: '#c4b5fd',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Winner's Portal
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 60%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            You Won — Now Claim<br />Your Prize! 🎉
          </h1>
          <p
            style={{
              color: '#a5b4fc',
              fontSize: '18px',
              maxWidth: '520px',
              marginBottom: '48px',
              lineHeight: 1.6,
            }}
          >
            Fill in your details below to receive your winnings directly to your bank
            account or mobile money wallet.
          </p>

          {/* YouTube Playlist Embed */}
          <div
            style={{
              width: '100%',
              maxWidth: '860px',
              margin: '0 auto',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow:
                '0 0 0 1px rgba(139,92,246,0.3), 0 32px 80px rgba(0,0,0,0.6)',
              aspectRatio: '16 / 9',
              background: '#000',
            }}
          >
            <iframe
              id="claim-prize-youtube-playlist"
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/0FZzqbSk9mc?list=PLDXarGwl_XMwZOI0Bh3Cb6zCriqkvQw9y&rel=0&modestbranding=1&color=white"
              title="Naija Ayo Worldwide — Tournament Highlights Playlist"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ display: 'block', width: '100%', height: '100%' }}
            />
          </div>

          {/* Stat chips below video */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              marginTop: '32px',
            }}
          >
            {[
              { icon: '🎮', label: 'Active Players', value: '10,000+' },
              { icon: '💰', label: 'Prizes Paid Out', value: '₦5M+' },
              { icon: '🌍', label: 'Countries', value: '3' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  textAlign: 'center',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '2px' }}>{stat.icon}</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '20px' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#818cf8', fontSize: '11px', fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FORM SECTION ─────────────────────────────────────── */}
      <section
        style={{
          background: '#0f0c29',
          padding: '64px 24px 80px',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {/* Section label */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#fff',
                marginBottom: '8px',
              }}
            >
              Submit Your Claim
            </h2>
            <p style={{ color: '#818cf8', fontSize: '15px' }}>
              All fields are required. Your payout will be processed within 48 hours.
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: '24px',
              padding: '40px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle card glow */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {!isSubmitted ? (
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Error Alert */}
                {error && (
                  <div
                    style={{
                      background: 'rgba(220,38,38,0.12)',
                      border: '1px solid rgba(220,38,38,0.4)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#fca5a5',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    <svg
                      style={{ width: '18px', height: '18px', flexShrink: 0 }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* ── Player Info ──────────────────────────────── */}
                  <fieldset style={{ border: 'none', padding: 0, margin: '0 0 32px 0' }}>
                    <legend
                      style={{
                        color: '#a78bfa',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>👤</span> Player Information
                    </legend>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label
                          htmlFor="cp-username"
                          style={{
                            display: 'block',
                            color: '#e2e8f0',
                            fontSize: '13px',
                            fontWeight: 700,
                            marginBottom: '8px',
                          }}
                        >
                          Game Username <span style={{ color: '#f87171' }}>*</span>
                        </label>
                        <input
                          id="cp-username"
                          type="text"
                          required
                          placeholder="e.g. AyoKing2024"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid rgba(139,92,246,0.3)',
                            background: 'rgba(255,255,255,0.06)',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = 'rgba(139,92,246,0.8)')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = 'rgba(139,92,246,0.3)')
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cp-email"
                          style={{
                            display: 'block',
                            color: '#e2e8f0',
                            fontSize: '13px',
                            fontWeight: 700,
                            marginBottom: '8px',
                          }}
                        >
                          Game Email Address <span style={{ color: '#f87171' }}>*</span>
                        </label>
                        <input
                          id="cp-email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid rgba(139,92,246,0.3)',
                            background: 'rgba(255,255,255,0.06)',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = 'rgba(139,92,246,0.8)')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = 'rgba(139,92,246,0.3)')
                          }
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* ── Currency Selection ───────────────────────── */}
                  <fieldset style={{ border: 'none', padding: 0, margin: '0 0 24px 0' }}>
                    <legend
                      style={{
                        color: '#a78bfa',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>💱</span> Payout Currency
                    </legend>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '10px',
                      }}
                    >
                      {CURRENCIES.map((c) => {
                        const isSelected = currency === c.value;
                        return (
                          <label
                            key={c.value}
                            htmlFor={`cp-currency-${c.value}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              border: isSelected
                                ? '2px solid #7c3aed'
                                : '1px solid rgba(139,92,246,0.25)',
                              background: isSelected
                                ? 'rgba(124,58,237,0.18)'
                                : 'rgba(255,255,255,0.04)',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              userSelect: 'none',
                            }}
                          >
                            <input
                              type="radio"
                              id={`cp-currency-${c.value}`}
                              name="currency"
                              value={c.value}
                              checked={isSelected}
                              onChange={() => handleCurrencyChange(c.value)}
                              style={{ display: 'none' }}
                            />
                            <span style={{ fontSize: '20px' }}>{c.flag}</span>
                            <span
                              style={{
                                color: isSelected ? '#c4b5fd' : '#94a3b8',
                                fontSize: '13px',
                                fontWeight: isSelected ? 700 : 500,
                              }}
                            >
                              {c.label}
                            </span>
                            {isSelected && (
                              <span
                                style={{
                                  marginLeft: 'auto',
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  background: '#7c3aed',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <svg
                                  width="9"
                                  height="9"
                                  viewBox="0 0 9 9"
                                  fill="none"
                                >
                                  <path
                                    d="M1.5 4.5L3.5 6.5L7.5 2.5"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* ── Conditional Payment Fields ───────────────── */}
                  {currency !== 'Others' ? (
                    <fieldset
                      style={{
                        border: 'none',
                        padding: 0,
                        margin: '0 0 32px 0',
                        animation: 'fadeSlideIn 0.3s ease',
                      }}
                    >
                      <legend
                        style={{
                          color: '#a78bfa',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span>🏦</span> Payment Details ({currency})
                      </legend>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label
                            htmlFor="cp-bankName"
                            style={{
                              display: 'block',
                              color: '#e2e8f0',
                              fontSize: '13px',
                              fontWeight: 700,
                              marginBottom: '8px',
                            }}
                          >
                            Bank Name or Mobile Money Provider{' '}
                            <span style={{ color: '#f87171' }}>*</span>
                          </label>
                          <input
                            id="cp-bankName"
                            type="text"
                            required
                            placeholder={
                              currency === 'KES'
                                ? 'e.g. Equity Bank, M-Pesa'
                                : currency === 'GHS'
                                ? 'e.g. MTN MoMo, GCB Bank'
                                : 'e.g. GTBank, OPay, Kuda'
                            }
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              border: '1px solid rgba(139,92,246,0.3)',
                              background: 'rgba(255,255,255,0.06)',
                              color: '#fff',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = 'rgba(139,92,246,0.8)')
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = 'rgba(139,92,246,0.3)')
                            }
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="cp-accountNumber"
                            style={{
                              display: 'block',
                              color: '#e2e8f0',
                              fontSize: '13px',
                              fontWeight: 700,
                              marginBottom: '8px',
                            }}
                          >
                            Account Number <span style={{ color: '#f87171' }}>*</span>
                          </label>
                          <input
                            id="cp-accountNumber"
                            type="text"
                            required
                            inputMode="numeric"
                            placeholder="e.g. 0123456789"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              border: '1px solid rgba(139,92,246,0.3)',
                              background: 'rgba(255,255,255,0.06)',
                              color: '#fff',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box',
                              letterSpacing: '0.08em',
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = 'rgba(139,92,246,0.8)')
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = 'rgba(139,92,246,0.3)')
                            }
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="cp-accountName"
                            style={{
                              display: 'block',
                              color: '#e2e8f0',
                              fontSize: '13px',
                              fontWeight: 700,
                              marginBottom: '8px',
                            }}
                          >
                            Account Name <span style={{ color: '#f87171' }}>*</span>
                          </label>
                          <input
                            id="cp-accountName"
                            type="text"
                            required
                            placeholder="Full name on your account"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              border: '1px solid rgba(139,92,246,0.3)',
                              background: 'rgba(255,255,255,0.06)',
                              color: '#fff',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = 'rgba(139,92,246,0.8)')
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = 'rgba(139,92,246,0.3)')
                            }
                          />
                        </div>
                      </div>
                    </fieldset>
                  ) : (
                    <fieldset
                      style={{
                        border: 'none',
                        padding: 0,
                        margin: '0 0 32px 0',
                        animation: 'fadeSlideIn 0.3s ease',
                      }}
                    >
                      <legend
                        style={{
                          color: '#a78bfa',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span>🌍</span> Payment Instructions
                      </legend>

                      <div>
                        <label
                          htmlFor="cp-otherInstructions"
                          style={{
                            display: 'block',
                            color: '#e2e8f0',
                            fontSize: '13px',
                            fontWeight: 700,
                            marginBottom: '8px',
                          }}
                        >
                          Describe how you'd like to receive your payment{' '}
                          <span style={{ color: '#f87171' }}>*</span>
                        </label>
                        <textarea
                          id="cp-otherInstructions"
                          required
                          rows={4}
                          placeholder="e.g. PayPal: yourname@email.com, or Wise transfer to account #XXXXXX in USD"
                          value={otherInstructions}
                          onChange={(e) => setOtherInstructions(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid rgba(139,92,246,0.3)',
                            background: 'rgba(255,255,255,0.06)',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            lineHeight: 1.6,
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = 'rgba(139,92,246,0.8)')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = 'rgba(139,92,246,0.3)')
                          }
                        />
                      </div>
                    </fieldset>
                  )}

                  {/* Security notice */}
                  <div
                    style={{
                      background: 'rgba(251,191,36,0.08)',
                      border: '1px solid rgba(251,191,36,0.25)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '24px',
                      color: '#fcd34d',
                      fontSize: '12px',
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>⚠️ Important:</strong> Ensure your account details are correct.
                    Incorrect information may cause delays. Our team will contact you at
                    your game email if there are any issues.
                  </div>

                  {/* Cloudflare Turnstile */}
                  {import.meta.env.VITE_TURNSTILE_SITE_KEY ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '24px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '10px',
                      }}
                    >
                      <Turnstile
                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() =>
                          setError('Turnstile captcha failed to load. Please refresh.')
                        }
                        options={{ theme: 'dark' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        fontSize: '10px',
                        color: '#475569',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px',
                        padding: '10px',
                        marginBottom: '24px',
                      }}
                    >
                      ℹ️ Captcha bypassed: VITE_TURNSTILE_SITE_KEY not configured
                    </div>
                  )}

                  {/* Submit + Cancel */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link
                      to="/apps"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '14px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8',
                        fontWeight: 700,
                        fontSize: '14px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Cancel
                    </Link>
                    <button
                      id="cp-submit-btn"
                      type="submit"
                      disabled={isLoading}
                      style={{
                        flex: 2,
                        padding: '14px',
                        borderRadius: '14px',
                        background: isLoading
                          ? 'rgba(109,40,217,0.5)'
                          : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '14px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: isLoading
                          ? 'none'
                          : '0 8px 24px rgba(124,58,237,0.4)',
                        transition: 'all 0.2s',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            style={{
                              animation: 'spin 1s linear infinite',
                              width: '18px',
                              height: '18px',
                            }}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              style={{ opacity: 0.25 }}
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              style={{ opacity: 0.75 }}
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>🏆 Submit Prize Claim</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ── Success State ──────────────────────────────── */
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  textAlign: 'center',
                  padding: '16px 0',
                }}
              >
                {/* Trophy animation */}
                <div
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    background: 'rgba(124,58,237,0.15)',
                    border: '2px solid rgba(124,58,237,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '40px',
                    boxShadow: '0 0 40px rgba(124,58,237,0.3)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  🏆
                </div>

                <h2
                  style={{
                    fontSize: '26px',
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: '8px',
                  }}
                >
                  Claim Submitted!
                </h2>
                <p style={{ color: '#818cf8', fontSize: '15px', marginBottom: '32px' }}>
                  We've received your prize claim and our team is reviewing it.
                </p>

                {/* Info cards */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'left',
                    marginBottom: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {[
                    { icon: '✅', text: 'Your claim has been logged in our system.' },
                    {
                      icon: '📬',
                      text: 'Our admin team at admin@afigo.sampidia.com has been notified.',
                    },
                    {
                      icon: '⏳',
                      text: 'Payouts are processed within 48 hours on business days.',
                    },
                  ].map((item) => (
                    <div
                      key={item.icon}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        fontSize: '14px',
                        color: '#cbd5e1',
                      }}
                    >
                      <span style={{ flexShrink: 0, fontSize: '16px' }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/apps"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '14px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                    boxSizing: 'border-box',
                  }}
                >
                  Back to Mobile Apps
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Keyframe styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(124,58,237,0.3); }
          50% { box-shadow: 0 0 60px rgba(124,58,237,0.6); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder, textarea::placeholder {
          color: #475569;
        }
      `}</style>
    </div>
  );
};

export default ClaimPrizePage;
