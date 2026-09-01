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

  // 1. Fetch live exchange rates from Open Exchange Rates API (Free, $0 cost, 0 API keys)
  useEffect(() => {
    const fetchRates = async () => {
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
          }
        }
      } catch (err) {
        console.warn('[Currency API] Using fallback exchange rates due to network fetch:', err);
      } finally {
        setIsLoadingRates(false);
      }
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
