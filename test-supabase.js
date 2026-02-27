import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('candidates').select('*').limit(1);
    
    if (error) {
      console.error('Connection error:', error);
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testConnection();
