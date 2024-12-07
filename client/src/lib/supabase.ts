import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://jilmyncazgwrvtkvhofy.supabase.co', // Replace with your Supabase project URL
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbG15bmNhemd3cnZ0a3Zob2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTg4MzUsImV4cCI6MjA0OTA3NDgzNX0.koWy-KTsG0kJ4jkT56TEIf171xRZ9Zua9ibrzD-8cVc` // Replace with your Supabase anon key
);

// Set the custom JWT token in Supabase client
const setSupabaseToken = (jwtToken) => {
    supabase.auth.setSession({ access_token: jwtToken });
  };
  
export { supabase, setSupabaseToken };
