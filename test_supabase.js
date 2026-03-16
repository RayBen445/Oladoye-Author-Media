import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLumina() {
  const { data: settings } = await supabase.from('site_settings').select('author_name');
  console.log('site_settings author_name:', settings);

  const { data: books } = await supabase.from('books').select('author_name');
  console.log('books author_name:', books);

  const { data: posts } = await supabase.from('blog_posts').select('author_name');
  console.log('blog_posts author_name:', posts);
}

checkLumina();
