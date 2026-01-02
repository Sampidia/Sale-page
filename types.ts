
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  alternatePrice?: number;
  imageUrl: string;
  category: 'Plugin' | 'Theme' | 'Script';
  features: string[];
  buyUrl: string;
  alternateUrl?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
