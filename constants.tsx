
import React from 'react';
import { Product, NavItem, MobileApp, ClientProject, SkillCategory, ExperienceItem, EducationItem } from './types';

export const FLUTTERWAVE_URL = "https://flutterwave.com/pay/wordpressai";
export const CODECANYON_URL = "#";

export const FIVERR_URL = "https://pro.fiverr.com/freelancers/afigo2211?";
export const UPWORK_URL = "https://www.upwork.com/freelancers/~01aec98a5a87d3096e?s=1044578476142100494";
export const N8N_CREATOR_URL = "https://n8n.io/creators/sampidia/";
export const PORTFOLIO_URL = "https://portfolio.sampidia.com/";
export const CV_DOWNLOAD_URL = "assets/Oghenekaro_Samson_Afigo_CV.pdf";

export const EMAIL_MAIN = "oghenekaroafigo@gmail.com";
export const EMAIL_SUPPORT = "admin@sampidia.com";
export const PHONE_MAIN = "+234 706 345 3903";
export const PHONE_ALT = "+234 903 717 2693";
export const LOCATION_MAIN = "Ilorin, Kwara State, Nigeria";

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Products', href: '/#products' },
  { label: 'Mobile Apps', href: '/apps' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' }
];

export const CLIENT_PROJECTS: ClientProject[] = [
  {
    id: 'hotel-casa-escobar',
    title: 'Hotel Casa Escobar',
    category: 'Hotel Booking',
    client: 'Leonardoalza',
    location: 'Guadalajara de Buga, Valle del Cauca, Colombia',
    date: 'May 2022',
    description: 'Complete hotel booking engine with room selection, amenities preview, event space reservation, and seamless online payment gateway integration.',
    imageUrl: 'https://portfolio.sampidia.com/img/portfolio/hotelcasaescobar.webp',
    additionalImages: [
      'https://portfolio.sampidia.com/img/portfolio/hotelcasa1.webp',
      'https://portfolio.sampidia.com/img/portfolio/hotelcasa2.webp',
      'https://portfolio.sampidia.com/img/portfolio/hotelcasa3.webp'
    ],
    websiteUrl: 'https://hotelcasaescobar.com/',
    tags: ['WordPress', 'MotoPress Booking', 'Payment Gateway', 'Custom PHP']
  },
  {
    id: 'nano-earth-cbd',
    title: 'Nano Earth CBD',
    category: 'E-commerce',
    client: 'Markmediaman',
    location: 'Pittsford, NY, USA',
    date: 'August 2022',
    description: 'E-commerce storefront for Nano Emulsified CBD health treatments featuring custom product catalog, secure checkout flows, and payment gateway integration.',
    imageUrl: 'https://portfolio.sampidia.com/img/portfolio/nanoearthcbd.webp',
    additionalImages: [
      'https://portfolio.sampidia.com/img/portfolio/nanoearthcbd1.webp',
      'https://portfolio.sampidia.com/img/portfolio/nanoearthcbd2.webp',
      'https://portfolio.sampidia.com/img/portfolio/nanoearthcbd3.webp'
    ],
    websiteUrl: 'https://nanoearthcbd.com/',
    tags: ['E-commerce', 'WooCommerce', 'Payment Gateway', 'Custom Theme']
  },
  {
    id: 'chazzy-creations',
    title: 'Chazzy Creations',
    category: 'E-commerce',
    client: 'Adeel',
    location: 'USA',
    date: 'October 2024',
    description: 'Vibrant e-commerce platform for custom event design, party favors, birthdays, and celebrations with personalized product ordering.',
    imageUrl: 'https://portfolio.sampidia.com/img/portfolio/Chazzy.webp',
    additionalImages: [
      'https://portfolio.sampidia.com/img/portfolio/chazzy1.webp',
      'https://portfolio.sampidia.com/img/portfolio/Chazzy2.webp',
      'https://portfolio.sampidia.com/img/portfolio/Chazzy3.webp'
    ],
    websiteUrl: 'https://chazzycreations.com/',
    tags: ['E-commerce', 'Product Customization', 'Payment Processing']
  },
  {
    id: 'dream-stories-hub',
    title: 'Dream Stories Hub',
    category: 'Appointment Booking',
    client: 'Morountodun Joseph',
    location: 'Nigeria & UK',
    date: 'August 2021',
    description: 'Appointment booking and service portal for scriptwriting courses, script consultations, and copyediting with online calendar scheduling.',
    imageUrl: 'https://portfolio.sampidia.com/img/portfolio/dreamstorieshub.webp',
    additionalImages: [
      'https://portfolio.sampidia.com/img/portfolio/dreamstorieshub1.webp',
      'https://portfolio.sampidia.com/img/portfolio/dreamstorieshub2.webp',
      'https://portfolio.sampidia.com/img/portfolio/dreamstorieshub3.webp'
    ],
    websiteUrl: 'https://dreamstorieshub.com/',
    tags: ['Appointment Booking', 'WordPress', 'Payment Gateway', 'Calendar Sync']
  },
  {
    id: 'tetrad-opus',
    title: 'Tetrad Opus Photography',
    category: 'Appointment Booking',
    client: 'Tetradopus',
    location: 'Baltimore, MD, USA',
    date: 'February 2022',
    description: 'Service appointment scheduling site serving DC, MD, and VA, integrated with digital package checkout and automated confirmation systems.',
    imageUrl: 'https://portfolio.sampidia.com/img/portfolio/tet.webp',
    websiteUrl: 'https://www.tetradopus.com/',
    tags: ['Appointment Booking', 'Payment Gateway', 'Photography Services']
  },
  {
    id: 'solana-community-dapp',
    title: 'Solana Savings dApp (ESUSU)',
    category: 'AI & Web3',
    client: 'Web3 Community',
    date: '2024',
    description: 'Decentralized community-savings (Ajo/ESUSU) dApp engineered on Solana utilizing Rust smart contracts for transparent, trustless financial pools.',
    imageUrl: 'assets/Solana Savings dApp ESUSU.webp',
    websiteUrl: 'https://ajo.sampidia.com/',
    tags: ['Rust', 'Solana', 'Smart Contracts', 'Web3', 'dApp']
  },
  {
    id: 'ai-multi-agent-workflow',
    title: 'AI Multi-Agent Content Pipeline',
    category: 'AI & Web3',
    client: 'Gaming & Creator Studio',
    date: '2025',
    description: 'Autonomous multi-agent workflow for game developers and VTubers — auto-posts trending X/Twitter content with AI-generated FLUX images and Buffer scheduling.',
    imageUrl: 'assets/AI Multi-Agent Content Pipeline.webp',
    websiteUrl: 'https://n8n.io/workflows/14768-auto-post-trending-x-tweets-with-gemini-ai-images-flux-and-buffer/',
    tags: ['n8n Creator', 'Gemini AI', 'FLUX Image Gen', 'Apify', 'Buffer API', 'X/Twitter']
  },
  {
    id: 'telegram-storefront-bot',
    title: 'Telegram Storefront & Payment Bot',
    category: 'AI & Web3',
    client: 'SME Merchants',
    date: '2025',
    description: 'Full n8n workflow that turns a Telegram bot into a complete storefront — product browsing, cart, Paystack/Flutterwave checkout, and Google Sheets inventory sync. Published on n8n.io.',
    imageUrl: 'assets/Workflow Automation (n8n, Make, Zapier Expert).webp',
    websiteUrl: 'https://n8n.io/creators/sampidia/',
    tags: ['n8n Creator', 'Telegram Bot', 'Paystack', 'Flutterwave', 'Google Sheets']
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'AI Automation & Workflows',
    icon: '⚡',
    description: 'Published n8n workflow creator building enterprise-grade LLM pipelines, bots, and API bridges.',
    skills: ['n8n (Published Creator)', 'Make (Integromat)', 'Zapier', 'OpenAI / Gemini / Claude API', 'FLUX Image Generation', 'Telegram Bot Commerce', 'Social Media Automation (Buffer/Apify)']
  },
  {
    title: 'Web & E-Commerce Engineering',
    icon: '💻',
    description: '10+ years creating high-converting booking portals, custom plugins, and storefronts.',
    skills: ['WordPress Theme & Plugin Dev', 'Custom PHP', 'HTML5 / CSS3 / JavaScript', 'React & Tailwind CSS', 'Framer & Webflow', 'Paystack & Flutterwave Integration', 'Shopify & WooCommerce']
  },
  {
    title: 'Mobile & Web3 Systems',
    icon: '📱',
    description: 'Cross-platform mobile apps and decentralized applications with robust backend logic.',
    skills: ['React Native (iOS/Android)', 'Native Android (Java/Kotlin)', 'Offline-First Data Sync', 'Rust on Solana', 'Solana Smart Contracts', 'dApp Architecture']
  },
  {
    title: 'Edge Cloud & Databases',
    icon: '☁️',
    description: 'Serverless cloud infrastructure, database management, and extreme performance optimization.',
    skills: ['Cloudflare Workers & Workers AI', 'Cloudflare D1 & KV', 'MySQL & PostgreSQL', 'Firebase Realtime Database', 'MongoDB & SQLite', 'SEO & Web Security Hardening']
  },
  {
    title: 'Scientific Analysis & Rigor',
    icon: '🔬',
    description: 'Master of Science analytical mindset applied to software architecture and problem solving.',
    skills: ['M.Sc. Industrial Chemistry', 'Green Synthesis & Nanomaterials', 'FTIR, UV-Vis, SEM, XRD Analysis', 'Corrosion Gravimetric Analysis', 'Data Modeling (Origin/Prism/Excel)']
  }
];

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    role: 'Founder & Lead Developer',
    company: 'Afigo-Sam Technology',
    period: '2015 – Present',
    description: [
      'Founded and manage a full-service web and mobile development studio producing hotel booking, appointment booking, and e-commerce platforms.',
      'Engineered intelligent AI systems with n8n, Make, and Zapier bridging third-party APIs and eliminating manual business workflow bottlenecks.',
      'Crafted bespoke WordPress solutions using custom PHP with robust security hardening and scalable hosting administration.',
      'Built cross-platform mobile apps in React Native with fluid navigation and offline-first functionality.'
    ]
  },
  {
    role: 'Freelance Web Developer (Pro Seller)',
    company: 'Fiverr & Upwork',
    period: '2018 – Present',
    description: [
      'Delivered 15+ production client websites for businesses across USA, UK, Spain, Colombia, Morocco, Slovakia, Vanuatu, and Nigeria.',
      'Specialized in advanced booking systems (MotoPress, Guesty channel integration) and end-to-end multi-currency payment processing.',
      'Maintained a top-rated seller record with a 100% client satisfaction score and repeat international client roster.'
    ]
  },
  {
    role: 'Workflow Template Creator',
    company: 'n8n Community (@sampidia)',
    period: '2025 – Present',
    description: [
      'Published 5 public automation templates on n8n.io used by hundreds of automation builders worldwide.',
      'Engineered Telegram storefront workflows selling products via Paystack/Flutterwave backed by Google Sheets inventory.',
      'Built automated AI content pipelines auto-generating and publishing trending social media posts (X, Facebook, Threads) using Apify, Gemini, FLUX, and Buffer.'
    ]
  }
];

