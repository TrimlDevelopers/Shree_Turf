/** Shared helpers for customer booking UI */

export function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDaysISO(iso, days) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d + days)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

export function formatDisplayDate(value) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

export function formatLongDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function buildDateRange(fromISO, count = 15) {
  return Array.from({ length: count }, (_, i) => addDaysISO(fromISO, i))
}

export function slotStartHour(slot) {
  const match = String(slot).match(/^(\d{2}):/)
  return match ? Number(match[1]) : 0
}

export function periodKeyForSlot(slot) {
  const h = slotStartHour(slot)
  if (h >= 6 && h < 12) return 'morning'
  if (h >= 12 && h < 16) return 'afternoon'
  if (h >= 16 && h < 19) return 'evening'
  // 7PM–midnight and midnight–6AM
  return 'night'
}

export const PERIOD_META = [
  { key: 'morning', label: 'Morning', range: '6 AM – 12 PM' },
  { key: 'afternoon', label: 'Afternoon', range: '12 PM – 4 PM' },
  { key: 'evening', label: 'Evening', range: '4 PM – 7 PM' },
  { key: 'night', label: 'Night', range: '7 PM – 6 AM' },
]

export function shortSlotLabel(slot) {
  const match = String(slot).match(/^(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/)
  if (!match) return slot
  const startH = Number(match[1])
  const endH = Number(match[3])
  const fmt = (h) => {
    if (h === 0) return '12AM'
    if (h === 12) return '12PM'
    if (h < 12) return `${h}AM`
    return `${h - 12}PM`
  }
  return `${fmt(startH)}–${fmt(endH)}`
}

export function rateAmount(rate) {
  if (!rate) return 0
  if (Number.isFinite(Number(rate.amount))) return Number(rate.amount)
  const fromPrice = String(rate.price || '').replace(/[^\d.]/g, '')
  return Number(fromPrice) || 0
}

export function estimateTotal(selectedSlots, rates) {
  const byKey = Object.fromEntries(
    (rates || []).map((r) => [r.key || r.id, r]),
  )
  return selectedSlots.reduce((sum, slot) => {
    const key = periodKeyForSlot(slot)
    return sum + rateAmount(byKey[key])
  }, 0)
}

export function formatRupee(amount) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}
