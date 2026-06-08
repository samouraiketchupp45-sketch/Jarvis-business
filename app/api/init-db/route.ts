import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function GET() {
  const ref = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace('https://','').replace('.supabase.co','')
  return NextResponse.json({ 
    message: 'Exécute ce SQL dans Supabase pour créer les tables JARVIS',
    sql_url: `https://supabase.com/dashboard/project/${ref}/sql/new`,
    ready: false,
  })
}
