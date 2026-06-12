'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Send, Loader } from 'lucide-react'

// ─── Telegram SDK ─────────────────────────────────────────────────────────────
type TgUser = { id: number; username?: string; first_name?: string; last_name?: string }

function readTgUser(): TgUser | null {
  if (typeof window === 'undefined') return null
  try {
    const u = (window as any).Telegram?.WebApp?.initDataUnsafe?.user
    if (!u?.id) return null
    console.log('[ApplyaaBot] Telegram user:', u)
    return u
  } catch { return null }
}

// ─── Pack items ───────────────────────────────────────────────────────────────
const PACK_ITEMS = [
  { icon: '🤖', text: 'Bot Telegram personnalisé' },
  { icon: '📱', text: 'Mini App Telegram premium' },
  { icon: '⚙️', text: 'Panel Administrateur complet' },
  { icon: '🚀', text: 'Configuration & déploiement inclus' },
  { icon: '🎯', text: 'Accompagnement au lancement' },
  { icon: '⏱️', text: 'Livraison sous 48h à 7 jours' },
]

// ─── Confettis ────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#3b82f6', '#a855f7', '#22d3ee', '#f59e0b', '#10b981']
function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.random() * 100, delay: Math.random() * 0.5,
    duration: 1.6 + Math.random() * 1.2, size: 5 + Math.random() * 5,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 99 }}>
      {pieces.map(p => (
        <motion.div key={p.id}
          initial={{ y: -10, x: `${p.x}vw`, opacity: 1 }}
          animate={{ y: '110vh', opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{ position: 'fixed', top: 0, width: p.size, height: p.size * 0.5,
            borderRadius: 2, background: p.color }} />
      ))}
    </div>
  )
}

// ─── Animated checkmark ───────────────────────────────────────────────────────
function AnimatedCheck() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <motion.path d="M8 20 L17 29 L32 12" stroke="#60a5fa" strokeWidth="3.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.45, duration: 0.5, ease: 'easeOut' }} />
    </svg>
  )
}

// ─── Écran succès ─────────────────────────────────────────────────────────────
const TG_ME = 'Aapply_bot'
const TG_MSG = encodeURIComponent('Bonjour, je viens de faire une demande sur Aapply_bot concernant le Pack Complet à 1200€.')
const TG_URL = `https://t.me/${TG_ME}?text=${TG_MSG}`

function SuccessScreen({ username }: { username?: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full max-w-sm mx-auto text-center pt-4">
      <Confetti />

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 relative"
        style={{ background: 'linear-gradient(135deg,rgba(59,130,246,.15),rgba(168,85,247,.15))',
          border: '2px solid rgba(59,130,246,.4)',
          boxShadow: '0 0 0 12px rgba(59,130,246,.06), 0 0 60px rgba(59,130,246,.2)' }}>
        <motion.div className="absolute inset-0 rounded-full"
          style={{ border: '2px solid rgba(59,130,246,.3)' }}
          animate={{ scale: [1,1.35,1.35], opacity: [0.8,0,0] }}
          transition={{ delay: 0.6, duration: 1.2, repeat: 2 }} />
        <AnimatedCheck />
      </motion.div>

      <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }} className="text-2xl font-black text-white mb-2 tracking-tight">
        Demande envoyée !
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }} className="text-sm leading-relaxed mb-1"
        style={{ color: 'rgba(255,255,255,.5)' }}>
        Nous étudions votre projet et revenons vers vous rapidement.
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }} className="text-xs font-semibold mb-7"
        style={{ color: 'rgba(255,255,255,.28)' }}>
        ⏱️ Réponse généralement sous 2 heures
      </motion.p>

      {/* Pack recap */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="rounded-2xl p-4 mb-5 text-left relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(59,130,246,.07),rgba(168,85,247,.07))',
          border: '1px solid rgba(59,130,246,.2)' }}>
        <div style={{ position:'absolute',top:0,left:'30%',right:'30%',height:1,
          background:'linear-gradient(90deg,transparent,rgba(96,165,250,.6),transparent)' }} />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>🚀</div>
          <div className="flex-1">
            <p className="text-xs font-black text-white">PACK COMPLET</p>
            <p className="text-[10px]" style={{ color:'rgba(255,255,255,.35)' }}>Bot · Mini App · Panel Admin</p>
          </div>
          <span className="text-lg font-black text-blue-400">1 200€</span>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor:'rgba(255,255,255,.06)' }}>
          <span className="text-[10px]" style={{ color:'rgba(255,255,255,.3)' }}>⏱ Livraison 48h à 7 jours · Configuration incluse</span>
        </div>
      </motion.div>

      {/* CTA Telegram */}
      <motion.a href={TG_URL} target="_blank" rel="noopener noreferrer"
        initial={{ opacity: 0, y: 14, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.95, type:'spring', stiffness:300, damping:22 }}
        whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-white text-base mb-3 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,#3b82f6 0%,#7c3aed 100%)',
          boxShadow:'0 8px 36px rgba(59,130,246,.38)', textDecoration:'none' }}>
        <motion.div className="absolute inset-0"
          style={{ background:'linear-gradient(105deg,transparent 35%,rgba(255,255,255,.1) 50%,transparent 65%)' }}
          animate={{ x:['-100%','200%'] }}
          transition={{ delay:1.4, duration:1.2, repeat:Infinity, repeatDelay:3 }} />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="relative z-10 flex-shrink-0">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.47l-2.967-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.537-.194 1.006.131.834.944z"/>
        </svg>
        <span className="relative z-10">
          {username ? `💬 Contacter @${username}` : `💬 Nous contacter sur Telegram`}
        </span>
      </motion.a>

      <motion.a href="/" initial={{ opacity:0 }} animate={{ opacity:1 }}
        transition={{ delay:1.15 }} whileTap={{ scale:0.97 }}
        className="flex items-center justify-center w-full py-3 rounded-2xl text-sm font-semibold"
        style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)',
          color:'rgba(255,255,255,.35)', textDecoration:'none' }}>
        🏠 Retour à l'accueil
      </motion.a>
    </motion.div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
