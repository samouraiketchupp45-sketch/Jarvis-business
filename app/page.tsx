'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Zap, Palette, Bot, Smartphone, ChevronRight, Star, ArrowRight } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'

// ─── Counter animé ──────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const steps = 40
    const step = target / steps
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setCount(Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Données ─────────────────────────────────────────────────────────────────
const STATS = [
  { value: 50, suffix: '+', label: 'Mini Apps réalisées' },
  { value: 98, suffix: '%', label: 'Clients satisfaits' },
  { value: 48, suffix: 'h', label: 'Délai moyen' },
  { value: 24, suffix: '/7', label: 'Support' },
]

const WHY = [
  {
    icon: Zap,
    title: 'Livraison rapide',
    desc: 'Mini App complète livrée en 48h à 72h. De l\'idée à la mise en ligne.',
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.15)',
  },
  {
    icon: Palette,
    title: 'Design exceptionnel',
    desc: 'Interfaces premium inspirées de Apple, Stripe et Linear. Vos clients adorent.',
    color: '#00cfff',
    glow: 'rgba(0,207,255,0.15)',
  },
  {
    icon: Bot,
    title: 'Automatisation complète',
    desc: 'Bot Telegram + Mini App + Panel Admin. Tout votre business automatisé.',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.15)',
  },
  {
    icon: Smartphone,
    title: '100% intégré Telegram',
    desc: '3 milliards d\'utilisateurs. Vos clients commandent sans télécharger d\'app.',
    color: '#00ff88',
    glow: 'rgba(0,255,136,0.15)',
  },
]

const REVIEWS = [
  { name: 'Alexandre M.', role: 'Fondateur Exoticz CBD', text: 'Mini App livrée en 48h exactement. Le design est incroyable et mes clients adorent. ROI immédiat dès la première semaine.', stars: 5 },
  { name: 'Sarah K.', role: 'E-commerçante', text: 'Interface ultra intuitive. Mes ventes ont augmenté de 40% le premier mois. L\'équipe est réactive et professionnelle.', stars: 5 },
  { name: 'Thomas R.', role: 'Restaurateur', text: 'Le panel admin est parfait. Je gère tout depuis mon téléphone. Je recommande ApplyaaBot les yeux fermés.', stars: 5 },
]

const FEATURES = [
  { icon: '🛍️', label: 'Boutique & Catalogue', sub: 'Produits, photos, vidéos, prix' },
  { icon: '🛒', label: 'Panier intelligent', sub: 'Commandes, paiement, livraison' },
  { icon: '⭐', label: 'Programme fidélité', sub: 'Points, niveaux, récompenses' },
  { icon: '🎰', label: 'Roulette de récompenses', sub: 'Gamification addictive' },
  { icon: '📦', label: 'Suivi de commande', sub: 'Timeline temps réel' },
  { icon: '🎧', label: 'SAV intégré', sub: 'Tickets & support client' },
  { icon: '⚙️', label: 'Panel Admin', sub: 'Dashboard, stats, gestion' },
  { icon: '📢', label: 'Notifications push', sub: 'Telegram instantané' },
]

