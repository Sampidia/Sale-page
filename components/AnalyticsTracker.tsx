import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView, GA_MEASUREMENT_ID } from '../utils/analytics';

/**
 * Google Analytics 4 Route Tracker Component
 * Automatically initializes GA4 tag and tracks route changes for SPAs (including HashRouter).
 * Complies with Google Analytics GA4 Single-Page Application (SPA) tracking best practices.
 */
const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  // Initialize GA4 on component mount
  useEffect(() => {
    initGA(GA_MEASUREMENT_ID);
  }, []);

  // Track virtual page views whenever pathname, search query, or hash changes
  useEffect(() => {
    const fullPath = location.pathname + location.search + location.hash;
    // Small timeout to allow document.title updates from SEO component to settle
    const timer = setTimeout(() => {
      trackPageView(fullPath, document.title);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default AnalyticsTracker;
