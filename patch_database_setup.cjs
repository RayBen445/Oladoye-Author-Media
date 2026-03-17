const fs = require('fs');
let content = fs.readFileSync('src/components/DatabaseSetup.tsx', 'utf8');

content = content.replace(/CREATE TABLE public\.books/g, 'CREATE TABLE IF NOT EXISTS public.books');
content = content.replace(/CREATE TABLE public\.blog_posts/g, 'CREATE TABLE IF NOT EXISTS public.blog_posts');
content = content.replace(/CREATE TABLE public\.site_settings/g, 'CREATE TABLE IF NOT EXISTS public.site_settings');

fs.writeFileSync('src/components/DatabaseSetup.tsx', content);
