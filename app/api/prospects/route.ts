import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { notifyNewProspect } from '@/lib/telegram-bot'

export const dynamic = 'force-dynamic'

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const isStats = searchParams.get('stats') === '1'
  const limit   = parseInt(searchParams.get('limit') ?? '50')

  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json([])

  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (isStats) {
    const prospects = data ?? []
    const clients   = prospects.filter(p => p.status === 'GAGNE')
    const now       = new Date()
    const weekAgo   = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const newThisWeek = prospects.filter(p => new Date(p.created_at) > weekAgo).length

    // MRR from clients table (fallback to 0)
    const { data: clientsData } = await supabase.from('clients').select('monthly_fee').eq('active', true)
    const mrr = (clientsData ?? []).reduce((sum: number, c: any) => sum + (c.monthly_fee ?? 0), 0)

    const total      = prospects.length
    const won        = clients.length
    const conversion = total > 0 ? Math.round(won / total * 100) : 0
    const pending    = prospects.filter(p => p.status === 'DEVIS').length

    return NextResponse.json({ prospects: total, clients: won, mrr, conversion, newThisWeek, pendingDevis: pending })
  }

  return NextResponse.json(data ?? [])
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { name, company, telegram, service, budget, message } = body

  if (!name || !service || !message) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json({ error: 'DB non configurée' }, { status: 503 })

  const { data, error } = await supabase
    .from('prospects')
    .insert({
      name:     name.trim(),
      company:  company?.trim() ?? null,
      telegram: telegram?.trim() ?? null,
      service:  service.trim(),
      budget:   budget?.trim() ?? null,
      message:  message.trim(),
      status:   'NOUVEAU',
      notes:    [],
    })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notifier l'admin Telegram
  notifyNewProspect({
    id:      data.id,
    name:    data.name,
    company: data.company ?? 'Particulier',
    sector:  data.service,
    message: data.message,
  }).catch(e => console.error('[PROSPECTS] notifyNewProspect:', e?.message))

  return NextResponse.json(data, { status: 201 })
}

// ── PATCH ──────────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { id, status, note } = body
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json({ error: 'DB non configurée' }, { status: 503 })

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (status) updates.status = status

  if (note) {
    const { data: current } = await supabase.from('prospects').select('notes').eq('id', id).single()
    const existing = (current?.notes ?? []) as any[]
    updates.notes = [...existing, { text: note, date: new Date().toISOString() }]
  }

  const { data, error } = await supabase
    .from('prospects').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
