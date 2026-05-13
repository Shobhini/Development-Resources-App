import express from 'express'
import Resource from '../models/Resource.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// GET /api/resources?category=books&tag=reactjs&search=redux&page=1
router.get('/', async (req, res) => {
  try {
    const { category, tag, search, page = 1 } = req.query
    const limit = 20
    const skip = (Number(page) - 1) * limit

    const query = { status: 'approved' }
    if (category) query.category = category
    if (tag) query.tag = tag
    if (search) query.title = { $regex: search, $options: 'i' }

    const [data, total] = await Promise.all([
      Resource.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Resource.countDocuments(query),
    ])

    res.json({ data, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/resources/:id
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) return res.status(404).json({ message: 'Resource not found' })
    res.json(resource)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/resources — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, status: 'approved' })
    res.status(201).json(resource)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/resources/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!resource) return res.status(404).json({ message: 'Resource not found' })
    res.json(resource)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/resources/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id)
    if (!resource) return res.status(404).json({ message: 'Resource not found' })
    res.json({ message: 'Resource deleted' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
