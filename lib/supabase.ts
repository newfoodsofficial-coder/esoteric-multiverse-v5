import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Avoid crashing the build when env is missing; surface a clear runtime error instead.
  console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type AdminTier = 'admin' | 'super';

export type ServiceStatus = 'active' | 'hidden' | 'coming_soon';
export type ServiceTier = 'free' | 'premium';

export type ApiKeyState = 'OFF' | 'ON' | 'TEST' | 'ACTIVE_RUNNER';

export interface AdminUser {
  id: string;
  role_title: string;
  tier: AdminTier;
  access_code: string;
  active: boolean;
  created_at: string;
}

export interface ServiceConfig {
  id: number;
  slug: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  status: ServiceStatus;
  tier: ServiceTier;
  limit_window: 'day' | 'month' | 'year' | null;
  limit_count: number | null;
  sort_order: number;
}

export interface ApiKeyRow {
  id: string;
  provider: 'openrouter' | 'stability' | 'controlnet';
  label: string;
  key_ref: string;
  state: ApiKeyState;
  balance: string | null;
  last_tested_at: string | null;
  created_at: string;
}

export interface FingerprintRow {
  id: string;
  fingerprint: string;
  created_at: string;
}

export interface UsageRow {
  id: string;
  fingerprint: string;
  service_id: number;
  created_at: string;
}
