'use client'
import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  NOUVEAU:  { label: 'Nouveau',  color: '#00cfff', emoji: '🆕' },
  CONTACTE: { label: 'Contacté', color: '#ffd700', emoji: '💬' },
  ACCEPTE:  { label: 'Accepté',  color: '#cc88ff', emoji: '✅' },
  EN_COURS: { label: 'En cours', color: '#ff8855', emoji: '🔨' },
  LIVRE:    { label: 'Livré',    color: '#00ff88', emoji: '🎉' },
  REFUSE:   { label: 'Refusé',   color: '#ff4455', emoji: '❌' },
}

type Tab = 'dashboard' | 'demandes' | 'projets' | 'clients' | 'hebergements' | 'stats'

export default function DashboardPage() {
  const [tab,       setTab]       = useState<Tab>('dashboard')
  const [stats,     setStats]     = useState<any>(null)
  const [prospects, setProspects] = useState<any[]>([])
  const [clients,   setClients]   = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, pRes, cRes] = await Promise.all([
        fetch('/api/prospects?stats=1'),
        fetch('/api/prospects'),
        fetch('/api/clients'),
      ])
      if (sRes.ok) setStats(await sRes.json())
      if (pRes.ok) setProspects(await pRes.json())
      if (cRes.ok) setClients(await cRes.json())
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const TABS: { key: Tab; icon: string; label: string }[] = [
    { key: 'dashboard',    icon: '📊', label: 'Vue d\'ensemble' },
    { key: 'demandes',     icon: '📥', label: 'Demandes' },
    { key: 'projets',      icon: '📦', label: 'Projets' },
    { key: 'clients',      icon: '👥', label: 'Clients' },
    { key: 'hebergements', icon: '🌐', label: 'Hébergements' },
    { key: 'stats',        icon: '📈', label: 'Statistiques' },
  ]

  const active      = prospects.filter(p => p.status === 'EN_COURS')
  const demandes    = prospects.filter(p => p.status === 'NOUVEAU')
  const hebergements = clients.filter(c => c.active)
  const maintenances = clients.filter(c => c.maintenance_active)
  const mrr = stats?.mrr ?? (hebergements.length * 15 + maintenances.length * 50)

  return (
    <div className="pb-28 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-0"
        style={{ background: 'rgba(2,10,24,.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,207,255,.1)' }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="section-title text-lg">Dashboard</h1>
          <button onClick={load} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,.05)' }}>
            <RefreshCw size={15} className={`text-white/50 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {/* Tabs scroll */}
        <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all"
              style={tab === t.key
                ? { background: '#00cfff', color: '#000' }
                : { background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.5)' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-5 w-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
        </div>
      )}

      {/* ── VUE D'ENSEMBLE ── */}
      {!loading && tab === 'dashboard' && (
        <div className="px-4 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📥', label: 'Nouvelles demandes', value: demandes.length,       color: '#00cfff', sub: `+${stats?.newThisWeek ?? 0} cette semaine` },
              { icon: '📦', label: 'Projets en cours',   value: active.length,         color: '#ff8855', sub: 'En développement' },
              { icon: '👥', label: 'Clients actifs',     value: hebergements.length,   color: '#ffd700', sub: `${maintenances.length} avec maintenance` },
              { icon: '💰', label: 'MRR',                value: `${mrr}€`,             color: '#00ff88', sub: 'Mensuel récurrent' },
            ].map(s => (
              <div key={s.label} className="card p-4">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs font-bold text-white/70 mt-0.5">{s.label}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Dernières demandes */}
          {demandes.length > 0 && (
            <div>
              <p className="label mb-2">📥 Demandes en attente</p>
              <div className="space-y-2">
                {demandes.slice(0, 5).map(p => {
                  const tgRaw = p.telegram ?? ''
                  const tgHandle = tgRaw.replace('@', '').trim()
                  const hasHandle = tgHandle && tgHandle !== 'Non renseigné' && !tgHandle.startsWith('ID:')
                  const tgUrl = hasHandle
                    ? `https://t.me/${tgHandle}`
                    : null
                  const displayTg = tgRaw.startsWith('@') ? tgRaw : tgRaw ? `@${tgHandle}` : '—'

                  return (
                    <div key={p.id} className="card p-3"
                      style={{ border: '1px solid rgba(0,207,255,.2)' }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{p.activity ?? 'Pack Complet 1200€'}</p>
                          <p className="text-xs font-mono mt-0.5"
                            style={{ color: hasHandle ? '#00cfff' : 'rgba(255,255,255,0.3)' }}>
                            {hasHandle ? displayTg : 'Telegram non renseigné'}
                          </p>
                        </div>
                        {tgUrl ? (
                          <a href={tgUrl} target="_blank" rel="noreferrer" className="flex-shrink-0">
                            <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold"
                              style={{ background: 'linear-gradient(135deg,rgba(0,207,255,.15),rgba(59,130,246,.15))', color: '#00cfff', border: '1px solid rgba(0,207,255,.35)' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.47l-2.967-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.537-.194 1.006.131.834.944z"/>
                              </svg>
                              Contacter
                            </button>
                          </a>
                        ) : (
                          <span className="text-[10px] text-white/20 flex-shrink-0">Pas de handle</span>
                        )}
                      </div>
                      {p.project_description && (
                        <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">
                          {p.project_description}
                        </p>
                      )}
                      <p className="text-[10px] text-white/20 mt-1.5">
                        {new Date(p.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pipeline */}
          <div>
            <p className="label mb-2">Pipeline de vente</p>
            <div className="space-y-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = prospects.filter(p => p.status === key).length
                const pct = prospects.length ? Math.round(count / prospects.length * 100) : 0
                return (
                  <div key={key} className="card p-3 flex items-center gap-3">
                    <span>{cfg.emoji}</span>
                    <span className="text-xs text-white/70 flex-1">{cfg.label}</span>
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.color }} />
                    </div>
                    <span className="text-xs font-bold text-white/50 w-4 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── DEMANDES ── */}
      {!loading && tab === 'demandes' && (
        <div className="px-4 pt-4 space-y-3">
          {prospects.filter(p => ['NOUVEAU','CONTACTE'].includes(p.status)).length === 0 ? (
            <p className="text-center py-10 text-white/30 text-sm">Aucune demande en attente</p>
          ) : prospects.filter(p => ['NOUVEAU','CONTACTE'].includes(p.status)).map(p => {
            const cfg = STATUS_CONFIG[p.status]
            return (
              <div key={p.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm text-white">{p.activity}</p>
                    <p className="text-xs text-cyan-400">{p.telegram}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-white/50 mb-3 line-clamp-2">{p.project_description}</p>
                <div className="flex gap-2">
                  <a href={`https://t.me/${p.telegram?.replace('@','')}`} target="_blank" rel="noreferrer" className="flex-1">
                    <button className="btn-primary w-full justify-center text-xs py-2">💬 Contacter</button>
                  </a>
                  {p.wants_maintenance && (
                    <span className="text-[10px] px-2 py-1.5 rounded-xl flex items-center font-bold"
                      style={{ background: 'rgba(255,215,0,.1)', color: '#ffd700' }}>🛠 Maint.</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── PROJETS EN COURS ── */}
      {!loading && tab === 'projets' && (
        <div className="px-4 pt-4 space-y-3">
          {prospects.filter(p => ['ACCEPTE','EN_COURS','LIVRE'].includes(p.status)).length === 0 ? (
            <p className="text-center py-10 text-white/30 text-sm">Aucun projet actif</p>
          ) : prospects.filter(p => ['ACCEPTE','EN_COURS','LIVRE'].includes(p.status)).map(p => {
            const cfg = STATUS_CONFIG[p.status]
            return (
              <div key={p.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-sm text-white">{p.activity}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-cyan-400 mb-1">{p.telegram}</p>
                <p className="text-xs text-white/40 mb-3 line-clamp-2">{p.project_description}</p>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span>🚀 1 200€</span>
                  <span>🌐 15€/mois</span>
                  {p.wants_maintenance && <span>🛠 50€/mois</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── CLIENTS ── */}
      {!loading && tab === 'clients' && (
        <div className="px-4 pt-4 space-y-3">
          {clients.length === 0 ? (
            <div className="text-center py-10 text-white/30 text-sm">
              Aucun client enregistré<br />
              <span className="text-xs">Les clients apparaissent quand un projet est livré.</span>
            </div>
          ) : clients.map(c => (
            <div key={c.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm text-white">{c.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.active ? 'text-green-400' : 'text-white/30'}`}
                  style={{ background: c.active ? 'rgba(0,255,136,.1)' : 'rgba(255,255,255,.05)' }}>
                  {c.active ? '🟢 Actif' : '⚫ Inactif'}
                </span>
              </div>
              {c.telegram && <p className="text-xs text-cyan-400 mb-2">{c.telegram}</p>}
              <div className="flex gap-3 text-xs text-white/50">
                <span>🌐 {c.active ? '15€/mois' : '—'}</span>
                {c.maintenance_active && <span>🛠 50€/mois</span>}
                <span>💰 {c.monthly_fee ?? 0}€/mois total</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HEBERGEMENTS ── */}
      {!loading && tab === 'hebergements' && (
        <div className="px-4 pt-4 space-y-3">
          {/* Récap */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-cyan-400">{hebergements.length}</p>
              <p className="text-xs text-white/50 mt-1">🌐 Hébergements actifs</p>
              <p className="text-xs text-white/30">× 15€/mois</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-yellow-400">{maintenances.length}</p>
              <p className="text-xs text-white/50 mt-1">🛠 Maintenances actives</p>
              <p className="text-xs text-white/30">× 50€/mois</p>
            </div>
          </div>
          <div className="card p-4 text-center"
            style={{ background: 'rgba(0,255,136,.05)', border: '1px solid rgba(0,255,136,.2)' }}>
            <p className="text-3xl font-black text-green-400">{mrr}€</p>
            <p className="text-sm text-white/50 mt-1">Revenu mensuel récurrent</p>
          </div>
          {clients.filter(c => c.active).map(c => (
            <div key={c.id} className="card p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{c.name}</p>
                <p className="text-xs text-cyan-400">{c.telegram}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-green-400">{c.monthly_fee ?? 0}€</p>
                <p className="text-[10px] text-white/30">par mois</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── STATISTIQUES ── */}
      {!loading && tab === 'stats' && (
        <div className="px-4 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total demandes', value: prospects.length,                                                  color: '#00cfff' },
              { label: 'Taux conversion', value: `${stats?.conversion ?? 0}%`,                                    color: '#cc88ff' },
              { label: 'Projets livrés',  value: prospects.filter(p => p.status === 'LIVRE').length,              color: '#00ff88' },
              { label: 'Avec maintenance', value: prospects.filter(p => p.wants_maintenance).length,              color: '#ffd700' },
              { label: 'MRR estimé',      value: `${mrr}€`,                                                       color: '#00ff88' },
              { label: 'Revenus proj.',   value: `${prospects.filter(p => ['ACCEPTE','EN_COURS','LIVRE'].includes(p.status)).length * 1200}€`, color: '#ff8855' },
            ].map(s => (
              <div key={s.label} className="card p-4">
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
