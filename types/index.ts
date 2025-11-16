/**
 * Type definitions for the portfolio website
 */

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType;
  username?: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon?: string;
  category: 'language' | 'framework' | 'tool' | 'database' | 'other';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
  type: 'work' | 'freelance' | 'internship' | 'volunteer';
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  institutionUrl?: string;
  location: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  achievements?: string[];
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  images?: string[];
  demoUrl?: string;
  githubUrl?: string;
  technologies: string[];
  category: string[];
  featured?: boolean;
  startDate: string;
  endDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
  highlights?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  image?: string;
  content: string;
  rating?: number;
  date: string;
  linkedinUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    image?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  readingTime: number;
  featured?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: string;
  alternateLocales?: string[];
}

export interface LocaleConfig {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  flag?: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  accentColor?: string;
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
    image?: string;
    bio?: string;
  };
  social: SocialLink[];
  locales: LocaleConfig[];
  defaultLocale: string;
}
