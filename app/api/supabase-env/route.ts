import { NextResponse } from 'next/server';

export const GET = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return NextResponse.json({ 
    supabaseConfigured: !!(supabaseUrl && supabaseKey),
    message: !!(supabaseUrl && supabaseKey) 
      ? 'Supabase environment variables are configured correctly.' 
      : 'Supabase environment variables are not yet configured. Please add them to your .env.local file.'
  });
}; 