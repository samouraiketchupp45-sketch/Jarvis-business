import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { notifyNewProspect } from '@/lib/telegram-bot'

export const dynamic = 'force-dynamic'

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const isStats = searchParams.get('stats') === '1'
  const status  = searchParams.get('status') ?? null
  const limit   = parseInt(searchParams.get('limit') ?? '100')

  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json([])

  let query = supabase
    .from('jrv_prospects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (isStats) {
    const list       = data ?? []
    const now        = new Date()
    const weekAgo    = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const newThisWeek = list.filter((p: any) => new Date(p.created_at) > weekAgo).length
    const total      = list.length
    const accepted   = list.filter((p: any) => ['ACCEPTE','EN_COURS','LIVRE'].includes(p.status)).length
    const conversion = total > 0 ? Math.round(accepted / total * 100) : 0
    const pending    = list.filter((p: any) => p.status === 'NOUVEAU').length
    const inProgress = list.filter((p: any) => p.status === 'EN_COURS').length
    const maintenance = list.filter((p: any) => p.wants_maintenance && p.status === 'LIVRE').length

    // MRR = hébergements actifs × 15 + maintenances actives × 50
    let clients: any[] | null = null
    try {
      const r = await supabase.from('jrv_clients').select('monthly_fee').eq('active', true)
      clients = r.data
    } catch { /* ignore */ }
    const mrr = (clients ?? []).reduce((sum: number, c: any) => sum + (c.monthly_fee ?? 0), 0)

    return NextResponse.json({ total, accepted, pending, inProgress, conversion, newThisWeek, maintenance, mrr })
  }

  return NextResponse.json(data ?? [])
}

// ── Détecter si les nouvelles colonnes existent ───────────────────────────────
let _hasNewColumns: boolean | null = null
async function hasNewColumns(supabase: any): Promise<boolean> {
  if (_hasNewColumns !== null) return _hasNewColumns
  const { error } = await supabase.from('jrv_prospects').select('activity').limit(1)
  _hasNewColumns = !error
  return _hasNewColumns
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { activity, project_description, telegram, features, wants_maintenance } = body

  if (!activity || !project_description || !telegram) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json({ error: 'DB non configurée' }, { status: 503 })

  const newCols = await hasNewColumns(supabase)

  // Données à insérer — compatibilité anciens ET nouveaux schémas
  const insertData: Record<string, unknown> = newCols
    ? {
        activity:             activity.trim(),
        project_description:  project_description.trim(),
        telegram:             telegram.trim(),
        features:             features?.trim() ?? null,
        wants_maintenance:    Boolean(wants_maintenance),
        status:               'NOUVEAU',
        notes:                [],
      }
    : {
        // Fallback sur les colonnes existantes
        name:    telegram.trim(),
        company: activity.trim(),
        service: activity.trim(),
        message: project_description.trim() + (features ? `\n\nFonctionnalités: ${features}` : '') + (wants_maintenance ? '\n\n✅ Maintenance souhaitée' : ''),
        telegram: telegram.trim(),
        status:  'NOUVEAU',
        notes:   [{ text: `Activité: ${activity} | Maintenance: ${wants_maintenance ? 'Oui' : 'Non'}`, date: new Date().toISOString() }],
      }

  const { data, error } = await supabase
    .from('jrv_prospects')
    .insert(insertData)
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notifier admin Telegram
  notifyNewProspect({
    id:                  data.id,
    activity:            data.activity,
    project_description: data.project_description,
    telegram:            data.telegram,
    features:            data.features ?? null,
    wants_maintenance:   data.wants_maintenance,
  }).catch(e => console.error('[PROSPECTS] notify:', e?.message))

  return NextResponse.json(data, { status: 201 })
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { id, status, note } = body
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json({ error: 'DB non configurée' }, { status: 503 })

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (status) updates.status = status

  if (note) {
    const { data: current } = await supabase.from('jrv_prospects').select('notes').eq('id', id).single()
    const existing = (current?.notes ?? []) as any[]
    updates.notes = [...existing, { text: note, date: new Date().toISOString() }]
  }

  const { data, error } = await supabase
    .from('jrv_prospects').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
