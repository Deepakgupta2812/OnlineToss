import { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiVolume2, FiVolumeX, FiMaximize, FiMinimize, FiRotateCcw, FiSun, FiMoon } from 'react-icons/fi'
import { playSound, setMuted } from '../utils/sounds'
import { useToss } from '../hooks/useToss'
import { useStats } from '../hooks/useStats'
import { useTheme } from '../hooks/useTheme'
import ChoiceCard from '../components/ChoiceCard'
import CountdownOverlay from '../components/CountdownOverlay'
import ResultScreen from '../components/ResultScreen'
import Statistics from '../components/Statistics'
import ParticleBackground from '../components/ParticleBackground'

const Coin3D = lazy(() => import('../components/Coin3D'))

export default function HomePage() {
  const [choice, setChoice] = useState(null)
  const [muted, setMutedState] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const { phase, countdown, result, toss, reset } = useToss()
  const { stats, addToss, reset: resetStats } = useStats()
  const { isDark, toggle: toggleTheme } = useTheme()

  const toggleMute = useCallback(() => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }, [muted])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
      setFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space' && phase === 'idle' && choice) {
        e.preventDefault()
        startToss()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  useEffect(() => {
    if (result && navigator.vibrate) navigator.vibrate([60, 40, 120])
  }, [result])

  const startToss = useCallback(() => {
    if (!choice || phase !== 'idle') return
    playSound('whoosh')
    setTimeout(() => playSound('flip'), 200)
    toss(choice, (outcome) => {
      addToss(outcome)
      setTimeout(() => playSound('land'), 100)
    })
  }, [choice, phase, toss, addToss])

  const handlePlayAgain = useCallback(() => {
    reset()
    setChoice(null)
  }, [reset])

  const isIdle = phase === 'idle'
  const isResult = phase === 'result'

  // Theme-aware colors
  const titleColor     = '#FFD700'
  const subtitleColor  = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)'
  const flippingColor  = isDark ? 'rgba(255,255,255,0.4)'  : 'rgba(15,23,42,0.4)'

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col transition-colors duration-500"
      style={{ background: 'var(--bg)' }}
    >
      <ParticleBackground />

      {/* ── Top bar ── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <motion.div
          className="cinzel font-black text-sm tracking-[0.2em]"
          style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#1e293b' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        > 
          🪙 COIN TOSS By Deepak 🪔
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Theme toggle */}
          <ControlBtn onClick={() => { playSound('click'); toggleTheme() }} title={isDark ? 'Light mode' : 'Dark mode'} isDark={isDark}>
            <motion.span
              key={isDark ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </motion.span>
          </ControlBtn>

          <ControlBtn onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'} isDark={isDark}>
            {muted ? <FiVolumeX /> : <FiVolume2 />}
          </ControlBtn>
          <ControlBtn onClick={toggleFullscreen} title="Fullscreen" isDark={isDark}>
            {fullscreen ? <FiMinimize /> : <FiMaximize />}
          </ControlBtn>
          <ControlBtn onClick={resetStats} title="Reset statistics" isDark={isDark}>
            <FiRotateCcw />
          </ControlBtn>
        </motion.div>
      </header>

      {/* ── Main layout ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-start justify-center gap-6 px-4 pb-6 max-w-6xl mx-auto w-full">

        {/* Stats — left on desktop */}
        <motion.aside
          className="w-full lg:w-72 shrink-0 hidden lg:block pt-2"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Statistics stats={stats} isDark={isDark} />
        </motion.aside>

        {/* ── Center column ── */}
        <div className="flex-1 flex flex-col items-center gap-5 w-full max-w-lg mx-auto">

          {/* Title */}
          <AnimatePresence mode="wait">
            {isIdle && (
              <motion.div
                key="title"
                className="text-center pt-1"
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
              >
                <h1
                  className="cinzel font-black tracking-widest"
                  style={{
                    fontSize: 'clamp(1.5rem, 4.5vw, 2.8rem)',
                    color: titleColor,
                    textShadow: isDark
                      ? '0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.2)'
                      : '0 0 20px rgba(200,140,0,0.4)',
                  }}
                >
                  ONLINE COIN TOSS
                </h1>
                <p className="tracking-[0.3em] text-xs uppercase mt-1.5" style={{ color: subtitleColor }}>
                  Choose your side
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 3D Coin ── */}
          <div
            className="relative w-full rounded-3xl overflow-hidden glass shrink-0"
            style={{ height: '320px' }}
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center text-5xl animate-pulse select-none">🪙</div>
            }>
              <Coin3D phase={phase} result={result} isDark={isDark} />
            </Suspense>
            <CountdownOverlay countdown={countdown} />
            <AnimatePresence>
              {phase === 'tossing' && <TossParticles key="tp" isDark={isDark} />}
            </AnimatePresence>
          </div>

          {/* ── Choice cards ── */}
          <AnimatePresence>
            {isIdle && (
              <motion.div
                key="cards"
                className="flex gap-4 justify-center w-full"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
              >
                <ChoiceCard side="heads" selected={choice === 'heads'} onClick={setChoice} isDark={isDark} />
                <ChoiceCard side="tails" selected={choice === 'tails'} onClick={setChoice} isDark={isDark} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── START TOSS button ── */}
          <AnimatePresence>
            {isIdle && (
              <motion.div
                key="start-btn"
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <motion.button
                  onClick={startToss}
                  disabled={!choice}
                  className="relative cinzel font-black text-lg tracking-[0.2em] px-12 py-4 rounded-2xl overflow-hidden"
                  style={{
                    background: choice
                      ? 'linear-gradient(135deg, #FFD700 0%, #FF8C00 50%, #FFD700 100%)'
                      : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                    backgroundSize: '200% 200%',
                    color: choice ? '#050816' : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                    cursor: choice ? 'pointer' : 'not-allowed',
                    border: choice ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
                  }}
                  animate={choice ? {
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    boxShadow: ['0 0 18px rgba(255,215,0,0.35)', '0 0 45px rgba(255,215,0,0.65)', '0 0 18px rgba(255,215,0,0.35)'],
                  } : {}}
                  transition={{
                    backgroundPosition: { duration: 2.5, repeat: Infinity, ease: 'linear' },
                    boxShadow: { duration: 1.8, repeat: Infinity },
                  }}
                  whileHover={choice ? { scale: 1.05, y: -2 } : {}}
                  whileTap={choice ? { scale: 0.94 } : {}}
                >
                  <motion.span
                    className="absolute inset-0 rounded-2xl bg-white/20"
                    initial={{ scale: 0, opacity: 1 }}
                    whileTap={{ scale: 2.8, opacity: 0 }}
                    transition={{ duration: 0.45 }}
                  />
                  <span className="relative z-10">
                    {choice ? '⚡ START TOSS' : 'SELECT A SIDE'}
                  </span>
                </motion.button>
                {choice && (
                  <motion.p
                    className="text-[11px] tracking-widest uppercase"
                    style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    or press Space
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Result screen ── */}
          <AnimatePresence>
            {isResult && (
              <motion.div key="result" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResultScreen result={result} choice={choice} onPlayAgain={handlePlayAgain} isDark={isDark} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flipping label */}
          <AnimatePresence>
            {phase === 'tossing' && (
              <motion.p
                key="flipping"
                className="cinzel text-sm tracking-[0.3em] uppercase"
                style={{ color: flippingColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                Flipping…
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Stats — bottom on mobile */}
        <motion.aside
          className="w-full lg:hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Statistics stats={stats} isDark={isDark} />
        </motion.aside>

        <div className="hidden lg:block w-72 shrink-0" />
      </main>
    </div>
  )
}

function ControlBtn({ onClick, children, title, isDark }) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="glass w-9 h-9 rounded-xl flex items-center justify-center transition-colors overflow-hidden"
      style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.6)' }}
      whileHover={{ scale: 1.1, color: isDark ? '#fff' : '#000' }}
      whileTap={{ scale: 0.88 }}
      onMouseEnter={() => playSound('hover')}
    >
      {children}
    </motion.button>
  )
}

function TossParticles({ isDark }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {Array.from({ length: 20 }).map((_, i) => {
        const gold = i % 2 === 0
        const angle = (i / 20) * 360
        const r = 50 + (i % 5) * 18
        const color = gold
          ? (isDark ? '#FFD700' : '#CC8800')
          : (isDark ? '#38BDF8' : '#0284C7')
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: gold ? '6px' : '4px', height: gold ? '6px' : '4px',
              left: '50%', top: '45%',
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}
            animate={{
              x: [0, Math.cos((angle * Math.PI) / 180) * r],
              y: [0, Math.sin((angle * Math.PI) / 180) * r - 50],
              opacity: [0, 0.9, 0], scale: [0, 1.6, 0],
            }}
            transition={{
              duration: 1.0 + (i % 3) * 0.2,
              repeat: Infinity, delay: (i / 20) * 0.7, ease: 'easeOut',
            }}
          />
        )
      })}
    </motion.div>
  )
}
