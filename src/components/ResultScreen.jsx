import { motion } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import { useWindowSize } from '../hooks/useWindowSize'
import { playSound } from '../utils/sounds'
import { useEffect, useRef } from 'react'

export default function ResultScreen({ result, choice, onPlayAgain, isDark }) {
  const { width, height } = useWindowSize()
  const won = result === choice
  const isHeads = result === 'heads'
  const played = useRef(false)

  useEffect(() => {
    if (!result || played.current) return
    played.current = true
    setTimeout(() => playSound(won ? 'victory' : 'loss'), 400)
    return () => { played.current = false }
  }, [result, won])

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={won ? 280 : 90}
        colors={won
          ? ['#FFD700', '#FFF176', '#FFEB3B', '#FF8C00', '#ffffff']
          : ['#38BDF8', '#0EA5E9', '#7C3AED', '#ffffff']}
        recycle={false}
        gravity={0.22}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }}
      />

      <motion.div
        className="glass rounded-3xl px-10 py-8 flex flex-col items-center gap-5 text-center w-full max-w-sm"
        initial={{ scale: 0.4, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }}
        style={{
          boxShadow: won
            ? '0 0 50px rgba(255,215,0,0.45), 0 0 100px rgba(255,215,0,0.18)'
            : '0 0 50px rgba(56,189,248,0.35)',
        }}
      >
        <motion.div
          className="text-6xl"
          animate={{ rotate: [0, -15, 15, -8, 8, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {won ? '🏆' : '🎯'}
        </motion.div>

        <div>
          <motion.p
            className="text-xs tracking-[0.35em] uppercase mb-1"
            style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            You Got
          </motion.p>
          <motion.h2
            className="cinzel font-black"
            style={{
              fontSize: 'clamp(2.8rem, 9vw, 5rem)',
              color: isHeads ? '#FFD700' : '#38BDF8',
              textShadow: isHeads
                ? '0 0 30px #FFD700, 0 0 60px #FFD70055'
                : '0 0 30px #38BDF8, 0 0 60px #38BDF855',
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 12, delay: 0.45 }}
          >
            {result.toUpperCase()}
          </motion.h2>
        </div>

        <motion.div
          className="px-5 py-1.5 rounded-full text-sm font-semibold tracking-widest uppercase"
          style={{
            background: won ? 'rgba(255,215,0,0.12)' : 'rgba(255,80,80,0.12)',
            border: `1px solid ${won ? '#FFD700' : '#FF6464'}44`,
            color: won ? '#FFD700' : '#FF7070',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          {won ? '✨ Correct Pick!' : '😔 Wrong Pick'}
        </motion.div>

        <motion.button
          onClick={onPlayAgain}
          className="relative cinzel font-bold text-base tracking-widest px-10 py-3.5 rounded-xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)', color: '#050816' }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(255,215,0,0.6)' }}
          whileTap={{ scale: 0.93 }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          <motion.span
            className="absolute inset-0 rounded-xl bg-white/25"
            initial={{ scale: 0, opacity: 1 }}
            whileTap={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.45 }}
          />
          <span className="relative z-10">🔄 Play Again</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
