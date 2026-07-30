import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { Admin } from '../models/Admin.js'
import { requireAdmin, signToken } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase()
    const password = String(req.body.password || '')

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const ok = await bcrypt.compare(password, admin.passwordHash)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(admin)
    res.json({
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAdmin, (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name,
    },
  })
})

export default router
