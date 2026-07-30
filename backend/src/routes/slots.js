import { Router } from 'express'
import { Booking } from '../models/Booking.js'
import { TIME_SLOTS, ACTIVE_STATUSES } from '../config/slots.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const date = String(req.query.date || '').trim()

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Query param date=YYYY-MM-DD is required' })
    }

    const bookings = await Booking.find({
      date,
      status: { $in: ACTIVE_STATUSES },
    }).select('slots status')

    const booked = new Set()
    for (const booking of bookings) {
      for (const slot of booking.slots) {
        booked.add(slot)
      }
    }

    const slots = TIME_SLOTS.map((time, index) => ({
      id: `${date}-${index}`,
      time,
      status: booked.has(time) ? 'booked' : 'available',
    }))

    res.json({ date, slots })
  } catch (err) {
    next(err)
  }
})

export default router
