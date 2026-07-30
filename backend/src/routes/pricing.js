import { Router } from 'express'
import { Pricing } from '../models/Pricing.js'
import { DEFAULT_RATES, toPublicRate } from '../config/pricing.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
const ICONS = ['sun', 'afternoon', 'sunset', 'moon']

/** Public: active rates for the website. */
router.get('/', async (req, res, next) => {
  try {
    let rates = await Pricing.find({ active: true }).sort({ sortOrder: 1 })

    if (rates.length === 0) {
      await Pricing.insertMany(DEFAULT_RATES)
      rates = await Pricing.find({ active: true }).sort({ sortOrder: 1 })
    }

    res.json({ rates: rates.map(toPublicRate) })
  } catch (err) {
    next(err)
  }
})

/** Admin: all rates including inactive. */
router.get('/all', requireAdmin, async (req, res, next) => {
  try {
    let rates = await Pricing.find().sort({ sortOrder: 1 })
    if (rates.length === 0) {
      await Pricing.insertMany(DEFAULT_RATES)
      rates = await Pricing.find().sort({ sortOrder: 1 })
    }
    res.json({ rates: rates.map(toPublicRate) })
  } catch (err) {
    next(err)
  }
})

/** Admin: update one rate by key. */
router.patch('/:key', requireAdmin, async (req, res, next) => {
  try {
    const key = String(req.params.key || '')
      .trim()
      .toLowerCase()
    const rate = await Pricing.findOne({ key })
    if (!rate) {
      return res.status(404).json({ message: 'Rate not found' })
    }

    const { name, amount, unit, note, icon, popular, sortOrder, active } =
      req.body || {}

    if (name !== undefined) {
      const n = String(name).trim()
      if (!n) return res.status(400).json({ message: 'name cannot be empty' })
      rate.name = n.toUpperCase()
    }

    if (amount !== undefined) {
      const n = Number(amount)
      if (!Number.isFinite(n) || n < 0) {
        return res.status(400).json({
          message: 'amount must be a non-negative number',
        })
      }
      rate.amount = Math.round(n)
    }

    if (unit !== undefined) rate.unit = String(unit).trim() || '/hr'
    if (note !== undefined) {
      const n = String(note).trim()
      if (!n) return res.status(400).json({ message: 'note cannot be empty' })
      rate.note = n
    }
    if (icon !== undefined) {
      if (!ICONS.includes(icon)) {
        return res.status(400).json({
          message: `icon must be one of: ${ICONS.join(', ')}`,
        })
      }
      rate.icon = icon
    }
    if (popular !== undefined) rate.popular = Boolean(popular)
    if (sortOrder !== undefined) rate.sortOrder = Number(sortOrder) || 0
    if (active !== undefined) rate.active = Boolean(active)

    await rate.save()
    res.json({ rate: toPublicRate(rate) })
  } catch (err) {
    next(err)
  }
})

/** Admin: bulk update rates. */
router.put('/', requireAdmin, async (req, res, next) => {
  try {
    const list = req.body?.rates
    if (!Array.isArray(list) || list.length === 0) {
      return res.status(400).json({ message: 'rates array is required' })
    }

    const updated = []
    for (const item of list) {
      const key = String(item.key || item.id || '')
        .trim()
        .toLowerCase()
      if (!key) continue

      const amount = Number(item.amount)
      if (!Number.isFinite(amount) || amount < 0) {
        return res.status(400).json({ message: `Invalid amount for ${key}` })
      }

      const name = String(item.name || key)
        .trim()
        .toUpperCase()
      const note = String(item.note || '').trim()
      if (!note) {
        return res.status(400).json({ message: `note required for ${key}` })
      }

      const rate = await Pricing.findOneAndUpdate(
        { key },
        {
          $set: {
            name,
            amount: Math.round(amount),
            unit: String(item.unit || '/hr').trim() || '/hr',
            note,
            icon: ICONS.includes(item.icon) ? item.icon : 'sun',
            popular: Boolean(item.popular),
            sortOrder: Number(item.sortOrder) || 0,
            active: item.active !== false,
          },
          $setOnInsert: { key },
        },
        { upsert: true, new: true },
      )
      updated.push(toPublicRate(rate))
    }

    res.json({ rates: updated })
  } catch (err) {
    next(err)
  }
})

export default router
