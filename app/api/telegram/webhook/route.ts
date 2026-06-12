import { NextRequest, NextResponse } from 'next/server'
import { tg, setCommands } from '@/lib/telegram-bot'
import { createServiceClient } from '@/lib/supabase'
import { verifyWebhookSecret } from '@/lib/security'

export const dynamic = 'force-dynamic'

const APP_URL  = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://jarvis-business.vercel.app').replace(/\/$/, '')
const ADMIN_ID = (process.env.ADMIN_TELEGRAM_ID ?? '').trim()

function parseCallback(data: string, prefix: string): string | null {
  if (!data.startsWith(prefix)) return null
  return data.slice(prefix.length)
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Mise à jour directe du statut d'un prospect (service role), sans repasser par
// l'API publique. Réservé aux appels webhook déjà authentifiés par le secret.
async function setProspectStatus(id: string, status: string, note?: string) {
  if (!UUID_RE.test(id)) return
  const sb = createServiceClient()
  if (!sb) return
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (note) {
    const { data: cur } = await sb.from('jrv_prospects').select('notes').eq('id', id).single()
    updates.notes = [ ...((cur?.notes ?? []) as any[]), { text: note, date: new Date().toISOString() } ]
  }
  await sb.from('jrv_prospects').update(updates).eq('id', id)
}

export async function POST(req: NextRequest) {
  // 🔒 Anti-spoofing : Telegram envoie le secret configuré via setWebhook
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

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
              [{ text: '📞 Nous contacter',          url: 'https://t.me/Applybots' }],
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
    // Les actions admin (accept/refuse/relance) ne sont déclenchables que par
    // l'administrateur — l'utilisateur du callback est vérifié.
    const fromId = String(cq.from?.id ?? '')
    const isAdminCallback = ADMIN_ID && fromId === ADMIN_ID

    const acceptId = parseCallback(data, 'accept_')
    if (acceptId) {
      if (isAdminCallback) await setProspectStatus(acceptId, 'ACCEPTE')
      await tg('answerCallbackQuery', { callback_query_id: cq.id, text: isAdminCallback ? '✅ Projet accepté !' : 'Accès refusé', show_alert: !isAdminCallback })
      answered = true
    }

    // Refuser un projet
    const refuseId = parseCallback(data, 'refuse_')
    if (refuseId) {
      if (isAdminCallback) await setProspectStatus(refuseId, 'REFUSE')
      await tg('answerCallbackQuery', { callback_query_id: cq.id, text: isAdminCallback ? '❌ Projet refusé' : 'Accès refusé', show_alert: !isAdminCallback })
      answered = true
    }

    // Relance faite
    const relanceId = parseCallback(data, 'relance_done_')
    if (relanceId) {
      if (isAdminCallback) await setProspectStatus(relanceId, 'CONTACTE', 'Relance effectuée')
      await tg('answerCallbackQuery', { callback_query_id: cq.id, text: isAdminCallback ? '✅ Relance marquée' : 'Accès refusé', show_alert: !isAdminCallback })
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
