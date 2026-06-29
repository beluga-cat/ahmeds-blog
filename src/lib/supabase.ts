import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Comment = {
  id: string;
  post_slug: string;
  parent_id: string | null;
  name: string;
  email: string | null;
  content: string;
  created_at: string;
  approved: boolean;
};
