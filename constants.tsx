
import React from 'react';
import { Product, NavItem } from './types';

export const FLUTTERWAVE_URL = "https://flutterwave.com/pay/wordpressai";
export const CODECANYON_URL = "https://codecanyon.net/popular_item/by_category?category=wordpress";

export const PRODUCTS: Product[] = [
  {
    id: 'ai-content-generator',
    name: 'WordPress AI-Powered Automatic Content Generator',
    description: 'Automatically generate, optimize, and publish high-ranking blog content using multiple AI providers (OpenAI, Gemini, Claude, DeepSeek).',
    price: 25,
    alternatePrice: 35,
    imageUrl: 'https://picsum.photos/seed/ai-plugin/800/600',
    category: 'Plugin',
    features: [
      'Multi-AI Provider Support (OpenAI, Gemini, Claude, DeepSeek)',
      'Bulk Content Generation',
      'SEO Auto-Optimization',
      'Instant Publishing & Scheduling',
      'Automatic Image Generation'
    ],
    buyUrl: FLUTTERWAVE_URL,
    alternateUrl: CODECANYON_URL
  },
  {
    id: 'license-manager',
    name: 'My Licenses Manager',
    description: 'The ultimate solution for software developers to manage product keys, updates, and domain activations for WordPress products.',
    price: 49,
    imageUrl: 'https://picsum.photos/seed/license/800/600',
    category: 'Plugin',
    features: [
      'License Key Generation',
      'Remote Domain Validation',
      'Automatic Update Server',
      'Client Dashboard',
      'WooCommerce Integration'
    ],
    buyUrl: '#'
  },
  {
    id: 'booking-theme',
    name: 'Booking Theme Pro',
    description: 'A comprehensive, high-performance WordPress theme designed specifically for service providers and rental businesses.',
    price: 59,
    imageUrl: 'https://picsum.photos/seed/booking/800/600',
    category: 'Theme',
    features: [
      'Real-time Availability Calendar',
      'Payment Gateway Integration',
      'Mobile-First Responsive Design',
      'Custom Form Builder',
      'Detailed Analytics'
    ],
    buyUrl: '#'
  }
];

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'AI Generator', href: '/product/ai-content-generator' },
  { label: 'Support', href: 'mailto:admin@sampidia.cm' }
];

export const BRAIN_LOGO = (
  <svg viewBox="0 0 100 100" className="w-10 h-10 text-red-600 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5C25.147 5 5 25.147 5 50s20.147 45 45 45 45-20.147 45-45S74.853 5 50 5zm0 80c-19.33 0-35-15.67-35-35s15.67-35 35-35 35 15.67 35 35-15.67 35-35 35zm-5-55v15h-10v5h10v10h5v-10h10v-5h-10v-15h-5zm0 35v5h5v-5h-5z"/>
    <rect x="35" y="30" width="30" height="40" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="40" cy="40" r="3" />
    <circle cx="60" cy="50" r="3" />
    <path d="M40 40 L60 40 M40 50 L60 50 M40 60 L60 60" stroke="currentColor" strokeWidth="2" />
  </svg>
);
