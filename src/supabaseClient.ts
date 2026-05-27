import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const validateUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
    return 'https://gqezdfiobxxwgouzmyhr.supabase.co';
  }
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return 'https://gqezdfiobxxwgouzmyhr.supabase.co';
  }
  return trimmed;
};

const validateKey = (key: string): string => {
  const trimmed = key.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
    return 'sb_publishable_0bQOKiDYrvl1W597v-KmwQ_FCd70wNc';
  }
  return trimmed;
};

export const supabase = createClient(validateUrl(rawUrl), validateKey(rawKey));


