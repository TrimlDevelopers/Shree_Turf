import jwt from 'jsonwebtoken'
import { Admin } from '../models/Admin.js'

export function signToken(admin) {
  return jwt.sign(
    { id: admin._id.toString(), email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )
}

export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const admin = await Admin.findById(payload.id).select('_id email name')

    if (!admin) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.admin = admin
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
