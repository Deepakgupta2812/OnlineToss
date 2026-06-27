// Local storage helpers for toss statistics
export function getStats() {
  try {
    return JSON.parse(localStorage.getItem('cointoss_stats')) || { total: 0, heads: 0, tails: 0, history: [] }
  } catch {
    return { total: 0, heads: 0, tails: 0, history: [] }
  }
}

export function recordToss(result) {
  const stats = getStats()
  stats.total += 1
  stats[result] += 1
  stats.history = [result, ...stats.history].slice(0, 20)
  localStorage.setItem('cointoss_stats', JSON.stringify(stats))
  return stats
}

export function clearStats() {
  localStorage.removeItem('cointoss_stats')
  return { total: 0, heads: 0, tails: 0, history: [] }
}
