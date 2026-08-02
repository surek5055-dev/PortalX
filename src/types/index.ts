export type Role = 'user' | 'admin';

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  dribbble?: string;
  website?: string;
}

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  role: Role;
  contact_email: string;
  phone: string;
  location: string;
  resume_url: string;
  social_links: SocialLinks;
  seo: SeoMeta;
  theme: 'light' | 'dark';
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  tags: string[];
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  level: number;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type ProfileInput = Omit<Profile, 'id' | 'role' | 'created_at'>;
