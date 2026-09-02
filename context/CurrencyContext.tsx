import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedCurrency = 'USD' | 'NGN' | 'GHS' | 'KES' | 'ZAR' | 'UGX' | 'TZS' | 'RWF' | 'SLE' | 'EGP' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCY_CONFIGS: Record<SupportedCurrency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  GHS: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', flag: '🇬🇭' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
  UGX: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', flag: '🇺🇬' },
  TZS: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', flag: '🇹🇿' },
  RWF: { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc', flag: '🇷🇼' },
  SLE: { code: 'SLE', symbol: 'Le', name: 'Sierra Leonean Leone', flag: '🇸🇱' },
  EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
};

// Built-in static fallback rates relative to 1 USD
const DEFAULT_FALLBACK_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  NGN: 1500,
  GHS: 15.5,
  KES: 130,
  ZAR: 18.2,
  UGX: 3700,
  TZS: 2600,
  RWF: 1350,
  SLE: 22.5,
  EGP: 48.5,
  EUR: 0.92,
  GBP: 0.78,
};

interface CurrencyContextType {
  activeCurrency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  exchangeRates: Record<SupportedCurrency, number>;
  formatProductPrice: (baseUsdPrice: number) => { formatted: string; amount: number; currency: SupportedCurrency; symbol: string };
  formatCoursePrice: (baseNgnPrice: number) => { formatted: string; amount: number; currency: SupportedCurrency; symbol: string };
  isLoadingRates: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'afigo_user_currency_pref';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<SupportedCurrency, number>>(DEFAULT_FALLBACK_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(true);

  // 1. Fetch live exchange rates with 3-Tier Failover & Admin Alert Ping
  useEffect(() => {
    const fetchRates = async () => {
      let tier1Success = false;
      let tier2Success = false;

      // Tier 1: Primary API (open.er-api.com)
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates) {
            const fetchedRates = { ...DEFAULT_FALLBACK_RATES };
            (Object.keys(DEFAULT_FALLBACK_RATES) as SupportedCurrency[]).forEach((code) => {
              if (data.rates[code]) {
                fetchedRates[code] = data.rates[code];
              }
            });
            setExchangeRates(fetchedRates);
            tier1Success = true;
          }
        }
      } catch (err) {
        console.warn('[Currency API - Tier 1] Failed:', err);
      }

      // Tier 2: Secondary Backup API (api.exchangerate-api.com) if Tier 1 fails
      if (!tier1Success) {
        try {
          const res2 = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          if (res2.ok) {
            const data2 = await res2.json();
            if (data2 && data2.rates) {
              const fetchedRates = { ...DEFAULT_FALLBACK_RATES };
              (Object.keys(DEFAULT_FALLBACK_RATES) as SupportedCurrency[]).forEach((code) => {
                if (data2.rates[code]) {
                  fetchedRates[code] = data2.rates[code];
                }
              });
              setExchangeRates(fetchedRates);
              tier2Success = true;
              console.log('[Currency API - Tier 2 Backup] Successfully recovered rates via Secondary API.');
            }
          }
        } catch (err2) {
          console.warn('[Currency API - Tier 2 Backup] Failed:', err2);
        }
      }

      // Tier 3: Static Rates + Trigger Admin Failover Alert Email Ping if Tier 1 & Tier 2 both failed
      if (!tier1Success && !tier2Success) {
        console.warn('[Currency API - Tier 3] Using resilient static fallback rates. Triggering admin alert...');
        try {
          const workerUrl = import.meta.env.VITE_COURSE_WORKER_URL || import.meta.env.VITE_WORKER_URL || 'https://course.sampidia.com';
          fetch(`${workerUrl.endsWith('/') ? workerUrl : workerUrl + '/'}api/notify-currency-failure`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reason: 'Tier 1 (open.er-api.com) and Tier 2 (exchangerate-api.com) both failed to respond.',
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {});
        } catch {
          // Silent catch for background alert
        }
      }

      setIsLoadingRates(false);
    };

    fetchRates();
  }, []);

  // 2. Auto-detect visitor location on first visit & load saved preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem(STORAGE_KEY) as SupportedCurrency;
    if (savedCurrency && CURRENCY_CONFIGS[savedCurrency]) {
      setActiveCurrency(savedCurrency);
      return;
    }

    // Attempt location auto-detection via ipapi.co (Free)
    const detectCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          const country = data.country_code;

          const countryCurrencyMap: Record<string, SupportedCurrency> = {
            NG: 'NGN',
            GH: 'GHS',
            KE: 'KES',
            ZA: 'ZAR',
            UG: 'UGX',
            TZ: 'TZS',
            RW: 'RWF',
            SL: 'SLE',
            EG: 'EGP',
            GB: 'GBP',
            DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', BE: 'EUR', IE: 'EUR', AT: 'EUR', PT: 'EUR', FI: 'EUR',
          };

          if (country && countryCurrencyMap[country]) {
            setActiveCurrency(countryCurrencyMap[country]);
          }
        }
      } catch {
        // Default stays USD
      }
    };

    detectCountry();
  }, []);

  const setCurrency = (currency: SupportedCurrency) => {
    if (CURRENCY_CONFIGS[currency]) {
      setActiveCurrency(currency);
      localStorage.setItem(STORAGE_KEY, currency);
    }
  };

  // Helper to format product price (given base price in USD)
  const formatProductPrice = (baseUsdPrice: number) => {
    if (baseUsdPrice === 0) {
      return { formatted: 'Free', amount: 0, currency: activeCurrency, symbol: CURRENCY_CONFIGS[activeCurrency].symbol };
    }

    const rate = exchangeRates[activeCurrency] || DEFAULT_FALLBACK_RATES[activeCurrency] || 1;
    const rawConverted = baseUsdPrice * rate;

    // Smart rounding for aesthetic display
    let amount = Math.round(rawConverted);
    if (['USD', 'EUR', 'GBP', 'GHS', 'ZAR', 'SLE'].includes(activeCurrency)) {
      amount = Number(rawConverted.toFixed(2));
    }

    const symbol = CURRENCY_CONFIGS[activeCurrency].symbol;
    const formatted = `${symbol}${amount.toLocaleString()} ${activeCurrency}`;

    return { formatted, amount, currency: activeCurrency, symbol };
  };

  // Helper to format course price (given base price in NGN e.g. 30,000 NGN)
  const formatCoursePrice = (baseNgnPrice: number) => {
    const ngnRate = exchangeRates['NGN'] || 1500;
    const baseUsdPrice = baseNgnPrice / ngnRate; // Convert NGN to USD baseline (~$20 USD)

    if (activeCurrency === 'NGN') {
      return {
        formatted: `₦${baseNgnPrice.toLocaleString()} NGN`,
        amount: baseNgnPrice,
        currency: 'NGN' as SupportedCurrency,
        symbol: '₦'
      };
    }

    const rate = exchangeRates[activeCurrency] || 1;
    const rawConverted = baseUsdPrice * rate;

    let amount = Math.round(rawConverted);
    if (['USD', 'EUR', 'GBP', 'GHS', 'ZAR', 'SLE'].includes(activeCurrency)) {
      amount = Number(rawConverted.toFixed(2));
    }

    const symbol = CURRENCY_CONFIGS[activeCurrency].symbol;
    const formatted = `${symbol}${amount.toLocaleString()} ${activeCurrency}`;

    return { formatted, amount, currency: activeCurrency, symbol };
  };

  return (
    <CurrencyContext.Provider
      value={{
        activeCurrency,
        setCurrency,
        exchangeRates,
        formatProductPrice,
        formatCoursePrice,
        isLoadingRates
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
