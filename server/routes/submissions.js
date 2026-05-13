import express from 'express'
import Resource from '../models/Resource.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// POST /api/submissions — logged-in user submits a resource
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, link, img, category, tag } = req.body
    await Resource.create({
      title, description, link, img, category, tag,
      status: 'pending',
      submittedBy: req.user._id,
    })
    res.status(201).json({ message: 'Resource submitted for review' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// GET /api/submissions — admin: list all pending
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const pending = await Resource.find({ status: 'pending' }).populate('submittedBy', 'name email')
    res.json(pending)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/submissions/:id/approve — admin: approve
router.patch('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    )
    if (!resource) return res.status(404).json({ message: 'Submission not found' })
    res.json(resource)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/submissions/:id/reject — admin: delete the pending resource
router.patch('/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id)
    res.json({ message: 'Submission rejected and removed' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
