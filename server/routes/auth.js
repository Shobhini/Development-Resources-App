import express from 'express'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'

const router = express.Router()

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body
    try {
      const exists = await User.findOne({ email })
      if (exists) return res.status(400).json({ message: 'Email already registered' })

      const user = await User.create({ name, email, password })
      res.status(201).json({
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      res.json({
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

export default router
