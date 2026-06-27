import { useEffect, useRef, memo } from 'react'
import { useTheme } from '../hooks/useTheme'

const ParticleBackground = memo(function ParticleBackground() {
  const canvasRef = useRef()
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let w, h, particles = []

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    const rand = (a, b) => Math.random() * (b - a) + a

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light'

    const colors = isDark
      ? ['#FFD700', '#38BDF8', '#a78bfa']
      : ['#CC8800', '#0284C7', '#7C3AED']

    const bgStart  = isDark ? '#050816' : '#f0f4ff'
    const bgEnd    = isDark ? '#080d20' : '#e8eeff'
    const orbs = isDark
      ? [
          { x: 0.2, y: 0.3, r: 380, c: 'rgba(56,189,248,0.06)' },
          { x: 0.8, y: 0.7, r: 420, c: 'rgba(255,215,0,0.05)' },
          { x: 0.5, y: 0.5, r: 300, c: 'rgba(124,58,237,0.04)' },
        ]
      : [
          { x: 0.2, y: 0.3, r: 380, c: 'rgba(56,189,248,0.10)' },
          { x: 0.8, y: 0.7, r: 420, c: 'rgba(255,180,0,0.08)' },
          { x: 0.5, y: 0.5, r: 300, c: 'rgba(124,58,237,0.06)' },
        ]

    const createParticle = () => ({
      x: rand(0, w), y: rand(0, h),
      r: rand(0.8, 2.5),
      vx: rand(-0.25, 0.25), vy: rand(-0.45, -0.08),
      alpha: rand(0.2, 0.7),
      color: colors[Math.floor(Math.random() * colors.length)],
      life: rand(100, 220), age: 0,
    })

    resize()
    window.addEventListener('resize', resize)
    particles = Array.from({ length: 80 }, createParticle)

    let angle = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, w, h)
      bg.addColorStop(0, bgStart)
      bg.addColorStop(1, bgEnd)
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Animated orbs
      angle += 0.003
      orbs.forEach((o, i) => {
        const ox = (o.x + Math.sin(angle + i) * 0.08) * w
        const oy = (o.y + Math.cos(angle * 0.7 + i) * 0.06) * h
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r)
        g.addColorStop(0, o.c)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      })

      // Particles
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.age++
        const life = 1 - p.age / p.life
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * life
        ctx.fill()
        ctx.globalAlpha = 1
        if (p.age >= p.life || p.y < -10) particles[i] = createParticle()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [theme]) // re-run when theme changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
})

export default ParticleBackground
