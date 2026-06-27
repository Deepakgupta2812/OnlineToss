import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function SplashScreen({ onDone }) {
  // Simple timer — always fires regardless of animation library quirks
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 select-none"
      style={{ background: '#050816' }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      {/* Spinning coin */}
      <motion.div
        className="text-8xl mb-8"
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-block' }}
      >
        🪙
      </motion.div>

      {/* Title */}
      <motion.h1
        className="cinzel font-black text-center"
        style={{
          fontSize: 'clamp(1.8rem, 5.5vw, 3.5rem)',
          color: '#FFD700',
          textShadow: '0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,215,0,0.3)',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        ONLINE COIN TOSS
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-3 text-white/50 tracking-[0.4em] uppercase text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
      >
        Premium Experience
      </motion.p>

      {/* Loading bar */}
      <div className="mt-12 w-52 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #FFD700, #38BDF8, #FFD700)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 3.0, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}
