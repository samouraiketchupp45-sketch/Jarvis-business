'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence, useSpring } from 'framer-motion'
import Link from 'next/link'
import {
  X, ChevronLeft, ChevronRight, ShoppingCart, Star, Clock, Package,
  Plus, Minus, Truck, CheckCircle, Gift, Trophy, Zap, LayoutDashboard,
  Users, TrendingUp, MessageSquare, Settings, Bell, Search, Filter,
  Edit2, Trash2, Image, BarChart2, Send, Bot
} from 'lucide-react'

// ─── Constantes Exoticz ──────────────────────────────────────────────────────
const C = '#ff1a6e'
const GRAM_OPTIONS = [
  { g: '1g',   price: 8.50 },
  { g: '3.5g', price: 28.00 },
  { g: '7g',   price: 52.00 },
  { g: '14g',  price: 98.00 },
  { g: '28g',  price: 185.00 },
  { g: '50g',  price: 320.00 },
  { g: '100g', price: 600.00 },
  { g: '250g', price: 1400.00 },
  { g: '500g', price: 2700.00 },
  { g: '1kg',  price: 5000.00 },
]
const ROULETTE_PRIZES = [
  { label: 'Livraison\nofferte', emoji: '🚚', color: '#00ff88' },
  { label: '5%\nréduction', emoji: '🏷️', color: '#00cfff' },
  { label: 'Points\nbonus', emoji: '⭐', color: '#ffd700' },
  { label: '10%\nréduction', emoji: '💎', color: '#8800cc' },
  { label: 'Cadeau\nsurprise', emoji: '🎁', color: '#ff8855' },
  { label: '15%\nréduction', emoji: '🔥', color: C },
  { label: 'Livraison\nofferte', emoji: '🚚', color: '#00ff88' },
  { label: 'Points\nbonus', emoji: '⭐', color: '#ffd700' },
]

// ─── Écrans Mini App ─────────────────────────────────────────────────────────

