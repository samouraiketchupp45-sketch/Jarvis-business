import { NextRequest, NextResponse } from 'next/server'
import { requireSetupAuth } from '@/lib/security'
export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  const auth = requireSetupAuth(req)
  if (!auth.ok) return auth.response
  const ref = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace('https://','').replace('.supabase.co','')
  return NextResponse.json({ 
    message: 'Exécute ce SQL dans Supabase pour créer les tables JARVIS',
    sql_url: `https://supabase.com/dashboard/project/${ref}/sql/new`,
    ready: false,
  })
}