export default function HomePage() {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg) { tg.ready(); tg.expand() }
  }, [])

  return (
    <div className="min-h-screen pb-28 overflow-x-hidden" style={{ background: 'linear-gradient(180deg,#020617 0%,#081428 40%,#0f172a 100%)' }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-5 pt-10 pb-10 text-center">
        {/* Glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle,#3b82f6,#7c3aed)' }} />
        </div>

        <div className="relative">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-6"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Agence Mini-Apps Telegram · Paris
          </motion.div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h1 className="text-4xl font-black text-white mb-2 leading-tight tracking-tight">
              🤖 ApplyaaBot
            </h1>
            <p className="text-xl font-black mb-3 leading-tight"
              style={{ background: 'linear-gradient(135deg,#60a5fa,#a855f7,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Transformez votre activité<br />avec une Mini App Telegram.
            </p>
          </motion.div>

          {/* Sub */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,.45)' }}>
            Bot Telegram · Mini App · Panel Admin
          </motion.p>

          {/* USPs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-2 mb-8 text-left">
            {['Livraison 48h', 'Design premium', 'Support réactif', 'Hébergement inclus'].map((u, i) => (
              <div key={u} className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-sm font-black" style={{ color: '#00ff88' }}>✓</span>
                <span className="text-xs font-semibold text-white/70">{u}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col gap-3">
            <Link href="/contact">
              <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
                className="w-full py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 text-black"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', boxShadow: '0 8px 32px rgba(59,130,246,0.4)' }}>
                🚀 Commencer mon projet
                <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="/portfolio">
              <motion.button whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}>
                👀 Voir nos réalisations
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="px-4 mb-10">
        <div className="grid grid-cols-4 gap-2">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-lg font-black"
                style={{ background: 'linear-gradient(135deg,#60a5fa,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-[9px] font-medium mt-0.5 leading-tight" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Pourquoi nous ─────────────────────────────────────────── */}
      <div className="px-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(96,165,250,0.7)' }}>Pourquoi nous</p>
          <h2 className="text-xl font-black text-white">Ce qui nous distingue</h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {WHY.map((w, i) => {
            const Icon = w.icon
            return (
              <motion.div key={w.title}
                initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="rounded-2xl p-4"
                style={{ background: w.glow, border: `1px solid ${w.color}25` }}>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${w.color}20`, border: `1px solid ${w.color}30` }}>
                  <Icon size={18} style={{ color: w.color }} />
                </div>
                <p className="text-sm font-black text-white mb-1">{w.title}</p>
                <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{w.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Fonctionnalités incluses ───────────────────────────────── */}
      <div className="px-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(96,165,250,0.7)' }}>Pack Complet</p>
          <h2 className="text-xl font-black text-white">Tout inclus · 1 200€</h2>
        </motion.div>
        <div className="space-y-2">
          {FEATURES.map((f, i) => (
            <motion.div key={f.label}
              initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-xl">{f.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{f.label}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.sub}</p>
              </div>
              <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-4 rounded-2xl p-4 text-center"
          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <p className="text-sm font-black text-white mb-0.5">Hébergement · 15€/mois</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Mini App en ligne · Base de données · Bot actif · Surveillance 24/7</p>
        </motion.div>
      </div>

      {/* ── Avis clients ──────────────────────────────────────────── */}
      <div className="px-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,215,0,0.7)' }}>Témoignages</p>
          <h2 className="text-xl font-black text-white">Ils nous font confiance</h2>
        </motion.div>
        <div className="space-y-3">
          {REVIEWS.map((r, i) => (
            <motion.div key={r.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)' }}>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} size={12} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[12px] leading-relaxed italic mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white">{r.name}</p>
                  <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Comment ça marche ─────────────────────────────────────── */}
      <div className="px-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(96,165,250,0.7)' }}>Process</p>
          <h2 className="text-xl font-black text-white">En 3 étapes simples</h2>
        </motion.div>
        <div className="space-y-3">
          {[
            { n: '01', title: 'Décrivez votre projet', sub: 'Formulaire simple — 2 minutes', color: '#60a5fa' },
            { n: '02', title: 'On développe pour vous', sub: 'Mini App complète en 48h-72h', color: '#a855f7' },
            { n: '03', title: 'Votre app est en ligne', sub: 'Prête à l\'emploi, formation incluse', color: '#00ff88' },
          ].map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="flex items-center gap-4 rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}30`, color: s.color }}>
                {s.n}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{s.title}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA final ─────────────────────────────────────────────── */}
      <motion.div className="px-4"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        <div className="rounded-3xl p-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(124,58,237,0.12))', border: '1px solid rgba(59,130,246,0.25)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%,rgba(124,58,237,0.1),transparent)' }} />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(96,165,250,0.7)' }}>Prêt à vous lancer ?</p>
            <p className="text-xl font-black text-white mb-1">Votre Mini App en 48h</p>
            <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Devis gratuit · Réponse sous 24h · Sans engagement</p>
            <Link href="/contact">
              <motion.button whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 text-white"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', boxShadow: '0 8px 32px rgba(59,130,246,0.35)' }}>
                🚀 Commencer mon projet — 1 200€
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  )
}
