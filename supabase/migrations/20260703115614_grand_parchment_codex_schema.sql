/*
# Grand Parchment Esoteric Codex — Core Schema

## Purpose
Single-tenant (no Supabase auth) esoteric platform. Admin access is granted via
clearance codes stored in the `admins` table, NOT via Supabase auth. The frontend
talks to Supabase with the anon key for its entire lifetime, so every policy
lists `anon, authenticated` and the data is intentionally shared/public.

## New Tables
1. `admins` — staff control. Two tiers: `admin` (clearance code "test12345") and
   `super` (clearance code "test1234567890"). Super admins can CRUD admins,
   rename role titles, change codes, suspend, delete.
   - `id` uuid pk
   - `role_title` text — displayable moniker (e.g. "Admin", "مراقب", "Sovereign Oracle")
   - `tier` text check in ('admin','super')
   - `access_code` text unique — the clearance bypass code
   - `active` boolean default true
   - `created_at` timestamptz
2. `services` — the 10 core portals. Seeded here.
   - `id` smallint pk (1..10)
   - `slug` text unique
   - `name_en`, `name_ar`, `name_fr` text
   - `status` text check in ('active','hidden','coming_soon') default 'active'
   - `tier` text check in ('free','premium') default 'free'
   - `limit_window` text check in ('day','month','year') nullable
   - `limit_count` integer nullable
   - `sort_order` integer default 0
3. `api_keys` — up to 30 keys per provider for OpenRouter / Stability / ControlNet.
   - `id` uuid pk
   - `provider` text check in ('openrouter','stability','controlnet')
   - `label` text
   - `key_ref` text — a reference/label only, never the raw secret
   - `state` text check in ('OFF','ON','TEST','ACTIVE_RUNNER') default 'OFF'
   - `balance` text nullable — remaining credits as a string (provider-dependent)
   - `last_tested_at` timestamptz nullable
   - `created_at` timestamptz
4. `fingerprints` — browser fingerprint deduplication for rate-limit tracking.
   - `id` uuid pk
   - `fingerprint` text unique
   - `created_at` timestamptz
5. `usage_events` — one row per service use, scoped by fingerprint + service.
   - `id` uuid pk
   - `fingerprint` text
   - `service_id` smallint references services(id) on delete cascade
   - `created_at` timestamptz

## Security
- RLS enabled on every table.
- All policies are `TO anon, authenticated` because this is a no-auth app: the
  anon-key client must read/write its own shared data. `USING (true)` is
  acceptable here precisely because the data is intentionally public/shared
  (single-tenant, no sign-in screen).

## Notes
1. Default admins are seeded: a `super` with code "test1234567890" and an `admin`
   with code "test12345".
2. All 10 services are seeded with default active/free status.
3. Idempotent: safe to re-run.
*/

-- ───────────────────────── admins ─────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_title text NOT NULL DEFAULT 'Admin',
  tier text NOT NULL CHECK (tier IN ('admin','super')) DEFAULT 'admin',
  access_code text UNIQUE NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_admins" ON admins;
CREATE POLICY "anon_select_admins" ON admins FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_admins" ON admins;
CREATE POLICY "anon_insert_admins" ON admins FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_admins" ON admins;
CREATE POLICY "anon_update_admins" ON admins FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_admins" ON admins;
CREATE POLICY "anon_delete_admins" ON admins FOR DELETE
  TO anon, authenticated USING (true);

-- Seed default admins (idempotent via ON CONFLICT)
INSERT INTO admins (role_title, tier, access_code, active) VALUES
  ('Sovereign Oracle', 'super', 'test1234567890', true),
  ('Admin', 'admin', 'test12345', true)
ON CONFLICT (access_code) DO NOTHING;

-- ───────────────────────── services ─────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id smallint PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  name_fr text NOT NULL,
  status text NOT NULL CHECK (status IN ('active','hidden','coming_soon')) DEFAULT 'active',
  tier text NOT NULL CHECK (tier IN ('free','premium')) DEFAULT 'free',
  limit_window text CHECK (limit_window IN ('day','month','year')),
  limit_count integer,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_services" ON services;
