'use client'
import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, X, Send, Loader } from 'lucide-react'

// Extraire les infos Telegram depuis notes jsonb
function getTgInfo(p: any) {
  const note = (p.notes ?? []).find((n: any) => n.type === 'tg_user')
  const username   = note?.username   ?? null
  const first_name = note?.first_name ?? null
  const last_name  = note?.last_name  ?? null
  const id         = note?.id         ?? null
  const fullName   = [first_name, last_name].filter(Boolean).join(' ')
  const hasHandle  = Boolean(username)
  const display    = hasHandle
    ? `@${username}`
    : fullName || (id ? `ID: ${id}` : p.telegram || '—')
  const tgUrl      = hasHandle ? `https://t.me/${username}` : null
  return { username, first_name, last_name, id, fullName, hasHandle, display, tgUrl }
}

const STATUS_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  NOUVEAU:   { label: 'Nouveau',      color: '#00cfff', emoji: '🆕' },
  CONTACTE:  { label: 'Contacté',     color: '#ffd700', emoji: '💬' },
  ACCEPTE:   { label: 'Accepté',      color: '#cc88ff', emoji: '✅' },
  EN_COURS:  { label: 'En cours',     color: '#ff8855', emoji: '🔨' },
  LIVRE:     { label: 'Livré',        color: '#00ff88', emoji: '🎉' },
  REFUSE:    { label: 'Refusé',       color: '#ff4455', emoji: '❌' },
}

