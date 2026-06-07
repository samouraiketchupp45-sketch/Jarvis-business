const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''
const ADMIN_ID  = process.env.ADMIN_TELEGRAM_ID   ?? ''
const APP_URL   = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://jarvis-business.vercel.app').replace(/\/$/, '')

export async function tg(method: string, body: Record<string, unknown>) {
  if (!BOT_TOKEN) return { ok: false }
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!data.ok) console.error(`[TG] ${method}:`, JSON.stringify(data))
    return data
  } catch (e) {
    console.error(`[TG] ${method} exception:`, e)
    return { ok: false }
  }
}

// ── Notifier admin d'un nouveau prospect ──────────────────────────────────────
export async function notifyNewProspect(p: {
  name: string; company: string; sector: string; message: string; id: string
}) {
  if (!ADMIN_ID) return
  await tg('sendMessage', {
    chat_id: Number(ADMIN_ID),
    text: `🎯 <b>Nouveau prospect !</b>\n\n🏢 ${p.company}\n👤 ${p.name}\n📂 Secteur : ${p.sector}\n💬 "${p.message}"`,
    parse_mode: 'HTML',
    disable_notification: false,
    reply_markup: {
      inline_keyboard: [
        [{ text: '👁 Voir le prospect', web_app: { url: `${APP_URL}/crm` } }],
        [
          { text: '✅ Qualifié',  callback_data: `prospect_qualifie_${p.id}` },
          { text: '❌ Non qualifié', callback_data: `prospect_nok_${p.id}` },
        ],
      ],
    },
  })
}

// ── Notifier admin d'une demande de devis ────────────────────────────────────
export async function notifyDevisRequest(d: {
  name: string; company: string; service: string; budget: string; id: string
}) {
  if (!ADMIN_ID) return
  await tg('sendMessage', {
    chat_id: Number(ADMIN_ID),
    text: `💼 <b>Demande de devis !</b>\n\n🏢 ${d.company}\n👤 ${d.name}\n🛠 Service : ${d.service}\n💰 Budget : ${d.budget}`,
    parse_mode: 'HTML',
    disable_notification: false,
    reply_markup: {
      inline_keyboard: [
        [{ text: '📄 Voir & générer le devis', web_app: { url: `${APP_URL}/devis` } }],
      ],
    },
  })
}

// ── Envoyer rappel relance ────────────────────────────────────────────────────
export async function sendRelanceReminder(p: { name: string; company: string; id: string }) {
  if (!ADMIN_ID) return
  await tg('sendMessage', {
    chat_id: Number(ADMIN_ID),
    text: `🔔 <b>Relance à faire !</b>\n\n🏢 ${p.company} — ${p.name}\nIl est temps de les recontacter.`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '📋 Voir le CRM', web_app: { url: `${APP_URL}/crm` } }],
        [{ text: '✅ Relance faite', callback_data: `relance_done_${p.id}` }],
      ],
    },
  })
}

export async function setWebhook(url: string) {
  return tg('setWebhook', { url, allowed_updates: ['message', 'callback_query'], drop_pending_updates: true })
}

export async function setCommands() {
  return tg('setMyCommands', {
    commands: [
      { command: 'start',     description: '🚀 Découvrir JARVIS BUSINESS' },
      { command: 'services',  description: '🛠 Voir tous les services' },
      { command: 'portfolio', description: '🏆 Voir les réalisations' },
      { command: 'devis',     description: '💼 Demander un devis' },
      { command: 'contact',   description: '📩 Nous contacter' },
    ],
  })
}
