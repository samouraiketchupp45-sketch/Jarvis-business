import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { notifyNewProspect } from '@/lib/telegram-bot'
import { requireAdmin, checkRateLimit, getClientIP, sanitizeText } from '@/lib/security'

export const dynamic = 'force-dynamic'

// ── GET ─── ADMIN UNIQUEMENT (données CRM = PII + revenus) ─────────────────────
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if (!auth.ok) return auth.response

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

    // MRR réel : calcul depuis les prospects actifs (LIVRE / EN_COURS)
    // hébergement = 15€/mois, maintenance = 50€/mois
    let mrr = 0
    const activeProjects = list.filter((p: any) => ['LIVRE', 'EN_COURS', 'ACCEPTE'].includes(p.status))
    for (const p of activeProjects) {
      const optNote = (p.notes ?? []).find((n: any) => n.type === 'options')
      if (optNote?.hosting)     mrr += 15
      if (optNote?.maintenance) mrr += 50
    }
    // Fallback : essayer la table jrv_clients si elle existe
    try {
      const r = await supabase.from('jrv_clients').select('monthly_fee').eq('active', true)
      if (r.data && r.data.length > 0) {
        mrr = r.data.reduce((sum: number, c: any) => sum + (c.monthly_fee ?? 0), 0)
      }
    } catch { /* table absente, on garde le calcul prospects */ }

    return NextResponse.json({ total, accepted, pending, inProgress, conversion, newThisWeek, maintenance, mrr })
  }

  return NextResponse.json(data ?? [])
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Anti-spam : 5 soumissions / minute / IP (formulaire public)
  if (!checkRateLimit(`prospect-post:${getClientIP(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Trop de demandes. Réessayez dans une minute.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))

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
    tg_user,        // { id, username, first_name, last_name } depuis Telegram WebApp SDK
    wants_hosting,  // boolean
  } = body

  if (!project_description || String(project_description).trim().length < 5) {
    return NextResponse.json({ error: 'La description du projet est requise (min. 5 caractères)' }, { status: 400 })
  }

  const supabase = createServiceClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Base de données non configurée. Contactez l\'administrateur.' }, { status: 503 })
  }

  const activityVal = sanitizeText(activity ?? 'Pack Complet 1200€', 200)
  const serviceVal  = sanitizeText(service  ?? 'Bot + Mini App + Panel Admin', 200)
  const telegramVal = sanitizeText(telegram ?? name ?? 'Non renseigné', 120)

  // Stocker profil Telegram + options dans notes JSONB
  const initialNotes: any[] = []

  if (tg_user && typeof tg_user === 'object') {
    initialNotes.push({
      type:       'tg_user',
      id:         tg_user.id         ?? null,
      username:   sanitizeText(tg_user.username, 64)   || null,
      first_name: sanitizeText(tg_user.first_name, 64) || null,
      last_name:  sanitizeText(tg_user.last_name, 64)  || null,
      date:       new Date().toISOString(),
    })
  }

  // Options choisies par le client
  initialNotes.push({
    type:        'options',
    hosting:     Boolean(wants_hosting),
    maintenance: Boolean(wants_maintenance),
    date:        new Date().toISOString(),
  })

  const descVal = sanitizeText(project_description, 4000)
  const insertData: Record<string, unknown> = {
    activity:            activityVal,
    project_description: descVal,
    telegram:            telegramVal,
    features:            features ? sanitizeText(features, 2000) : null,
    wants_maintenance:   Boolean(wants_maintenance),
    status:              'NOUVEAU',
    notes:               initialNotes,
    // colonnes rétrocompat (NOT NULL dans l'ancienne table)
    name:                sanitizeText(name ?? tg_user?.first_name ?? 'Prospect', 120),
    company:             activityVal,
    service:             serviceVal,
    budget:              sanitizeText(budget ?? '1200', 40),
    message:             descVal,
  }

  const { data, error } = await supabase
    .from('jrv_prospects')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('[PROSPECTS POST] insert error:', error.code)
    return NextResponse.json({ error: 'Enregistrement impossible. Réessayez.' }, { status: 500 })
  }

  // Notifier admin Telegram (non bloquant sur la réponse en cas d'échec)
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
      notes:               data.notes ?? [],
    })
  } catch { /* notification best-effort */ }

  return NextResponse.json({ id: data.id, status: data.status }, { status: 201 })
}

// ── PATCH ─── ADMIN UNIQUEMENT ────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = requireAdmin(req)
  if (!auth.ok) return auth.response

  const body = await req.json().catch(() => ({}))
  const { id, status, note } = body
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  // Liste blanche des statuts (évite l'injection de valeurs arbitraires)
  const ALLOWED = ['NOUVEAU', 'CONTACTE', 'ACCEPTE', 'REFUSE', 'EN_COURS', 'LIVRE']
  if (status && !ALLOWED.includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json({ error: 'DB non configurée' }, { status: 503 })

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (status) updates.status = status

  if (note) {
    const { data: current } = await supabase.from('jrv_prospects').select('notes').eq('id', id).single()
    const existing = (current?.notes ?? []) as any[]
    updates.notes = [...existing, { text: sanitizeText(note, 2000), date: new Date().toISOString() }]
  }

  const { data, error } = await supabase
    .from('jrv_prospects').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: 'Mise à jour impossible' }, { status: 500 })
  return NextResponse.json(data)
}
