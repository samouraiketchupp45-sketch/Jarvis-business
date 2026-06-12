import { createHmac, timingSafeEqual, createHash } from 'crypto'
import { NextResponse } from 'next/server'

const IS_PROD = process.env.NODE_ENV === 'production'

// ── Comparaison constante (length-safe) ──────────────────────────────────────
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

// ── Session HMAC (fail-closed en production, résolu paresseusement) ───────────
// Résolution à l'exécution (pas à l'import) pour ne pas casser `next build`.
function sessionSecret(): string {
  const s = process.env.SESSION_SECRET ?? process.env.WEBHOOK_SECRET
  if (!s) {
    if (IS_PROD) throw new Error('SESSION_SECRET (ou WEBHOOK_SECRET) requis en production')
    return 'dev-only-insecure-secret'
  }
  return s
}

export function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64url')
  const sig  = createHmac('sha256', sessionSecret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [data, sig] = token.split('.')
    if (!data || !sig) return null
    const expected = createHmac('sha256', sessionSecret()).update(data).digest('base64url')
    const a = Buffer.from(sig, 'base64url')
    const b = Buffer.from(expected, 'base64url')
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (typeof payload.iat === 'number' && Date.now() - payload.iat > 24 * 60 * 60 * 1000) return null
    return payload
  } catch { return null }
}

// ── Vérification de l'initData Telegram (signature serveur) ───────────────────
export interface TgUser { id: number; username?: string; first_name?: string; last_name?: string }

export function verifyTelegramInitData(initData: string): { valid: boolean; user?: TgUser } {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return { valid: !IS_PROD } // fail-closed en prod
  if (!initData) return { valid: false }

  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash) return { valid: false }
    params.delete('hash')

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n')

    const secretKey = createHmac('sha256', 'WebAppData').update(token).digest()
    const computed  = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
    if (!safeEqual(computed, hash)) return { valid: false }

    const authDate = parseInt(params.get('auth_date') ?? '0', 10)
    if (!authDate || Date.now() / 1000 - authDate > 3600) return { valid: false }

    const userStr = params.get('user')
    const user = userStr ? (JSON.parse(userStr) as TgUser) : undefined
    return { valid: true, user }
  } catch {
    return { valid: false }
  }
}

export const INIT_DATA_HEADER = 'x-telegram-init-data'

/**
 * Garde admin : exige un initData Telegram signé dont l'utilisateur est
 * l'administrateur (ADMIN_TELEGRAM_ID). L'identité provient de la signature,
 * jamais d'un id fourni en clair par le client.
 */
export function requireAdmin(req: Request):
  | { ok: true; user?: TgUser }
  | { ok: false; response: NextResponse } {
  const adminId = (process.env.ADMIN_TELEGRAM_ID ?? '').trim()
  if (!adminId) {
    if (IS_PROD) return { ok: false, response: NextResponse.json({ error: 'Admin non configuré' }, { status: 500 }) }
    return { ok: true } // dev local uniquement
  }

  const v = verifyTelegramInitData(req.headers.get(INIT_DATA_HEADER) ?? '')
  if (!v.valid || !v.user) {
    return { ok: false, response: NextResponse.json({ error: 'Authentification requise' }, { status: 401 }) }
  }
  if (String(v.user.id) !== adminId) {
    return { ok: false, response: NextResponse.json({ error: 'Accès refusé' }, { status: 403 }) }
  }
  return { ok: true, user: v.user }
}

/**
 * Auth pour les routes d'exploitation (setup-webhook, migrate, init-db, setup).
 * Accepte SOIT l'admin via initData Telegram, SOIT un paramètre ?secret=WEBHOOK_SECRET
 * (secret fort) — utilisable depuis un navigateur pour le bootstrap.
 */
export function requireSetupAuth(req: Request):
  | { ok: true }
  | { ok: false; response: NextResponse } {
  const secret = process.env.WEBHOOK_SECRET
  if (secret) {
    const url = new URL(req.url)
    const provided = url.searchParams.get('secret') ?? ''
    if (provided && safeEqual(provided, secret)) return { ok: true }
  }
  const admin = requireAdmin(req)
  if (admin.ok) return { ok: true }
  return { ok: false, response: admin.response }
}

// ── Validation du webhook Telegram (secret token) ────────────────────────────
export function verifyWebhookSecret(req: Request): boolean {
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) return !IS_PROD // fail-closed en prod
  const provided = req.headers.get('x-telegram-bot-api-secret-token') ?? ''
  return !!provided && safeEqual(provided, secret)
}

// ── Rate limiting (en mémoire, par instance) ─────────────────────────────────
interface RLEntry { count: number; resetAt: number }
const rlStore = new Map<string, RLEntry>()

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const e = rlStore.get(key)
  if (!e || now > e.resetAt) {
    rlStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (e.count >= limit) return false
  e.count++
  return true
}

export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '0.0.0.0'
  )
}

// ── Sanitisation d'entrée (anti-XSS stocké) ──────────────────────────────────
export function sanitizeText(input: unknown, maxLen = 2000): string {
  if (typeof input !== 'string') return ''
  // retire les balises HTML et tronque
  return input.replace(/<[^>]*>/g, '').trim().slice(0, maxLen)
}
