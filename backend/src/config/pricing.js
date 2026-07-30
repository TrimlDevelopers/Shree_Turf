export const DEFAULT_RATES = [
  {
    key: 'morning',
    name: 'MORNING',
    amount: 700,
    unit: '/hr',
    note: '6AM – 12PM',
    icon: 'sun',
    popular: false,
    sortOrder: 1,
  },
  {
    key: 'afternoon',
    name: 'AFTERNOON',
    amount: 800,
    unit: '/hr',
    note: '12PM – 4PM',
    icon: 'afternoon',
    popular: false,
    sortOrder: 2,
  },
  {
    key: 'evening',
    name: 'EVENING',
    amount: 1000,
    unit: '/hr',
    note: '4PM – 7PM',
    icon: 'sunset',
    popular: true,
    sortOrder: 3,
  },
  {
    key: 'night',
    name: 'NIGHT',
    amount: 1200,
    unit: '/hr',
    note: '7PM – 6AM',
    icon: 'moon',
    popular: false,
    sortOrder: 4,
  },
]

export function formatPrice(amount) {
  const n = Number(amount)
  if (!Number.isFinite(n)) return '₹0'
  return `₹${Math.round(n)}`
}

export function toPublicRate(doc) {
  const o = doc.toObject ? doc.toObject() : doc
  return {
    id: o.key,
    key: o.key,
    name: o.name,
    amount: o.amount,
    price: formatPrice(o.amount),
    unit: o.unit || '/hr',
    note: o.note,
    icon: o.icon || 'sun',
    popular: Boolean(o.popular),
    sortOrder: o.sortOrder ?? 0,
    active: o.active !== false,
  }
}
