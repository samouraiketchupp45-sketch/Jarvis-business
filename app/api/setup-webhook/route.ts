import { NextResponse } from 'next/server'
import { setWebhook, setCommands } from '@/lib/telegram-bot'

export const dynamic = 'force-dynamic'

export async function GET() {
  const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '')
  const [webhookRes, cmdRes] = await Promise.all([
    setWebhook(`${APP_URL}/api/telegram/webhook`),
    setCommands(),
  ])
  return NextResponse.json({ webhook: webhookRes, commands: cmdRes })
}
