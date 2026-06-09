'use client'
import { useEffect, useState } from 'react'

const ADMIN_ID = '6186178719'

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      const userId = String(tg.initDataUnsafe?.user?.id ?? '')
      setAllowed(userId === ADMIN_ID)
    } else {
      setAllowed(process.env.NODE_ENV === 'development')
    }
  }, [])

  if (allowed === null) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#020a18' }}>
      <div className="h-6 w-6 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
    </div>
  )

  if (!allowed) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: '#020a18' }}>
      <div className="text-5xl mb-4">🔒</div>
      <p className="text-lg font-black text-white mb-2">Accès refusé</p>
      <p className="text-sm text-white/40">Cette page est réservée à l'administrateur.</p>
    </div>
  )

  return <>{children}</>
}
