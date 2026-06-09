'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Send, Loader, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────
type FormData = {
  sector: string
  budget: string
  features: string[]
  name: string
  telegram: string
  description: string
  wants_maintenance: boolean
}

// ─── Config ──────────────────────────────────────────────────────────────────
const SECTORS = [
  { id: 'cbd',        emoji: '🌿', label: 'CBD / Bien-être' },
  { id: 'ecommerce',  emoji: '🛍️', label: 'E-commerce' },
  { id: 'restaurant', emoji: '🍕', label: 'Restaurant' },
  { id: 'coiffeur',   emoji: '✂️', label: 'Coiffeur / Esthétique' },
  { id: 'services',   emoji: '🔧', label: 'Services' },
  { id: 'autre',      emoji: '✨', label: 'Autre' },
]

const BUDGETS = [
  { id: '500',   label: '500€', sub: 'Budget serré' },
  { id: '1000',  label: '1 000€', sub: 'Standard' },
  { id: '1200',  label: '1 200€', sub: 'Pack Complet ⭐', highlight: true },
  { id: '2000+', label: '2 000€+', sub: 'Sur mesure premium' },
]

const FEATURES_LIST = [
  { id: 'bot',      emoji: '🤖', label: 'Bot Telegram', price: 0 },
  { id: 'miniapp',  emoji: '📱', label: 'Mini App', price: 0 },
  { id: 'panel',    emoji: '⚙️', label: 'Panel Admin', price: 200 },
  { id: 'payment',  emoji: '💳', label: 'Paiement intégré', price: 200 },
  { id: 'loyalty',  emoji: '⭐', label: 'Programme fidélité', price: 150 },
  { id: 'roulette', emoji: '🎰', label: 'Roulette récompenses', price: 100 },
  { id: 'delivery', emoji: '🚚', label: 'Suivi livraison', price: 100 },
  { id: 'sav',      emoji: '🎧', label: 'SAV / Tickets', price: 100 },
]

