/**
 * Meta / Facebook Pixel & Conversions API (CAPI) Utility
 * Supports Pixel ID: 636162258059569
 * Handles browser fbq events, SHA-256 PII hashing, deduplication event_ids,
 * numeric custom_data.value sanitization (>0), and CAPI edge server relays.
 */

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export const FB_PIXEL_ID = '636162258059569';

/**
 * SHA-256 Hashing helper using Web Crypto API
 * Normalizes input text (lowercase, trimmed) and returns hex string
 */
export const hashSHA256 = async (text: string): Promise<string> => {
  if (!text) return '';
  const clean = text.trim().toLowerCase();
  if (!clean) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(clean);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('[FB Tracking] SHA-256 hashing error:', err);
    return '';
  }
};

/**
 * Get cookie value by name from document.cookie
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return matches ? decodeURIComponent(matches[1]) : null;
};

/**
 * Get Meta _fbc Click ID cookie or build from URL ?fbclid= parameter
 */
export const getMetaFbc = (): string | null => {
  const cookieFbc = getCookie('_fbc');
  if (cookieFbc) return cookieFbc;

  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      const creationTime = Date.now();
      return `fb.1.${creationTime}.${fbclid}`;
    }
  }
  return null;
};

/**
 * Get Meta _fbp Browser Cookie
 */
export const getMetaFbp = (): string | null => {
  return getCookie('_fbp');
};

/**
 * Sanitize & Format Numeric Digit for custom_data.value (Must be > 0)
 * Resolves Meta Event Manager "How to set value (price)" warning
 */
/**
 * Sanitize & Format Numeric Digit for custom_data.value (Must be > 0)
 * Resolves Meta Event Manager "How to set value (price)" warning
 */
export const formatNumericValue = (val: number | string | undefined | null, fallback = 25.00): number => {
  if (val === undefined || val === null) return fallback;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num <= 0) return fallback;
  return Number(num.toFixed(2));
};

/**
 * Whitelist of ISO currency codes accepted by Meta / Facebook Pixel JS SDK (fbevents.js) & CAPI.
 * Currencies outside this list (e.g. KES, UGX, TZS, RWF, SLE) cause fbevents.js to emit:
 * "[Meta Pixel] - Parameter 'currency' is invalid for event 'Purchase'." and drop the event.
 */
const META_SUPPORTED_CURRENCIES = new Set([
  'USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY', 'INR', 'ZAR', 'BRL',
  'MXN', 'SGD', 'NZD', 'HKD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF',
  'ILS', 'MYR', 'PHP', 'THB', 'IDR', 'TWD', 'AED', 'SAR', 'EGP', 'CLP',
  'COP', 'PEN', 'PKR', 'GHS', 'TRY', 'ARS', 'CRC', 'VND', 'KWD', 'QAR',
  'BHD', 'OMR', 'CHF'
]);

const UNSUPPORTED_TO_USD_RATES: Record<string, number> = {
  KES: 130,   // Kenyan Shilling
  UGX: 3700,  // Ugandan Shilling
  TZS: 2600,  // Tanzanian Shilling
  RWF: 1350,  // Rwandan Franc
  SLE: 22.5,  // Sierra Leonean Leone
};

export const normalizeMetaCurrencyAndValue = (
  val: number | string | undefined | null,
  rawCurrency?: string,
  fallbackVal = 25.00
): { currency: string; value: number } => {
  const numericVal = formatNumericValue(val, fallbackVal);
  const cleanCurrency = (rawCurrency || 'USD').trim().toUpperCase();

  if (META_SUPPORTED_CURRENCIES.has(cleanCurrency)) {
    return { currency: cleanCurrency, value: numericVal };
  }

  // If currency is unsupported by Meta Pixel (e.g. KES, UGX, TZS, RWF, SLE),
  // convert value to USD baseline so fbevents.js accepts and dispatches the event cleanly.
  const rateToUsd = UNSUPPORTED_TO_USD_RATES[cleanCurrency];
  if (rateToUsd && rateToUsd > 0 && numericVal > 0) {
    const convertedUsd = Number((numericVal / rateToUsd).toFixed(2));
    return { currency: 'USD', value: convertedUsd > 0 ? convertedUsd : 1.00 };
  }

  return { currency: 'USD', value: numericVal };
};

