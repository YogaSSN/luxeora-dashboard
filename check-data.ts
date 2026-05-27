import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function check() {
  console.log("Checking data...");
  const { data, error } = await supabase.from('luxury_moods').select('*');
  console.log("Moods:", data?.length, error);
}

check();
