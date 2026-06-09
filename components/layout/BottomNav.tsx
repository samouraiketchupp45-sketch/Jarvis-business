'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const NAV = [
  { href: '/',          emoji: '🏠', label: 'Accueil' },
  { href: '/portfolio', emoji: '🏆', label: 'Réalisations' },
  { href: '/contact',   emoji: '🚀', label: 'Projet' },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(2,6,23,0.92)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {NAV.map(item => {
          const active = item.href === '/' ? path === '/' : path.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center gap-0.5 px-4 py-1 relative">
              {/* Glow active */}
              {active && (
                <motion.div layoutId="nav-glow"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
              )}
              <motion.span
                animate={{ scale: active ? 1.15 : 1, opacity: active ? 1 : 0.45 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="text-xl relative z-10">
                {item.emoji}
              </motion.span>
              <span className="text-[9px] font-semibold relative z-10 transition-colors"
                style={{ color: active ? '#60a5fa' : 'rgba(255,255,255,0.35)' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* Safe area */}
      <div style={{ height: 'env(safe-area-inset-bottom)' }} />
    </nav>
  )
}