export default function CrmPage() {
  const [prospects, setProspects] = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('ALL')
  const [selected,  setSelected]  = useState<any | null>(null)
  const [note,      setNote]      = useState('')
  const [saving,    setSaving]    = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    fetch('/api/prospects').then(r => r.ok ? r.json() : [])
      .then(d => setProspects(Array.isArray(d) ? d : []))
      .catch(() => setProspects([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/prospects', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => {})
    load()
    if (selected?.id === id) setSelected((p: any) => ({ ...p, status }))
  }

  async function addNote() {
    if (!note.trim() || !selected) return
    setSaving(true)
    await fetch('/api/prospects', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, note: note.trim() }),
    }).catch(() => {})
    setNote(''); setSaving(false); load()
  }

  const displayed = filter === 'ALL' ? prospects : prospects.filter(p => p.status === filter)

  return (
    <div className="pb-28 min-h-screen">
      <div className="sticky top-0 z-40 px-4 pt-4 pb-0"
        style={{ background: 'rgba(2,10,24,.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,207,255,.1)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="section-title text-lg">CRM Demandes</h1>
            <p className="text-xs text-white/35">{displayed.length} demande(s)</p>
          </div>
          <button onClick={load} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,.05)' }}>
            <RefreshCw size={15} className={`text-white/50 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
          {[['ALL','Tous'], ...Object.entries(STATUS_CONFIG).map(([k,v]) => [k, `${v.emoji} ${v.label}`])].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className="rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all"
              style={filter === key
                ? { background: '#00cfff', color: '#000' }
                : { background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.5)' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-5 w-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">
            Aucune demande{filter !== 'ALL' ? ` avec ce statut` : ''}<br />
            <span className="text-xs">Les formulaires de contact apparaîtront ici.</span>
          </div>
        ) : displayed.map(p => {
          const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.NOUVEAU
          const tgi = getTgInfo(p)
          return (
            <div key={p.id} className="card p-4 cursor-pointer active:scale-[.99] transition-transform"
              onClick={() => setSelected(p)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white">{p.activity ?? 'Pack Complet 1200€'}</p>
                  {/* Identité Telegram */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {tgi.hasHandle ? (
                      <p className="text-xs font-mono text-cyan-400">{tgi.display}</p>
                    ) : (
                      <p className="text-xs text-white/30">
                        {tgi.display}
                        {!tgi.hasHandle && <span className="ml-1 text-yellow-500/60">· pas de @</span>}
                      </p>
                    )}
                    {tgi.id && <span className="text-[9px] text-white/20">ID {tgi.id}</span>}
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                  style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                  {cfg.emoji} {cfg.label}
                </span>
              </div>
              <p className="text-xs text-white/50 line-clamp-2 mb-2">{p.project_description}</p>
              <div className="flex items-center gap-3 text-[10px] text-white/25">
                <span>{new Date(p.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal détail */}
      {selected && (() => {
        const tgi = getTgInfo(selected)
        return (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-t-3xl max-h-[92vh] overflow-y-auto"
            style={{ background: '#050f24', border: '1px solid rgba(0,207,255,.2)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10"
              style={{ background: '#050f24', borderColor: 'rgba(0,207,255,.1)' }}>
              <div>
                <p className="font-black text-white">{selected.activity}</p>
                <p className="text-xs mt-0.5" style={{ color: tgi.hasHandle ? '#00cfff' : 'rgba(255,255,255,0.35)' }}>
                  {tgi.display}
                  {!tgi.hasHandle && tgi.id && <span className="text-white/25 ml-1">· ID {tgi.id}</span>}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40"><X size={20} /></button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Infos projet */}
              <div className="card p-4 space-y-3">
                <div>
                  <p className="label mb-1">📝 Description du projet</p>
                  <p className="text-sm text-white/70 leading-relaxed">{selected.project_description}</p>
                </div>
                {selected.features && (
                  <div>
                    <p className="label mb-1">⚡ Fonctionnalités demandées</p>
                    <p className="text-sm text-white/70 leading-relaxed">{selected.features}</p>
                  </div>
                )}
                {(() => {
                  const optNote = (selected.notes ?? []).find((n: any) => n.type === 'options')
                  const hosting     = optNote?.hosting     ?? false
                  const maintenance = optNote?.maintenance ?? selected.wants_maintenance ?? false
                  return (
                    <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Pack</p>
                        <p className="text-sm font-bold text-cyan-400">1 200€</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Hébergement</p>
                        <p className={`text-sm font-bold ${hosting ? 'text-blue-400' : 'text-white/30'}`}>
                          {hosting ? '15€/mois' : 'Non'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Maintenance</p>
                        <p className={`text-sm font-bold ${maintenance ? 'text-purple-400' : 'text-white/30'}`}>
                          {maintenance ? '50€/mois' : 'Non'}
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Statut */}
              <div>
                <p className="label mb-2">Statut du projet</p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button key={key} onClick={() => updateStatus(selected.id, key)}
                      className="rounded-xl py-2 text-xs font-bold transition-all"
                      style={selected.status === key
                        ? { background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}50` }
                        : { background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.4)', border: '1px solid rgba(255,255,255,.08)' }}>
                      {cfg.emoji} {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contacter */}
              {tgi.hasHandle ? (
                <a href={tgi.tgUrl!} target="_blank" rel="noreferrer">
                  <button className="btn-primary w-full justify-center">
                    💬 Contacter {tgi.display}
                  </button>
                </a>
              ) : (
                <div className="rounded-2xl p-3 text-center"
                  style={{ background: 'rgba(255,200,0,0.06)', border: '1px solid rgba(255,200,0,0.2)' }}>
                  <p className="text-xs font-bold text-yellow-400 mb-1">⚠️ Pas de @ Telegram public</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    {tgi.id
                      ? `ID Telegram : ${tgi.id} — demandez-lui de vous écrire directement.`
                      : 'Cet utilisateur n\'a pas de @ public. Demandez-lui de vous écrire en premier.'}
                  </p>
                </div>
              )}

              {/* Note */}
              <div>
                <p className="label mb-2">Ajouter une note</p>
                <textarea className="input" style={{ resize:'none', minHeight:70, fontSize:13 } as React.CSSProperties}
                  placeholder="Note interne…" value={note} onChange={e => setNote(e.target.value)} rows={3} />
                <button onClick={addNote} disabled={saving || !note.trim()}
                  className="btn-primary mt-2 text-sm disabled:opacity-50">
                  {saving ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                  Enregistrer
                </button>
              </div>

              {/* Historique notes */}
              {/* Historique notes (on exclut les notes internes tg_user) */}
              {(selected.notes?.filter((n: any) => n.type !== 'tg_user') ?? []).length > 0 && (
                <div>
                  <p className="label mb-2">Historique</p>
                  <div className="space-y-2">
                    {[...selected.notes.filter((n: any) => n.type !== 'tg_user')].reverse().map((n: any, i: number) => (
                      <div key={i} className="rounded-xl px-3 py-2"
                        style={{ background: 'rgba(0,207,255,.05)', border: '1px solid rgba(0,207,255,.1)' }}>
                        <p className="text-xs text-white/70">{n.text}</p>
                        <p className="text-[10px] text-white/25 mt-1">{new Date(n.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )
      })()}
    </div>
  )
}
