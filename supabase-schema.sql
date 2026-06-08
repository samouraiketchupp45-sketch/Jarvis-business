-- ═══════════════════════════════════════════════════════
-- JARVIS BUSINESS — Tables Supabase (préfixe jrv_)
-- Compatible avec le projet Supabase Exoticz existant
-- Coller dans : https://supabase.com/dashboard/project/rgjvkxenwtnfllakjvza/sql/new
-- ═══════════════════════════════════════════════════════

-- 1. Prospects / Leads
CREATE TABLE IF NOT EXISTS jrv_prospects (
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

-- 2. Clients actifs (abonnements)
CREATE TABLE IF NOT EXISTS jrv_clients (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text    NOT NULL,
  company     text,
  telegram    text,
  service     text    NOT NULL,
  monthly_fee int     DEFAULT 0,
  active      boolean DEFAULT true,
  start_date  timestamptz DEFAULT now(),
  notes       text,
  created_at  timestamptz DEFAULT now()
);

-- 3. Devis générés
CREATE TABLE IF NOT EXISTS jrv_devis (
  id           uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id  uuid    REFERENCES jrv_prospects(id) ON DELETE SET NULL,
  client_name  text    NOT NULL,
  company      text,
  services     jsonb   DEFAULT '[]',
  total_ht     int     NOT NULL DEFAULT 0,
  monthly_fee  int     DEFAULT 0,
  status       text    DEFAULT 'BROUILLON',
  notes        text,
  created_at   timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_jrv_prospects_status  ON jrv_prospects(status);
CREATE INDEX IF NOT EXISTS idx_jrv_prospects_created ON jrv_prospects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jrv_clients_active    ON jrv_clients(active);

-- Désactiver RLS (accès via service role key côté serveur uniquement)
ALTER TABLE jrv_prospects DISABLE ROW LEVEL SECURITY;
ALTER TABLE jrv_clients   DISABLE ROW LEVEL SECURITY;
ALTER TABLE jrv_devis     DISABLE ROW LEVEL SECURITY;

SELECT 'JARVIS BUSINESS — Tables créées avec succès ✅' as status;
