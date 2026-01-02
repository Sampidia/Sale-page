
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
  buyUrl: string;
  alternateUrl?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
