-- ═══════════════════════════════════════════════════════════
-- JARVIS BUSINESS — Schema Supabase
-- Coller dans Supabase SQL Editor et cliquer Run
-- ═══════════════════════════════════════════════════════════

-- 1. Prospects
CREATE TABLE IF NOT EXISTS prospects (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text    NOT NULL,
  company     text,
  telegram    text,
  service     text    NOT NULL,
  budget      text,
  message     text    NOT NULL,
  status      text    NOT NULL DEFAULT 'NOUVEAU',
  notes       jsonb   DEFAULT '[]',
  score       int     DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- 2. Clients actifs
CREATE TABLE IF NOT EXISTS clients (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text    NOT NULL,
  company     text,
  telegram    text,
  service     text    NOT NULL,
  monthly_fee int     DEFAULT 0,
  active      boolean DEFAULT true,
  start_date  timestamptz DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

-- 3. Devis
CREATE TABLE IF NOT EXISTS devis (
  id           uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id  uuid    REFERENCES prospects(id),
  client_name  text    NOT NULL,
  company      text,
  services     jsonb   DEFAULT '[]',
  total_ht     int     NOT NULL DEFAULT 0,
  monthly_fee  int     DEFAULT 0,
  status       text    DEFAULT 'BROUILLON',
  notes        text,
  created_at   timestamptz DEFAULT now()
);

-- 4. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_created ON prospects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(active);

-- 5. RLS — Désactivé (accès via service role key uniquement)
ALTER TABLE prospects     DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients       DISABLE ROW LEVEL SECURITY;
ALTER TABLE devis         DISABLE ROW LEVEL SECURITY;
