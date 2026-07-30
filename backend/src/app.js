import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'
import slotRoutes from './routes/slots.js'
import bookingRoutes from './routes/bookings.js'
import pricingRoutes from './routes/pricing.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin,
    credentials: true,
  }),
)
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'shree350-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/slots', slotRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/pricing', pricingRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
