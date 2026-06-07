'use client'
import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, ChevronDown, X, Send, Loader } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NOUVEAU:  { label: 'Nouveau',      color: '#00cfff' },
  CONTACTE: { label: 'Contacté',     color: '#ffd700' },
  QUALIFIE: { label: 'Qualifié',     color: '#cc88ff' },
  DEVIS:    { label: 'Devis envoyé', color: '#ff8855' },
  GAGNE:    { label: 'Gagné ✅',     color: '#00ff88' },
  PERDU:    { label: 'Perdu',        color: '#ff4455' },
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
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => {})
    load()
    if (selected?.id === id) setSelected((p: any) => ({ ...p, status }))
  }

  async function addNote() {
    if (!note.trim() || !selected) return
    setSaving(true)
    await fetch('/api/prospects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, note: note.trim() }),
    }).catch(() => {})
    setNote('')
    setSaving(false)
    load()
  }

  const displayed = filter === 'ALL' ? prospects : prospects.filter(p => p.status === filter)

  return (
    <div className="pb-28 min-h-screen">
      <div className="sticky top-0 z-40 px-4 pt-4 pb-0"
        style={{ background: 'rgba(2,10,24,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,207,255,0.1)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="section-title text-lg">CRM Prospects</h1>
            <p className="text-xs text-white/35">{displayed.length} prospect(s)</p>
          </div>
          <button onClick={load} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <RefreshCw size={15} className={`text-white/50 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {/* Filtres */}
        <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
          {[['ALL','Tous'], ...Object.entries(STATUS_CONFIG).map(([k,v]) => [k, v.label])].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className="rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all flex-shrink-0"
              style={filter === key
                ? { background: '#00cfff', color: '#000' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
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
          <div className="text-center py-12 text-white/30 text-sm">Aucun prospect</div>
        ) : displayed.map(p => {
          const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.NOUVEAU
          return (
            <div key={p.id} className="card p-4 cursor-pointer active:scale-[0.99] transition-transform"
              onClick={() => setSelected(p)}>
              <div className="flex items-start justify-between mb-1.5">
                <div>
                  <p className="font-bold text-sm text-white">{p.name}</p>
                  {p.company && <p className="text-xs text-white/40">{p.company}</p>}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-white/50">{p.service} {p.budget ? `· ${p.budget}` : ''}</p>
              <p className="text-[10px] text-white/25 mt-1">
                {new Date(p.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })}
                {p.telegram && ` · @${p.telegram.replace('@','')}`}
              </p>
            </div>
          )
        })}
      </div>

      {/* Modal détail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto"
            style={{ background: '#050f24', border: '1px solid rgba(0,207,255,0.2)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10"
              style={{ background: '#050f24', borderColor: 'rgba(0,207,255,0.1)' }}>
              <div>
                <p className="font-black text-white">{selected.name}</p>
                {selected.company && <p className="text-xs text-white/40">{selected.company}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40">
                <X size={20} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Info */}
              <div className="card p-4 space-y-2">
                {selected.telegram && <p className="text-xs text-white/50">📱 @{selected.telegram.replace('@','')}</p>}
                <p className="text-xs text-white/50">🛠 {selected.service}</p>
                {selected.budget && <p className="text-xs text-white/50">💰 {selected.budget}</p>}
                <p className="text-xs text-white/60 leading-relaxed mt-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  "{selected.message}"
                </p>
              </div>

              {/* Changer statut */}
              <div>
                <p className="label mb-2">Statut du prospect</p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button key={key} onClick={() => updateStatus(selected.id, key)}
                      className="rounded-xl py-2 text-xs font-bold transition-all"
                      style={selected.status === key
                        ? { background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}50` }
                        : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <p className="label mb-2">Ajouter une note</p>
                <textarea
                  className="input"
                  style={{ resize: 'none', minHeight: 80, fontSize: 13 } as React.CSSProperties}
                  placeholder="Note interne…"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                />
                <button onClick={addNote} disabled={saving || !note.trim()}
                  className="btn-primary mt-2 text-sm disabled:opacity-50">
                  {saving ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                  Enregistrer la note
                </button>
              </div>

              {/* Notes existantes */}
              {selected.notes?.length > 0 && (
                <div>
                  <p className="label mb-2">Historique notes</p>
                  <div className="space-y-2">
                    {selected.notes.map((n: any, i: number) => (
                      <div key={i} className="rounded-xl px-3 py-2"
                        style={{ background: 'rgba(0,207,255,0.05)', border: '1px solid rgba(0,207,255,0.1)' }}>
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
      )}
    </div>
  )
}
