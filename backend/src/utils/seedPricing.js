import 'dotenv/config'
import { connectDB } from '../config/db.js'
import { Pricing } from '../models/Pricing.js'
import { DEFAULT_RATES } from '../config/pricing.js'

export async function ensurePricing() {
  const count = await Pricing.countDocuments()
  if (count === 0) {
    await Pricing.insertMany(DEFAULT_RATES)
    console.log(`Pricing seeded: ${DEFAULT_RATES.length} rates`)
    return
  }

  // Keep night window note in sync with product hours (7PM – 6AM)
  await Pricing.updateOne(
    { key: 'night' },
    { $set: { note: '7PM – 6AM' } },
  )
  console.log(`Pricing ready: ${count} rate(s)`)
}

async function runSeed() {
  await connectDB(process.env.MONGODB_URI)
  await ensurePricing()
  process.exit(0)
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith('seedPricing.js') ||
    process.argv[1].includes('seedPricing'))

if (isDirect) {
  runSeed().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
