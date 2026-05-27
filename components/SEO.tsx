import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  geoRegion?: string;
  geoPlacename?: string;
  geoPosition?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage,
  ogUrl,
  canonicalUrl,
  geoRegion = 'NG-LA',
  geoPlacename = 'Lagos',
  geoPosition = '6.5244;3.3792',
}) => {
  useEffect(() => {
    // 1. Set Title
    document.title = title;

    // Helper to update or create a meta tag
    const updateOrCreateMeta = (attr: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    updateOrCreateMeta('name', 'description', description);
    if (keywords) {
      updateOrCreateMeta('name', 'keywords', keywords);
    }
    updateOrCreateMeta('name', 'robots', 'index, follow');

    // 3. OpenGraph tags
    updateOrCreateMeta('property', 'og:title', title);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:type', ogType);
    updateOrCreateMeta('property', 'og:site_name', 'Afigo-Sam');
    
    if (ogImage) {
      // Normalize and construct absolute image URL
      const absoluteImage = ogImage.startsWith('http')
        ? ogImage
        : `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
      updateOrCreateMeta('property', 'og:image', absoluteImage);
      updateOrCreateMeta('property', 'og:image:alt', title);
    }
    
    const currentUrl = ogUrl || window.location.href;
    updateOrCreateMeta('property', 'og:url', currentUrl);

    // 4. Twitter tags
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', title);
    updateOrCreateMeta('name', 'twitter:description', description);
    if (ogImage) {
      const absoluteImage = ogImage.startsWith('http')
        ? ogImage
        : `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
      updateOrCreateMeta('name', 'twitter:image', absoluteImage);
    }

    // 5. GEO Targeting tags (highly optimized for localized Search relevance)
    updateOrCreateMeta('name', 'geo.region', geoRegion);
    updateOrCreateMeta('name', 'geo.placename', geoPlacename);
    updateOrCreateMeta('name', 'geo.position', geoPosition);
    updateOrCreateMeta('name', 'ICBM', geoPosition.replace(';', ', '));

    // 6. Canonical link
    const canonical = canonicalUrl || currentUrl;
    let linkElement = document.querySelector('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute('href', canonical);

  }, [title, description, keywords, ogType, ogImage, ogUrl, canonicalUrl, geoRegion, geoPlacename, geoPosition]);

  return null;
};

export default SEO;
