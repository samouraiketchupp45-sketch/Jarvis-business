'use client'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const MINI_APP = [
  'Catalogue / Boutique sur mesure',
  'Système de commandes & panier',
  'Photos et vidéos produits',
  'Suivi des livraisons en temps réel',
  'SAV intégré avec tickets',
]

const BOT = [
  'Notifications automatiques (commandes, livraisons)',
  'Gestion des commandes via Telegram',
  'Automatisations sur mesure',
]

const ADMIN = [
  'Gestion des commandes',
  'Gestion des produits',
  'Gestion des clients',
  'Gestion des livreurs',
  'Statistiques & rapports',
]

const MENSUEL = [
  { icon: '🌐', label: 'Hébergement', price: '15€/mois', items: ['Mini-App en ligne', 'Base de données Supabase', 'Bot Telegram actif', 'Surveillance des services', 'Mises à jour techniques'], required: true },
  { icon: '🛠', label: 'Maintenance', price: '50€/mois', items: ['Corrections de bugs', 'Mises à jour mineures', 'Assistance technique', 'Petites modifications', 'Support prioritaire'], required: false },
]

export default function PackPage() {
  return (
    <div className="pb-28 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3"
        style={{ background: 'rgba(2,10,24,.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,207,255,.1)' }}>
        <div className="flex items-center gap-3">
          <Link href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
            <ChevronLeft size={18} className="text-white/70" />
          </Link>
          <div>
            <h1 className="section-title text-lg">Pack Complet</h1>
            <p className="text-[11px] text-white/35">Tout inclus · Clé en main</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">

        {/* Prix hero */}
        <div className="card p-6 text-center"
          style={{ background: 'rgba(0,207,255,.06)', border: '1px solid rgba(0,207,255,.35)' }}>
          <p className="text-5xl font-black text-white mb-2">1 200€</p>
          <p className="text-sm font-bold text-white/60 mb-1">Pack Complet Telegram</p>
          <p className="text-xs text-white/35">Livraison 48h à 72h · Formation incluse</p>
        </div>

        {/* Mini-App */}
        <div>
          <p className="label mb-3">📱 Mini-App Telegram personnalisée</p>
          <div className="card p-4 space-y-2.5">
            {MINI_APP.map(f => (
              <div key={f} className="flex items-start gap-2.5">
                <span className="text-cyan-400 flex-shrink-0 text-sm font-black mt-0.5">✓</span>
                <span className="text-sm text-white/70">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bot */}
        <div>
          <p className="label mb-3">🤖 Bot Telegram intelligent</p>
          <div className="card p-4 space-y-2.5">
            {BOT.map(f => (
              <div key={f} className="flex items-start gap-2.5">
                <span className="text-cyan-400 flex-shrink-0 text-sm font-black mt-0.5">✓</span>
                <span className="text-sm text-white/70">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Admin */}
        <div>
          <p className="label mb-3">⚙️ Panel Admin complet</p>
          <div className="card p-4 space-y-2.5">
            {ADMIN.map(f => (
              <div key={f} className="flex items-start gap-2.5">
                <span className="text-cyan-400 flex-shrink-0 text-sm font-black mt-0.5">✓</span>
                <span className="text-sm text-white/70">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mensuel */}
        <div>
          <p className="label mb-3">💳 Abonnements mensuels</p>
          <div className="space-y-3">
            {MENSUEL.map(m => (
              <div key={m.label} className="card p-4"
                style={m.required ? { border: '1px solid rgba(0,207,255,.25)' } : { border: '1px solid rgba(255,255,255,.08)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <span className="font-bold text-white text-sm">{m.label}</span>
                      {m.required
                        ? <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,207,255,.1)', color: '#00cfff' }}>REQUIS</span>
                        : <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.4)' }}>OPTIONNEL</span>
                      }
                    </div>
                  </div>
                  <span className="font-black text-lg" style={{ color: m.required ? '#00cfff' : '#ffd700' }}>{m.price}</span>
                </div>
                <div className="space-y-1.5">
                  {m.items.map(i => (
                    <p key={i} className="text-xs text-white/50 flex items-center gap-2">
                      <span style={{ color: m.required ? '#00cfff' : '#ffd700' }}>·</span> {i}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="card p-4" style={{ background: 'rgba(0,255,136,.04)', border: '1px solid rgba(0,255,136,.15)' }}>
          <p className="text-xs font-bold text-green-400 mb-3 uppercase tracking-widest">Résumé des coûts</p>
          <div className="space-y-2">
            {[
              { l: '🚀 Pack Complet',    v: '1 200€',   sub: 'paiement unique' },
              { l: '🌐 Hébergement',     v: '15€/mois', sub: 'obligatoire' },
              { l: '🛠 Maintenance',     v: '50€/mois', sub: 'optionnel' },
            ].map(r => (
              <div key={r.l} className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-white/70">{r.l}</span>
                  <span className="text-[10px] text-white/30 ml-2">{r.sub}</span>
                </div>
                <span className="text-sm font-black text-white">{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3 pb-4">
          <Link href="/contact">
            <button className="btn-primary w-full justify-center text-base py-4">
              🚀 Commencer mon projet
            </button>
          </Link>
          <Link href="/portfolio">
            <button className="btn-secondary w-full justify-center">
              📂 Voir nos réalisations
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}
