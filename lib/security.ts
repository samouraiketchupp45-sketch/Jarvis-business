import { createHmac, timingSafeEqual } from 'crypto'

const SECRET = process.env.SESSION_SECRET ?? 'jarvis-secret'

export function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig  = createHmac('sha256', SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [data, sig] = token.split('.')
    const expected = createHmac('sha256', SECRET).update(data).digest('base64url')
    const a = Buffer.from(sig, 'base64url')
    const b = Buffer.from(expected, 'base64url')
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    return JSON.parse(Buffer.from(data, 'base64url').toString())
  } catch { return null }
}

export function isAdminRequest(req: Request): boolean {
  const cookie = req.headers.get('cookie') ?? ''
  const token  = cookie.split(';').find(c => c.trim().startsWith('jrv_sess='))?.split('=')[1]
  if (!token) return process.env.NODE_ENV === 'development'
  return verifyToken(token) !== null
}
