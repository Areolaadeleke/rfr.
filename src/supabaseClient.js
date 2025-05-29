 import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://puekdngepxgjnxvqpnpo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZWtkbmdlcHhnam54dnFwbnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDY2MTgsImV4cCI6MjA2MzU4MjYxOH0.Z-MlmvNsJjShLM-Zl7vO5lYVmkA3NUXA9fS1EVkVhjI';

//export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,      // keep session stored in localStorage/cookies
    autoRefreshToken: true,    // refresh tokens automatically before expiry
    detectSessionInUrl: true,  // detect session from URL after OAuth login redirects
  }
});