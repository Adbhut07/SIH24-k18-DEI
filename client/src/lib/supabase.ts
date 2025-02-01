import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://enbjzvvgbjxojwngiecn.supabase.co', // Replace with your Supabase project URL
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuYmp6dnZnYmp4b2p3bmdpZWNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQxODM2NiwiZXhwIjoyMDUzOTk0MzY2fQ.Twh8nL4fqnfYMKvNqWBPzsbPJ5-QtaTcT_ta8hfp2kc` // Replace with your Supabase anon key
);

// Set the custom JWT token in Supabase client
const setSupabaseToken = (jwtToken) => {
    supabase.auth.setSession({ access_token: jwtToken });
  };
  
export { supabase, setSupabaseToken };
