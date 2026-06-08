import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
export const dynamic = 'force-dynamic'
export async function GET() {
  const supabase = createServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré — ajoute les env vars' }, { status: 503 })
  const { error } = await supabase.from('jrv_prospects').select('id').limit(1)
  if (!error) return NextResponse.json({ status: '✅ Tables JARVIS opérationnelles' })
  return NextResponse.json({ status: '⚠️ Tables manquantes — exécute supabase-schema.sql', sql_url: 'https://supabase.com/dashboard/project/rgjvkxenwtnfllakjvza/sql/new' })
}
