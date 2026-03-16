import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

export async function uploadImage(file: File, bucket: string = 'images') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

export type Book = {
  id: string;
  title: string;
  author_name: string;
  slug: string;
  description: string;
  long_description: string;
  cover_image_url: string;
  release_date: string;
  genre: string;
  gumroad_link: string;
  selar_link?: string;
  featured: boolean;
  order: number;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  genre?: string;
  featured_image_url: string;
  author_name: string;
  published: boolean;
  published_at: string;
  created_at: string;
};

export type NewsletterCampaign = {
  id: string;
  subject: string;
  content: string;
  content_type: 'markdown' | 'html';
  recipient_count: number;
  delivered: number;
  failed: number;
  simulated: boolean;
  featured_image_url: string | null;
  accent_color: string | null;
  sent_at: string;
};

export type SiteSettings = {
  id: string;
  site_name: string;
  site_logo_url: string;
  favicon_url: string;
  author_name: string;
  author_bio: string;
  author_email: string;
  author_profile_image_url: string;
  tagline: string;
  social_links: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
  about_content: string;
  footer_text: string;
};
