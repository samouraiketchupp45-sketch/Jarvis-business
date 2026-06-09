-- ═══════════════════════════════════════════════════════════
-- JARVIS BUSINESS — Schéma Supabase v2
-- Coller dans : https://supabase.com/dashboard/project/rgjvkxenwtnfllakjvza/sql/new
-- ═══════════════════════════════════════════════════════════

-- ── 1. Prospects (demandes de projets) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS jrv_prospects (
  id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now(),
  activity            text,
  project_description text,
  telegram            text,
  features            text,
  wants_maintenance   boolean     DEFAULT false,
  -- rétrocompatibilité
  name    text, company text, service text, budget text, message text,
  status  text    DEFAULT 'NOUVEAU',
  notes   jsonb   DEFAULT '[]',
  score   int     DEFAULT 0
);

-- Migrations si table déjà existante
ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS activity            text;
ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS project_description text;
ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS features            text;
ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS wants_maintenance   boolean DEFAULT false;

-- ── 2. Clients (projets livrés + abonnements) ────────────────────────────────
CREATE TABLE IF NOT EXISTS jrv_clients (
  id                 uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at         timestamptz DEFAULT now(),
  name               text        NOT NULL,
  telegram           text,
  active             boolean     DEFAULT true,
  hosting_active     boolean     DEFAULT true,
  maintenance_active boolean     DEFAULT false,
  monthly_fee        int         DEFAULT 15,
  project_url        text,
  notes              text,
  -- rétrocompatibilité
  company text, service text, start_date timestamptz DEFAULT now()
);

ALTER TABLE jrv_clients ADD COLUMN IF NOT EXISTS hosting_active     boolean DEFAULT true;
ALTER TABLE jrv_clients ADD COLUMN IF NOT EXISTS maintenance_active boolean DEFAULT false;
ALTER TABLE jrv_clients ADD COLUMN IF NOT EXISTS project_url        text;

-- ── 3. Index ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_jrv_prospects_status  ON jrv_prospects(status);
CREATE INDEX IF NOT EXISTS idx_jrv_prospects_created ON jrv_prospects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jrv_clients_active    ON jrv_clients(active);

-- ── 4. Désactiver RLS ─────────────────────────────────────────────────────────
ALTER TABLE jrv_prospects DISABLE ROW LEVEL SECURITY;
ALTER TABLE jrv_clients   DISABLE ROW LEVEL SECURITY;

-- ── 5. Rafraîchir le cache PostgREST ─────────────────────────────────────────
NOTIFY pgrst, 'reload schema';

SELECT 'JARVIS BUSINESS v2 — Tables OK ✅' as status;
