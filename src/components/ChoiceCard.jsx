import { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { playSound } from '../utils/sounds'

export default function ChoiceCard({ side, selected, onClick, isDark }) {
  const cardRef = useRef()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useTransform(my, [-60, 60], [12, -12])
  const rotY = useTransform(mx, [-60, 60], [-12, 12])

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(e.clientX - rect.left - rect.width / 2)
    my.set(e.clientY - rect.top - rect.height / 2)
  }

  const isHeads = side === 'heads'
  const label   = isHeads ? 'HEADS' : 'TAILS'
  const emoji   = isHeads ? '👑' : '⚜️'
  const accent  = isHeads ? '#FFD700' : '#38BDF8'

  const labelColor = selected
    ? accent
    : isDark ? '#fff' : '#1e293b'

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mx.set(0); my.set(0) }}
      onClick={() => { playSound('click'); onClick(side) }}
      onMouseEnter={() => playSound('hover')}
      style={{
        rotateX: rotX, rotateY: rotY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        borderColor: selected ? accent : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        boxShadow: selected ? `0 0 24px ${accent}66, 0 0 60px ${accent}22` : 'none',
      }}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      animate={selected ? { scale: 1.05, y: -6 } : { scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative cursor-pointer rounded-2xl glass p-8 flex flex-col items-center gap-4 select-none border-2 transition-colors duration-300"
    >
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `2px solid ${accent}`, borderRadius: '1rem' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}

      <motion.div
        className="text-5xl"
        animate={selected ? { rotate: [0, -12, 12, 0], scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {emoji}
      </motion.div>

      <span
        className="cinzel text-2xl font-bold tracking-widest transition-colors duration-300"
        style={{ color: labelColor, textShadow: selected ? `0 0 20px ${accent}` : 'none' }}
      >
        {label}
      </span>

      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: accent, color: '#050816' }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  )
}
