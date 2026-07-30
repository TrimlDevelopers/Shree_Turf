import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDB } from '../config/db.js'
import { Admin } from '../models/Admin.js'

export async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || ''

  if (!email || !password) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed')
    return null
  }

  let admin = await Admin.findOne({ email })
  if (admin) {
    console.log(`Admin ready: ${email}`)
    return admin
  }

  const passwordHash = await bcrypt.hash(password, 10)
  admin = await Admin.create({
    email,
    passwordHash,
    name: 'Shree Turf Admin',
  })
  console.log(`Admin created: ${email}`)
  return admin
}

/** Run directly: npm run seed */
async function runSeed() {
  await connectDB(process.env.MONGODB_URI)
  await ensureAdmin()
  process.exit(0)
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith('seedAdmin.js') ||
    process.argv[1].includes('seedAdmin'))

if (isDirect) {
  runSeed().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
