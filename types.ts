
export type ProductCategory = 'Plugin' | 'Theme' | 'Template' | 'Script';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  alternatePrice?: number;
  imageUrl: string;
  category: ProductCategory;
  features: string[];
  detailedFeatures?: { title: string; desc: string; icon: string; }[];
  perfectFor?: { title: string; desc: string; metric: string; }[];
  buyUrl: string;
  alternateUrl?: string;
  badge?: string;
  showcaseImages?: { img: string; title: string; }[];
}

export type MobileAppCategory = 'Games' | 'Health' | 'Entertainment' | 'Socials' | 'Finance' | 'Others';

export interface MobileApp {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: MobileAppCategory;
  googlePlayUrl: string;
  appStoreUrl?: string;
  features?: string[];
  detailedFeatures?: { title: string; desc: string; icon: string; }[];
  perfectFor?: { title: string; desc: string; metric: string; }[];
  showcaseImages?: { img: string; title: string; }[];
}

export interface NavItem {
  label: string;
  href: string;
}
