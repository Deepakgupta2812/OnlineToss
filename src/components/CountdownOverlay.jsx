import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { playSound } from '../utils/sounds'

export default function CountdownOverlay({ countdown }) {
  const numRef = useRef()
  const prevCountdown = useRef(null)

  useEffect(() => {
    if (countdown == null || countdown === prevCountdown.current) return
    prevCountdown.current = countdown
    playSound('countdown', countdown)
    if (!numRef.current) return
    gsap.killTweensOf(numRef.current)
    gsap.fromTo(
      numRef.current,
      { scale: 2.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.5)' }
    )
  }, [countdown])

  return (
    <AnimatePresence>
      {countdown != null && (
        <motion.div
          key="countdown-wrapper"
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <div
            ref={numRef}
            className="cinzel font-black select-none"
            style={{
              fontSize: 'clamp(5rem, 18vw, 9rem)',
              color: '#FFD700',
              textShadow: '0 0 40px #FFD700, 0 0 80px #FFD70066, 0 0 120px #FFD70033',
              lineHeight: 1,
            }}
          >
            {countdown}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
