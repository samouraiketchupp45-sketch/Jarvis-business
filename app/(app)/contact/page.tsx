'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Send, Loader, Star, Zap, Shield, Clock, Headphones } from 'lucide-react'

// ─── Contenu du pack ──────────────────────────────────────────────────────────
const PACK_ITEMS = [
  { icon: '🤖', text: 'Bot Telegram complet (commandes, menus, catalogue)' },
  { icon: '📱', text: 'Mini App premium avec design sur-mesure' },
  { icon: '⚙️', text: 'Panel Admin web (commandes, produits, clients)' },
  { icon: '🚀', text: 'Mise en ligne complète + nom de domaine configuré' },
  { icon: '🔔', text: 'Notifications automatiques clients en temps réel' },
  { icon: '📊', text: 'Statistiques & analytics intégrés' },
  { icon: '🛟', text: 'Support prioritaire 30 jours offert' },
]

const BADGES = [
  { icon: Zap, label: 'Livré en 48h' },
  { icon: Shield, label: 'Satisfait ou remboursé' },
  { icon: Headphones, label: 'Support 24/7' },
]

// ─── Pack Card ────────────────────────────────────────────────────────────────
function PackCard({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-bold tracking-[0.25em] uppercase mb-2"
          style={{ color: '#60a5fa' }}
        >
          Commencer mon projet
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-black text-white"
        >
          Une seule offre.{' '}
          <span style={{ background: 'linear-gradient(135deg, #3b82f6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Tout inclus.
          </span>
        </motion.h1>
      </div>

      {/* Main Pack Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          background: 'linear-gradient(145deg, rgba(59,130,246,0.08) 0%, rgba(168,85,247,0.08) 100%)',
          border: '1px solid rgba(59,130,246,0.35)',
          borderRadius: 24,
          boxShadow: '0 0 60px rgba(59,130,246,0.15), 0 0 120px rgba(168,85,247,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="p-6 mb-4"
      >
        {/* Glow top */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 180, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.8), transparent)',
        }} />

        {/* Badge recommandé */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(59,130,246,0.4)' }}>
            <Star size={11} fill="#fbbf24" color="#fbbf24" />
            <span className="text-[10px] font-bold text-yellow-300 tracking-wider">OFFRE RECOMMANDÉE</span>
          </div>
          <div className="text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
            ✓ Disponible
          </div>
        </div>

        {/* Pack name */}
        <div className="mb-4">
          <p className="text-xs text-blue-400/70 font-semibold tracking-widest uppercase mb-1">Pack</p>
          <h2 className="text-3xl font-black text-white tracking-tight">COMPLET</h2>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-5xl font-black text-white">1 200</span>
          <span className="text-2xl font-bold" style={{ color: '#60a5fa' }}>€</span>
          <span className="text-xs text-white/30 ml-1">paiement unique</span>
        </div>

        {/* Checklist */}
        <ul className="space-y-3">
          {PACK_ITEMS.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)' }}>
                <Check size={10} className="text-blue-400" strokeWidth={3} />
              </div>
              <span className="text-sm text-white/75 leading-relaxed">
                <span className="mr-1">{item.icon}</span>
                {item.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Badges */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {BADGES.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.08 }}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Icon size={14} className="text-blue-400" />
            <span className="text-[9px] font-semibold text-white/50 text-center leading-tight">{label}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full py-4 rounded-2xl font-black text-white text-base tracking-wide relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
          boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
        }}
      >
        <span className="relative z-10">🚀 Démarrer mon projet</span>
      </motion.button>

      <p className="text-center text-[10px] text-white/25 mt-3">
        Sans engagement · Réponse sous 2h · Devis gratuit
      </p>
    </motion.div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────
type FormData = { name: string; telegram: string; description: string }

