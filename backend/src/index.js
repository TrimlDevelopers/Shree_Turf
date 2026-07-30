import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'
import { ensureAdmin } from './utils/seedAdmin.js'
import { ensurePricing } from './utils/seedPricing.js'

const PORT = Number(process.env.PORT) || 5000

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required')
  }

  await connectDB(process.env.MONGODB_URI)
  await ensureAdmin()
  await ensurePricing()

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
