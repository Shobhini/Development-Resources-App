import express from 'express'
import Bookmark from '../models/Bookmark.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// GET /api/bookmarks — user's saved resources
router.get('/', protect, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).populate('resourceId')
    res.json(bookmarks.map((b) => b.resourceId))
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/bookmarks — save a resource
router.post('/', protect, async (req, res) => {
  try {
    const { resourceId } = req.body
    const exists = await Bookmark.findOne({ userId: req.user._id, resourceId })
    if (exists) return res.status(400).json({ message: 'Already bookmarked' })
    const bookmark = await Bookmark.create({ userId: req.user._id, resourceId })
    res.status(201).json(bookmark)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/bookmarks/:resourceId — remove bookmark
router.delete('/:resourceId', protect, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ userId: req.user._id, resourceId: req.params.resourceId })
    res.json({ message: 'Bookmark removed' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
