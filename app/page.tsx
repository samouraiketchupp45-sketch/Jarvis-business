'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const SERVICES = [
  { icon: '🤖', title: 'Bot Telegram',       desc: 'Automatisation, réservations, commandes, SAV', price: 'à partir de 500€', color: '#00cfff' },
  { icon: '📱', title: 'Mini-App Telegram',   desc: 'Boutique, catalogue, commandes intégrées', price: 'à partir de 800€', color: '#ffd700' },
  { icon: '⚙️', title: 'Panel Admin',         desc: 'Dashboard complet pour gérer votre activité', price: 'inclus', color: '#00ff88' },
  { icon: '🧠', title: 'Automatisation IA',   desc: 'Workflows intelligents, réponses automatiques', price: 'à partir de 300€', color: '#cc88ff' },
  { icon: '📦', title: 'Système de commandes',desc: 'Panier, paiement, suivi livraison', price: 'à partir de 600€', color: '#ff8855' },
  { icon: '📅', title: 'Réservation',         desc: 'Agenda, créneaux, confirmation automatique', price: 'à partir de 400€', color: '#ff6ba8' },
]

const STATS = [
  { value: '10+', label: 'Projets livrés' },
  { value: '48h', label: 'Délai moyen' },
  { value: '100%', label: 'Satisfaction' },
  { value: '24/7', label: 'Support' },
]

export default function HomePage() {
  const [tgReady, setTgReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp
      tg.ready()
      tg.expand()
      setTgReady(true)
    }
  }, [])

  return (
    <div className="min-h-screen pb-8" style={{ background: 'linear-gradient(180deg, #020a18 0%, #050f24 100%)' }}>

      {/* Hero */}
      <div className="relative overflow-hidden px-5 pt-10 pb-8 text-center">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,207,255,0.15), transparent)',
        }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold mb-4"
            style={{ background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.25)', color: '#00cfff' }}>
            🤖 Propulsé par IA · Telegram Native
          </div>
          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            JARVIS<br />
            <span style={{ background: 'linear-gradient(135deg,#00cfff,#ffd700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              BUSINESS
            </span>
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto mb-6">
            Mini-Apps Telegram, Bots & Automatisations IA.<br />
            Votre business digitalisé en 48h.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/contact">
              <button className="btn-primary text-sm">
                💼 Demander un devis
              </button>
            </Link>
            <Link href="/portfolio">
              <button className="btn-secondary text-sm">
                🏆 Voir les réalisations
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-8">
        <div className="grid grid-cols-4 gap-2">
          {STATS.map(s => (
            <div key={s.label} className="card text-center py-3 px-1">
              <p className="text-lg font-black neon-cyan">{s.value}</p>
              <p className="text-[10px] text-white/40 leading-tight mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="px-5 mb-8">
        <h2 className="section-title mb-4">Nos services</h2>
        <div className="space-y-3">
          {SERVICES.map(s => (
            <div key={s.title} className="card p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl flex-shrink-0 text-2xl"
                style={{ background: `${s.color}12`, border: `1px solid ${s.color}30` }}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-sm text-white">{s.title}</p>
                  <span className="text-[11px] font-bold flex-shrink-0" style={{ color: s.color }}>{s.price}</span>
                </div>
                <p className="text-xs text-white/40 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Abonnements */}
      <div className="px-5 mb-8">
        <h2 className="section-title mb-4">Abonnements mensuels</h2>
        <div className="space-y-3">
          {[
            { name: 'Starter',     price: '20€/mois', features: ['Hébergement', 'Mises à jour', 'Support email'], color: '#00cfff' },
            { name: 'Pro',         price: '50€/mois', features: ['Tout Starter', 'Nouvelles fonctionnalités', 'Support prioritaire', 'Statistiques avancées'], color: '#ffd700' },
            { name: 'Enterprise',  price: '100€/mois', features: ['Tout Pro', 'Développement sur mesure', 'Support 24/7', 'SLA garanti'], color: '#cc88ff' },
          ].map(plan => (
            <div key={plan.name} className="card p-4"
              style={{ border: `1px solid ${plan.color}25` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-black text-white">{plan.name}</p>
                <span className="font-black text-lg" style={{ color: plan.color }}>{plan.price}</span>
              </div>
              <div className="space-y-1">
                {plan.features.map(f => (
                  <p key={f} className="text-xs text-white/50 flex items-center gap-2">
                    <span style={{ color: plan.color }}>✓</span> {f}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5">
        <div className="card p-6 text-center" style={{ background: 'rgba(0,207,255,0.05)', border: '1px solid rgba(0,207,255,0.2)' }}>
          <p className="text-2xl mb-2">🚀</p>
          <p className="font-black text-white text-lg mb-1">Prêt à digitaliser votre business ?</p>
          <p className="text-sm text-white/40 mb-4">Devis gratuit en 24h · Sans engagement</p>
          <Link href="/contact">
            <button className="btn-primary w-full justify-center">
              Obtenir mon devis gratuit
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
