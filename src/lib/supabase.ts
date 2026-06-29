import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nseilhimgwbffajuvpxw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZWlsaGltZ3diZmZhanV2cHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzYyNzgsImV4cCI6MjA5NzgxMjI3OH0.9NqbpLkY0X1OWD8_jdPsI392h3xHuL8Umao-3KnoW3s';

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
