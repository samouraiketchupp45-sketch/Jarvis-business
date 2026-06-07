import { NextRequest, NextResponse } from 'next/server'
import { tg, setCommands } from '@/lib/telegram-bot'

export const dynamic = 'force-dynamic'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://jarvis-business.vercel.app').replace(/\/$/, '')
const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID ?? ''

export async function POST(req: NextRequest) {
  let update: any
  try { update = await req.json() } catch { return NextResponse.json({ ok: true }) }

  // ── Messages ──────────────────────────────────────────────────────────────
  if (update.message) {
    const msg    = update.message
    const chatId = msg.chat.id as number
    const userId = msg.from?.id as number
    const cmd    = (msg.text ?? '').split(' ')[0].split('@')[0].toLowerCase()

    switch (cmd) {
      case '/start':
        await tg('sendMessage', {
          chat_id: chatId,
          text: '🤖 <b>JARVIS BUSINESS</b>\n\nCréation de Mini-Apps Telegram, Bots & Automatisations IA.\n\n<b>Votre business digitalisé en 48h.</b>',
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🛠 Voir nos services',  web_app: { url: `${APP_URL}/` } }],
              [{ text: '🏆 Réalisations',        web_app: { url: `${APP_URL}/portfolio` } }],
              [{ text: '💼 Demander un devis',   web_app: { url: `${APP_URL}/contact` } }],
            ],
          },
        })
        break

      case '/services':
        await tg('sendMessage', {
          chat_id: chatId,
          text: '🛠 <b>Nos services</b>\n\n• Mini-App Telegram — 800€+\n• Bot Telegram — 500€+\n• Panel Admin — inclus\n• Automatisation IA — 300€+\n• Système commandes — 600€+\n• Réservation — 400€+\n\n📅 Abonnements : 20€ à 100€/mois',
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: [[
            { text: '💼 Demander un devis', web_app: { url: `${APP_URL}/contact` } },
          ]] },
        })
        break

      case '/portfolio':
        await tg('sendMessage', {
          chat_id: chatId,
          text: '🏆 <b>Nos réalisations</b>\n\nDécouvrez nos projets livrés, dont <b>Exoticz CBD</b> — boutique e-commerce complète sur Telegram.',
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: [[
            { text: '🏆 Voir le portfolio', web_app: { url: `${APP_URL}/portfolio` } },
          ]] },
        })
        break

      case '/devis':
      case '/contact':
        await tg('sendMessage', {
          chat_id: chatId,
          text: '💼 <b>Demande de devis</b>\n\nDevis gratuit — Réponse en 24h.\nSans engagement.',
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: [[
            { text: '📋 Remplir le formulaire', web_app: { url: `${APP_URL}/contact` } },
          ]] },
        })
        break

      case '/admin':
        if (String(userId) !== String(ADMIN_ID)) break
        await tg('sendMessage', {
          chat_id: chatId,
          text: '⚙️ <b>Dashboard JARVIS</b>',
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: [
            [{ text: '📊 Dashboard',    web_app: { url: `${APP_URL}/dashboard` } }],
            [{ text: '🎯 CRM Prospects', web_app: { url: `${APP_URL}/crm` } }],
          ] },
        })
        break

      default: break
    }
  }

  // ── Callbacks ─────────────────────────────────────────────────────────────
  if (update.callback_query) {
    const cq   = update.callback_query
    const data = cq.data as string

    if (data?.startsWith('prospect_')) {
      const [, action, id] = data.split('_')
      const status = action === 'qualifie' ? 'QUALIFIE' : 'PERDU'
      await fetch(`${APP_URL}/api/prospects`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      }).catch(() => {})
      await tg('answerCallbackQuery', {
        callback_query_id: cq.id,
        text: status === 'QUALIFIE' ? '✅ Prospect qualifié' : '❌ Prospect non qualifié',
      })
    }

    if (data?.startsWith('relance_done_')) {
      const id = data.replace('relance_done_', '')
      await fetch(`${APP_URL}/api/prospects`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'CONTACTE', note: 'Relance effectuée' }),
      }).catch(() => {})
      await tg('answerCallbackQuery', { callback_query_id: cq.id, text: '✅ Relance marquée comme faite' })
    }

    await tg('answerCallbackQuery', { callback_query_id: cq.id }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ status: '✅ JARVIS BUSINESS Bot actif', ts: new Date().toISOString() })
}
