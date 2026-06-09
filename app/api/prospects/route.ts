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
  if (!supabase) {
    console.error('[PROSPECTS GET] Supabase non configuré — vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY')
    return NextResponse.json({ error: 'DB non configurée' }, { status: 503 })
  }

  let query = supabase
    .from('jrv_prospects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) {
    console.error('[PROSPECTS GET] Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (isStats) {
    const list        = data ?? []
    const now         = new Date()
    const weekAgo     = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const newThisWeek = list.filter((p: any) => new Date(p.created_at) > weekAgo).length
    const total       = list.length
    const accepted    = list.filter((p: any) => ['ACCEPTE','EN_COURS','LIVRE'].includes(p.status)).length
    const conversion  = total > 0 ? Math.round(accepted / total * 100) : 0
    const pending     = list.filter((p: any) => p.status === 'NOUVEAU').length
    const inProgress  = list.filter((p: any) => p.status === 'EN_COURS').length
    const maintenance = list.filter((p: any) => p.wants_maintenance && p.status === 'LIVRE').length

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

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  console.log('[PROSPECTS POST] body reçu:', JSON.stringify(body))

  const {
    project_description,
    activity,
    telegram,
    features,
    wants_maintenance,
    name,
    pack,
    budget,
    service,
    tg_user,  // { id, username, first_name, last_name } depuis Telegram WebApp SDK
  } = body

  if (!project_description || String(project_description).trim().length < 5) {
    console.error('[PROSPECTS POST] Validation échouée — project_description manquant ou trop court')
    return NextResponse.json({ error: 'La description du projet est requise (min. 5 caractères)' }, { status: 400 })
  }

  const supabase = createServiceClient()
  if (!supabase) {
    console.error('[PROSPECTS POST] Supabase non configuré — NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant')
    return NextResponse.json({ error: 'Base de données non configurée. Contactez l\'administrateur.' }, { status: 503 })
  }

  const activityVal = (activity ?? 'Pack Complet 1200€').trim()
  const serviceVal  = (service  ?? 'Bot + Mini App + Panel Admin').trim()
  const telegramVal = (telegram ?? name ?? 'Non renseigné').trim()

  // Stocker le profil Telegram complet dans notes (colonne jsonb existante)
  const initialNotes: any[] = []
  if (tg_user && typeof tg_user === 'object') {
    initialNotes.push({
      type:       'tg_user',
      id:         tg_user.id         ?? null,
      username:   tg_user.username   ?? null,
      first_name: tg_user.first_name ?? null,
      last_name:  tg_user.last_name  ?? null,
      date:       new Date().toISOString(),
    })
    console.log('[PROSPECTS POST] tg_user capturé:', JSON.stringify(tg_user))
  } else {
    console.log('[PROSPECTS POST] Pas de tg_user fourni (formulaire hors Telegram ?)')
  }

  const insertData: Record<string, unknown> = {
    activity:            activityVal,
    project_description: project_description.trim(),
    telegram:            telegramVal,
    features:            features ? String(features).trim() : null,
    wants_maintenance:   Boolean(wants_maintenance),
    status:              'NOUVEAU',
    notes:               initialNotes,
    // colonnes rétrocompat (NOT NULL dans l'ancienne table)
    name:                (name ?? tg_user?.first_name ?? 'Prospect').trim(),
    company:             activityVal,
    service:             serviceVal,
    budget:              budget ?? '1200',
    message:             project_description.trim(),
  }

  console.log('[PROSPECTS POST] Insertion dans jrv_prospects:', JSON.stringify(insertData))

  const { data, error } = await supabase
    .from('jrv_prospects')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('[PROSPECTS POST] Supabase insert error:', error.message, error.details, error.hint)
    return NextResponse.json({
      error: `Erreur base de données : ${error.message}`,
      details: error.details,
      hint: error.hint,
    }, { status: 500 })
  }

  console.log('[PROSPECTS POST] ✅ Prospect enregistré — id:', data.id)

  // Notifier admin Telegram — AWAITÉ pour que Vercel ne coupe pas avant l'envoi
  // Extraire infos tg depuis notes pour la notification
  const tgNote = (data.notes as any[])?.find((n: any) => n.type === 'tg_user')

  try {
    await notifyNewProspect({
      id:                  data.id,
      activity:            data.activity,
      project_description: data.project_description,
      telegram:            data.telegram,
      features:            data.features ?? null,
      wants_maintenance:   data.wants_maintenance,
      tg_user:             tgNote ?? null,
    })
    console.log('[PROSPECTS POST] ✅ Notification Telegram envoyée')
  } catch (e: any) {
    console.error('[PROSPECTS POST] Telegram notify error:', e?.message)
  }

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
