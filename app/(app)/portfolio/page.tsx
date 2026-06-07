'use client'

const PROJECTS = [
  {
    name: 'Exoticz CBD',
    category: 'E-commerce Telegram',
    description: 'Boutique CBD complète sur Telegram. Mini-App avec catalogue produits, système de commandes, panel admin, programme de fidélité avec roulette, SAV intégré et système de livraison avec livreurs.',
    features: [
      '🛍️ Boutique avec catalogue & variantes',
      '🛒 Panier & checkout avec adresse livraison',
      '👑 Système de fidélité (points, niveaux, roulette)',
      '⚙️ Panel admin complet (commandes, clients, produits)',
      '🎧 SAV avec tickets & notifications Telegram',
      '🛵 Système livreurs avec bot commandes',
      '🤖 Notifications Telegram temps réel',
    ],
    tech: ['Next.js 14', 'Supabase', 'Vercel', 'Telegram Bot API'],
    status: 'En production',
    duration: '2 semaines',
    price: '1200€',
    color: '#ff1a6e',
    emoji: '🌴',
    highlight: true,
  },
  {
    name: 'ApplyBot — Réservation',
    category: 'Système de réservation',
    description: 'Bot Telegram de prise de rendez-vous automatique avec gestion de créneaux, confirmation, rappels et panel admin.',
    features: [
      '📅 Gestion de créneaux horaires',
      '✅ Confirmation automatique',
      '🔔 Rappels 24h avant',
      '⚙️ Panel admin calendrier',
    ],
    tech: ['Next.js', 'Supabase', 'Telegram Bot'],
    status: 'Template disponible',
    duration: '1 semaine',
    price: '600€',
    color: '#00cfff',
    emoji: '📅',
    highlight: false,
  },
  {
    name: 'CatalogBot',
    category: 'Catalogue Telegram',
    description: 'Mini-App catalogue produits avec recherche, filtres, fiches détaillées et formulaire de commande.',
    features: [
      '📦 Catalogue avec photos & descriptions',
      '🔍 Recherche et filtres',
      '📋 Formulaire de commande',
      '📊 Statistiques produits',
    ],
    tech: ['Next.js', 'Supabase', 'Telegram Mini App'],
    status: 'Template disponible',
    duration: '5 jours',
    price: '500€',
    color: '#ffd700',
    emoji: '📦',
    highlight: false,
  },
]

export default function PortfolioPage() {
  return (
    <div className="pb-28 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3"
        style={{ background: 'rgba(2,10,24,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,207,255,0.1)' }}>
        <h1 className="section-title text-lg">Nos Réalisations</h1>
        <p className="text-xs text-white/40 mt-0.5">Projets livrés & templates disponibles</p>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {PROJECTS.map(p => (
          <div key={p.name} className="rounded-2xl overflow-hidden"
            style={{
              border: `1px solid ${p.color}${p.highlight ? '40' : '20'}`,
              background: p.highlight ? `${p.color}06` : 'rgba(255,255,255,0.02)',
            }}>
            {/* Banner */}
            <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}44)` }} />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{p.emoji}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-white">{p.name}</p>
                      {p.highlight && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                          style={{ background: `${p.color}20`, color: p.color }}>
                          ⭐ FEATURED
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold mt-0.5" style={{ color: p.color }}>{p.category}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>
                  {p.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-white/50 leading-relaxed mb-4">{p.description}</p>

              {/* Features */}
              <div className="space-y-1.5 mb-4">
                {p.features.map(f => (
                  <p key={f} className="text-xs text-white/60 flex items-start gap-1.5">
                    <span>{f}</span>
                  </p>
                ))}
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tech.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl p-2.5 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Délai</p>
                  <p className="text-sm font-black text-white mt-0.5">{p.duration}</p>
                </div>
                <div className="rounded-xl p-2.5 text-center"
                  style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Tarif</p>
                  <p className="text-sm font-black mt-0.5" style={{ color: p.color }}>{p.price}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="card p-5 text-center" style={{ background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.15)' }}>
          <p className="font-black text-white mb-1">Vous avez un projet similaire ?</p>
          <p className="text-xs text-white/40 mb-3">Devis gratuit — réponse en 24h</p>
          <a href="/contact">
            <button className="btn-primary w-full justify-center text-sm">
              💼 Demander un devis
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