type Step = 'form' | 'success'

export default function ContactPage() {
  const [step,       setStep]       = useState<Step>('form')
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [desc,       setDesc]       = useState('')
  const [hosting,    setHosting]    = useState(false)
  const [maint,      setMaint]      = useState(false)
  const [tgUser,     setTgUser]     = useState<TgUser | null>(null)
  const [showPack,   setShowPack]   = useState(true)

  useEffect(() => { setTgUser(readTgUser()) }, [])

  const username = tgUser?.username

  const handleSubmit = async () => {
    if (desc.trim().length < 5) {
      setError('Veuillez décrire votre projet.')
      return
    }
    setError(null)
    setLoading(true)

    const payload = {
      project_description: desc.trim(),
      wants_hosting:       hosting,
      wants_maintenance:   maint,
      tg_user:             tgUser ?? null,
    }
    console.log('[ApplyaaBot] Data envoyée :', payload)

    try {
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        console.error('[ApplyaaBot] Erreur API :', json)
        setError(json?.error ?? '❌ Une erreur est survenue. Veuillez réessayer.')
        return
      }

      console.log('[ApplyaaBot] ✅ Demande enregistrée :', json?.id)
      setStep('success')
    } catch (e: any) {
      console.error('[ApplyaaBot] Erreur réseau :', e)
      setError('❌ Une erreur est survenue. Vérifiez votre connexion et réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') return (
    <div className="min-h-screen pb-28 px-4 pt-6"
      style={{ background:'linear-gradient(160deg,#020617 0%,#081428 55%,#0f172a 100%)' }}>
      <SuccessScreen username={username} />
    </div>
  )

  const totalMensuel = (hosting ? 15 : 0) + (maint ? 50 : 0)

  return (
    <div className="min-h-screen pb-28 px-4 pt-6"
      style={{ background:'linear-gradient(160deg,#020617 0%,#081428 55%,#0f172a 100%)' }}>
      <div className="w-full max-w-sm mx-auto">

        {/* ── Pack card (collapsible) ── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="mb-4 rounded-2xl overflow-hidden"
          style={{ background:'linear-gradient(145deg,rgba(59,130,246,.08),rgba(168,85,247,.08))',
            border:'1px solid rgba(59,130,246,.3)',
            boxShadow:'0 0 50px rgba(59,130,246,.1)' }}>

          {/* Header — toujours visible */}
          <button onClick={() => setShowPack(v => !v)}
            className="w-full flex items-center gap-3 p-4 text-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background:'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>🚀</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-white tracking-wide">PACK COMPLET</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background:'rgba(251,191,36,.15)', color:'#fbbf24', border:'1px solid rgba(251,191,36,.3)' }}>
                  ⭐ RECOMMANDÉ
                </span>
              </div>
              <p className="text-[10px] text-white/40">Bot · Mini App · Panel Admin</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-black text-blue-400">1 200€</p>
              <p className="text-[9px] text-white/25">unique</p>
            </div>
          </button>

          {/* Détails collapsibles */}
          <AnimatePresence>
            {showPack && (
              <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }}
                className="overflow-hidden">
                <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor:'rgba(255,255,255,.06)' }}>
                  <div className="pt-3 space-y-2">
                    {PACK_ITEMS.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.35)' }}>
                          <Check size={8} className="text-blue-400" strokeWidth={3} />
                        </div>
                        <span className="text-xs text-white/65">{item.icon} {item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Description ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1 }} className="mb-4">
          <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">
            Décrivez votre projet <span className="text-blue-400">*</span>
          </label>
          <textarea rows={5}
            placeholder="Ex: Je vends du CBD, j'ai besoin d'une boutique sur Telegram avec un bot de commande automatique et un panel admin pour gérer les produits…"
            value={desc} onChange={e => { setDesc(e.target.value); setError(null) }}
            className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none resize-none"
            style={{ background:'rgba(255,255,255,.04)',
              border:`1px solid ${error && desc.length < 5 ? 'rgba(239,68,68,.5)' : desc.length >= 10 ? 'rgba(59,130,246,.45)' : 'rgba(255,255,255,.1)'}`,
              transition:'border-color .2s' }} />
          <p className="text-[10px] text-white/20 mt-1">{desc.length} caractères</p>
        </motion.div>

        {/* ── Options ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.15 }} className="mb-4">
          <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">
            Options mensuelles
          </label>
          <div className="space-y-2">
            {/* Hébergement */}
            <button type="button" onClick={() => setHosting(v => !v)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left"
              style={{ background: hosting ? 'rgba(59,130,246,.1)' : 'rgba(255,255,255,.03)',
                border: hosting ? '1px solid rgba(59,130,246,.4)' : '1px solid rgba(255,255,255,.07)' }}>
              <span className="text-xl">🌐</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Hébergement serveur</p>
                <p className="text-[11px] text-white/35">Domaine · SSL · Serveur dédié</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black" style={{ color: hosting ? '#60a5fa' : 'rgba(255,255,255,.2)' }}>
                  +15€<span className="text-[9px] font-normal">/mois</span>
                </p>
                {/* Toggle */}
                <div className="mt-1.5 ml-auto w-9 h-5 rounded-full relative transition-all duration-200"
                  style={{ background: hosting ? '#3b82f6' : 'rgba(255,255,255,.12)' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: hosting ? 'calc(100% - 18px)' : '2px' }} />
                </div>
              </div>
            </button>

            {/* Maintenance */}
            <button type="button" onClick={() => setMaint(v => !v)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left"
              style={{ background: maint ? 'rgba(168,85,247,.1)' : 'rgba(255,255,255,.03)',
                border: maint ? '1px solid rgba(168,85,247,.4)' : '1px solid rgba(255,255,255,.07)' }}>
              <span className="text-xl">🛠</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Maintenance mensuelle</p>
                <p className="text-[11px] text-white/35">Mises à jour · Support · Sauvegardes</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black" style={{ color: maint ? '#c084fc' : 'rgba(255,255,255,.2)' }}>
                  +50€<span className="text-[9px] font-normal">/mois</span>
                </p>
                <div className="mt-1.5 ml-auto w-9 h-5 rounded-full relative transition-all duration-200"
                  style={{ background: maint ? '#a855f7' : 'rgba(255,255,255,.12)' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: maint ? 'calc(100% - 18px)' : '2px' }} />
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Récap prix */}
        <AnimatePresence>
          {totalMensuel > 0 && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }} className="mb-4 overflow-hidden">
              <div className="p-3 rounded-2xl"
                style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)' }}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Pack Complet (une fois)</span>
                  <span className="font-bold text-white">1 200€</span>
                </div>
                {hosting && <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Hébergement</span>
                  <span className="font-bold text-blue-400">+15€/mois</span>
                </div>}
                {maint && <div className="flex justify-between text-xs">
                  <span className="text-white/50">Maintenance</span>
                  <span className="font-bold text-purple-400">+50€/mois</span>
                </div>}
                <div className="flex justify-between text-xs mt-2 pt-2 border-t" style={{ borderColor:'rgba(255,255,255,.06)' }}>
                  <span className="text-white/30">Total mensuel</span>
                  <span className="font-black text-white/60">{totalMensuel}€/mois</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Erreur */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="mb-4 p-3 rounded-2xl flex items-start gap-2"
              style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.3)' }}>
              <span className="text-red-400 flex-shrink-0">⚠️</span>
              <p className="text-xs text-red-300 leading-relaxed">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.2 }} whileTap={{ scale:0.97 }}
          onClick={handleSubmit} disabled={loading}
          className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 relative overflow-hidden"
          style={{ background: loading ? 'rgba(255,255,255,.08)' : 'linear-gradient(135deg,#3b82f6 0%,#7c3aed 100%)',
            boxShadow: loading ? 'none' : '0 8px 32px rgba(59,130,246,.35)' }}>
          {loading
            ? <Loader size={18} className="animate-spin text-white/50" />
            : <><Send size={15} /> 🚀 Recevoir mon devis</>}
        </motion.button>

        <p className="text-center text-[10px] text-white/20 mt-3">
          Sans engagement · Réponse sous 2h · 100% gratuit
        </p>
      </div>
    </div>
  )
}
