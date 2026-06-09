'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Send, Loader, Star, Zap, Shield, Clock, Headphones, Home } from 'lucide-react'

// Lire l'utilisateur Telegram depuis le SDK Mini App
function getTelegramUser(): { username?: string; first_name?: string; id?: number } | null {
  if (typeof window === 'undefined') return null
  try {
    const tg = (window as any).Telegram?.WebApp
    return tg?.initDataUnsafe?.user ?? null
  } catch {
    return null
  }
}

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
type FormData = { description: string; hosting: boolean; maintenance: boolean }

function ContactForm({
  form, setForm, loading, apiError, telegramHandle, onSubmit,
}: {
  form: FormData
  setForm: (f: FormData) => void
  loading: boolean
  apiError: string | null
  telegramHandle: string
  onSubmit: () => void
}) {
  const valid = form.description.length >= 10

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

      {/* Title + Telegram détecté */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-white mb-1">Vos informations</h2>
        <p className="text-xs text-white/40 mb-3">On vous contacte sous 2h pour valider votre projet.</p>
        {/* Badge Telegram auto-détecté */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.18)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#60a5fa">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.47l-2.967-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.537-.194 1.006.131.834.944z"/>
          </svg>
          <span className="text-xs text-blue-300 font-semibold">{telegramHandle}</span>
          <span className="text-[10px] text-white/25 ml-auto">détecté automatiquement</span>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4 mb-6">
        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5 block">
            Décrivez votre projet <span className="text-blue-400">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Ex: Je vends du CBD, j'ai besoin d'une boutique Telegram avec un bot pour les commandes…"
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

        {/* Options hébergement + maintenance */}
        <div>
          <label className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 block">
            Options supplémentaires
          </label>
          <div className="space-y-2">
            {/* Hébergement */}
            <button
              type="button"
              onClick={() => setForm({ ...form, hosting: !form.hosting })}
              className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left"
              style={{
                background: form.hosting ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                border: form.hosting ? '1px solid rgba(59,130,246,0.45)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: form.hosting ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)' }}>
                🌐
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Hébergement serveur</p>
                <p className="text-[11px] text-white/40">Domaine configuré · SSL · Serveur dédié</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-black" style={{ color: form.hosting ? '#60a5fa' : 'rgba(255,255,255,0.25)' }}>
                  15€<span className="text-[10px] font-normal">/mois</span>
                </p>
                <div className="mt-1 w-8 h-4 rounded-full relative ml-auto transition-all"
                  style={{ background: form.hosting ? '#3b82f6' : 'rgba(255,255,255,0.1)' }}>
                  <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                    style={{ left: form.hosting ? 'calc(100% - 14px)' : '2px' }} />
                </div>
              </div>
            </button>

            {/* Maintenance */}
            <button
              type="button"
              onClick={() => setForm({ ...form, maintenance: !form.maintenance })}
              className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left"
              style={{
                background: form.maintenance ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.03)',
                border: form.maintenance ? '1px solid rgba(168,85,247,0.45)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: form.maintenance ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)' }}>
                🛠
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Maintenance mensuelle</p>
                <p className="text-[11px] text-white/40">Mises à jour · Support prioritaire · Sauvegardes</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-black" style={{ color: form.maintenance ? '#a855f7' : 'rgba(255,255,255,0.25)' }}>
                  50€<span className="text-[10px] font-normal">/mois</span>
                </p>
                <div className="mt-1 w-8 h-4 rounded-full relative ml-auto transition-all"
                  style={{ background: form.maintenance ? '#a855f7' : 'rgba(255,255,255,0.1)' }}>
                  <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                    style={{ left: form.maintenance ? 'calc(100% - 14px)' : '2px' }} />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Récap prix total */}
        {(form.hosting || form.maintenance) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Récapitulatif</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Pack Complet</span>
                <span className="font-bold text-white">1 200€</span>
              </div>
              {form.hosting && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Hébergement</span>
                  <span className="font-bold text-blue-400">+15€/mois</span>
                </div>
              )}
              {form.maintenance && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Maintenance</span>
                  <span className="font-bold text-purple-400">+50€/mois</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
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

      {/* Erreur API */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-2xl flex items-start gap-2"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <span className="text-red-400 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-xs text-red-300 leading-relaxed">{apiError}</p>
        </motion.div>
      )}

      <p className="text-center text-[10px] text-white/20 mt-3">
        Aucun paiement maintenant · Réponse garantie sous 2h
      </p>
    </motion.div>
  )
}

// ─── Confettis ────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#3b82f6', '#a855f7', '#22d3ee', '#f59e0b', '#10b981', '#ec4899']

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.8 + Math.random() * 1.2,
    size: 5 + Math.random() * 6,
    rotate: Math.random() * 360,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 'inherit' }}>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -10, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotate, scale: 0.5 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'fixed',
            top: 0,
            width: p.size,
            height: p.size * 0.5,
            borderRadius: 2,
            background: p.color,
            zIndex: 100,
          }}
        />
      ))}
    </div>
  )
}