/**
 * Generate unique Event ID for deduplication between Browser fbq and Server CAPI
 */
export const generateEventId = (prefix = 'EVT', itemId = ''): string => {
  const cleanId = String(itemId).replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
  const time = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return `${prefix}_${cleanId ? cleanId + '_' : ''}${time}_${rand}`;
};

const getMetaTestEventCode = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const search = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
    const urlParams = new URLSearchParams(search);
    const code = urlParams.get('test_event_code') || urlParams.get('testCode') || urlParams.get('test_code');
    if (code) {
      sessionStorage.setItem('meta_test_event_code', code);
      return code;
    }
    return sessionStorage.getItem('meta_test_event_code') || undefined;
  } catch (e) {
    return undefined;
  }
};

/**
 * Relay CAPI Event to Cloudflare Worker Endpoint
 */
export const sendCapiRelay = async (payload: {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  test_event_code?: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    postcode?: string;
    externalId?: string;
  };
  customData?: {
    value?: number;
    currency?: string;
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
    content_category?: string;
    order_id?: string;
    num_items?: number;
    contents?: Array<{ id: string; quantity: number; item_price: number }>;
  };
}) => {
  try {
    const workerBase = import.meta.env.VITE_COURSE_WORKER_URL || import.meta.env.VITE_WORKER_URL || 'https://course.sampidia.com';
    const cleanWorkerBase = workerBase.endsWith('/') ? workerBase : workerBase + '/';

    const fbp = getMetaFbp();
    const fbc = getMetaFbc();
    const testEventCode = payload.test_event_code || getMetaTestEventCode();

    // Send payload to Worker edge relay
    fetch(`${cleanWorkerBase}api/track-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: payload.eventName,
        eventId: payload.eventId,
        eventSourceUrl: payload.eventSourceUrl || window.location.href,
        fbp,
        fbc,
        test_event_code: testEventCode,
        userData: payload.userData || {},
        customData: payload.customData || {},
      }),
    }).catch(err => console.error('[FB CAPI Relay Error]', err));
  } catch (err) {
    console.error('[FB CAPI Relay Exception]', err);
  }
};

/**
 * ── ViewContent Event ────────────────────────────────────────────────────────
 */
export const trackFBViewContent = async (params: {
  id: string;
  name: string;
  category?: string;
  value?: number | string;
  currency?: string;
}) => {
  if (typeof window === 'undefined') return;

  const { currency, value: numericValue } = normalizeMetaCurrencyAndValue(params.value, params.currency, 0);
  const eventId = generateEventId('VIEW', params.id);
  const eventSourceUrl = window.location.href;

  const customData: Record<string, any> = {
    content_name: params.name,
    content_category: params.category || 'General',
    content_ids: [params.id],
    content_type: 'product',
    contents: [{ id: params.id, quantity: 1, item_price: numericValue }],
  };

  if (numericValue > 0) {
    customData.value = numericValue;
    customData.currency = currency;
  }

  // 1. Fire Browser Pixel
  if (window.fbq) {
    try {
      window.fbq('track', 'ViewContent', customData, { eventID: eventId });
    } catch (err) {
      console.error('[FB Pixel] ViewContent error:', err);
    }
  }

  // 2. Fire Server CAPI Relay
  sendCapiRelay({
    eventName: 'ViewContent',
    eventId,
    eventSourceUrl,
    customData,
  });
};

/**
 * ── InitiateCheckout Event ───────────────────────────────────────────────────
 */
export const trackFBInitiateCheckout = async (params: {
  id: string;
  name: string;
  category?: string;
  value: number | string;
  currency?: string;
  email?: string;
  customerName?: string;
  phone?: string;
}) => {
  if (typeof window === 'undefined') return;

  const { currency, value: numericValue } = normalizeMetaCurrencyAndValue(params.value, params.currency, 25.00);
  const eventId = generateEventId('IC', params.id);
  const eventSourceUrl = window.location.href;

  const customData = {
    content_name: params.name,
    content_category: params.category || 'General',
    content_ids: [params.id],
    content_type: 'product',
    value: numericValue,
    currency: currency,
    num_items: 1,
    contents: [{ id: params.id, quantity: 1, item_price: numericValue }],
  };

  // 1. Fire Browser Pixel
  if (window.fbq) {
    try {
      window.fbq('track', 'InitiateCheckout', customData, { eventID: eventId });
    } catch (err) {
      console.error('[FB Pixel] InitiateCheckout error:', err);
    }
  }

  // 2. Prepare user data for CAPI
  const userData: Record<string, string> = {};
  if (params.email) userData.email = params.email;
  if (params.phone) userData.phone = params.phone;
  if (params.customerName) {
    const parts = params.customerName.trim().split(' ');
    userData.firstName = parts[0] || '';
    userData.lastName = parts.slice(1).join(' ') || parts[0] || '';
  }

  // 3. Fire Server CAPI Relay
  sendCapiRelay({
    eventName: 'InitiateCheckout',
    eventId,
    eventSourceUrl,
    userData,
    customData,
  });

  return eventId;
};

/**
 * ── Purchase Event ───────────────────────────────────────────────────────────
 */
export const trackFBPurchase = async (params: {
  id: string;
  name: string;
  category?: string;
  value: number | string;
  currency?: string;
  transactionRef: string;
  email?: string;
  customerName?: string;
  phone?: string;
}) => {
  if (typeof window === 'undefined') return;

  const { currency, value: numericValue } = normalizeMetaCurrencyAndValue(params.value, params.currency, 25.00);
  const eventId = `PURCHASE_${params.transactionRef}`;
  const eventSourceUrl = window.location.href;

  const customData = {
    content_name: params.name,
    content_category: params.category || 'General',
    content_ids: [params.id],
    content_type: 'product',
    value: numericValue,
    currency: currency,
    order_id: params.transactionRef,
    num_items: 1,
    contents: [{ id: params.id, quantity: 1, item_price: numericValue }],
  };

  // 1. Fire Browser Pixel with eventID for deduplication
  if (window.fbq) {
    try {
      window.fbq('track', 'Purchase', customData, { eventID: eventId });
      console.log('[FB Pixel] Purchase tracked successfully:', params.transactionRef, customData);
    } catch (err) {
      console.error('[FB Pixel] Purchase error:', err);
    }
  }

  // 2. Fire Server CAPI Relay
  const userData: Record<string, string> = {};
  if (params.email) userData.email = params.email;
  if (params.phone) userData.phone = params.phone;
  if (params.customerName) {
    const parts = params.customerName.trim().split(' ');
    userData.firstName = parts[0] || '';
    userData.lastName = parts.slice(1).join(' ') || parts[0] || '';
  }

  sendCapiRelay({
    eventName: 'Purchase',
    eventId,
    eventSourceUrl,
    userData,
    customData,
  });
};

/**
 * ── Lead Event ───────────────────────────────────────────────────────────────
 */
export const trackFBLead = async (params: {
  id: string;
  name: string;
  category?: string;
}) => {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId('LEAD', params.id);
  const eventSourceUrl = window.location.href;

  const customData = {
    content_name: params.name,
    content_category: params.category || 'General',
    content_ids: [params.id],
    content_type: 'product',
  };

  if (window.fbq) {
    try {
      window.fbq('track', 'Lead', customData, { eventID: eventId });
    } catch (err) {
      console.error('[FB Pixel] Lead error:', err);
    }
  }

  sendCapiRelay({
    eventName: 'Lead',
    eventId,
    eventSourceUrl,
    customData,
  });
};
