import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import resourceRoutes from './routes/resources.js'
import bookmarkRoutes from './routes/bookmarks.js'
import submissionRoutes from './routes/submissions.js'
import learningPathRoutes from './routes/learningPath.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/learning-path', learningPathRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
