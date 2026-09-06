/**
 * Google Analytics 4 (GA4) Integration Utility
 * Following Google's Official Best Practices for Single Page Applications (SPAs)
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Support Vite import.meta.env as well as fallback process.env and default measurement ID
export const GA_MEASUREMENT_ID: string =
  (import.meta as any).env?.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  (import.meta as any).env?.VITE_GA_MEASUREMENT_ID ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GA_MEASUREMENT_ID) ||
  'G-X54JP1GJ6B';

let isInitialized = false;

/**
 * Initialize Google Analytics 4 tag script and setup dataLayer
 * Following Google GA4 best practices:
 * - Asynchronous, non-blocking script loading
 * - Anonymize IP enabled
 * - Manual page_view control for accurate SPA route tracking
 */
export const initGA = (measurementId: string = GA_MEASUREMENT_ID): void => {
  if (typeof window === 'undefined' || !measurementId) return;

  // Prevent duplicate script tag injection
  if (!document.getElementById('ga-gtag-script')) {
    const script = document.createElement('script');
    script.id = 'ga-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  // Initialize dataLayer and gtag function array queue
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  if (!isInitialized) {
    window.gtag('js', new Date());
    // Send_page_view false allows React Router to handle page_view events accurately for SPAs & HashRouter
    window.gtag('config', measurementId, {
      send_page_view: false,
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
    isInitialized = true;
  }
};

/**
 * Track virtual page views in Single Page Applications
 * Google Analytics 4 SPA Best Practice: Send page_title, page_location, and page_path on route changes
 */
export const trackPageView = (path?: string, title?: string): void => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const pagePath = path || (window.location.pathname + window.location.search + window.location.hash);
  const pageTitle = title || document.title;
  const pageLocation = window.location.href;

  // Update GA4 configuration and send page_view event
  window.gtag('event', 'page_view', {
    page_title: pageTitle,
    page_location: pageLocation,
    page_path: pagePath,
    send_to: GA_MEASUREMENT_ID,
  });
};

/**
 * Send custom GA4 event (Google GA4 Standard)
 */
export const trackEvent = (
  eventName: string,
  eventParams: Record<string, any> = {}
): void => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    ...eventParams,
    send_to: GA_MEASUREMENT_ID,
  });
};

/**
 * GA4 Standard Recommended Event: select_content
 * Track user clicks on products, courses, or features
 */
export const trackSelectContent = (contentType: string, itemId: string, itemName?: string): void => {
  trackEvent('select_content', {
    content_type: contentType,
    item_id: itemId,
    item_name: itemName || itemId,
  });
};

/**
 * GA4 Standard Recommended Event: generate_lead
 * Track user contact requests, hire me clicks, or account deletion requests
 */
export const trackLead = (category: string, label?: string): void => {
  trackEvent('generate_lead', {
    lead_category: category,
    label: label || category,
  });
};

/**
 * GA4 Standard Recommended Event: begin_checkout
 * Track when a user initiates buying a product or enrolling in a course
 */
export const trackBeginCheckout = (params: {
  itemId: string;
  itemName: string;
  category?: string;
  value?: number;
  currency?: string;
}): void => {
  trackEvent('begin_checkout', {
    currency: params.currency || 'USD',
    value: params.value || 0,
    items: [
      {
        item_id: params.itemId,
        item_name: params.itemName,
        item_category: params.category || 'General',
        price: params.value || 0,
        quantity: 1,
      },
    ],
  });
};
