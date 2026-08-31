
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

export type ClientProjectCategory = 'Hotel Booking' | 'E-commerce' | 'Appointment Booking' | 'AI & Web3' | 'Landing Pages';

export interface ClientProject {
  id: string;
  title: string;
  category: ClientProjectCategory;
  client: string;
  location?: string;
  date?: string;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  websiteUrl?: string;
  tags: string[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  description: string;
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location?: string;
  description: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  thesisOrDissertation: string;
  supervisor?: string;
}

export type CourseFormat = 'pdf' | 'one-on-one';

export interface CourseCurriculumModule {
  moduleTitle: string;
  duration: string;
  lessons: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number; // 30000 NGN
  currency: string; // 'NGN'
  selarUrl: string;
  pdfCoverUrl: string;
  oneOnOneCoverUrl: string;
  ogImage?: string;
  badge?: string;
  level: string; // e.g. 'Beginner to Advanced'
  duration: string;
  features: string[];
  detailedFeatures?: { title: string; desc: string; icon: string; }[];
  curriculum: CourseCurriculumModule[];
  pdfFileName: string; // e.g. 'Vibe-Coding-Masterclass.pdf'
  pdfDownloadUrl?: string; // Direct Supabase or CDN PDF download URL
  calendlyUrl: string; // e.g. 'https://calendly.com/oghenekaroafigo/meeting'
  perfectFor: { title: string; desc: string; metric: string; }[];
}
