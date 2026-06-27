import { useState, useCallback, useRef } from 'react'

export function useToss() {
  const [phase, setPhase] = useState('idle') // idle | countdown | tossing | result
  const [countdown, setCountdown] = useState(null)
  const [result, setResult] = useState(null)
  const timerRef = useRef([])

  const clear = () => timerRef.current.forEach(clearTimeout)

  const toss = useCallback((choice, onResult) => {
    clear()
    setPhase('countdown')
    setResult(null)

    const schedule = (fn, ms) => { const t = setTimeout(fn, ms); timerRef.current.push(t) }

    setCountdown(3)
    schedule(() => setCountdown(2), 1000)
    schedule(() => setCountdown(1), 2000)
    schedule(() => {
      setCountdown(null)
      setPhase('tossing')
    }, 3000)
    schedule(() => {
      const outcome = Math.random() < 0.5 ? 'heads' : 'tails'
      setResult(outcome)
      setPhase('result')
      onResult?.(outcome)
    }, 5500)
  }, [])

  const reset = useCallback(() => {
    clear()
    setPhase('idle')
    setCountdown(null)
    setResult(null)
  }, [])

  return { phase, countdown, result, toss, reset }
}