function ContactForm({
  form, setForm, loading, onSubmit,
}: {
  form: FormData
  setForm: (f: FormData) => void
  loading: boolean
  onSubmit: () => void
}) {
  const valid = form.telegram.length >= 3 && form.description.length >= 10

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Mini pack recap */}
      <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl"
        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
          🚀
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-white">PACK COMPLET</p>
          <p className="text-[10px] text-white/40">Bot + Mini App + Panel Admin</p>
        </div>
        <span className="text-lg font-black text-blue-400">1 200€</span>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-white mb-1">Vos informations</h2>
        <p className="text-xs text-white/40">On vous contacte sous 2h pour valider votre projet.</p>
      </div>

      {/* Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5 block">
            Prénom / Nom
          </label>
          <input
            type="text"
            placeholder="Ex: Thomas Martin"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/25 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5 block">
            Pseudo Telegram <span className="text-blue-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">@</span>
            <input
              type="text"
              placeholder="votre_pseudo"
              value={form.telegram}
              onChange={e => setForm({ ...form, telegram: e.target.value.replace('@', '') })}
              className="w-full pl-8 pr-4 py-3 rounded-2xl text-sm text-white placeholder-white/25 outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${form.telegram.length >= 3 ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
              }}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5 block">
            Décrivez votre projet <span className="text-blue-400">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Ex: Je vends du CBD, j'ai besoin d'une boutique Telegram avec paiement en ligne et un bot pour les commandes…"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/25 outline-none resize-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${form.description.length >= 10 ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
            }}
          />
          <p className="text-[10px] text-white/25 mt-1">{form.description.length} / 500 caractères</p>
        </div>
      </div>

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        disabled={!valid || loading}
        className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 transition-all"
        style={{
          background: valid
            ? 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)'
            : 'rgba(255,255,255,0.05)',
          boxShadow: valid ? '0 8px 32px rgba(59,130,246,0.35)' : 'none',
          color: valid ? 'white' : 'rgba(255,255,255,0.25)',
        }}
      >
        {loading ? (
          <Loader size={18} className="animate-spin" />
        ) : (
          <>
            <Send size={16} />
            Recevoir mon devis
          </>
        )}
      </motion.button>

      <p className="text-center text-[10px] text-white/20 mt-3">
        Aucun paiement maintenant · Réponse garantie sous 2h
      </p>
    </motion.div>
  )
}

// ─── Success ──────────────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-sm mx-auto text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 20 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))',
          border: '2px solid rgba(59,130,246,0.5)',
          boxShadow: '0 0 40px rgba(59,130,246,0.25)',
        }}
      >
        <Check size={36} className="text-blue-400" strokeWidth={3} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-black text-white mb-3"
      >
        Demande envoyée !
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="text-sm text-white/50 leading-relaxed mb-8"
      >
        On revient vers vous sur Telegram{' '}
        <span className="text-blue-400 font-semibold">dans les 2 heures</span>
        {' '}pour valider votre projet et démarrer.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-4 rounded-2xl mb-6 text-left"
        style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <p className="text-xs font-bold text-blue-400 mb-2">🚀 Pack COMPLET — 1 200€</p>
        <p className="text-xs text-white/40">Bot + Mini App + Panel Admin · Livré en 48h</p>
      </motion.div>

      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        href="https://t.me/ApplyaaBot"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
          boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
        }}
      >
        💬 Nous contacter sur Telegram
      </motion.a>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
type Step = 'pack' | 'form' | 'success'

export default function ContactPage() {
  const [step, setStep] = useState<Step>('pack')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({ name: '', telegram: '', description: '' })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          telegram: form.telegram,
          project_description: form.description,
          budget: '1200',
          pack: 'complet',
        }),
      })
    } catch {
      // silent
    } finally {
      setLoading(false)
      setStep('success')
    }
  }

  return (
    <div
      className="min-h-screen pb-28 px-4 pt-6"
      style={{ background: 'linear-gradient(160deg, #020617 0%, #081428 55%, #0f172a 100%)' }}
    >
      {/* Step indicator (pack → form only) */}
      {step !== 'success' && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['pack', 'form'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: step === s ? '#3b82f6' : step === 'form' && s === 'pack' ? '#22c55e' : 'rgba(255,255,255,0.15)',
                  width: step === s ? 20 : 8,
                  borderRadius: step === s ? 4 : 999,
                }}
              />
              {i < 1 && <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'pack' && (
          <PackCard key="pack" onContinue={() => setStep('form')} />
        )}
        {step === 'form' && (
          <ContactForm
            key="form"
            form={form}
            setForm={setForm}
            loading={loading}
            onSubmit={handleSubmit}
          />
        )}
        {step === 'success' && <SuccessScreen key="success" />}
      </AnimatePresence>
    </div>
  )
}
