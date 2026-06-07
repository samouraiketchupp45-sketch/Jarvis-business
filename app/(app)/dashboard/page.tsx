'use client'
import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, Users, DollarSign, Target, RefreshCw } from 'lucide-react'

interface Stats {
  prospects:   number
  clients:     number
  mrr:         number
  conversion:  number
  newThisWeek: number
  pendingDevis:number
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NOUVEAU:    { label: 'Nouveau',     color: '#00cfff' },
  CONTACTE:   { label: 'Contacté',    color: '#ffd700' },
  QUALIFIE:   { label: 'Qualifié',    color: '#cc88ff' },
  DEVIS:      { label: 'Devis envoyé',color: '#ff8855' },
  GAGNE:      { label: 'Gagné ✅',    color: '#00ff88' },
  PERDU:      { label: 'Perdu',       color: '#ff4455' },
}

export default function DashboardPage() {
  const [stats,     setStats]     = useState<Stats | null>(null)
  const [prospects, setProspects] = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [tab,       setTab]       = useState<'overview' | 'prospects'>('overview')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, pRes] = await Promise.all([
        fetch('/api/prospects?stats=1'),
        fetch('/api/prospects?limit=10'),
      ])
      if (sRes.ok) setStats(await sRes.json())
      if (pRes.ok) setProspects(await pRes.json())
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const STAT_CARDS = stats ? [
    { icon: '🎯', label: 'Prospects',     value: stats.prospects,   color: '#00cfff', sub: `+${stats.newThisWeek} cette semaine` },
    { icon: '👑', label: 'Clients actifs',value: stats.clients,     color: '#ffd700', sub: `${stats.mrr}€ MRR` },
    { icon: '💰', label: 'MRR',           value: `${stats.mrr}€`,   color: '#00ff88', sub: 'Mensuel récurrent' },
    { icon: '📈', label: 'Conversion',    value: `${stats.conversion}%`, color: '#cc88ff', sub: `${stats.pendingDevis} devis en attente` },
  ] : []

  return (
    <div className="pb-28 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3"
        style={{ background: 'rgba(2,10,24,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,207,255,0.1)' }}>
        <div className="flex items-center justify-between">
          <h1 className="section-title text-lg">Dashboard</h1>
          <button onClick={load} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <RefreshCw size={15} className={`text-white/50 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          {([['overview','📊 Vue d\'ensemble'], ['prospects','🎯 Prospects']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className="rounded-full px-3 py-1.5 text-xs font-bold transition-all"
              style={tab === k
                ? { background: '#00cfff', color: '#000' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
        </div>
      )}

      {!loading && tab === 'overview' && (
        <div className="px-4 pt-5 space-y-4">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            {STAT_CARDS.map(s => (
              <div key={s.label} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: s.color }}>↑</span>
                </div>
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs font-bold text-white/70 mt-0.5">{s.label}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Pipeline */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Pipeline de vente</p>
            <div className="space-y-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = prospects.filter(p => p.status === key).length
                const pct = prospects.length ? Math.round(count / prospects.length * 100) : 0
                return (
                  <div key={key} className="card p-3 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                    <span className="text-xs text-white/70 flex-1">{cfg.label}</span>
                    <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cfg.color }} />
                    </div>
                    <span className="text-xs font-bold text-white/50 w-4 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions rapides */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Actions rapides</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📋', label: 'Gérer le CRM', href: '/crm', color: '#00cfff' },
                { icon: '📄', label: 'Créer un devis', href: '/devis', color: '#ffd700' },
                { icon: '🏆', label: 'Portfolio', href: '/portfolio', color: '#cc88ff' },
                { icon: '📩', label: 'Formulaire contact', href: '/contact', color: '#00ff88' },
              ].map(a => (
                <a key={a.href} href={a.href}
                  className="card p-4 flex flex-col items-center gap-2 text-center active:scale-95 transition-transform">
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs font-bold text-white/70">{a.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && tab === 'prospects' && (
        <div className="px-4 pt-5 space-y-3">
          {prospects.length === 0 ? (
            <div className="text-center py-10 text-white/30 text-sm">
              Aucun prospect pour le moment.<br />
              <span className="text-xs">Les demandes de devis apparaîtront ici.</span>
            </div>
          ) : prospects.map((p: any) => {
            const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.NOUVEAU
            return (
              <div key={p.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm text-white">{p.name}</p>
                    {p.company && <p className="text-xs text-white/40">{p.company}</p>}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-white/50 mb-2">{p.service} · {p.budget || 'Budget non précisé'}</p>
                <p className="text-xs text-white/30 leading-relaxed line-clamp-2">{p.message}</p>
                <p className="text-[10px] text-white/20 mt-2">
                  {new Date(p.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
