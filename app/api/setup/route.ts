import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { requireSetupAuth } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // 🔒 Diagnostic réservé à l'admin (ne jamais exposer l'état des secrets publiquement)
  const auth = requireSetupAuth(req)
  if (!auth.ok) return auth.response

  const url     = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY

  const checks: Record<string, any> = {
    env: {
      // On indique seulement présent/absent — jamais la valeur ni l'ID admin.
      NEXT_PUBLIC_SUPABASE_URL:      url     ? '✅ défini' : '❌ MANQUANT',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anon    ? '✅ défini' : '❌ MANQUANT',
      SUPABASE_SERVICE_ROLE_KEY:     service ? '✅ défini' : '❌ MANQUANT',
      TELEGRAM_BOT_TOKEN:            process.env.TELEGRAM_BOT_TOKEN ? '✅ défini' : '❌ MANQUANT',
      ADMIN_TELEGRAM_ID:             process.env.ADMIN_TELEGRAM_ID ? '✅ défini' : '❌ MANQUANT',
      WEBHOOK_SECRET:                process.env.WEBHOOK_SECRET ? '✅ défini' : '❌ MANQUANT',
    },
  }

  const supabase = createServiceClient()
  if (!supabase) {
    checks.supabase = '❌ Client non créé — NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant'
    checks.fix = 'Allez sur vercel.com → votre projet → Settings → Environment Variables et ajoutez les 3 clés Supabase'
    return NextResponse.json(checks, { status: 503 })
  }

  // Test table prospects
  const { data: prosp, error: prospErr } = await supabase
    .from('jrv_prospects')
    .select('id')
    .limit(1)

  checks.table_jrv_prospects = prospErr
    ? `❌ ${prospErr.message} — exécutez supabase-schema.sql`
    : `✅ accessible (${prosp?.length ?? 0} ligne(s) testée(s))`

  // Test table clients
  const { error: clientErr } = await supabase
    .from('jrv_clients')
    .select('id')
    .limit(1)

  checks.table_jrv_clients = clientErr
    ? `❌ ${clientErr.message} — exécutez supabase-schema.sql`
    : '✅ accessible'

  const allOk = !prospErr && !clientErr
  checks.status = allOk ? '✅ Tout est opérationnel' : '⚠️ Des problèmes détectés — voir détails ci-dessus'

  return NextResponse.json(checks, { status: allOk ? 200 : 500 })
}
