import { NextRequest, NextResponse } from 'next/server'
import { tg, setCommands } from '@/lib/telegram-bot'

export const dynamic = 'force-dynamic'

const APP_URL  = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://jarvis-business.vercel.app').replace(/\/$/, '')
const ADMIN_ID = (process.env.ADMIN_TELEGRAM_ID ?? '').trim()

function parseCallback(data: string, prefix: string): string | null {
  if (!data.startsWith(prefix)) return null
  return data.slice(prefix.length)
}

export async function POST(req: NextRequest) {
  let update: any
  try { update = await req.json() } catch { return NextResponse.json({ ok: true }) }

  // ── Messages ──────────────────────────────────────────────────────────────
  if (update.message) {
    const msg    = update.message
    const chatId = msg.chat.id as number
    const userId = String(msg.from?.id ?? '')
    const cmd    = (msg.text ?? '').split(' ')[0].split('@')[0].toLowerCase()

    switch (cmd) {

      case '/start':
        await tg('sendMessage', {
          chat_id:    chatId,
          parse_mode: 'HTML',
          text:
            `👋 <b>Bienvenue chez Apply</b>\n\n` +
            `Transformez votre activité avec une Mini-App Telegram professionnelle.\n\n` +
            `<b>Choisissez une option :</b>`,
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚀 Pack Complet — 1 200€',  web_app: { url: `${APP_URL}/pack` } }],
              [{ text: '📂 Voir nos réalisations',   web_app: { url: `${APP_URL}/portfolio` } }],
              [{ text: '💼 Commencer mon projet',    web_app: { url: `${APP_URL}/contact` } }],
              [{ text: '📞 Nous contacter',          url: 'https://t.me/ApplyJarvis' }],
            ],
          },
        })
        break

      case '/pack':
        await tg('sendMessage', {
          chat_id:    chatId,
          parse_mode: 'HTML',
          text:
            `🚀 <b>Pack Complet Telegram</b>\n\n` +
            `✅ Mini-App Telegram personnalisée\n` +
            `✅ Bot Telegram intelligent\n` +
            `✅ Panel Admin complet\n` +
            `✅ Installation & mise en ligne\n` +
            `✅ Formation rapide\n\n` +
            `💰 <b>Prix : 1 200€</b>\n` +
            `🌐 Hébergement : 15€/mois\n` +
            `🛠 Maintenance : 50€/mois (optionnel)\n\n` +
            `⏳ <b>Livraison : 48h à 72h</b>`,
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚀 Commencer mon projet', web_app: { url: `${APP_URL}/contact` } }],
              [{ text: '📂 Voir les réalisations', web_app: { url: `${APP_URL}/portfolio` } }],
            ],
          },
        })
        break

      case '/portfolio':
        await tg('sendMessage', {
          chat_id:    chatId,
          parse_mode: 'HTML',
          text: '📂 <b>Nos réalisations</b>\n\nDécouvrez nos projets livrés, dont <b>Exoticz CBD</b> — boutique e-commerce complète sur Telegram.',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📂 Voir le portfolio', web_app: { url: `${APP_URL}/portfolio` } }],
            ],
          },
        })
        break

      case '/devis':
      case '/contact':
        await tg('sendMessage', {
          chat_id:    chatId,
          parse_mode: 'HTML',
          text: '💼 <b>Commencer mon projet</b>\n\nDevis gratuit · Réponse en 24h · Sans engagement.',
          reply_markup: {
            inline_keyboard: [
              [{ text: '💼 Remplir le formulaire', web_app: { url: `${APP_URL}/contact` } }],
            ],
          },
        })
        break

      case '/admin': {
        if (!ADMIN_ID) { console.error('[BOT /admin] ADMIN_TELEGRAM_ID non configuré !'); break }
        if (userId !== ADMIN_ID) {
          await tg('sendMessage', { chat_id: chatId, text: 'Accès refusé.' })
          break
        }
        await tg('sendMessage', {
          chat_id:    chatId,
          parse_mode: 'HTML',
          text: '⚙️ <b>Dashboard JARVIS</b>\n\nBienvenue dans votre espace admin.',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📊 Dashboard',     web_app: { url: `${APP_URL}/dashboard` } }],
              [{ text: '🎯 CRM Prospects', web_app: { url: `${APP_URL}/crm` } }],
            ],
          },
        })
        break
      }

      default: break
    }
  }

  // ── Callbacks ─────────────────────────────────────────────────────────────
  if (update.callback_query) {
    const cq     = update.callback_query
    const data   = cq.data as string
    let answered = false

    // Accepter un projet
    const acceptId = parseCallback(data, 'accept_')
    if (acceptId) {
      await fetch(`${APP_URL}/api/prospects`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: acceptId, status: 'ACCEPTE' }),
      }).catch(() => {})
      await tg('answerCallbackQuery', { callback_query_id: cq.id, text: '✅ Projet accepté !' })
      answered = true
    }

    // Refuser un projet
    const refuseId = parseCallback(data, 'refuse_')
    if (refuseId) {
      await fetch(`${APP_URL}/api/prospects`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: refuseId, status: 'REFUSE' }),
      }).catch(() => {})
      await tg('answerCallbackQuery', { callback_query_id: cq.id, text: '❌ Projet refusé' })
      answered = true
    }

    // Relance faite
    const relanceId = parseCallback(data, 'relance_done_')
    if (relanceId) {
      await fetch(`${APP_URL}/api/prospects`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: relanceId, status: 'CONTACTE', note: 'Relance effectuée' }),
      }).catch(() => {})
      await tg('answerCallbackQuery', { callback_query_id: cq.id, text: '✅ Relance marquée' })
      answered = true
    }

    if (!answered) {
      await tg('answerCallbackQuery', { callback_query_id: cq.id }).catch(() => {})
    }
  }

  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ status: '✅ Apply Business Bot actif', ts: new Date().toISOString() })
}