function ScreenHome() {
  return (
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(180deg,#0a0015,#070010)' }}>
      {/* Hero */}
      <div className="px-3 pt-4 pb-3" style={{ background: `linear-gradient(135deg,${C}20,#8800cc20)` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl flex items-center justify-center text-sm" style={{ background: `${C}25` }}>🌴</div>
            <span className="text-[11px] font-black text-white">EXOTICZ CBD</span>
          </div>
          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full" style={{ background: `${C}25`, color: C }}>CBD Premium</span>
        </div>
        <div className="rounded-xl p-2" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <p className="text-[9px] font-bold" style={{ color: '#ffd700' }}>🌟 Bienvenue ! +50 pts fidélité offerts</p>
        </div>
      </div>
      {/* Nav cards */}
      <div className="px-3 pt-2 flex-1 space-y-1.5">
        {[
          ['🛍️', 'Boutique', 'Voir les produits premium'],
          ['⭐', 'Fidélité', 'Bronze · 250 points'],
          ['📦', 'Commandes', 'Suivre mes achats'],
          ['🎰', 'Roulette', '3 tours disponibles'],
        ].map(([icon, title, sub]) => (
          <div key={title} className="flex items-center gap-2.5 rounded-xl p-2.5"
            style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
            <span className="text-base">{icon}</span>
            <div>
              <p className="text-[9px] font-bold text-white">{title}</p>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,.4)' }}>{sub}</p>
            </div>
            <ChevronRight size={10} className="ml-auto" style={{ color: 'rgba(255,255,255,.2)' }} />
          </div>
        ))}
      </div>
      {/* Bottom nav */}
      <div className="flex items-center justify-around px-2 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
        {[['🏠','Accueil',true],['🛍️','Boutique',false],['🛒','Panier',false],['👤','Profil',false]].map(([i,l,a]) => (
          <div key={String(l)} className="flex flex-col items-center gap-0.5">
            <span className="text-sm" style={{ opacity: a ? 1 : 0.4 }}>{i}</span>
            <span className="text-[7px] font-bold" style={{ color: a ? C : 'rgba(255,255,255,.4)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScreenCatalog() {
  const products = [
    { name: 'Amnesia Haze', grade: '⭐ 4.9', badge: '🔥 TOP' },
    { name: 'OG Kush', grade: '⭐ 4.8', badge: '' },
    { name: 'Purple Haze', grade: '⭐ 5.0', badge: '✨ NEW' },
    { name: 'Gelato CBD', grade: '⭐ 4.7', badge: '' },
  ]
  return (
    <div className="h-full flex flex-col" style={{ background: '#070010' }}>
      <div className="px-3 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <ChevronLeft size={13} style={{ color: 'rgba(255,255,255,.4)' }} />
        <span className="text-[11px] font-black text-white flex-1">Boutique</span>
        <ShoppingCart size={13} style={{ color: C }} />
      </div>
      <div className="px-3 pt-2 pb-1.5">
        <div className="rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-[9px]" style={{ background: 'rgba(255,255,255,.05)' }}>
          <Search size={9} style={{ color: 'rgba(255,255,255,.3)' }} />
          <span style={{ color: 'rgba(255,255,255,.3)' }}>Rechercher...</span>
        </div>
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-0.5">
          {['Tout', 'Fleurs', 'Résines', 'Huiles', 'Gummies'].map((cat, i) => (
            <span key={cat} className="text-[8px] px-2 py-1 rounded-full whitespace-nowrap font-bold flex-shrink-0"
              style={i === 0 ? { background: C, color: '#000' } : { background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.5)' }}>
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div className="px-3 flex-1 overflow-hidden">
        <div className="grid grid-cols-2 gap-1.5">
          {products.map((p, i) => (
            <div key={p.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C}18` }}>
              <div className="h-12 flex items-center justify-center relative" style={{ background: `${C}10` }}>
                <span className="text-xl">🌿</span>
                {p.badge && (
                  <span className="absolute top-1 left-1 text-[6px] font-black px-1 py-0.5 rounded-full"
                    style={{ background: C, color: '#000' }}>{p.badge}</span>
                )}
              </div>
              <div className="p-1.5">
                <p className="text-[8px] font-bold text-white leading-tight truncate">{p.name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[8px] font-black" style={{ color: C }}>8.50€/g</span>
                  <span className="text-[7px]" style={{ color: 'rgba(255,255,255,.35)' }}>{p.grade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScreenProduct() {
  const [gramIdx, setGramIdx] = useState(1)
  const [added, setAdded] = useState(false)
  const gram = GRAM_OPTIONS[gramIdx]
  const visibleGrams = GRAM_OPTIONS.slice(0, 5)

  function handleAdd() {
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#070010' }}>
      {/* Image */}
      <div className="h-20 flex items-center justify-center relative flex-shrink-0"
        style={{ background: `linear-gradient(180deg,${C}22,transparent)` }}>
        <span className="text-4xl">🌿</span>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[7px] font-bold"
          style={{ background: '#00ff8820', color: '#00ff88' }}>En stock</div>
      </div>
      {/* Info */}
      <div className="px-3 flex-1 overflow-auto">
        <p className="text-[11px] font-black text-white mt-1">OG Kush Premium</p>
        <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,.45)' }}>CBD 22% · Certifié bio · Récolte 2026</p>
        {/* Prix dynamique */}
        <div className="flex items-baseline gap-1.5 mt-1.5 mb-2">
          <motion.span key={gram.price}
            initial={{ scale: 1.3, color: '#ffd700' }} animate={{ scale: 1, color: C }}
            transition={{ duration: 0.35 }}
            className="text-base font-black" style={{ color: C }}>
            {gram.price.toFixed(2)}€
          </motion.span>
          <span className="text-[8px]" style={{ color: 'rgba(255,255,255,.35)' }}>pour {gram.g}</span>
        </div>
        {/* Sélecteur grammage */}
        <p className="text-[7px] font-bold uppercase mb-1" style={{ color: 'rgba(255,255,255,.35)', letterSpacing: '0.1em' }}>Grammage</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {visibleGrams.map((opt, i) => (
            <button key={opt.g} onClick={() => setGramIdx(i)}
              className="py-1 px-2 rounded-lg text-[8px] font-bold transition-all"
              style={i === gramIdx
                ? { background: C, color: '#000', boxShadow: `0 0 10px ${C}60` }
                : { background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.5)' }}>
              {opt.g}
            </button>
          ))}
          <span className="py-1 px-2 rounded-lg text-[8px]" style={{ color: 'rgba(255,255,255,.25)' }}>+5</span>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(s => <Star key={s} size={8} className="fill-yellow-400 text-yellow-400" />)}
          <span className="text-[7px]" style={{ color: 'rgba(255,255,255,.35)' }}>4.8 (342 avis)</span>
        </div>
      </div>
      {/* CTA */}
      <div className="px-3 pb-3 flex-shrink-0">
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd}
          className="w-full py-2.5 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5"
          style={{ background: added ? '#00ff88' : `linear-gradient(135deg,${C},${C}aa)`, color: added ? '#000' : '#000',
            transition: 'background 0.3s', boxShadow: `0 4px 16px ${C}50` }}>
          {added ? <><CheckCircle size={11} />Ajouté !</> : <><ShoppingCart size={11} />Ajouter · {gram.price.toFixed(2)}€</>}
        </motion.button>
      </div>
    </div>
  )
}

function ScreenCart() {
  const [items, setItems] = useState([
    { name: 'OG Kush Premium', gram: '3.5g', price: 28.00, qty: 1 },
    { name: 'Amnesia Haze', gram: '1g', price: 8.50, qty: 2 },
  ])
  function update(i: number, delta: number) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, qty: Math.max(0, it.qty + delta) } : it).filter(it => it.qty > 0))
  }
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)
  const delivery = subtotal >= 50 ? 0 : 4.99
  return (
    <div className="h-full flex flex-col" style={{ background: '#070010' }}>
      <div className="px-3 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <ChevronLeft size={13} style={{ color: 'rgba(255,255,255,.4)' }} />
        <span className="text-[11px] font-black text-white flex-1">🛒 Panier</span>
        <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${C}20`, color: C }}>{items.length}</span>
      </div>
      <div className="px-3 pt-2 flex-1 space-y-1.5 overflow-auto">
        <AnimatePresence>
          {items.map((it, i) => (
            <motion.div key={it.name} layout initial={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}
              className="flex items-center gap-2 rounded-xl p-2"
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: `${C}15` }}>🌿</div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-bold text-white truncate">{it.name}</p>
                <p className="text-[7px]" style={{ color: 'rgba(255,255,255,.35)' }}>{it.gram}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => update(i, -1)} className="h-5 w-5 rounded-md flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,.08)' }}><Minus size={8} /></button>
                <span className="text-[9px] font-bold text-white w-3 text-center">{it.qty}</span>
                <button onClick={() => update(i, +1)} className="h-5 w-5 rounded-md flex items-center justify-center"
                  style={{ background: `${C}30` }}><Plus size={8} /></button>
              </div>
              <span className="text-[9px] font-black w-10 text-right" style={{ color: C }}>{(it.price * it.qty).toFixed(2)}€</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Summary */}
        <div className="rounded-xl p-2 mt-1" style={{ background: `${C}0a`, border: `1px solid ${C}20` }}>
          <div className="flex justify-between text-[8px] mb-1" style={{ color: 'rgba(255,255,255,.4)' }}>
            <span>Sous-total</span><span>{subtotal.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-[8px] mb-1" style={{ color: delivery === 0 ? '#00ff88' : 'rgba(255,255,255,.4)' }}>
            <span>Livraison</span><span>{delivery === 0 ? 'Gratuite 🎉' : `${delivery.toFixed(2)}€`}</span>
          </div>
          {delivery > 0 && <p className="text-[7px] mb-1" style={{ color: 'rgba(255,255,255,.3)' }}>+ {(50 - subtotal).toFixed(2)}€ pour la livraison offerte</p>}
          <div className="flex justify-between text-[10px] font-black pt-1" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
            <span className="text-white">Total</span>
            <span style={{ color: C }}>{(subtotal + delivery).toFixed(2)}€</span>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3 flex-shrink-0">
        <button className="w-full py-2.5 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5"
          style={{ background: `linear-gradient(135deg,${C},#8800cc)`, color: '#000', boxShadow: `0 4px 20px ${C}40` }}>
          ✅ Commander — {(subtotal + delivery).toFixed(2)}€
        </button>
      </div>
    </div>
  )
}

function ScreenLoyalty() {
  const levels = [
    { name: 'Bronze', min: 0, max: 500, emoji: '🥉', color: '#cd7f32', perks: ['Accès standard'] },
    { name: 'Silver', min: 500, max: 1500, emoji: '🥈', color: '#c0c0c0', perks: ['Ventes privées', 'Nouveautés 24h avant'] },
    { name: 'Gold', min: 1500, max: 3000, emoji: '🥇', color: '#ffd700', perks: ['Réductions exclusives', 'Cadeaux fidélité', 'Accès VIP'] },
  ]
  const points = 250
  const currentLevel = levels[0]
  const nextLevel = levels[1]
  const progress = (points / nextLevel.min) * 100

  return (
    <div className="h-full flex flex-col" style={{ background: '#070010' }}>
      <div className="px-3 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <ChevronLeft size={13} style={{ color: 'rgba(255,255,255,.4)' }} />
        <span className="text-[11px] font-black text-white flex-1">⭐ Fidélité</span>
      </div>
      {/* Current level */}
      <div className="px-3 pt-2.5 pb-2">
        <div className="rounded-xl p-3 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg,${currentLevel.color}15,${currentLevel.color}05)`, border: `1px solid ${currentLevel.color}30` }}>
          <div className="text-3xl mb-1">{currentLevel.emoji}</div>
          <p className="text-[11px] font-black text-white">{currentLevel.name}</p>
          <p className="text-lg font-black mt-0.5" style={{ color: currentLevel.color }}>{points} pts</p>
          {/* Progress */}
          <div className="mt-2 mb-1">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.1)' }}>
              <motion.div className="h-full rounded-full"
                initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ background: `linear-gradient(90deg,${currentLevel.color},${nextLevel.color})` }} />
            </div>
          </div>
          <p className="text-[7px]" style={{ color: 'rgba(255,255,255,.4)' }}>{nextLevel.min - points} pts → {nextLevel.emoji} {nextLevel.name}</p>
        </div>
      </div>
      {/* Levels */}
      <div className="px-3 flex-1 space-y-1.5 overflow-auto">
        {levels.map((lv, i) => (
          <div key={lv.name} className="rounded-xl p-2.5 flex items-start gap-2"
            style={{ background: i === 0 ? `${lv.color}12` : 'rgba(255,255,255,.03)', border: `1px solid ${i === 0 ? lv.color + '30' : 'rgba(255,255,255,.06)'}`, opacity: i === 0 ? 1 : 0.7 }}>
            <span className="text-base">{lv.emoji}</span>
            <div className="flex-1">
              <p className="text-[9px] font-black" style={{ color: lv.color }}>{lv.name}</p>
              <div className="space-y-0.5 mt-0.5">
                {lv.perks.map(p => <p key={p} className="text-[7px]" style={{ color: 'rgba(255,255,255,.4)' }}>• {p}</p>)}
              </div>
            </div>
            {i === 0 && <span className="text-[6px] font-black px-1.5 py-0.5 rounded-full" style={{ background: lv.color, color: '#000' }}>ACTIF</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ScreenRoulette() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<null | typeof ROULETTE_PRIZES[0]>(null)
  const [rotation, setRotation] = useState(0)
  const [spins, setSpins] = useState(3)

  function spin() {
    if (spinning || spins === 0) return
    setResult(null)
    setSpinning(true)
    const prizeIdx = Math.floor(Math.random() * ROULETTE_PRIZES.length)
    const extraSpins = 5
    const targetAngle = extraSpins * 360 + (prizeIdx / ROULETTE_PRIZES.length) * 360
    setRotation(prev => prev + targetAngle + 360)
    setTimeout(() => {
      setSpinning(false)
      setResult(ROULETTE_PRIZES[prizeIdx])
      setSpins(s => s - 1)
    }, 3000)
  }

  const segmentAngle = 360 / ROULETTE_PRIZES.length

  return (
    <div className="h-full flex flex-col" style={{ background: '#070010' }}>
      <div className="px-3 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <ChevronLeft size={13} style={{ color: 'rgba(255,255,255,.4)' }} />
        <span className="text-[11px] font-black text-white flex-1">🎰 Roulette</span>
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${C}20`, color: C }}>{spins} tours</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-3 gap-3">
        {/* Wheel */}
        <div className="relative" style={{ width: 140, height: 140 }}>
          {/* Pointer */}
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-10 w-3 h-4 flex items-end justify-center">
            <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '12px solid #ffd700' }} />
          </div>
          <motion.div className="w-full h-full rounded-full overflow-hidden relative"
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: [0.17, 0.67, 0.12, 1.0] }}
            style={{ boxShadow: `0 0 30px ${C}40, 0 0 60px ${C}20` }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              {ROULETTE_PRIZES.map((prize, i) => {
                const startAngle = (i * segmentAngle - 90) * (Math.PI / 180)
                const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)
                const x1 = 70 + 70 * Math.cos(startAngle)
                const y1 = 70 + 70 * Math.sin(startAngle)
                const x2 = 70 + 70 * Math.cos(endAngle)
                const y2 = 70 + 70 * Math.sin(endAngle)
                const mx = 70 + 42 * Math.cos((startAngle + endAngle) / 2)
                const my = 70 + 42 * Math.sin((startAngle + endAngle) / 2)
                return (
                  <g key={i}>
                    <path d={`M70,70 L${x1},${y1} A70,70 0 0,1 ${x2},${y2} Z`} fill={prize.color} opacity={0.85} />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                      fontSize="10" fill="#000" fontWeight="bold" transform={`rotate(${i * segmentAngle + segmentAngle/2},${mx},${my})`}>
                      {prize.emoji}
                    </text>
                  </g>
                )
              })}
              <circle cx="70" cy="70" r="10" fill="#07000d" stroke={C} strokeWidth="2" />
            </svg>
          </motion.div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              className="rounded-xl px-4 py-2 text-center"
              style={{ background: `${result.color}15`, border: `1px solid ${result.color}40` }}>
              <span className="text-xl">{result.emoji}</span>
              <p className="text-[9px] font-black mt-0.5" style={{ color: result.color }}>
                {result.label.replace('\n', ' ')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={spin} disabled={spinning || spins === 0}
          className="px-6 py-2.5 rounded-xl text-[10px] font-black transition-all"
          style={{
            background: spins === 0 ? 'rgba(255,255,255,.1)' : `linear-gradient(135deg,${C},#8800cc)`,
            color: spins === 0 ? 'rgba(255,255,255,.3)' : '#000',
            opacity: spinning ? 0.7 : 1,
            boxShadow: spins > 0 ? `0 4px 20px ${C}40` : 'none',
          }}>
          {spinning ? '🌀 En cours...' : spins === 0 ? '❌ Plus de tours' : `🎰 Tourner (${spins})`}
        </button>
      </div>
    </div>
  )
}

function ScreenOrders() {
  const steps = [
    { label: 'Commande reçue', time: '09:15', done: true, icon: Package },
    { label: 'Préparation', time: '09:22', done: true, icon: Settings },
    { label: 'Expédiée', time: '09:35', done: true, icon: Truck },
    { label: 'Livrée', time: '~10:05', done: false, icon: CheckCircle },
  ]
  return (
    <div className="h-full flex flex-col" style={{ background: '#070010' }}>
      <div className="px-3 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <ChevronLeft size={13} style={{ color: 'rgba(255,255,255,.4)' }} />
        <span className="text-[11px] font-black text-white flex-1">📦 Suivi</span>
        <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#00ff8820', color: '#00ff88' }}>En route</span>
      </div>
      <div className="px-3 pt-3 flex-1">
        <div className="rounded-xl p-2.5 mb-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
          <p className="text-[8px] font-bold text-white">EXO-0906-001</p>
          <p className="text-[7px] mt-0.5" style={{ color: 'rgba(255,255,255,.4)' }}>OG Kush 3.5g · Amnesia 1g · 38.50€</p>
        </div>
        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.1)' }}>
            <motion.div className="h-full rounded-full"
              initial={{ width: 0 }} animate={{ width: '75%' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ background: `linear-gradient(90deg,${C},#00ff88)` }} />
          </div>
        </div>
        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div key={step.label} className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <div className="flex flex-col items-center">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: step.done ? '#00ff8820' : 'rgba(255,255,255,.06)', border: `1.5px solid ${step.done ? '#00ff88' : 'rgba(255,255,255,.15)'}` }}>
                    <Icon size={10} style={{ color: step.done ? '#00ff88' : 'rgba(255,255,255,.3)' }} />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 mt-0.5" style={{ height: 16, background: step.done ? '#00ff8840' : 'rgba(255,255,255,.08)' }} />
                  )}
                </div>
                <div className="pb-2">
                  <p className="text-[9px] font-bold" style={{ color: step.done ? '#fff' : 'rgba(255,255,255,.35)' }}>{step.label}</p>
                  <p className="text-[7px] mt-0.5" style={{ color: step.done ? 'rgba(255,255,255,.4)' : 'rgba(255,255,255,.2)' }}>{step.time}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
        {/* Livreur */}
        <div className="mt-3 rounded-xl p-2.5 flex items-center gap-2"
          style={{ background: `${C}0a`, border: `1px solid ${C}20` }}>
          <div className="h-7 w-7 rounded-full flex items-center justify-center text-base" style={{ background: `${C}20` }}>🛵</div>
          <div>
            <p className="text-[8px] font-bold text-white">Lucas — Livreur</p>
            <p className="text-[7px]" style={{ color: C }}>À 5 min de chez vous</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Bot Telegram Client ─────────────────────────────────────────────────────

function BotClientScreen() {
  const [inputMsg, setInputMsg] = useState('')
  const [messages, setMessages] = useState([
    { from: 'user', text: '/start', ts: '20:30' },
    { from: 'bot', text: '👋 Bienvenue chez **Exoticz CBD** !\n\nTransformez votre expérience CBD avec notre Mini App premium.\n\nChoisissez une option :', ts: '20:30', buttons: ['🛍️ Catalogue', '⭐ Fidélité', '📦 Commandes', '🎰 Roulette', '📞 Support'] },
  ])
  const [typing, setTyping] = useState(false)

  const botResponses: Record<string, { text: string; buttons?: string[] }> = {
    '/start': { text: '👋 Bienvenue chez **Exoticz CBD** !\n\nChoisissez une option :', buttons: ['🛍️ Catalogue', '⭐ Fidélité', '📦 Commandes', '🎰 Roulette'] },
    '/catalogue': { text: '🛍️ **Catalogue Exoticz**\n\nDécouvrez nos produits CBD premium :\n• Fleurs 🌿\n• Résines\n• Huiles\n• Gummies\n\nOuvrir la boutique :', buttons: ['🌿 Ouvrir la boutique'] },
    '/panier': { text: '🛒 **Votre panier**\n\n• OG Kush 3.5g — 28.00€\n• Amnesia 1g — 8.50€\n\n**Total : 36.50€**\n\nLivraison gratuite à partir de 50€', buttons: ['✅ Commander', '➕ Continuer mes achats'] },
    '/fidelite': { text: '⭐ **Programme Fidélité**\n\nNiveau actuel : 🥉 **Bronze**\nPoints : **250 pts**\n\nProchain niveau Silver à 500 pts.\n\n250 pts restants !', buttons: ['🎰 Utiliser mes points'] },
    '/support': { text: '🎧 **Support Exoticz**\n\nNotre équipe est disponible 7j/7.\n\nComment puis-je vous aider ?', buttons: ['📦 Problème de commande', '💳 Question paiement', '💬 Autre'] },
    '🛍️ Catalogue': { text: '🛍️ **Catalogue Exoticz**\n\nNos meilleures ventes :\n\n🌿 OG Kush Premium — 8.50€/g\n🌿 Amnesia Haze — 7.90€/g\n🌿 Purple Haze — 9.90€/g', buttons: ['🌿 Ouvrir la Mini App'] },
    '⭐ Fidélité': { text: '⭐ **Vos points fidélité**\n\n🥉 Bronze · 250 points\n\nEncore 250 pts pour le niveau Silver !\n\n**Récompenses disponibles :**\n• 1 tour de roulette (500 pts)', buttons: ['🎰 Échanger mes points'] },
    '📦 Commandes': { text: '📦 **Vos commandes**\n\n✅ EXO-0906-001 — Livré\n🚀 EXO-0906-002 — En route\n\nSuivez votre commande en temps réel dans la Mini App.', buttons: ['📍 Suivre ma commande'] },
    '🎰 Roulette': { text: '🎰 **Roulette Exoticz**\n\nVous avez **3 tours** disponibles !\n\nTentez votre chance pour gagner :\n• Livraison offerte 🚚\n• Réductions exclusives 💎\n• Cadeaux surprises 🎁', buttons: ['🎰 Tourner maintenant'] },
    '📞 Support': { text: '🎧 **Support disponible 7j/7**\n\nComment pouvons-nous vous aider ?', buttons: ['📦 Ma commande', '💬 Autre question'] },
  }

  function sendMessage(text: string) {
    const now = new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })
    const newMsg = { from: 'user' as const, text, ts: now }
    setMessages(prev => [...prev, newMsg])
    setInputMsg('')
    setTyping(true)
    setTimeout(() => {
      const resp = botResponses[text] ?? { text: '✅ Message reçu ! Notre équipe vous répondra sous peu.' }
      setMessages(prev => [...prev, { from: 'bot', text: resp.text, ts: now, buttons: resp.buttons }])
      setTyping(false)
    }, 800 + Math.random() * 600)
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#17212b' }}>
      {/* Header Telegram */}
      <div className="px-3 py-2 flex items-center gap-2 flex-shrink-0" style={{ background: '#1c2733', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="h-7 w-7 rounded-full flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#ff1a6e,#8800cc)' }}>🌴</div>
        <div className="flex-1">
          <p className="text-[9px] font-bold text-white">ExoticzBot</p>
          <p className="text-[7px]" style={{ color: '#5d7a8f' }}>bot</p>
        </div>
        <Search size={12} style={{ color: '#5d7a8f' }} />
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-auto px-2 py-2 space-y-1.5" style={{ background: '#0d1117' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%]">
              <div className="px-2.5 py-1.5 rounded-2xl text-[8px] leading-relaxed whitespace-pre-line"
                style={msg.from === 'user'
                  ? { background: '#2b5278', color: '#fff', borderRadius: '14px 14px 4px 14px' }
                  : { background: '#1e2d3d', color: '#fff', borderRadius: '4px 14px 14px 14px' }}>
                {msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
              </div>
              {(msg as any).buttons && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {(msg as any).buttons.map((btn: string) => (
                    <button key={btn} onClick={() => sendMessage(btn)}
                      className="text-[7px] font-bold px-2 py-1 rounded-lg"
                      style={{ background: '#1a4a7a', color: '#6ab3f3', border: '1px solid #2b5278' }}>
                      {btn}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[6px] mt-0.5 text-right" style={{ color: '#5d7a8f' }}>{msg.ts}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-2xl flex items-center gap-1" style={{ background: '#1e2d3d', borderRadius: '4px 14px 14px 14px' }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="h-1.5 w-1.5 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  style={{ background: '#5d7a8f' }} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Commandes rapides */}
      <div className="px-2 py-1 flex gap-1 overflow-x-auto flex-shrink-0" style={{ background: '#1c2733', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        {['/start', '/catalogue', '/panier', '/fidelite', '/support'].map(cmd => (
          <button key={cmd} onClick={() => sendMessage(cmd)}
            className="flex-shrink-0 text-[7px] font-bold px-2 py-1 rounded-lg"
            style={{ background: 'rgba(100,160,200,0.15)', color: '#6ab3f3', border: '1px solid rgba(100,160,200,0.2)' }}>
            {cmd}
          </button>
        ))}
      </div>
      {/* Input */}
      <div className="px-2 py-1.5 flex items-center gap-1.5 flex-shrink-0" style={{ background: '#1c2733' }}>
        <div className="flex-1 rounded-full px-2.5 py-1.5 text-[8px]" style={{ background: '#283747', color: '#5d7a8f' }}>
          Écrire un message...
        </div>
        <button className="h-6 w-6 rounded-full flex items-center justify-center" style={{ background: '#2b5278' }}>
          <Send size={9} style={{ color: '#6ab3f3' }} />
        </button>
      </div>
    </div>
  )
}

// ─── Bot Admin ───────────────────────────────────────────────────────────────

function BotAdminScreen() {
  const [activeCmd, setActiveCmd] = useState<string | null>(null)
  const commands = [
    { cmd: '/addproduct', label: 'Ajouter produit', emoji: '➕', desc: 'Nom, prix, photos, stock' },
    { cmd: '/editproduct', label: 'Modifier produit', emoji: '✏️', desc: 'Modifier prix/stock/images' },
    { cmd: '/deleteproduct', label: 'Supprimer produit', emoji: '🗑️', desc: 'Retirer du catalogue' },
    { cmd: '/broadcast', label: 'Envoyer annonce', emoji: '📢', desc: 'Message à tous les clients' },
    { cmd: '/orders', label: 'Gérer commandes', emoji: '📦', desc: 'Voir & mettre à jour' },
    { cmd: '/stats', label: 'Statistiques', emoji: '📊', desc: 'CA, clients, ventes' },
    { cmd: '/tickets', label: 'Tickets SAV', emoji: '🎧', desc: 'Répondre aux clients' },
  ]

  const responses: Record<string, string> = {
    '/addproduct': '➕ **Ajouter un produit**\n\nEnvoyez le nom du produit :',
    '/editproduct': '✏️ **Modifier produit**\n\nChoisissez le produit :\n\n1. OG Kush Premium\n2. Amnesia Haze\n3. Purple Haze',
    '/broadcast': '📢 **Annonce mass**\n\n12 clients seront notifiés.\n\nRédigez votre message :',
    '/orders': '📦 **Commandes en cours**\n\n• EXO-001 — En route 🚀\n• EXO-002 — Préparation 📦\n• EXO-003 — En attente ⏳\n\nTotal : 3 commandes actives',
    '/stats': '📊 **Statistiques 7 derniers jours**\n\n💰 CA : 1 247€\n📦 Commandes : 23\n👥 Clients actifs : 18\n🌟 Note moyenne : 4.9/5',
    '/tickets': '🎧 **Tickets SAV ouverts**\n\n• #042 — Alex M. · Livraison retardée\n• #041 — Sarah K. · Question produit\n\nRépondre ?',
    '/deleteproduct': '🗑️ **Supprimer produit**\n\n⚠️ Action irréversible.\n\nChoisissez le produit à supprimer :',
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#17212b' }}>
      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-2 flex-shrink-0" style={{ background: '#1c2733', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="h-7 w-7 rounded-full flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#ffd700,#ff8800)' }}>⚙️</div>
        <div className="flex-1">
          <p className="text-[9px] font-bold text-white">ExoticzAdmin</p>
          <p className="text-[7px]" style={{ color: '#5d7a8f' }}>bot admin privé</p>
        </div>
      </div>
      {/* Commandes */}
      <div className="flex-1 overflow-auto px-2 py-2" style={{ background: '#0d1117' }}>
        {!activeCmd ? (
          <>
            <div className="px-2 py-1.5 rounded-2xl text-[8px] mb-2 leading-relaxed" style={{ background: '#1e2d3d', borderRadius: '4px 14px 14px 14px', color: '#fff' }}>
              ⚙️ **Panel Admin Exoticz**{'\n\n'}Choisissez une action :
            </div>
            <div className="space-y-1">
              {commands.map(c => (
                <button key={c.cmd} onClick={() => setActiveCmd(c.cmd)}
                  className="w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                  style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
                  <span className="text-sm">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-bold text-white">{c.label}</p>
                    <p className="text-[7px]" style={{ color: 'rgba(255,255,255,.35)' }}>{c.desc}</p>
                  </div>
                  <ChevronRight size={9} style={{ color: 'rgba(255,255,255,.2)' }} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-end mb-2">
              <div className="px-2.5 py-1.5 rounded-2xl text-[8px]" style={{ background: '#2b5278', color: '#fff', borderRadius: '14px 14px 4px 14px' }}>
                {activeCmd}
              </div>
            </div>
            <div className="px-2 py-1.5 rounded-2xl text-[8px] leading-relaxed whitespace-pre-line" style={{ background: '#1e2d3d', borderRadius: '4px 14px 14px 14px', color: '#fff' }}>
              {(responses[activeCmd] ?? 'Action effectuée ✅').replace(/\*\*(.*?)\*\*/g, '$1')}
            </div>
            <div className="mt-3 flex justify-center">
              <button onClick={() => setActiveCmd(null)} className="text-[7px] px-3 py-1.5 rounded-lg font-bold"
                style={{ background: 'rgba(255,215,0,0.12)', color: '#ffd700' }}>
                ← Retour au menu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Panel Admin Dashboard ───────────────────────────────────────────────────

function AdminPanelScreen() {
  const [tab, setTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard')
  const stats = [
    { label: 'CA du mois', value: '4 820€', trend: '+18%', color: '#00ff88', icon: TrendingUp },
    { label: 'Commandes', value: '89', trend: '+12%', color: '#00cfff', icon: Package },
    { label: 'Clients actifs', value: '63', trend: '+8%', color: C, icon: Users },
    { label: 'Note moyenne', value: '4.9★', trend: '', color: '#ffd700', icon: Star },
  ]
  const orders = [
    { id: 'EXO-001', client: 'Alex M.', status: 'Livré', amount: '38.50€', color: '#00ff88' },
    { id: 'EXO-002', client: 'Sarah K.', status: 'En route', amount: '52.00€', color: C },
    { id: 'EXO-003', client: 'Thomas R.', status: 'Préparat.', amount: '28.00€', color: '#8800cc' },
    { id: 'EXO-004', client: 'Julie P.', status: 'En attente', amount: '98.00€', color: '#ffd700' },
  ]
  const products = [
    { name: 'OG Kush Premium', stock: 47, price: '8.50€/g', badge: '🔥' },
    { name: 'Amnesia Haze', stock: 23, price: '7.90€/g', badge: '' },
    { name: 'Purple Haze', stock: 5, price: '9.90€/g', badge: '⚠️' },
    { name: 'Gelato CBD', stock: 31, price: '11.90€/g', badge: '' },
  ]

  return (
    <div className="h-full flex flex-col" style={{ background: '#05000f' }}>
      {/* Top bar */}
      <div className="px-3 py-2 flex items-center gap-2 flex-shrink-0" style={{ background: 'rgba(255,26,110,0.06)', borderBottom: `1px solid ${C}20` }}>
        <LayoutDashboard size={11} style={{ color: C }} />
        <span className="text-[9px] font-black text-white flex-1">Panel Admin · Exoticz</span>
        <Bell size={11} style={{ color: 'rgba(255,255,255,.4)' }} />
      </div>
      {/* Tabs */}
      <div className="flex px-3 pt-2 pb-1 gap-1 flex-shrink-0">
        {(['dashboard', 'orders', 'products'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-1 rounded-lg text-[7px] font-bold capitalize transition-all"
            style={tab === t ? { background: C, color: '#000' } : { background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.4)' }}>
            {t === 'dashboard' ? '📊 Stats' : t === 'orders' ? '📦 Cmdes' : '🌿 Produits'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 pb-2">
        {tab === 'dashboard' && (
          <div className="space-y-1.5 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              {stats.map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="rounded-xl p-2.5"
                    style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                    <div className="flex items-center justify-between mb-1">
                      <Icon size={10} style={{ color: s.color }} />
                      {s.trend && <span className="text-[6px] font-bold" style={{ color: '#00ff88' }}>{s.trend}</span>}
                    </div>
                    <p className="text-[11px] font-black text-white">{s.value}</p>
                    <p className="text-[7px]" style={{ color: 'rgba(255,255,255,.35)' }}>{s.label}</p>
                  </div>
                )
              })}
            </div>
            {/* Chart placeholder */}
            <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[8px] font-bold text-white">Ventes 7 jours</p>
                <span className="text-[6px]" style={{ color: 'rgba(255,255,255,.3)' }}>En €</span>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[40, 65, 45, 80, 70, 95, 60].map((h, i) => (
                  <motion.div key={i} className="flex-1 rounded-t-sm"
                    initial={{ height: 0 }} animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    style={{ background: i === 5 ? C : `${C}40`, alignSelf: 'flex-end' }} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {['L','M','M','J','V','S','D'].map((d, i) => (
                  <span key={i} className="flex-1 text-center text-[6px]" style={{ color: 'rgba(255,255,255,.25)' }}>{d}</span>
                ))}
              </div>
            </div>
            {/* Ticket SAV */}
            <div className="rounded-xl p-2" style={{ background: 'rgba(255,136,85,0.06)', border: '1px solid rgba(255,136,85,0.2)' }}>
              <div className="flex items-center gap-1.5">
                <MessageSquare size={10} style={{ color: '#ff8855' }} />
                <p className="text-[8px] font-bold text-white flex-1">2 tickets SAV ouverts</p>
                <span className="text-[6px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#ff885520', color: '#ff8855' }}>URGENT</span>
              </div>
            </div>
          </div>
        )}
        {tab === 'orders' && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="flex-1 rounded-lg px-2 py-1 flex items-center gap-1" style={{ background: 'rgba(255,255,255,.05)' }}>
                <Search size={8} style={{ color: 'rgba(255,255,255,.3)' }} />
                <span className="text-[7px]" style={{ color: 'rgba(255,255,255,.3)' }}>Rechercher...</span>
              </div>
              <Filter size={10} style={{ color: 'rgba(255,255,255,.3)' }} />
            </div>
            {orders.map(o => (
              <div key={o.id} className="rounded-xl p-2.5 flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div>
                  <p className="text-[8px] font-bold text-white">{o.client}</p>
                  <p className="text-[7px]" style={{ color: 'rgba(255,255,255,.35)' }}>{o.id}</p>
                </div>
                <div className="flex-1" />
                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${o.color}15`, color: o.color }}>{o.status}</span>
                <span className="text-[8px] font-black" style={{ color: 'rgba(255,255,255,.7)' }}>{o.amount}</span>
              </div>
            ))}
          </div>
        )}
        {tab === 'products' && (
          <div className="space-y-1.5 pt-1">
            <button className="w-full py-2 rounded-xl text-[8px] font-bold flex items-center justify-center gap-1.5"
              style={{ background: `${C}15`, border: `1px solid ${C}30`, color: C }}>
              <Plus size={10} /> Ajouter un produit
            </button>
            {products.map(p => (
              <div key={p.name} className="rounded-xl p-2.5 flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="h-7 w-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: `${C}12` }}>🌿</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[8px] font-bold text-white truncate">{p.name}</p>
                    {p.badge && <span className="text-[8px]">{p.badge}</span>}
                  </div>
                  <p className="text-[7px]" style={{ color: p.stock < 10 ? '#ff5555' : 'rgba(255,255,255,.35)' }}>
                    Stock : {p.stock}g · {p.price}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="h-5 w-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,255,255,.06)' }}>
                    <Edit2 size={8} style={{ color: 'rgba(255,255,255,.5)' }} />
                  </button>
                  <button className="h-5 w-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,85,85,0.1)' }}>
                    <Trash2 size={8} style={{ color: '#ff5555' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Modal Démo Exoticz ──────────────────────────────────────────────────────

const MINI_APP_SCREENS = [
  { id: 'home', label: 'Accueil', component: ScreenHome },
  { id: 'catalog', label: 'Boutique', component: ScreenCatalog },
  { id: 'product', label: 'Produit', component: ScreenProduct },
  { id: 'cart', label: 'Panier', component: ScreenCart },
  { id: 'loyalty', label: 'Fidélité', component: ScreenLoyalty },
  { id: 'roulette', label: 'Roulette', component: ScreenRoulette },
  { id: 'orders', label: 'Suivi', component: ScreenOrders },
]

function ExoticzDemoModal({ onClose }: { onClose: () => void }) {
  const [mainTab, setMainTab] = useState<'miniapp' | 'bot' | 'admin' | 'panel'>('miniapp')
  const [screenIdx, setScreenIdx] = useState(0)

  const CurrentScreen = MINI_APP_SCREENS[screenIdx].component

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,.95)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}>
      <motion.div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden"
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#080015', border: `1px solid ${C}25`, boxShadow: `0 0 80px ${C}30, 0 40px 80px rgba(0,0,0,.8)` }}>

        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${C}20` }}>
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg,${C}30,#8800cc30)`, border: `1px solid ${C}30` }}>
            🌴
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-white">Exoticz CBD</p>
            <p className="text-[10px] font-bold" style={{ color: C }}>Démo interactive</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,.06)' }}>
            <X size={15} style={{ color: 'rgba(255,255,255,.5)' }} />
          </button>
        </div>

        {/* Main tabs */}
        <div className="flex gap-1 px-3 py-2.5" style={{ background: 'rgba(0,0,0,.3)', borderBottom: `1px solid rgba(255,255,255,.06)` }}>
          {([
            { id: 'miniapp', label: '📱 Mini App' },
            { id: 'bot', label: '🤖 Bot Client' },
            { id: 'admin', label: '⚙️ Bot Admin' },
            { id: 'panel', label: '🖥️ Panel' },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              className="flex-1 py-1.5 rounded-xl text-[8px] font-bold transition-all"
              style={mainTab === t.id
                ? { background: `${C}25`, color: C, border: `1px solid ${C}40` }
                : { background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.4)', border: '1px solid transparent' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          {mainTab === 'miniapp' && (
            <div className="flex flex-col items-center">
              {/* Sous-navigation écrans */}
              <div className="flex gap-1.5 mb-3 w-full overflow-x-auto pb-0.5">
                {MINI_APP_SCREENS.map((s, i) => (
                  <button key={s.id} onClick={() => setScreenIdx(i)}
                    className="flex-shrink-0 text-[7px] font-bold px-2 py-1 rounded-lg transition-all"
                    style={i === screenIdx
                      ? { background: C, color: '#000' }
                      : { background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.45)' }}>
                    {s.label}
                  </button>
                ))}
              </div>
              {/* iPhone */}
              <div className="relative" style={{ width: 200, height: 390 }}>
                <div className="absolute inset-0 rounded-[36px]"
                  style={{ background: '#111125', border: `2px solid ${C}45`, boxShadow: `0 0 60px ${C}35, 0 20px 60px rgba(0,0,0,.8)` }} />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full z-10"
                  style={{ background: '#0a0a1a' }} />
                {/* Side buttons */}
                <div className="absolute left-[-2px] top-20 w-0.5 h-7 rounded-full" style={{ background: `${C}50` }} />
                <div className="absolute left-[-2px] top-32 w-0.5 h-10 rounded-full" style={{ background: `${C}50` }} />
                <div className="absolute right-[-2px] top-24 w-0.5 h-12 rounded-full" style={{ background: `${C}35` }} />
                {/* Screen */}
                <div className="absolute inset-[3px] rounded-[33px] overflow-hidden" style={{ top: 8, bottom: 8 }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={screenIdx} className="h-full"
                      initial={{ x: 15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -15, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <CurrentScreen />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-1 w-16 rounded-full"
                  style={{ background: `${C}70` }} />
                <div className="absolute inset-0 rounded-[36px] pointer-events-none"
                  style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.07) 0%,transparent 55%)' }} />
              </div>
              {/* Dots */}
              <div className="flex gap-1.5 mt-3">
                {MINI_APP_SCREENS.map((_, i) => (
                  <button key={i} onClick={() => setScreenIdx(i)}
                    className="rounded-full transition-all"
                    style={{ width: i === screenIdx ? 20 : 5, height: 5, background: i === screenIdx ? C : 'rgba(255,255,255,.2)' }} />
                ))}
              </div>
              {/* Prev/Next */}
              <div className="flex gap-2 mt-2">
                <button onClick={() => setScreenIdx(i => Math.max(0, i - 1))} disabled={screenIdx === 0}
                  className="px-3 py-1.5 rounded-xl text-[9px] font-bold disabled:opacity-25"
                  style={{ background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)' }}>← Préc.</button>
                <button onClick={() => setScreenIdx(i => Math.min(MINI_APP_SCREENS.length - 1, i + 1))} disabled={screenIdx === MINI_APP_SCREENS.length - 1}
                  className="px-3 py-1.5 rounded-xl text-[9px] font-bold disabled:opacity-25"
                  style={{ background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)' }}>Suiv. →</button>
              </div>
            </div>
          )}

          {mainTab === 'bot' && (
            <div className="flex flex-col items-center">
              <p className="text-[9px] font-bold mb-3 text-center" style={{ color: 'rgba(255,255,255,.4)' }}>
                Simulation du Bot Telegram Client — clique sur les commandes
              </p>
              <div className="relative" style={{ width: 200, height: 380 }}>
                <div className="absolute inset-0 rounded-[36px]"
                  style={{ background: '#111125', border: `2px solid #2b5278`, boxShadow: '0 0 40px rgba(43,82,120,0.4)' }} />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full z-10" style={{ background: '#0a0a1a' }} />
                <div className="absolute inset-[3px] rounded-[33px] overflow-hidden" style={{ top: 8, bottom: 8 }}>
                  <BotClientScreen />
                </div>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-1 w-16 rounded-full" style={{ background: 'rgba(43,82,120,0.7)' }} />
              </div>
            </div>
          )}

          {mainTab === 'admin' && (
            <div className="flex flex-col items-center">
              <p className="text-[9px] font-bold mb-3 text-center" style={{ color: 'rgba(255,255,255,.4)' }}>
                Bot Admin privé — accessible uniquement au propriétaire
              </p>
              <div className="relative" style={{ width: 200, height: 380 }}>
                <div className="absolute inset-0 rounded-[36px]"
                  style={{ background: '#111125', border: '2px solid rgba(255,215,0,0.4)', boxShadow: '0 0 40px rgba(255,215,0,0.2)' }} />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full z-10" style={{ background: '#0a0a1a' }} />
                <div className="absolute inset-[3px] rounded-[33px] overflow-hidden" style={{ top: 8, bottom: 8 }}>
                  <BotAdminScreen />
                </div>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-1 w-16 rounded-full" style={{ background: 'rgba(255,215,0,0.5)' }} />
              </div>
            </div>
          )}

          {mainTab === 'panel' && (
            <div className="flex flex-col items-center">
              <p className="text-[9px] font-bold mb-3 text-center" style={{ color: 'rgba(255,255,255,.4)' }}>
                Panel administrateur web — accessible via navigateur
              </p>
              <div className="relative" style={{ width: 220, height: 380 }}>
                {/* Laptop frame */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{ background: '#0d0020', border: `1.5px solid ${C}30`, boxShadow: `0 0 40px ${C}20` }}>
                  {/* Window bar */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5" style={{ background: 'rgba(255,255,255,.04)', borderBottom: `1px solid rgba(255,255,255,.06)` }}>
                    {['#ff5f57','#febc2e','#28c840'].map(col => (
                      <div key={col} className="h-2 w-2 rounded-full" style={{ background: col }} />
                    ))}
                    <div className="flex-1 mx-2 rounded px-2 py-0.5 text-[6px]" style={{ background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.3)' }}>
                      panel.exoticz.fr/admin
                    </div>
                  </div>
                  <AdminPanelScreen />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-4 pb-4 pt-0" style={{ borderTop: `1px solid ${C}15` }}>
          <p className="text-center text-[9px] mb-2 mt-3" style={{ color: 'rgba(255,255,255,.35)' }}>
            🚀 Vous voulez la même chose pour votre business ?
          </p>
          <Link href="/contact" onClick={onClose}>
            <motion.button whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg,${C},#8800cc)`, color: '#fff', boxShadow: `0 6px 30px ${C}40` }}>
              🚀 Je veux la même chose — 1 200€
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Autres projets ──────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 'exoticz', name: 'Exoticz CBD', category: 'E-commerce CBD', color: '#ff1a6e',
    bg: 'linear-gradient(135deg,#150010,#200025)', glow: 'rgba(255,26,110,0.45)',
    emoji: '🌴', tag: '⭐ PROJET RÉEL', tagColor: '#ffd700',
    checklist: ['Bot Telegram', 'Mini App Telegram', 'Panel Administrateur', 'Hébergement', 'Livré ✓'],
    preview: 'Boutique CBD premium, fidélité, roulette, suivi commande, SAV',
  },
  {
    id: 'restaurant', name: 'RestoBot', category: 'Restaurant / Livraison', color: '#ff8855',
    bg: 'linear-gradient(135deg,#1a0800,#2a1000)', glow: 'rgba(255,136,85,0.4)',
    emoji: '🍕', tag: 'TEMPLATE', tagColor: '#ff8855',
    checklist: ['Bot Telegram', 'Mini App', 'Panel Admin'],
    preview: 'Menu interactif, commandes, livraison express, avis clients',
  },
  {
    id: 'coiffeur', name: 'StyleBot', category: 'Coiffeur / Esthétique', color: '#cc88ff',
    bg: 'linear-gradient(135deg,#0f0020,#1a0035)', glow: 'rgba(204,136,255,0.4)',
    emoji: '✂️', tag: 'TEMPLATE', tagColor: '#cc88ff',
    checklist: ['Bot Telegram', 'Mini App', 'Réservations'],
    preview: 'Réservation créneaux, catalogue prestations, rappels automatiques',
  },
  {
    id: 'livraison', name: 'DelivBot', category: 'Livraison Express', color: '#00cfff',
    bg: 'linear-gradient(135deg,#001520,#002030)', glow: 'rgba(0,207,255,0.4)',
    emoji: '🛵', tag: 'TEMPLATE', tagColor: '#00cfff',
    checklist: ['Bot Telegram', 'Mini App', 'Suivi GPS'],
    preview: 'Suivi temps réel, gestion livreurs, zones de livraison',
  },
]

// Screens simplifiés pour autres projets
function SimpleScreen({ project, screen }: { project: typeof PROJECTS[0], screen: number }) {
  const c = project.color
  if (project.id === 'restaurant') {
    const screens = [
      <div key="home" className="h-full flex flex-col" style={{ background: '#0a0500' }}>
        <div className="h-16 flex flex-col items-center justify-center" style={{ background: `${c}20` }}>
          <span className="text-3xl">🍕</span>
          <p className="text-[9px] font-black text-white mt-0.5">La Bella Italia</p>
          <p className="text-[7px]" style={{ color: 'rgba(255,255,255,.4)' }}>Livraison 25-35 min · Ouvert</p>
        </div>
        <div className="px-3 pt-2 flex-1 space-y-1.5">
          {[['🍕','Pizzas','12 spécialités'],['🍝','Pâtes','8 recettes'],['🥗','Salades','6 options']].map(([i,t,s])=>(
            <div key={String(t)} className="flex items-center gap-2 rounded-xl p-2" style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${c}15` }}>
              <span className="text-base">{i}</span>
              <div><p className="text-[9px] font-bold text-white">{t}</p><p className="text-[7px]" style={{ color: 'rgba(255,255,255,.3)' }}>{s}</p></div>
            </div>
          ))}
        </div>
      </div>,
      <div key="order" className="h-full flex flex-col items-center justify-center" style={{ background: '#0a0500' }}>
        <div className="text-4xl mb-2">✅</div>
        <p className="text-[11px] font-black text-white">Commande confirmée !</p>
        <p className="text-[9px] mt-1" style={{ color: 'rgba(255,255,255,.4)' }}>Livraison estimée 28 min</p>
        <div className="mt-2 text-[9px] px-3 py-1.5 rounded-full" style={{ background: `${c}20`, color: c }}>🍕 En préparation</div>
      </div>,
    ]
    return screens[screen % screens.length]
  }
  if (project.id === 'coiffeur') {
    const screens = [
      <div key="home" className="h-full flex flex-col" style={{ background: '#0a0018' }}>
        <div className="px-3 pt-4 pb-2" style={{ background: `${c}15` }}>
          <p className="text-[11px] font-black text-white">✂️ StyleBot</p>
          <p className="text-[8px]" style={{ color: 'rgba(255,255,255,.45)' }}>Salon premium · Paris 8e</p>
        </div>
        <div className="px-3 pt-2 flex-1 space-y-1.5">
          {[['💈','Coupes','Homme, Femme, Enfant'],['🎨','Colorations','Mèches, balayage'],['📅','Mes RDV','Réservations']].map(([i,t,s])=>(
            <div key={String(t)} className="flex items-center gap-2 rounded-xl p-2" style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${c}15` }}>
              <span className="text-base">{i}</span>
              <div><p className="text-[9px] font-bold text-white">{t}</p><p className="text-[7px]" style={{ color: 'rgba(255,255,255,.3)' }}>{s}</p></div>
            </div>
          ))}
        </div>
      </div>,
      <div key="rdv" className="h-full flex flex-col items-center justify-center" style={{ background: '#0a0018' }}>
        <div className="text-3xl mb-2">📅</div>
        <p className="text-[10px] font-black text-white">RDV confirmé !</p>
        <p className="text-[8px] mt-1" style={{ color: 'rgba(255,255,255,.4)' }}>Mardi 10 juin · 14h00</p>
        <p className="text-[8px] mt-0.5" style={{ color: c }}>Coupe + Brushing — 45€</p>
      </div>,
    ]
    return screens[screen % screens.length]
  }
  if (project.id === 'livraison') {
    const screens = [
      <div key="home" className="h-full flex flex-col" style={{ background: '#001520' }}>
        <div className="px-3 pt-4 pb-2">
          <p className="text-[11px] font-black text-white">🛵 DelivBot</p>
          <p className="text-[8px]" style={{ color: 'rgba(255,255,255,.4)' }}>Livraison express 30 min</p>
        </div>
        <div className="px-3 flex-1 space-y-1.5">
          {[['📦','Commande active','EXO-001 · En route'],['📋','Historique','12 dernières commandes'],['📍','Suivi live','Livreur à 5 min']].map(([i,t,s])=>(
            <div key={String(t)} className="flex items-center gap-2 rounded-xl p-2" style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${c}15` }}>
              <span>{i}</span>
              <div><p className="text-[9px] font-bold text-white">{t}</p><p className="text-[7px]" style={{ color: 'rgba(255,255,255,.3)' }}>{s}</p></div>
            </div>
          ))}
        </div>
      </div>,
      <div key="delivered" className="h-full flex flex-col items-center justify-center" style={{ background: '#001520' }}>
        <div className="text-4xl mb-2">🎉</div>
        <p className="text-[10px] font-black text-white">Livraison effectuée !</p>
        <p className="text-[8px] mt-1" style={{ color: 'rgba(255,255,255,.4)' }}>Livré en 27 min</p>
        <div className="flex mt-2">{[1,2,3,4,5].map(s=><Star key={s} size={12} className="fill-yellow-400 text-yellow-400"/>)}</div>
      </div>,
    ]
    return screens[screen % screens.length]
  }
  return <div className="h-full flex items-center justify-center"><span className="text-4xl">{project.emoji}</span></div>
}

function OtherDemoModal({ project, onClose }: { project: typeof PROJECTS[0]; onClose: () => void }) {
  const [screenIdx, setScreenIdx] = useState(0)
  const c = project.color
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}>
      <motion.div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden"
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#080015', border: `1px solid ${c}25` }}>
        <div className="px-4 pt-4 pb-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${c}20` }}>
          <span className="text-xl">{project.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-black text-white">{project.name}</p>
            <p className="text-[10px]" style={{ color: c }}>Démo interactive</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,.06)' }}>
            <X size={15} style={{ color: 'rgba(255,255,255,.5)' }} />
          </button>
        </div>
        <div className="flex flex-col items-center py-6 px-4" style={{ background: 'linear-gradient(180deg,#080015,#050010)' }}>
          <div className="relative" style={{ width: 200, height: 380 }}>
            <div className="absolute inset-0 rounded-[36px]" style={{ background: '#111125', border: `2px solid ${c}50`, boxShadow: `0 0 60px ${project.glow}` }} />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full z-10" style={{ background: '#0a0a1a' }} />
            <div className="absolute inset-[3px] rounded-[33px] overflow-hidden" style={{ top: 8, bottom: 8 }}>
              <AnimatePresence mode="wait">
                <motion.div key={screenIdx} className="h-full"
                  initial={{ x: 15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -15, opacity: 0 }}
                  transition={{ duration: 0.2 }}>
                  <SimpleScreen project={project} screen={screenIdx} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-1 w-16 rounded-full" style={{ background: `${c}70` }} />
          </div>
          <div className="flex gap-2 mt-4">
            {[0, 1].map(i => (
              <button key={i} onClick={() => setScreenIdx(i)}
                className="rounded-full transition-all"
                style={{ width: i === screenIdx ? 20 : 5, height: 5, background: i === screenIdx ? c : 'rgba(255,255,255,.2)' }} />
            ))}
          </div>
          <div className="flex gap-3 mt-3">
            <button onClick={() => setScreenIdx(i => Math.max(0, i - 1))} disabled={screenIdx === 0}
              className="px-4 py-2 rounded-xl text-[9px] font-bold disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.6)' }}>← Préc.</button>
            <button onClick={() => setScreenIdx(i => Math.min(1, i + 1))} disabled={screenIdx === 1}
              className="px-4 py-2 rounded-xl text-[9px] font-bold disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.6)' }}>Suiv. →</button>
          </div>
        </div>
        <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid ${c}15` }}>
          <p className="text-center text-[9px] text-white/40 mb-3">🚀 Vous voulez la même chose ?</p>
          <Link href="/contact" onClick={onClose}>
            <motion.button whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl text-sm font-black"
              style={{ background: `linear-gradient(135deg,${c},${c}70)`, color: '#000' }}>
              🚀 Je veux la même chose — 1 200€
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Carte projet ────────────────────────────────────────────────────────────

function ProjectCard({ project, onDemo }: { project: typeof PROJECTS[0]; onDemo: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 250, damping: 25 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 250, damping: 25 })
  const isExoticz = project.id === 'exoticz'

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onMouseLeave() { mx.set(0); my.set(0) }

  return (
    <motion.div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.55 }}>
      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        className="relative cursor-pointer" onClick={onDemo}>

        {/* Glow */}
        <motion.div className="absolute inset-0 rounded-3xl blur-2xl"
          initial={{ opacity: 0 }} whileHover={{ opacity: isExoticz ? 0.7 : 0.5 }}
          style={{ background: project.glow, transform: 'scale(1.08) translateZ(-5px)' }} />

        {/* Card */}
        <motion.div whileHover={{ scale: 1.015 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: project.bg, border: `1px solid ${project.color}30`, boxShadow: `0 20px 60px ${project.glow}` }}>

          {/* Header */}
          <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `${project.color}20`, border: `1px solid ${project.color}30` }}>
                {project.emoji}
              </div>
              <div>
                <p className="font-black text-white text-sm">{project.name}</p>
                <p className="text-[10px] font-bold mt-0.5" style={{ color: project.color }}>{project.category}</p>
              </div>
            </div>
            <span className="text-[9px] font-black px-2 py-1 rounded-full flex-shrink-0"
              style={{ background: `${project.tagColor}20`, color: project.tagColor, border: `1px solid ${project.tagColor}30` }}>
              {project.tag}
            </span>
          </div>

          {/* Checklist + phone (pour Exoticz) ou phone seul */}
          <div className={`px-5 pb-4 ${isExoticz ? 'flex gap-4 items-center' : 'flex justify-center'}`}>
            {isExoticz && (
              <div className="flex-1 space-y-1.5">
                {project.checklist.map((item, i) => (
                  <motion.div key={item} className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#00ff8820', border: '1px solid #00ff8840' }}>
                      <CheckCircle size={9} style={{ color: '#00ff88' }} />
                    </div>
                    <span className="text-[9px] text-white/75">{item}</span>
                  </motion.div>
                ))}
                <p className="text-[8px] mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,.4)' }}>{project.preview}</p>
              </div>
            )}

            {/* Phone mockup */}
            <div className="relative flex-shrink-0" style={{ width: isExoticz ? 100 : 130, height: isExoticz ? 180 : 220 }}>
              <div className="absolute inset-0 rounded-[20px]"
                style={{ background: '#1a1a2e', border: `2px solid ${project.color}40`, boxShadow: `0 0 30px ${project.glow}` }} />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-2.5 w-12 rounded-full z-10" style={{ background: '#0d0d1a' }} />
              <div className="absolute inset-[3px] rounded-[17px] overflow-hidden" style={{ top: 5, bottom: 5 }}>
                {isExoticz ? <ScreenHome /> : <SimpleScreen project={project} screen={0} />}
              </div>
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                style={{ background: `${project.color}60` }} />
              <div className="absolute inset-0 rounded-[20px] pointer-events-none"
                style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.07) 0%,transparent 55%)' }} />
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 pb-5">
            <motion.button whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg,${project.color},${project.color}70)`, color: isExoticz ? '#fff' : '#000',
                boxShadow: `0 4px 20px ${project.glow}` }}>
              {isExoticz ? '🚀 Voir la démo complète' : '👁 Voir la démo interactive'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Avis clients ────────────────────────────────────────────────────────────

const REVIEWS = [
  { name: 'Alexandre M.', text: 'Une expérience utilisateur incroyable. La Mini App est fluide, rapide et le design est exceptionnel.', stars: 5, role: 'Client Exoticz CBD' },
  { name: 'Sarah K.', text: 'Interface ultra intuitive. Mes clients commandent en 2 clics. Le ROI a été immédiat dès la première semaine.', stars: 5, role: 'Gérante boutique' },
  { name: 'Thomas R.', text: 'Le panel admin est parfait. Je gère tout depuis mon téléphone. Vraiment impressionnant pour ce prix.', stars: 5, role: 'E-commerçant' },
  { name: 'Julie P.', text: 'La roulette fidélité fait adorer mes clients. Ils reviennent juste pour tenter leur chance. Génial !', stars: 5, role: 'Propriétaire CBD shop' },
]

function ReviewsSection() {
  return (
    <div className="px-4 mt-8">
      <motion.div className="text-center mb-5"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,215,0,0.6)' }}>Avis clients</p>
        <h2 className="text-xl font-black text-white">Ce qu&apos;ils disent</h2>
      </motion.div>
      <div className="space-y-3">
        {REVIEWS.map((review, i) => (
          <motion.div key={review.name}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-4"
            style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)' }}>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: review.stars }).map((_, j) => (
                <Star key={j} size={11} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-[11px] leading-relaxed text-white/80 mb-3 italic">&ldquo;{review.text}&rdquo;</p>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: `linear-gradient(135deg,${C},#8800cc)`, color: '#fff' }}>
                {review.name[0]}
              </div>
              <div>
                <p className="text-[9px] font-bold text-white">{review.name}</p>
                <p className="text-[8px]" style={{ color: 'rgba(255,255,255,.35)' }}>{review.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [demoProject, setDemoProject] = useState<typeof PROJECTS[0] | null>(null)

  return (
    <div className="pb-28 min-h-screen" style={{ background: 'linear-gradient(180deg,#020a18 0%,#040d20 100%)' }}>

      {/* Hero */}
      <div className="relative overflow-hidden px-5 pt-8 pb-6 text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 60% at 50% -20%,rgba(0,207,255,.1),transparent)' }} />
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(0,207,255,.65)' }}>
            Mini-Apps · Bots · Automatisations
          </p>
          <h1 className="text-3xl font-black text-white leading-tight mb-2">🔥 Nos Réalisations</h1>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,.4)' }}>
            Découvrez des Mini-Apps Telegram réelles créées pour nos clients.
          </p>
        </motion.div>
      </div>

      {/* Cards */}
      <div className="px-4 space-y-5">
        {PROJECTS.map((project, i) => (
          <motion.div key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}>
            <ProjectCard project={project} onDemo={() => setDemoProject(project)} />
          </motion.div>
        ))}
      </div>

      {/* Reviews */}
      <ReviewsSection />

      {/* Bottom CTA */}
      <motion.div className="mx-4 mt-8 mb-4"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="rounded-3xl p-6 text-center"
          style={{ background: 'rgba(0,207,255,.04)', border: '1px solid rgba(0,207,255,.18)' }}>
          <p className="text-lg font-black text-white mb-1">Votre Mini-App sur mesure</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,.4)' }}>Livraison 48h · Pack Complet 1 200€</p>
          <Link href="/contact">
            <motion.button whileTap={{ scale: 0.97 }}
              className="btn-primary w-full justify-center">
              🚀 Commencer mon projet
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {demoProject && demoProject.id === 'exoticz' && (
          <ExoticzDemoModal onClose={() => setDemoProject(null)} />
        )}
        {demoProject && demoProject.id !== 'exoticz' && (
          <OtherDemoModal project={demoProject} onClose={() => setDemoProject(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
