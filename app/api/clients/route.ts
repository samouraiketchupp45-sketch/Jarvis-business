import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { requireAdmin, sanitizeText } from '@/lib/security'

export const dynamic = 'force-dynamic'

// ── GET ─── ADMIN UNIQUEMENT (clients = PII + revenus) ────────────────────────
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if (!auth.ok) return auth.response

  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json([])
  const { data } = await supabase.from('jrv_clients').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

// ── POST ─── ADMIN UNIQUEMENT ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = requireAdmin(req)
  if (!auth.ok) return auth.response

  const body = await req.json().catch(() => ({}))
  if (!body.name || !String(body.name).trim()) {
    return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
  }
  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json({ error: 'DB non configurée' }, { status: 503 })
  const { data, error } = await supabase.from('jrv_clients').insert({
    name:        sanitizeText(body.name, 120),
    company:     body.company ? sanitizeText(body.company, 120) : null,
    telegram:    body.telegram ? sanitizeText(body.telegram, 120) : null,
    service:     sanitizeText(body.service ?? '', 200),
    monthly_fee: Number.isFinite(Number(body.monthly_fee)) ? Math.max(0, Math.trunc(Number(body.monthly_fee))) : 0,
    active:      true,
    start_date:  new Date().toISOString(),
  }).select().single()
  if (error) return NextResponse.json({ error: 'Création impossible' }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
