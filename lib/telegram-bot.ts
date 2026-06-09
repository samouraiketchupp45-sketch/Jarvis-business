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
  tg_user?:            { id?: number; username?: string; first_name?: string; last_name?: string } | null
  notes?:              any[]
}) {
  if (!ADMIN_ID) return

  const tg_u = p.tg_user
  const hasUsername = Boolean(tg_u?.username)

  // Ligne identité du client
  let identityLine = ''
  if (tg_u) {
    const fullName = [tg_u.first_name, tg_u.last_name].filter(Boolean).join(' ')
    if (hasUsername) {
      identityLine = `@${tg_u.username}`
      if (fullName) identityLine += ` (${fullName})`
      if (tg_u.id) identityLine += ` — ID: <code>${tg_u.id}</code>`
    } else {
      identityLine = fullName || 'Inconnu'
      if (tg_u.id) identityLine += ` — ID: <code>${tg_u.id}</code>`
      identityLine += '\n⚠️ Pas de @ public'
    }
  } else {
    identityLine = p.telegram || 'Non renseigné'
  }

  const buttons: any[][] = [
    [
      { text: '✅ Accepter', callback_data: `accept_${p.id}` },
      { text: '❌ Refuser',  callback_data: `refuse_${p.id}` },
    ],
  ]

  if (hasUsername) {
    buttons.push([{ text: `💬 Contacter @${tg_u!.username}`, url: `https://t.me/${tg_u!.username}` }])
  }

  buttons.push([{ text: '📊 Voir le CRM', web_app: { url: `${APP_URL}/crm` } }])

  const optNote = (p.notes ?? []).find((n: any) => n.type === 'options')
  const wantsHosting     = optNote?.hosting     ?? p.wants_maintenance ?? false
  const wantsMaintenance = optNote?.maintenance ?? p.wants_maintenance ?? false

  const optLines: string[] = [`🚀 Pack Complet — <b>1 200€</b>`]
  if (wantsHosting)     optLines.push(`🌐 Hébergement — <b>+15€/mois</b>`)
  if (wantsMaintenance) optLines.push(`🛠 Maintenance  — <b>+50€/mois</b>`)
  if (!wantsHosting && !wantsMaintenance) optLines.push(`(aucune option mensuelle)`)

  await tg('sendMessage', {
    chat_id:    Number(ADMIN_ID),
    parse_mode: 'HTML',
    text:
      `🔥 <b>Nouvelle demande !</b>\n\n` +
      `👤 <b>Client :</b>\n${identityLine}\n\n` +
      `📝 <b>Projet :</b>\n${p.project_description}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      optLines.join('\n') + `\n` +
      `⏱ Livraison 48h à 7 jours`,
    reply_markup: { inline_keyboard: buttons },
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
