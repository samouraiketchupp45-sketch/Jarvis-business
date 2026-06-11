'use client'

/**
 * fetch() pour les routes admin : injecte l'initData Telegram signé dans
 * l'en-tête X-Telegram-Init-Data. Le serveur vérifie la signature et que
 * l'utilisateur est bien l'administrateur — l'identité n'est jamais dérivée
 * d'une valeur en clair fournie par le client.
 */
export function adminFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const initData = (typeof window !== 'undefined'
    && (window as unknown as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp?.initData) || ''
  const headers = new Headers(init.headers)
  if (initData) headers.set('X-Telegram-Init-Data', initData)
  return fetch(input, { ...init, headers })
}
