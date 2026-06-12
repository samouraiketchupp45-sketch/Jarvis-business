// Endpoint de migration one-shot — RÉSERVÉ ADMIN
import { NextRequest, NextResponse } from 'next/server'
import { requireSetupAuth } from '@/lib/security'

export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

async function sql(query: string): Promise<{ ok: boolean; error?: string }> {
  // Essaie via l'API management Supabase
  const ref = SUPABASE_URL.replace('https://','').replace('.supabase.co','')
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { ok: false, error: JSON.stringify(data) }
  return { ok: true }
}

export async function GET(req: NextRequest) {
  const auth = requireSetupAuth(req)
  if (!auth.ok) return auth.response

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json({ error: 'Env vars manquantes' }, { status: 500 })
  }

  const migrations = [
    // Tables
    `CREATE TABLE IF NOT EXISTS jrv_prospects (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(),
      activity text, project_description text, telegram text, features text,
      wants_maintenance boolean DEFAULT false,
      name text, company text, service text, budget text, message text,
      status text DEFAULT 'NOUVEAU', notes jsonb DEFAULT '[]', score int DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS jrv_clients (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at timestamptz DEFAULT now(),
      name text NOT NULL, telegram text,
      active boolean DEFAULT true, hosting_active boolean DEFAULT true,
      maintenance_active boolean DEFAULT false, monthly_fee int DEFAULT 15,
      project_url text, notes text, company text, service text
    )`,
    // Colonnes nouvelles
    `ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS activity text`,
    `ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS project_description text`,
    `ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS features text`,
    `ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS wants_maintenance boolean DEFAULT false`,
    // Colonnes Telegram WebApp
    `ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS telegram_id bigint`,
    `ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS telegram_username text`,
    `ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS telegram_first_name text`,
    `ALTER TABLE jrv_prospects ADD COLUMN IF NOT EXISTS telegram_last_name text`,
    `ALTER TABLE jrv_clients ADD COLUMN IF NOT EXISTS hosting_active boolean DEFAULT true`,
    `ALTER TABLE jrv_clients ADD COLUMN IF NOT EXISTS maintenance_active boolean DEFAULT false`,
    `ALTER TABLE jrv_clients ADD COLUMN IF NOT EXISTS project_url text`,
    // Index
    `CREATE INDEX IF NOT EXISTS idx_jrv_prospects_status ON jrv_prospects(status)`,
    `CREATE INDEX IF NOT EXISTS idx_jrv_prospects_created ON jrv_prospects(created_at DESC)`,
    // Activer RLS (deny par défaut — accès uniquement via service_role/API)
    `ALTER TABLE jrv_prospects ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE jrv_clients ENABLE ROW LEVEL SECURITY`,
    `REVOKE ALL ON jrv_prospects FROM anon, authenticated`,
    `REVOKE ALL ON jrv_clients FROM anon, authenticated`,
    // Recharger schema PostgREST
    `NOTIFY pgrst, 'reload schema'`,
  ]

  const results: { sql: string; ok: boolean; error?: string }[] = []

  for (const query of migrations) {
    const label = query.trim().split('\n')[0].slice(0, 60)
    const r = await sql(query)
    results.push({ sql: label, ...r })
  }

  const errors = results.filter(r => !r.ok)
  return NextResponse.json({
    success: errors.length === 0,
    total: results.length,
    done: results.filter(r => r.ok).length,
    errors: errors.length,
    results,
  })
}
