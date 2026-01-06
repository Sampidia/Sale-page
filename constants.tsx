
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
    imageUrl: '/assets/ai generator logo white(1).png',
    category: 'Plugin',
    features: [
      'Multi-AI Provider Support (OpenAI, Gemini, Claude, DeepSeek)',
      'Bulk Content Generation',
      'SEO Auto-Optimization',
      'Instant Publishing & Scheduling',
      'Automatic Image Generation'
    ],
    detailedFeatures: [
      {
        title: 'Multi-AI Provider Support',
        desc: 'Leverage OpenAI GPT-4o, Google Gemini Pro, Anthropic Claude 3.5, and DeepSeek for diverse content generation.',
        icon: '🤖'
      },
      {
        title: 'Bulk Content Generation',
        desc: 'Generate hundreds of articles in minutes with intelligent queuing and automatic publishing.',
        icon: '⚡'
      },
      {
        title: 'SEO Auto-Optimization',
        desc: 'Built-in SEO analyzer ensures every article is optimized for search engines with meta tags, keywords, and structure.',
        icon: '🎯'
      },
      {
        title: 'Instant Publishing & Scheduling',
        desc: 'Publish immediately or schedule content for optimal timing. Set it and forget it.',
        icon: '📅'
      },
      {
        title: 'Automatic Image Generation',
        desc: 'Generate stunning featured images and in-content visuals using DALL-E 3 integration.',
        icon: '🖼️'
      },
      {
        title: 'Campaign Management',
        desc: 'Create and manage multiple content campaigns with different topics, schedules, and AI providers.',
        icon: '📊'
      }
    ],
    perfectFor: [
      {
        title: 'Content Marketers',
        desc: 'Generate SEO-optimized blog posts at scale without hiring writers.',
        metric: '10x faster production'
      },
      {
        title: 'Niche Site Builders',
        desc: 'Build authority sites quickly with consistent, high-quality content.',
        metric: '100+ posts per month'
      },
      {
        title: 'Digital Agencies',
        desc: 'Manage multiple client sites with automated content workflows.',
        metric: 'Save 40+ hours/week'
      }
    ],
    buyUrl: FLUTTERWAVE_URL,
    alternateUrl: CODECANYON_URL,
    badge: 'Best Seller'
  },
  {
    id: 'my-licenses-manager',
    name: 'My Licenses Manager',
    description: 'Central "license server" to remotely manage your Digital Assets with minimal manual effort. Supports Envato, WP Express Checkout, and WP eStore.',
    price: 0,
    imageUrl: '/assets/banner-772x250.png',
    category: 'Plugin',
    features: [
      'Remote License Management',
      'Envato Marketplace API Integration',
      'WP Express Checkout Support',
      'WP eStore Integration',
      'License Key Tracking',
      'Developer-First Hooks & Filters'
    ],
    detailedFeatures: [
      {
        title: 'Central License Server',
        desc: 'Manage your Digital Assets remotely with minimal manual effort using a centralized server architecture.',
        icon: '🖥️'
      },
      {
        title: 'API-Powered Activation',
        desc: 'Create, activate, deactivate, and check the status of license keys remotely from any application via API.',
        icon: '⚡'
      },
      {
        title: 'Developer Focused',
        desc: 'Designed specifically for developers with extensive action hooks and filters for custom extensions.',
        icon: '👨‍💻'
      },
      {
        title: 'Envato Integration',
        desc: 'Native support for Envato Marketplace API to verify and manage marketplace purchases automatically.',
        icon: '🛍️'
      },
      {
        title: 'E-Commerce Ready',
        desc: 'Seamlessly integrates with WP Express Checkout and WP eStore plugins for automated key delivery.',
        icon: '🛒'
      },
      {
        title: 'Usage Tracking',
        desc: 'Real-time tracking of license key usage to monitor domain activations and prevent misuse.',
        icon: '📊'
      }
    ],
    perfectFor: [
      {
        title: 'Software Developers',
        desc: 'Automate licensing and updates for your WordPress plugins and themes with ease.',
        metric: 'Save 20+ hours'
      },
      {
        title: 'Support Teams',
        desc: 'Easily track and manage customer activations and domain limits from one central dashboard.',
        metric: 'Streamlined Support'
      },
      {
        title: 'Marketplace Authors',
        desc: 'Seamlessly manage Envato purchases and integrate with your existing store automations.',
        metric: '100% Automated'
      }
    ],
    buyUrl: '#',
    badge: 'Popular'
  },
  {
    id: 'booking-theme',
    name: 'Booking Theme Pro',
    description: 'A comprehensive, high-performance WordPress theme designed specifically for service providers and rental businesses.',
    price: 59,
    imageUrl: '/assets/bookin theme 1.png',
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
    <path d="M50 5C25.147 5 5 25.147 5 50s20.147 45 45 45 45-20.147 45-45S74.853 5 50 5zm0 80c-19.33 0-35-15.67-35-35s15.67-35 35-35 35 15.67 35 35-15.67 35-35 35zm-5-55v15h-10v5h10v10h5v-10h10v-5h-10v-15h-5zm0 35v5h5v-5h-5z" />
    <rect x="35" y="30" width="30" height="40" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="40" cy="40" r="3" />
    <circle cx="60" cy="50" r="3" />
    <path d="M40 40 L60 40 M40 50 L60 50 M40 60 L60 60" stroke="currentColor" strokeWidth="2" />
  </svg>
);