// ─── Checkmark SVG animé ──────────────────────────────────────────────────────
function AnimatedCheck() {
  return (
    <motion.svg
      width="40" height="40" viewBox="0 0 40 40" fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <motion.path
        d="M8 20 L17 29 L32 12"
        stroke="#60a5fa"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}

// ─── Success ──────────────────────────────────────────────────────────────────
const TG_USERNAME = 'ApplyaaBot'
const TG_MESSAGE = encodeURIComponent(
  'Bonjour, je viens de faire une demande sur ApplyaaBot concernant le Pack Complet à 1200€.'
)
const TG_URL = `https://t.me/${TG_USERNAME}?text=${TG_MESSAGE}`

function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-sm mx-auto text-center relative"
      style={{ paddingTop: 8 }}
    >
      <Confetti />

      {/* Check circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 350, damping: 22 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(168,85,247,0.15))',
          border: '2px solid rgba(59,130,246,0.45)',
          boxShadow: '0 0 0 12px rgba(59,130,246,0.06), 0 0 60px rgba(59,130,246,0.2)',
        }}
      >
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid rgba(59,130,246,0.3)' }}
          animate={{ scale: [1, 1.3, 1.3], opacity: [0.8, 0, 0] }}
          transition={{ delay: 0.6, duration: 1.2, repeat: 2 }}
        />
        <AnimatedCheck />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 300, damping: 24 }}
        className="text-2xl font-black text-white mb-3 tracking-tight"
      >
        Demande envoyée !
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-sm leading-relaxed mb-2"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        Merci pour votre confiance. Nous étudions votre projet et revenons
        vers vous rapidement afin de vous accompagner dans sa réalisation.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.72 }}
        className="text-xs font-semibold mb-7"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        ⏱️ Réponse généralement sous 2 heures
      </motion.p>

      {/* Pack recap card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.82, type: 'spring', stiffness: 280, damping: 26 }}
        className="rounded-2xl p-4 mb-6 text-left relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(168,85,247,0.07))',
          border: '1px solid rgba(59,130,246,0.2)',
          boxShadow: '0 0 30px rgba(59,130,246,0.06)',
        }}
      >
        {/* top line glow */}
        <div style={{
          position: 'absolute', top: 0, left: '30%', right: '30%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.6), transparent)',
        }} />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
            🚀
          </div>
          <div>
            <p className="text-xs font-black text-white tracking-wide">PACK COMPLET</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Bot Telegram · Mini App · Panel Admin</p>
          </div>
          <span className="ml-auto text-lg font-black" style={{ color: '#60a5fa' }}>1 200€</span>
        </div>
        <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Clock size={11} className="text-blue-400/60 flex-shrink-0" />
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Livraison : 48h à 7 jours · Configuration intégrale incluse</span>
        </div>
      </motion.div>

      {/* Primary CTA — Telegram */}
      <motion.a
        href={TG_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 300, damping: 22 }}
        whileHover={{ scale: 1.03, boxShadow: '0 12px 48px rgba(59,130,246,0.5)' }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-white text-base mb-3 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
          boxShadow: '0 8px 36px rgba(59,130,246,0.38)',
          textDecoration: 'none',
        }}
      >
        {/* Shine sweep */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ delay: 1.3, duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
        />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="relative z-10 flex-shrink-0">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.47l-2.967-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.537-.194 1.006.131.834.944z"/>
        </svg>
        <span className="relative z-10">💬 Contacter @{TG_USERNAME}</span>
      </motion.a>

      {/* Secondary — back home */}
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-colors"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none',
        }}
      >
        🏠 Retour à l'accueil
      </motion.a>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
type Step = 'pack' | 'form' | 'success'

export default function ContactPage() {
  const [step, setStep]         = useState<Step>('pack')
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [form, setForm]         = useState<FormData>({ description: '', hosting: false, maintenance: false })
  const [tgUser, setTgUser]     = useState<{ username?: string; first_name?: string; id?: number } | null>(null)

  useEffect(() => {
    const user = getTelegramUser()
    console.log('[ApplyaaBot] Telegram user détecté:', user)
    if (user) setTgUser(user)
  }, [])

  const hasUsername  = Boolean(tgUser?.username)
  const telegramHandle = hasUsername
    ? `@${tgUser!.username}`
    : tgUser?.first_name
    ? `${tgUser.first_name}${tgUser.id ? ` (ID: ${tgUser.id})` : ''}`
    : 'Non identifié'

  const handleSubmit = async () => {
    setLoading(true)
    setApiError(null)
    try {
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_description: form.description,
          activity:          'Pack Complet 1200€',
          service:           'Bot + Mini App + Panel Admin',
          pack:              'Pack Complet 1200€',
          budget:            '1200',
          wants_hosting:     form.hosting,
          wants_maintenance: form.maintenance,
          // Identité Telegram (colonne principale)
          telegram:  hasUsername ? `@${tgUser!.username}` : (tgUser?.first_name ?? 'Non renseigné'),
          name:      tgUser?.first_name ?? tgUser?.username ?? 'Prospect',
          // Objet complet — stocké dans notes pour le CRM
          tg_user: tgUser ? {
            id:         tgUser.id,
            username:   tgUser.username   ?? null,
            first_name: tgUser.first_name ?? null,
            last_name:  (tgUser as any).last_name ?? null,
          } : null,
        }),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        // Afficher l'erreur réelle — jamais afficher "Demande envoyée" si ça a échoué
        const msg = json?.error ?? `Erreur serveur (${res.status})`
        setApiError(msg)
        return
      }

      // Succès réel confirmé par le serveur
      setStep('success')
    } catch (err: any) {
      setApiError('Erreur réseau — vérifiez votre connexion et réessayez.')
    } finally {
      setLoading(false)
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
            apiError={apiError}
            telegramHandle={telegramHandle}
            onSubmit={handleSubmit}
          />
        )}
        {step === 'success' && <SuccessScreen key="success" />}
      </AnimatePresence>
    </div>
  )
}
