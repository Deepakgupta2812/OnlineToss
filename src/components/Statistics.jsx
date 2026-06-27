import { motion } from 'framer-motion'

function Bar({ pct, color, label, isDark }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
        <span className="uppercase tracking-widest">{label}</span>
        <span style={{ color }}>{pct.toFixed(1)}%</span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function Statistics({ stats, isDark }) {
  const headsPct = stats.total ? (stats.heads / stats.total) * 100 : 50
  const tailsPct = stats.total ? (stats.tails / stats.total) * 100 : 50
  const labelColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'

  return (
    <motion.div
      className="glass rounded-2xl p-6 flex flex-col gap-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3
        className="cinzel text-sm font-bold tracking-[0.25em] uppercase"
        style={{ color: labelColor }}
      >
        Statistics
      </h3>

      {/* Counts */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Total', val: stats.total, color: isDark ? '#fff' : '#1e293b' },
          { label: 'Heads', val: stats.heads, color: '#FFD700' },
          { label: 'Tails', val: stats.tails, color: '#38BDF8' },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass rounded-xl py-3">
            <motion.div
              key={val}
              className="font-black text-2xl"
              style={{ color }}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {val}
            </motion.div>
            <div
              className="text-[10px] uppercase tracking-widest mt-0.5"
              style={{ color: labelColor }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-3">
        <Bar pct={headsPct} color="#FFD700" label="Heads" isDark={isDark} />
        <Bar pct={tailsPct} color="#38BDF8" label="Tails" isDark={isDark} />
      </div>

      {/* Recent history */}
      {stats.history.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: labelColor }}>Recent</p>
          <div className="flex flex-wrap gap-1.5">
            {stats.history.slice(0, 15).map((r, i) => (
              <motion.span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                style={{
                  background: r === 'heads' ? 'rgba(255,215,0,0.15)' : 'rgba(56,189,248,0.15)',
                  color: r === 'heads' ? '#FFD700' : '#38BDF8',
                  border: `1px solid ${r === 'heads' ? '#FFD70033' : '#38BDF833'}`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                {r === 'heads' ? 'H' : 'T'}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
