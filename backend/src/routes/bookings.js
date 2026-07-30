import { Router } from 'express'
import { Booking } from '../models/Booking.js'
import { GAMES, TIME_SLOTS, ACTIVE_STATUSES, BOOKING_STATUSES } from '../config/slots.js'
import { requireAdmin } from '../middleware/auth.js'
import {
  sendAdminNewBookingEmail,
  sendCustomerConfirmedEmail,
} from '../utils/mail.js'

const router = Router()

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function findConflicts(date, slots, excludeId = null) {
  const query = {
    date,
    status: { $in: ACTIVE_STATUSES },
    slots: { $in: slots },
  }
  if (excludeId) query._id = { $ne: excludeId }
  return Booking.find(query).select('slots customerName status')
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function validateBookingBody(body, { requireEmail = false } = {}) {
  const {
    date,
    slots,
    game,
    customerName,
    phone,
    customerEmail = '',
    notes = '',
  } = body || {}

  if (!date || !Array.isArray(slots) || !game || !customerName || !phone) {
    return {
      error: 'date, slots, game, customerName, and phone are required',
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: 'date must be YYYY-MM-DD' }
  }

  if (date < todayISO()) {
    return { error: 'Cannot book a past date' }
  }

  const uniqueSlots = [...new Set(slots)]
  if (uniqueSlots.length === 0 || uniqueSlots.some((s) => !TIME_SLOTS.includes(s))) {
    return { error: 'One or more time slots are invalid' }
  }

  if (!GAMES.includes(game)) {
    return { error: 'Invalid game' }
  }

  const email = String(customerEmail || '').trim().toLowerCase()
  if (requireEmail && !email) {
    return { error: 'customerEmail is required' }
  }
  if (email && !isValidEmail(email)) {
    return { error: 'customerEmail is invalid' }
  }

  return {
    data: {
      date,
      slots: uniqueSlots,
      game,
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      customerEmail: email,
      notes: String(notes || '').trim(),
    },
  }
}

function notifyLater(promise) {
  Promise.resolve(promise).catch((err) => {
    console.error('[email] Failed:', err.message || err)
  })
}

/** Public: create a booking request (pending). */
router.post('/', async (req, res, next) => {
  try {
    const parsed = validateBookingBody(req.body, { requireEmail: true })
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error })
    }

    const conflicts = await findConflicts(parsed.data.date, parsed.data.slots)
    if (conflicts.length > 0) {
      const taken = [...new Set(conflicts.flatMap((b) => b.slots))].filter((s) =>
        parsed.data.slots.includes(s),
      )
      return res.status(409).json({
        message: `Slot(s) already booked: ${taken.join(', ')}`,
        taken,
      })
    }

    const booking = await Booking.create({
      ...parsed.data,
      status: 'pending',
    })

    notifyLater(sendAdminNewBookingEmail(booking))

    res.status(201).json({ booking })
  } catch (err) {
    next(err)
  }
})

/** Admin: create a booking (confirmed immediately). */
router.post('/admin', requireAdmin, async (req, res, next) => {
  try {
    const parsed = validateBookingBody(req.body, { requireEmail: false })
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error })
    }

    const conflicts = await findConflicts(parsed.data.date, parsed.data.slots)
    if (conflicts.length > 0) {
      const taken = [...new Set(conflicts.flatMap((b) => b.slots))].filter((s) =>
        parsed.data.slots.includes(s),
      )
      return res.status(409).json({
        message: `Slot(s) already booked: ${taken.join(', ')}`,
        taken,
      })
    }

    const booking = await Booking.create({
      ...parsed.data,
      status: 'confirmed',
    })

    if (booking.customerEmail) {
      notifyLater(sendCustomerConfirmedEmail(booking))
    }

    res.status(201).json({ booking })
  } catch (err) {
    next(err)
  }
})

/** Admin: list bookings with optional filters. */
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.date) filter.date = String(req.query.date)
    if (req.query.status && BOOKING_STATUSES.includes(req.query.status)) {
      filter.status = req.query.status
    }

    const bookings = await Booking.find(filter).sort({ date: 1, createdAt: -1 })
    res.json({ bookings })
  } catch (err) {
    next(err)
  }
})

/** Admin: update booking status. */
router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body || {}
    if (!BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${BOOKING_STATUSES.join(', ')}`,
      })
    }

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (status === 'confirmed' || status === 'pending') {
      const conflicts = await findConflicts(booking.date, booking.slots, booking._id)
      if (conflicts.length > 0) {
        return res.status(409).json({
          message: 'Cannot set this status — overlapping active booking exists',
        })
      }
    }

    const previousStatus = booking.status
    booking.status = status
    await booking.save()

    if (status === 'confirmed' && previousStatus !== 'confirmed') {
      notifyLater(sendCustomerConfirmedEmail(booking))
    }

    res.json({ booking })
  } catch (err) {
    next(err)
  }
})

/** Admin: delete booking. */
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    res.json({ message: 'Booking deleted', id: booking._id })
  } catch (err) {
    next(err)
  }
})

export default router
