import { NextRequest, NextResponse } from 'next/server'
import { setWebhook, setCommands } from '@/lib/telegram-bot'
import { requireSetupAuth } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = requireSetupAuth(req)
  if (!auth.ok) return auth.response
  const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '')
  const [webhookRes, cmdRes] = await Promise.all([
    setWebhook(`${APP_URL}/api/telegram/webhook`),
    setCommands(),
  ])
  return NextResponse.json({ webhook: webhookRes, commands: cmdRes })
}