export const EDUCATION_TIMELINE: EducationItem[] = [
  {
    degree: 'M.Sc. Industrial Chemistry',
    institution: 'University of Ilorin, Kwara State, Nigeria',
    period: '2019 – 2023',
    thesisOrDissertation: 'Thesis: Green synthesis of copper oxide nanoparticles using Luffa cylindrica leaf extract and antimicrobial activities assessment.',
    supervisor: 'Prof. Dosumu O. O.'
  },
  {
    degree: 'B.Tech. Industrial Chemistry',
    institution: 'Federal University of Technology Akure, Ondo State, Nigeria',
    period: '2010 – 2015',
    thesisOrDissertation: 'Dissertation: Assessment of corrosion rate of dissimilar welded metals: gravimetric analysis.'
  }
];


export const PRODUCTS: Product[] = [
  {
    id: 'ai-content-generator',
    name: 'WordPress AI-Powered Automatic Content Generator',
    description: 'Automatically generate, optimize, and publish high-ranking blog content using multiple AI providers (OpenAI, Gemini, Claude, DeepSeek).',
    price: 25,
    alternatePrice: 35,
    imageUrl: 'assets/ai-generator-logo.webp',
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
    badge: 'Best Seller',
    showcaseImages: [
      { img: 'assets/ai-Screenshot-3.webp', title: 'Dashboard Overview' },
      { img: 'assets/ai-Screenshot-5.webp', title: 'AI Content Generation' },
      { img: 'assets/ai-Screenshot-9.webp', title: 'SEO Optimization' },
      { img: 'assets/ai-Screenshot-6.webp', title: 'Campaign Management' }
    ]
  },
  {
    id: 'my-licenses-manager',
    name: 'My Licenses Manager',
    description: 'Central "license server" to remotely manage your Digital Assets with minimal manual effort. Supports Envato, WP Express Checkout, and WP eStore.',
    price: 0,
    imageUrl: 'assets/banner-772x250.webp',
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
    badge: 'Popular',
    showcaseImages: [
      { img: 'assets/screenshot-1.webp', title: 'Intuitive Dashboard' },
      { img: 'assets/screenshot-2.webp', title: 'Advanced Settings' },
      { img: 'assets/screenshot-3.webp', title: 'Real-time Tracking' },
      { img: 'assets/screenshot-4.webp', title: 'Seamless Integration' }
    ]
  },
  {
    id: 'booking-theme',
    name: 'Booking Theme Pro',
    description: 'A comprehensive, high-performance WordPress theme designed specifically for service providers and rental businesses.',
    price: 59,
    imageUrl: 'assets/booking-theme-1.webp',
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



export const MOBILE_APPS: MobileApp[] = [
  {
    id: 'naija-ayo-worldwide',
    name: 'Naija Ayo Worldwide',
    category: 'Games',
    imageUrl: 'assets/Naija Ayo Worldwide banner (1).webp',
    description: "Rediscover the timeless joy of Ayo, Nigeria's classic strategy board game, with Naija Ayo Worldwide! Whether you're a seasoned master or a curious newcomer, get ready for an authentic and captivating experience right on your mobile device. Challenge your friends, family, and players from across the globe in this beautiful digital adaptation of one of Africa's most beloved traditional games.",
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.naijaayo.worldwide',
    features: [
      'Authentic Ayo rules and game design',
      'Pass and Play multiplayer mode',
      'Single player mode with smart AI opponent',
      'Stunning boards and visual themes',
      'Traditional sounds and local music score'
    ],
    detailedFeatures: [
      {
        title: 'Authentic Traditional Rules',
        desc: 'Experience the real Mancala and Ayo rules passed down through generations, fully optimized for your mobile screen.',
        icon: '🎲'
      },
      {
        title: 'Pass and Play Mode',
        desc: 'Play with family and friends on a single device, recreating the traditional social board game atmosphere.',
        icon: '👥'
      },
      {
        title: 'Challenging AI Opponents',
        desc: 'Hone your strategy skills against built-in AI players that adapt to your playing style and difficulty level.',
        icon: '🤖'
      }
    ],
    perfectFor: [
      {
        title: 'Board Game Lovers',
        desc: 'Fans of Mancala, Oware, and strategic board games who want a traditional African challenge.',
        metric: 'Classic Gameplay'
      },
      {
        title: 'Casual Players',
        desc: 'Anyone looking for a quick, mentally stimulating game to pass the time.',
        metric: 'Pick Up & Play'
      }
    ],
    showcaseImages: [
      { img: 'assets/Naija Ayo Worldwide banner (1).webp', title: 'Naija Ayo Gameplay' }
    ]
  },
  {
    id: 'afro-short',
    name: 'Afro Short',
    category: 'Entertainment',
    imageUrl: 'assets/Afro short gallery.webp',
    description: "Experience powerful stories, videos, musics, and life-changing podcasts.\n\nWelcome to the Afro Short app—your exclusive home for the most impactful conversations, videos, musics, and thought-provoking podcasts from Afro Short team.\n\nDesigned for those who seek depth, inspiration, and the truth",
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.afroshort',
    features: [
      'Curated short-form stories and narratives',
      'Original music and audio catalog',
      'Thought-provoking podcast directory',
      'Motivational talks and video series',
      'Smooth streaming and download options'
    ],
    detailedFeatures: [
      {
        title: 'Original Podcasts',
        desc: 'Listen to life-changing podcasts that inspire depth, awareness, and positive lifestyle changes.',
        icon: '🎙️'
      },
      {
        title: 'Original Music Catalog',
        desc: 'Enjoy a rich selection of local, inspiring, and authentic musical releases from native African artists.',
        icon: '🎵'
      },
      {
        title: 'Inspiring Videos',
        desc: 'Watch high-quality, thought-provoking short films, documentaries, and motivational messages.',
        icon: '🎬'
      }
    ],
    perfectFor: [
      {
        title: 'Inspiration Seekers',
        desc: 'People looking for daily motivation, culture, and life wisdom in video/audio formats.',
        metric: 'Daily Inspiration'
      },
      {
        title: 'Podcast Fans',
        desc: 'Listeners who appreciate deeper discussions on life, society, and identity.',
        metric: 'Deep Conversations'
      }
    ],
    showcaseImages: [
      { img: 'assets/Afro short gallery.webp', title: 'Afro Short Video Feed' }
    ]
  },
  {
    id: 'fake-detector',
    name: 'Fake Detector',
    category: 'Health',
    imageUrl: 'assets/Fake Detector  App.webp',
    description: "Tired of wasting money on counterfeit goods? Protect yourself with Fake Products Detector, the ultimate shopping tool for verifying product authenticity in seconds! Our powerful scanner instantly analyzes product name and batch number to check against a NAFDAC database of recall alerts. Get an immediate authenticity report before you buy, ensuring you never fall for a fake again.",
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.sampidia.fakeproductdetector',
    features: [
      'Verify NAFDAC recall registry status',
      'Analyze product name & batch number',
      'Instant authenticity and safety report',
      'Shopping safety guidelines and articles',
      'Simple scanner tool interface'
    ],
    detailedFeatures: [
      {
        title: 'Instant Database Check',
        desc: 'Check the safety status of your products against lists of banned, recalled, or suspected counterfeit products.',
        icon: '🔍'
      },
      {
        title: 'Safety Reports',
        desc: 'Read through detailed guides and recall logs to know which products pose health and safety risks.',
        icon: '📋'
      },
      {
        title: 'Batch Verification',
        desc: 'Enter manufacturer batch numbers to check for specific production runs flagged by regulatory bodies.',
        icon: '🔢'
      }
    ],
    perfectFor: [
      {
        title: 'Safety Conscious Buyers',
        desc: 'Shoppers who want to confirm if their food, drugs, or cosmetics are officially flagged.',
        metric: 'Health Shield'
      },
      {
        title: 'Pharmacists & Retailers',
        desc: 'Confirming store inventory against recall databases to protect customers.',
        metric: 'Commercial Safety'
      }
    ],
    showcaseImages: [
      { img: 'assets/Fake Detector  App.webp', title: 'Fake Detector Interface' }
    ]
  }
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
