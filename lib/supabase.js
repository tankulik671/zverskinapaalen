import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtunttvfbprvgwdaearu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dW50dHZmYnBydmd3ZGFlYXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODcwODAsImV4cCI6MjA3OTY2MzA4MH0.ECGyw1mniRwNCG8NhFEpGhU997y42J9dBERohP_9lf4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
