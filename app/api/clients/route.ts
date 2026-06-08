import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json([])
  const { data } = await supabase.from('jrv_clients').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json({ error: 'DB non configurée' }, { status: 503 })
  const { data, error } = await supabase.from('jrv_clients').insert({
    name:        body.name,
    company:     body.company ?? null,
    telegram:    body.telegram ?? null,
    service:     body.service,
    monthly_fee: body.monthly_fee ?? 0,
    active:      true,
    start_date:  new Date().toISOString(),
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