function calcPrice(features: string[], budget: string): number {
  const base = 800
  const extras = features.reduce((s, f) => {
    const found = FEATURES_LIST.find(fl => fl.id === f)
    return s + (found?.price ?? 0)
  }, 0)
  return Math.max(base + extras, 800)
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepSector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(96,165,250,0.7)' }}>Étape 1 / 4</p>
        <h2 className="text-xl font-black text-white mb-1">Quel est votre secteur ?</h2>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Choisissez l'activité la plus proche</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 mt-5">
        {SECTORS.map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.97 }}
            onClick={() => onChange(s.id)}
            className="rounded-2xl p-4 text-left transition-all"
            style={value === s.id
              ? { background: 'rgba(59,130,246,0.15)', border: '1.5px solid rgba(59,130,246,0.5)' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-2xl block mb-2">{s.emoji}</span>
            <p className="text-xs font-bold" style={{ color: value === s.id ? '#60a5fa' : 'rgba(255,255,255,0.7)' }}>
              {s.label}
            </p>
            {value === s.id && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="mt-1.5 h-1 w-6 rounded-full"
                style={{ background: '#60a5fa' }} />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function StepBudget({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(96,165,250,0.7)' }}>Étape 2 / 4</p>
        <h2 className="text-xl font-black text-white mb-1">Votre budget</h2>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Indicatif — nous nous adaptons toujours</p>
      </div>
      <div className="space-y-2.5 mt-5">
        {BUDGETS.map(b => (
          <motion.button key={b.id} whileTap={{ scale: 0.98 }}
            onClick={() => onChange(b.id)}
            className="w-full rounded-2xl p-4 flex items-center justify-between text-left transition-all"
            style={value === b.id
              ? { background: b.highlight ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.12)', border: `1.5px solid ${b.highlight ? '#3b82f6' : 'rgba(59,130,246,0.4)'}` }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <p className="text-base font-black text-white">{b.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{b.sub}</p>
            </div>
            {value === b.id
              ? <div className="h-5 w-5 rounded-full flex items-center justify-center" style={{ background: '#3b82f6' }}>
                  <Check size={11} color="#fff" />
                </div>
              : <div className="h-5 w-5 rounded-full" style={{ border: '1.5px solid rgba(255,255,255,0.2)' }} />
            }
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function StepFeatures({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter(f => f !== id) : [...value, id])
  }
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(96,165,250,0.7)' }}>Étape 3 / 4</p>
        <h2 className="text-xl font-black text-white mb-1">Fonctionnalités</h2>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Sélectionnez ce que vous voulez</p>
      </div>
      <div className="space-y-2 mt-4">
        {FEATURES_LIST.map(f => {
          const selected = value.includes(f.id)
          const required = f.id === 'bot' || f.id === 'miniapp'
          return (
            <motion.button key={f.id} whileTap={{ scale: 0.98 }}
              onClick={() => !required && toggle(f.id)}
              className="w-full rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition-all"
              style={selected
                ? { background: 'rgba(59,130,246,0.12)', border: '1.5px solid rgba(59,130,246,0.4)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', opacity: required ? 1 : 0.9 }}>
              <span className="text-lg">{f.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: selected ? '#fff' : 'rgba(255,255,255,0.75)' }}>
                  {f.label}
                  {required && <span className="ml-2 text-[8px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#60a5fa20', color: '#60a5fa' }}>INCLUS</span>}
                </p>
                {f.price > 0 && <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>+{f.price}€</p>}
              </div>
              <div className="h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                style={selected ? { background: '#3b82f6' } : { border: '1.5px solid rgba(255,255,255,0.2)' }}>
                {selected && <Check size={11} color="#fff" />}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function StepContact({ form, onChange }: { form: FormData; onChange: (k: keyof FormData, v: any) => void }) {
  const inp: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: 14, fontSize: 14,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', outline: 'none', fontFamily: 'inherit',
  }
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(96,165,250,0.7)' }}>Étape 4 / 4</p>
        <h2 className="text-xl font-black text-white mb-1">Vos coordonnées</h2>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>On vous répond sous 24h sur Telegram</p>
      </div>
      <div className="space-y-3 mt-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Votre prénom *</label>
          <input style={inp} placeholder="Alexandre" value={form.name}
            onChange={e => onChange('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Votre @Telegram *</label>
          <input style={inp} placeholder="@monusername" value={form.telegram}
            onChange={e => onChange('telegram', e.target.value)} />
          <p className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Notre seul moyen de contact — pas d'email</p>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Décrivez votre projet <span className="normal-case text-white/20">(optionnel)</span></label>
          <textarea style={{ ...inp, resize: 'none', minHeight: 90 } as React.CSSProperties}
            placeholder="Boutique CBD avec système de fidélité, roulette, et livraison…"
            value={form.description} rows={4}
            onChange={e => onChange('description', e.target.value)} />
        </div>
        <motion.button whileTap={{ scale: 0.98 }}
          onClick={() => onChange('wants_maintenance', !form.wants_maintenance)}
          className="w-full rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition-all"
          style={form.wants_maintenance
            ? { background: 'rgba(0,255,136,0.08)', border: '1.5px solid rgba(0,255,136,0.3)' }
            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="text-xl">🛠</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Maintenance 50€/mois</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Bugs, mises à jour, support prioritaire</p>
          </div>
          <div className="h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={form.wants_maintenance ? { background: '#00ff88' } : { border: '1.5px solid rgba(255,255,255,0.2)' }}>
            {form.wants_maintenance && <Check size={11} color="#000" />}
          </div>
        </motion.button>
      </div>
    </div>
  )
}

function StepResult({ form, price, onRetry }: { form: FormData; price: number; onRetry: () => void }) {
  const selectedSector = SECTORS.find(s => s.id === form.sector)
  const selectedFeatures = FEATURES_LIST.filter(f => form.features.includes(f.id))
  const tgUrl = `https://t.me/ApplyaaBot?start=devis_${form.telegram.replace('@','')}`

  return (
    <div className="space-y-5 text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        <div className="text-6xl mb-3">🎉</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(0,255,136,0.7)' }}>Devis prêt !</p>
        <h2 className="text-xl font-black text-white">Votre estimation</h2>
      </motion.div>

      {/* Prix */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(124,58,237,0.12))', border: '1px solid rgba(59,130,246,0.3)' }}>
        <p className="text-5xl font-black text-white mb-1">{price.toLocaleString('fr')}€</p>
        <p className="text-sm font-bold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Paiement unique · Clé en main</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>+ Hébergement 15€/mois</p>
      </motion.div>

      {/* Récap */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="rounded-2xl p-4 text-left space-y-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Récapitulatif</p>
        <div className="flex justify-between text-xs">
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Secteur</span>
          <span className="font-bold text-white">{selectedSector?.emoji} {selectedSector?.label}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Bonjour</span>
          <span className="font-bold text-white">{form.name} · {form.telegram}</span>
        </div>
        {selectedFeatures.length > 0 && (
          <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Fonctionnalités :</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedFeatures.map(f => (
                <span key={f.id} className="text-[9px] font-bold px-2 py-1 rounded-full"
                  style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>
                  {f.emoji} {f.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* CTAs */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="space-y-3">
        <a href={tgUrl} target="_blank" rel="noopener noreferrer">
          <motion.button whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 text-white"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', boxShadow: '0 8px 32px rgba(59,130,246,0.35)' }}>
            💬 Continuer sur Telegram
            <ArrowRight size={18} />
          </motion.button>
        </a>
        <button onClick={onRetry}
          className="w-full py-3 rounded-2xl text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
          ← Recommencer
        </button>
      </motion.div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ContactPage() {
  const [step, setStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    sector: '',
    budget: '1200',
    features: ['bot', 'miniapp', 'panel'],
    name: '',
    telegram: '',
    description: '',
    wants_maintenance: false,
  })

  function updateForm(key: keyof FormData, value: any) {
    setForm(f => ({ ...f, [key]: value }))
  }

  const estimatedPrice = calcPrice(form.features, form.budget)

  const canNext = [
    () => !!form.sector,
    () => !!form.budget,
    () => form.features.length > 0,
    () => !!form.name && !!form.telegram && form.telegram.startsWith('@'),
  ]

  async function submit() {
    setSending(true)
    setError('')
    try {
      const sector = SECTORS.find(s => s.id === form.sector)
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity: sector?.label ?? form.sector,
          project_description: form.description || `Budget: ${form.budget}€ | Features: ${form.features.join(', ')}`,
          telegram: form.telegram,
          features: form.features.join(', '),
          wants_maintenance: form.wants_maintenance,
        }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
      setStep(4)
    } catch {
      setError('Erreur réseau. Réessayez.')
    } finally {
      setSending(false)
    }
  }

  function handleNext() {
    if (step < 3) { setStep(s => s + 1); return }
    submit()
  }

  function handleReset() {
    setStep(0); setDone(false); setError('')
    setForm({ sector: '', budget: '1200', features: ['bot', 'miniapp', 'panel'], name: '', telegram: '', description: '', wants_maintenance: false })
  }

  const steps = ['Secteur', 'Budget', 'Options', 'Contact']

  return (
    <div className="min-h-screen pb-28" style={{ background: 'linear-gradient(180deg,#020617,#081428)' }}>

      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-safe pt-4 pb-3"
        style={{ background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ChevronLeft size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
          </Link>
          <div>
            <h1 className="text-base font-black text-white">Commencer mon projet</h1>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Pack Complet · 1 200€ · Livraison 48h</p>
          </div>
        </div>

        {/* Progress bar */}
        {!done && (
          <div className="mt-3">
            <div className="flex gap-1">
              {steps.map((s, i) => (
                <div key={s} className="flex-1">
                  <motion.div className="h-0.5 rounded-full"
                    animate={{ background: i <= step ? '#3b82f6' : 'rgba(255,255,255,0.1)' }}
                    transition={{ duration: 0.3 }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {steps.map((s, i) => (
                <span key={s} className="text-[8px] font-medium"
                  style={{ color: i === step ? '#60a5fa' : 'rgba(255,255,255,0.25)' }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-6 pb-4">
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}>

            {step === 0 && <StepSector value={form.sector} onChange={v => updateForm('sector', v)} />}
            {step === 1 && <StepBudget value={form.budget} onChange={v => updateForm('budget', v)} />}
            {step === 2 && <StepFeatures value={form.features} onChange={v => updateForm('features', v)} />}
            {step === 3 && <StepContact form={form} onChange={updateForm} />}
            {step === 4 && done && <StepResult form={form} price={estimatedPrice} onRetry={handleReset} />}
          </motion.div>
        </AnimatePresence>

        {/* Prix estimé (étapes 1-3) */}
        {step > 0 && step < 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-5 rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Estimation en cours</p>
            <motion.p key={estimatedPrice} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
              className="text-base font-black"
              style={{ background: 'linear-gradient(135deg,#60a5fa,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ~{estimatedPrice.toLocaleString('fr')}€
            </motion.p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-3 rounded-xl px-4 py-3 text-xs" style={{ background: 'rgba(255,68,85,0.08)', border: '1px solid rgba(255,68,85,0.2)', color: '#ff8888' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex gap-3 mt-5">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center justify-center h-12 w-12 rounded-2xl flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <ChevronLeft size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
              </button>
            )}
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={!canNext[step]?.() || sending}
              className="flex-1 h-12 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              style={{ background: canNext[step]?.() ? 'linear-gradient(135deg,#3b82f6,#7c3aed)' : 'rgba(255,255,255,0.08)', color: '#fff', boxShadow: canNext[step]?.() ? '0 6px 24px rgba(59,130,246,0.35)' : 'none' }}>
              {sending
                ? <><Loader size={16} className="animate-spin" /> Envoi...</>
                : step < 3
                  ? <>Suivant <ChevronRight size={16} /></>
                  : <><Send size={16} /> Envoyer ma demande</>
              }
            </motion.button>
          </div>
        )}

        {step < 4 && (
          <p className="text-center text-[10px] mt-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Réponse sous 24h · Gratuit · Sans engagement
          </p>
        )}
      </div>
    </div>
  )
}
