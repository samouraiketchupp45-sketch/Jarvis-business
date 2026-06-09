const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''
const ADMIN_ID  = (process.env.ADMIN_TELEGRAM_ID ?? '').trim()
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

// ── Notification admin — nouveau projet ───────────────────────────────────────
export async function notifyNewProspect(p: {
  id:                  string
  activity:            string
  project_description: string
  telegram:            string
  features?:           string | null
  wants_maintenance:   boolean
}) {
  if (!ADMIN_ID) return
  const maintenance = p.wants_maintenance ? '✅ Oui — 50€/mois' : 'Non'
  const features    = p.features ? p.features : 'Aucune spécifiée'

  await tg('sendMessage', {
    chat_id:    Number(ADMIN_ID),
    parse_mode: 'HTML',
    text:
      `🔥 <b>Nouveau projet !</b>\n\n` +
      `🏢 <b>Activité :</b>\n${p.activity}\n\n` +
      `📝 <b>Projet :</b>\n${p.project_description}\n\n` +
      `📱 <b>@ Telegram :</b>\n${p.telegram}\n\n` +
      `⚡ <b>Fonctionnalités :</b>\n${features}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>Pack demandé :</b> Pack Complet — 1 200€\n` +
      `🌐 <b>Hébergement :</b> 15€/mois\n` +
      `🛠 <b>Maintenance :</b> ${maintenance}`,
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Accepter',          callback_data: `accept_${p.id}` },
          { text: '❌ Refuser',           callback_data: `refuse_${p.id}` },
        ],
        [
          { text: '💬 Contacter le client', url: `https://t.me/${p.telegram.replace('@', '')}` },
        ],
        [
          { text: '📊 Voir le CRM', web_app: { url: `${APP_URL}/crm` } },
        ],
      ],
    },
  })
}

// ── Notification client — projet accepté ──────────────────────────────────────
export async function notifyClientAccepted(telegramUsername: string) {
  // On ne peut pas envoyer un message direct sans avoir le chat_id
  // On utilise un lien t.me pour que l'admin contacte manuellement
  // (le client initie la conversation d'abord via le bot)
  console.log(`[TG] Client à contacter : ${telegramUsername}`)
}

// ── Rappel relance ────────────────────────────────────────────────────────────
export async function sendRelanceReminder(p: { telegram: string; activity: string; id: string }) {
  if (!ADMIN_ID) return
  await tg('sendMessage', {
    chat_id:    Number(ADMIN_ID),
    parse_mode: 'HTML',
    text: `🔔 <b>Relance à faire !</b>\n\n🏢 ${p.activity}\n📱 ${p.telegram}\n\nIl est temps de les recontacter.`,
    reply_markup: {
      inline_keyboard: [
        [{ text: '📋 Voir le CRM',      web_app: { url: `${APP_URL}/crm` } }],
        [{ text: '💬 Contacter',        url: `https://t.me/${p.telegram.replace('@', '')}` }],
        [{ text: '✅ Relance faite',    callback_data: `relance_done_${p.id}` }],
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
      { command: 'start',     description: '👋 Accueil' },
      { command: 'pack',      description: '🚀 Pack Complet — 1 200€' },
      { command: 'portfolio', description: '📂 Nos réalisations' },
      { command: 'devis',     description: '💼 Démarrer mon projet' },
      { command: 'admin',     description: '⚙️ Dashboard admin' },
    ],
  })
}
