import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    headers: { 'X-Client-Info': 'grand-parchment-codex' },
  },
});

export type AdminTier = 'admin' | 'super';

export interface AdminUser {
  id: string;
  role_title: string;
  tier: AdminTier;
  access_code: string;
  active: boolean;
  created_at?: string;
}

export type ApiKeyState = 'OFF' | 'ON' | 'TEST' | 'ACTIVE_RUNNER';

export interface ApiKeyRow {
  id: string;
  provider: string;
  label: string;
  key_ref: string;
  state: ApiKeyState;
  balance: string | null;
  last_tested_at: string | null;
  created_at: string;
}

export interface ServiceConfig {
  id: number;
  slug: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  status: 'active' | 'hidden' | 'coming_soon';
  tier: 'free' | 'premium';
  limit_window: 'day' | 'month' | 'year' | null;
  limit_count: number | null;
  sort_order: number;
}
