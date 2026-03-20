-- Add lyrics column to podcasts
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS lyrics text;
