export const formatDate = (isoStr) => {
  if (!isoStr) return '—'
  const d = new Date(`${isoStr}T00:00:00`)
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const isToday = (isoStr) => isoStr === new Date().toISOString().slice(0, 10)

export const daysUntil = (isoStr) => {
  const ms = new Date(`${isoStr}T00:00:00`) - new Date(new Date().toDateString())
  return Math.round(ms / 86400000)
}
