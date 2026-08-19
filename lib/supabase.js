import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oxkvauehxtyktewzvjxs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-zp7CMqExZMnIUYFq9lhmQ_q9EEMx4a';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
