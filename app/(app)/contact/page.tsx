'use client'
import { useState } from 'react'
import { Send, Loader, CheckCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const SERVICES = [
  'Mini-App Telegram',
  'Bot Telegram',
  'Panel Admin',
  'Automatisation IA',
  'Catalogue Telegram',
  'Système de réservation',
  'Système de commandes',
  'Autre',
]

const BUDGETS = [
  '< 500€', '500€ - 1000€', '1000€ - 2000€', '> 2000€', 'À définir',
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', company: '', telegram: '', service: '', budget: '', message: '',
  })
  const [sending,  setSending]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit() {
    if (!form.name || !form.service || !form.message) {
      setError('Veuillez remplir les champs obligatoires (*)'); return
    }
    setSending(true); setError('')
    try {
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      setSuccess(true)
    } catch {
      setError('Erreur réseau. Réessayez ou contactez-nous directement.')
    } finally {
      setSending(false)
    }
  }

  if (success) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-28">
      <div className="text-6xl mb-4">✅</div>
      <p className="text-xl font-black text-white mb-2">Demande envoyée !</p>
      <p className="text-sm text-white/50 mb-6 leading-relaxed">
        Vous recevrez une réponse dans les 24h.<br />
        Nous vous contacterons directement sur Telegram.
      </p>
      <Link href="/">
        <button className="btn-primary">🏠 Retour à l'accueil</button>
      </Link>
    </div>
  )

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 14, fontSize: 14,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', outline: 'none',
  }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' }

  return (
    <div className="pb-28 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3"
        style={{ background: 'rgba(2,10,24,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,207,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <Link href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ChevronLeft size={18} className="text-white/70" />
          </Link>
          <div>
            <h1 className="section-title text-lg">Demande de devis</h1>
            <p className="text-[11px] text-white/35">Gratuit · Réponse en 24h</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Intro */}
        <div className="card p-4" style={{ background: 'rgba(0,207,255,0.05)', border: '1px solid rgba(0,207,255,0.15)' }}>
          <p className="text-xs text-white/60 leading-relaxed">
            📩 Remplissez ce formulaire et nous vous recontactons sur Telegram sous 24h avec un devis personnalisé.
          </p>
        </div>

        {/* Nom */}
        <div>
          <label style={lbl}>Votre nom *</label>
          <input style={inp} placeholder="Jean Dupont" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>

        {/* Entreprise */}
        <div>
          <label style={lbl}>Entreprise / Activité</label>
          <input style={inp} placeholder="Ma Boutique CBD" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
        </div>

        {/* Telegram */}
        <div>
          <label style={lbl}>Votre @Telegram</label>
          <input style={inp} placeholder="@monusername" value={form.telegram} onChange={e => setForm(f => ({ ...f, telegram: e.target.value }))} />
        </div>

        {/* Service */}
        <div>
          <label style={lbl}>Service souhaité *</label>
          <div className="grid grid-cols-2 gap-2">
            {SERVICES.map(s => (
              <button key={s} onClick={() => setForm(f => ({ ...f, service: s }))}
                className="rounded-xl px-3 py-2.5 text-xs font-medium text-left transition-all"
                style={form.service === s
                  ? { background: 'rgba(0,207,255,0.15)', border: '1px solid rgba(0,207,255,0.5)', color: '#00cfff' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label style={lbl}>Budget estimé</label>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map(b => (
              <button key={b} onClick={() => setForm(f => ({ ...f, budget: b }))}
                className="rounded-full px-3 py-1.5 text-xs font-bold transition-all"
                style={form.budget === b
                  ? { background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.4)', color: '#ffd700' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label style={lbl}>Décrivez votre projet *</label>
          <textarea style={{ ...inp, resize: 'none', minHeight: 110 } as React.CSSProperties}
            placeholder="Décrivez votre activité, vos besoins, vos fonctionnalités souhaitées…"
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            rows={5}
          />
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-xs text-red-400"
            style={{ background: 'rgba(255,68,85,0.08)', border: '1px solid rgba(255,68,85,0.2)' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={sending}
          className="btn-primary w-full justify-center disabled:opacity-60">
          {sending ? <><Loader size={16} className="animate-spin" /> Envoi…</> : <><Send size={16} /> Envoyer ma demande</>}
        </button>

        <p className="text-center text-[11px] text-white/25 pb-2">
          Réponse garantie sous 24h · Aucun engagement
        </p>
      </div>
    </div>
  )
}
