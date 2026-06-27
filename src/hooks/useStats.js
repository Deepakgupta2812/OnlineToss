import { useState, useEffect, useCallback } from 'react'
import { getStats, recordToss, clearStats } from '../utils/stats'

export function useStats() {
  const [stats, setStats] = useState(getStats)

  const addToss = useCallback((result) => {
    setStats(recordToss(result))
  }, [])

  const reset = useCallback(() => {
    setStats(clearStats())
  }, [])

  return { stats, addToss, reset }
}
