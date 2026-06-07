'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',          icon: '🏠', label: 'Accueil' },
  { href: '/portfolio', icon: '🏆', label: 'Réalisations' },
  { href: '/contact',   icon: '💼', label: 'Devis' },
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{ background: 'rgba(2,10,24,0.95)', backdropFilter: 'blur(20px)', borderColor: 'rgba(0,207,255,0.1)' }}>
      <div className="flex justify-around items-center px-2 py-2 max-w-lg mx-auto">
        {NAV.map(item => {
          const active = path === item.href
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative">
              <span className={`text-2xl transition-transform ${active ? 'scale-110' : 'scale-100 opacity-50'}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium ${active ? 'text-cyan-400' : 'text-white/40'}`}>
                {item.label}
              </span>
              {active && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