CREATE POLICY "anon_select_services" ON services FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_update_services" ON services;
CREATE POLICY "anon_update_services" ON services FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed the 10 core portals
INSERT INTO services (id, slug, name_en, name_ar, name_fr, status, tier, sort_order) VALUES
  (1,  'shadow-profiler',     'Shadow Profiler',            'محلل الظل',              'Profilage de l''Ombre',          'active', 'free', 1),
  (2,  'al-zanati-geomancy', 'Al-Zanati Geomancy',         'الرمل الزناتي',          'Géomancie Al-Zanati',           'active', 'free', 2),
  (3,  'luciferian-tarot',    'Luciferian Tarot Oracle',    'تاروت اللوسيفيري',       'Oracle Tarot Luciférien',       'active', 'free', 3),
  (4,  'taoist-shift',        'Taoist Shift Balancer',      'موازن التاو',            'Équilibrateur Taoïste',         'active', 'free', 4),
  (5,  'kabbalistic-jafr',    'Kabbalistic & Jafr Numerology','علم الحروف والجفر',    'Numérologie Kabbalistique & Jafr','active','free',5),
  (6,  'dream-necromancer',   'Dream Necromancer',          'مفسّر الأحلام',          'Nécromancien des Rêves',        'active', 'free', 6),
  (7,  'ritual-alchemy',      'Ritual Alchemy Engine',      'محرّك الخيمياء الطقسي',  'Moteur d''Alchimie Rituelle',   'active', 'free', 7),
  (8,  'bio-energy-synastry', 'Bio-Energy Synastry',        'التوافق الطاقي',         'Synastrie Bio-Énergétique',     'active', 'free', 8),
  (9,  'planetary-transit',   'Planetary Transit Guide',    'دليل العبور الكوكبي',    'Guide des Transits Planétaires','active', 'free', 9),
  (10, 'sovereign-guard',     'The Sovereign Guard Engine',  'محرّك الحارس السيادي',   'Moteur de la Garde Souveraine', 'active', 'free', 10)
ON CONFLICT (id) DO NOTHING;

-- ───────────────────────── api_keys ─────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('openrouter','stability','controlnet')),
  label text NOT NULL DEFAULT '',
  key_ref text NOT NULL DEFAULT '',
  state text NOT NULL CHECK (state IN ('OFF','ON','TEST','ACTIVE_RUNNER')) DEFAULT 'OFF',
  balance text,
  last_tested_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_api_keys" ON api_keys;
CREATE POLICY "anon_select_api_keys" ON api_keys FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_api_keys" ON api_keys;
CREATE POLICY "anon_insert_api_keys" ON api_keys FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_api_keys" ON api_keys;
CREATE POLICY "anon_update_api_keys" ON api_keys FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_api_keys" ON api_keys;
CREATE POLICY "anon_delete_api_keys" ON api_keys FOR DELETE
  TO anon, authenticated USING (true);

-- ───────────────────────── fingerprints ─────────────────────────
CREATE TABLE IF NOT EXISTS fingerprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE fingerprints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_fingerprints" ON fingerprints;
CREATE POLICY "anon_select_fingerprints" ON fingerprints FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_fingerprints" ON fingerprints;
CREATE POLICY "anon_insert_fingerprints" ON fingerprints FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ───────────────────────── usage_events ─────────────────────────
CREATE TABLE IF NOT EXISTS usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text NOT NULL,
  service_id smallint NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_usage" ON usage_events;
CREATE POLICY "anon_select_usage" ON usage_events FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_usage" ON usage_events;
CREATE POLICY "anon_insert_usage" ON usage_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_usage" ON usage_events;
CREATE POLICY "anon_delete_usage" ON usage_events FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_usage_fp_service_time
  ON usage_events (fingerprint, service_id, created_at DESC);
