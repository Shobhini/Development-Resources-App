# Fullstack Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Development Resources App from a static React SPA to a fullstack platform with JWT auth, bookmarks, resource submission, and an admin dashboard — deployed free on Vercel + Render + MongoDB Atlas.

**Architecture:** React frontend (Vercel) communicates with an Express REST API (Render) backed by MongoDB Atlas. All existing frontend code moves to `client/`, a new `server/` folder holds the Express app. Data migrates from local JSON files to MongoDB via a seed script.

**Tech Stack:** React 18, Vite, React Router v6, Tailwind CSS, Framer Motion · Node.js, Express, Mongoose, jsonwebtoken, bcryptjs, cors, dotenv, express-validator

---

## File Map

### New — Server (`server/`)
| File | Responsibility |
|------|---------------|
| `server/index.js` | Express app entry — mounts routes, connects MongoDB, starts server |
| `server/.env` | Environment variables (not committed) |
| `server/middleware/auth.js` | `protect` and `adminOnly` middleware |
| `server/models/User.js` | Mongoose User schema |
| `server/models/Resource.js` | Mongoose Resource schema |
| `server/models/Bookmark.js` | Mongoose Bookmark schema |
| `server/routes/auth.js` | POST /register, POST /login |
| `server/routes/resources.js` | GET/POST/PUT/DELETE /api/resources |
| `server/routes/bookmarks.js` | GET/POST/DELETE /api/bookmarks |
| `server/routes/submissions.js` | POST/GET/PATCH /api/submissions |
| `server/scripts/seed.js` | One-time script to seed MongoDB from local JSON files |

### New — Client (`client/src/`)
| File | Responsibility |
|------|---------------|
| `client/src/context/AuthContext.jsx` | Global auth state — user, token, login(), logout() |
| `client/src/components/ProtectedRoute.jsx` | Redirect to /login if not authenticated |
| `client/src/components/AdminRoute.jsx` | Redirect to / if not admin |
| `client/src/components/BookmarkButton.jsx` | Heart icon — save/remove bookmark per card |
| `client/src/pages/Login.jsx` | Login form page |
| `client/src/pages/Register.jsx` | Register form page |
| `client/src/pages/Bookmarks.jsx` | User's saved resources page |
| `client/src/pages/SubmitResource.jsx` | Submit new resource form |
| `client/src/pages/AdminDashboard.jsx` | Admin panel — submissions, resources, stats |

### Modified — Client
| File | Change |
|------|--------|
| `client/src/App.jsx` | Add new routes + ProtectedRoute/AdminRoute wrappers |
| `client/src/main.jsx` | Wrap with AuthContext provider |
| `client/src/components/Card.jsx` | Add BookmarkButton |
| `client/src/components/nav/SideNav.jsx` | Add auth-aware nav links |
| `client/src/components/books/Index.jsx` | Fetch from API instead of local JSON |
| `client/src/components/tools/Index.jsx` | Fetch from API instead of local JSON |
| `client/src/components/videos/Index.jsx` | Fetch from API instead of local JSON |
| `client/src/components/challenges/Index.jsx` | Fetch from API instead of local JSON |
| `client/src/components/websites/Index.jsx` | Fetch from API instead of local JSON |
| `client/src/components/editor/Index.jsx` | Fetch from API instead of local JSON |
| `client/.env` | Add VITE_API_URL |

---

## Task 1: Restructure into Monorepo

**Files:**
- Rename: root → `client/` (move all existing frontend files)
- Create: `server/` directory

- [ ] **Step 1: Move frontend into client folder**

```bash
cd /Users/shobs/Downloads/Development-Resources-App
mkdir client
# Move all frontend files into client/
mv src client/
mv index.html client/
mv package.json client/
mv package-lock.json client/
mv pnpm-lock.yaml client/
mv tailwind.config.js client/
mv postcss.config.cjs client/
mv vite.config.js client/ 2>/dev/null || true
mv .eslintrc.cjs client/ 2>/dev/null || true
mv node_modules client/
```

- [ ] **Step 2: Create server directory**

```bash
mkdir server
mkdir -p server/models server/routes server/middleware server/scripts
```

- [ ] **Step 3: Verify structure**

```bash
ls
# Expected: client/ server/ docs/
ls client/src
# Expected: components/ context/ database/ assets/ App.jsx main.jsx index.css
```

- [ ] **Step 4: Commit**

```bash
git init  # if not already a git repo
git add .
git commit -m "chore: restructure into client/server monorepo"
```

---

## Task 2: Set Up Express Server

**Files:**
- Create: `server/package.json`
- Create: `server/index.js`
- Create: `server/.env`

- [ ] **Step 1: Initialise server package**

```bash
cd server
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cors dotenv express-validator
```

- [ ] **Step 2: Create `server/.env`**

```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/devresources?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_string_at_least_32_chars
CLIENT_URL=http://localhost:5173
PORT=5000
```

> Note: Fill in real Atlas URI after Task 3 (Atlas setup). For now use the placeholder.

- [ ] **Step 3: Create `server/index.js`**

```js
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import resourceRoutes from './routes/resources.js'
import bookmarkRoutes from './routes/bookmarks.js'
import submissionRoutes from './routes/submissions.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use('/api/submissions', submissionRoutes)

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
```

- [ ] **Step 4: Add `"type": "module"` and start script to `server/package.json`**

Edit `server/package.json` — add these two fields:
```json
{
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  }
}
```

- [ ] **Step 5: Commit**

```bash
cd server
git add .
git commit -m "feat: add Express server scaffold with MongoDB connection"
```

---

## Task 3: MongoDB Schemas

**Files:**
- Create: `server/models/User.js`
- Create: `server/models/Resource.js`
- Create: `server/models/Bookmark.js`

- [ ] **Step 1: Create `server/models/User.js`**

```js
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

export default mongoose.model('User', userSchema)
```

- [ ] **Step 2: Create `server/models/Resource.js`**

```js
import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  img: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['books', 'tools', 'videos', 'challenges', 'editors', 'websites'],
  },
  tag: {
    type: String,
    required: true,
    enum: ['html', 'css', 'javascript', 'reactjs', 'tailwindcss', 'nextjs'],
  },
  status: { type: String, enum: ['approved', 'pending'], default: 'approved' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true })

export default mongoose.model('Resource', resourceSchema)
```

- [ ] **Step 3: Create `server/models/Bookmark.js`**

```js
import mongoose from 'mongoose'

const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
}, { timestamps: true })

bookmarkSchema.index({ userId: 1, resourceId: 1 }, { unique: true })

export default mongoose.model('Bookmark', bookmarkSchema)
```

- [ ] **Step 4: Commit**

```bash
git add server/models/
git commit -m "feat: add Mongoose schemas for User, Resource, Bookmark"
```

---

## Task 4: Auth Middleware

**Files:**
- Create: `server/middleware/auth.js`

- [ ] **Step 1: Create `server/middleware/auth.js`**

```js
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised, no token' })
  }
  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'User not found' })
    next()
  } catch {
    res.status(401).json({ message: 'Not authorised, token invalid' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}
```

- [ ] **Step 2: Commit**

```bash
git add server/middleware/auth.js
git commit -m "feat: add protect and adminOnly middleware"
```

---

## Task 5: Auth Routes

**Files:**
- Create: `server/routes/auth.js`

- [ ] **Step 1: Create `server/routes/auth.js`**

```js
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
```

- [ ] **Step 2: Test register endpoint manually**

Start the server (requires Atlas URI in `.env`):
```bash
cd server && npm run dev
```

In a second terminal:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```
Expected: `{ "token": "...", "user": { "id": "...", "name": "Test User", ... } }`

- [ ] **Step 3: Test login endpoint**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
Expected: `{ "token": "...", "user": { ... } }`

- [ ] **Step 4: Commit**

```bash
git add server/routes/auth.js
git commit -m "feat: add register and login endpoints"
```

---

## Task 6: Resources Routes

**Files:**
- Create: `server/routes/resources.js`

- [ ] **Step 1: Create `server/routes/resources.js`**

```js
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
```

- [ ] **Step 2: Test GET resources (after seeding in Task 7)**

```bash
curl "http://localhost:5000/api/resources?category=books&tag=reactjs&page=1"
```
Expected: `{ "data": [...], "total": N, "page": 1, "pages": N }`

- [ ] **Step 3: Commit**

```bash
git add server/routes/resources.js
git commit -m "feat: add resources CRUD endpoints"
```

---

## Task 7: Seed Script

**Files:**
- Create: `server/scripts/seed.js`

- [ ] **Step 1: Create `server/scripts/seed.js`**

```js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Resource from '../models/Resource.js'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') })

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '../../client/src/database')

const CATEGORIES = ['books', 'tools', 'videos', 'challenges', 'editors', 'websites']
const TAGS = ['html', 'css', 'javascript', 'reactjs', 'tailwindcss', 'nextjs']

// Map JSON tag values to schema enum values
const TAG_MAP = {
  html: 'html',
  css: 'css',
  js: 'javascript',
  javascript: 'javascript',
  react: 'reactjs',
  reactjs: 'reactjs',
  tailwind: 'tailwindcss',
  tailwindcss: 'tailwindcss',
  next: 'nextjs',
  nextjs: 'nextjs',
}

const FILE_TAG_MAP = {
  html: 'html',
  css: 'css',
  javascript: 'javascript',
  reactjs: 'reactjs',
  tailwindcss: 'tailwindcss',
  nextjs: 'nextjs',
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await Resource.deleteMany({})
  console.log('Cleared existing resources')

  const docs = []

  for (const category of CATEGORIES) {
    for (const fileTag of Object.keys(FILE_TAG_MAP)) {
      const filePath = join(DB_PATH, category, `${fileTag}.json`)
      try {
        const raw = JSON.parse(readFileSync(filePath, 'utf-8'))
        for (const item of raw) {
          docs.push({
            title: item.title,
            description: item.description,
            link: item.link,
            img: item.img,
            category,
            tag: FILE_TAG_MAP[fileTag],
            status: 'approved',
            submittedBy: null,
          })
        }
      } catch {
        // File may not exist for this category/tag combo — skip silently
      }
    }
  }

  await Resource.insertMany(docs)
  console.log(`Seeded ${docs.length} resources`)
  await mongoose.disconnect()
  console.log('Done')
}

seed().catch((err) => { console.error(err); process.exit(1) })
```

- [ ] **Step 2: Run seed script** (requires real Atlas URI in `.env`)

```bash
cd server
node scripts/seed.js
```
Expected output:
```
Connected to MongoDB
Cleared existing resources
Seeded 150+ resources
Done
```

- [ ] **Step 3: Verify in Atlas**

Open MongoDB Atlas → Browse Collections → `devresources.resources` — confirm documents exist.

- [ ] **Step 4: Commit**

```bash
git add server/scripts/seed.js
git commit -m "feat: add seed script to migrate JSON data to MongoDB"
```

---

## Task 8: Bookmarks & Submissions Routes

**Files:**
- Create: `server/routes/bookmarks.js`
- Create: `server/routes/submissions.js`

- [ ] **Step 1: Create `server/routes/bookmarks.js`**

```js
import express from 'express'
import Bookmark from '../models/Bookmark.js'
import Resource from '../models/Resource.js'
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
```

- [ ] **Step 2: Create `server/routes/submissions.js`**

```js
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
```

- [ ] **Step 3: Commit**

```bash
git add server/routes/bookmarks.js server/routes/submissions.js
git commit -m "feat: add bookmarks and submissions endpoints"
```

---

## Task 9: AuthContext (Frontend)

**Files:**
- Create: `client/src/context/AuthContext.jsx`
- Modify: `client/src/main.jsx`
- Create: `client/.env`

- [ ] **Step 1: Create `client/.env`**

```
VITE_API_URL=http://localhost:5000
```

- [ ] **Step 2: Create `client/src/context/AuthContext.jsx`**

```jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

- [ ] **Step 3: Wrap app with AuthProvider in `client/src/main.jsx`**

Open `client/src/main.jsx`. It currently looks like:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

Replace with:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 4: Commit**

```bash
git add client/src/context/AuthContext.jsx client/src/main.jsx client/.env
git commit -m "feat: add AuthContext with login/logout and localStorage persistence"
```

---

## Task 10: Login & Register Pages

**Files:**
- Create: `client/src/pages/Login.jsx`
- Create: `client/src/pages/Register.jsx`

- [ ] **Step 1: Create `client/src/pages/Login.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border rounded-lg p-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border rounded-lg p-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#545454] text-white py-3 rounded-lg hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          No account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
```

- [ ] **Step 2: Create `client/src/pages/Register.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

const Register = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Account</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg p-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border rounded-lg p-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <input
          type="password"
          placeholder="Password (6+ characters)"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border rounded-lg p-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#545454] text-white py-3 rounded-lg hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Login.jsx client/src/pages/Register.jsx
git commit -m "feat: add Login and Register pages"
```

---

## Task 11: Route Wrappers + App.jsx Update

**Files:**
- Create: `client/src/components/ProtectedRoute.jsx`
- Create: `client/src/components/AdminRoute.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Create `client/src/components/ProtectedRoute.jsx`**

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
```

- [ ] **Step 2: Create `client/src/components/AdminRoute.jsx`**

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  return user?.role === 'admin' ? children : <Navigate to="/" replace />
}

export default AdminRoute
```

- [ ] **Step 3: Update `client/src/App.jsx`**

Replace the entire file with:
```jsx
import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import SideNav from './components/nav/SideNav.jsx'
import ScrollToTopButton from './components/ScrollToTopButton.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

const Home = lazy(() => import('./components/Home.jsx'))
const Books = lazy(() => import('./components/books/Index.jsx'))
const Tools = lazy(() => import('./components/tools/Index.jsx'))
const Videos = lazy(() => import('./components/videos/Index.jsx'))
const Editors = lazy(() => import('./components/editor/Index.jsx'))
const Websites = lazy(() => import('./components/websites/Index.jsx'))
const Challenges = lazy(() => import('./components/challenges/Index.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Bookmarks = lazy(() => import('./pages/Bookmarks.jsx'))
const SubmitResource = lazy(() => import('./pages/SubmitResource.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))

const Wrap = ({ children }) => (
  <Suspense fallback={<p className="p-8 text-gray-500">Loading...</p>}>{children}</Suspense>
)

const App = () => (
  <div className="flex">
    <SideNav />
    <div className="lg:pl-60 w-full">
      <Routes>
        <Route path="/" element={<Wrap><Home /></Wrap>} />
        <Route path="/Videos" element={<Wrap><Videos /></Wrap>} />
        <Route path="/Websites" element={<Wrap><Websites /></Wrap>} />
        <Route path="/Challenges" element={<Wrap><Challenges /></Wrap>} />
        <Route path="/Books" element={<Wrap><Books /></Wrap>} />
        <Route path="/Tools" element={<Wrap><Tools /></Wrap>} />
        <Route path="/Editors" element={<Wrap><Editors /></Wrap>} />
        <Route path="/login" element={<Wrap><Login /></Wrap>} />
        <Route path="/register" element={<Wrap><Register /></Wrap>} />
        <Route path="/bookmarks" element={
          <ProtectedRoute><Wrap><Bookmarks /></Wrap></ProtectedRoute>
        } />
        <Route path="/submit" element={
          <ProtectedRoute><Wrap><SubmitResource /></Wrap></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><Wrap><AdminDashboard /></Wrap></AdminRoute>
        } />
      </Routes>
    </div>
    <ScrollToTopButton />
  </div>
)

export default App
```

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ProtectedRoute.jsx client/src/components/AdminRoute.jsx client/src/App.jsx
git commit -m "feat: add ProtectedRoute, AdminRoute, and update App routes"
```

---

## Task 12: BookmarkButton Component + Card Update

**Files:**
- Create: `client/src/components/BookmarkButton.jsx`
- Modify: `client/src/components/Card.jsx`

- [ ] **Step 1: Create `client/src/components/BookmarkButton.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

const BookmarkButton = ({ resourceId, initialBookmarked = false }) => {
  const { user, token } = useAuth()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  if (!user) return null

  const toggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)
    try {
      if (bookmarked) {
        await fetch(`${API}/api/bookmarks/${resourceId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        setBookmarked(false)
      } else {
        await fetch(`${API}/api/bookmarks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ resourceId }),
        })
        setBookmarked(true)
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      className="absolute top-2 right-2 text-red-400 hover:text-red-500 transition-colors z-10"
      title={bookmarked ? 'Remove bookmark' : 'Save bookmark'}
    >
      {bookmarked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
    </button>
  )
}

export default BookmarkButton
```

- [ ] **Step 2: Update `client/src/components/Card.jsx`**

Replace with:
```jsx
import React from 'react'
import { motion } from 'framer-motion'
import BookmarkButton from './BookmarkButton'

const Card = ({ title, link, description, i, img, _id, bookmarked }) => {
  return (
    <a href={link} target="_blank" rel="noreferrer" className="relative">
      <BookmarkButton resourceId={_id} initialBookmarked={bookmarked} />
      <motion.div
        className="card border-b-2 bg-gradient-to-r from-[#545454] to-[#807f7f] dark:from-gray-800 dark:to-gray-700 border-b-[#000000] dark:border-gray-600 flex flex-col rounded-lg gap-4 p-4 shadow-3xl h-[16rem] w-[24rem] hover:shadow-4xl transition-colors duration-200"
        key={i}
        initial={{ opacity: 0, translateX: -100 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.2, delay: i * 0.2 }}
      >
        <div className="img img-container self-center">
          <img className="rounded-sm w-40 h-40" src={img} alt="img" />
        </div>
        <div className="content flex flex-col gap-4 items-center">
          <h2 className="text-[#e5e5e5] hover:text-[#fff] dark:text-gray-200 dark:hover:text-white text-lg font-bold transition-colors duration-200">
            {title}
          </h2>
          <p className="text-[0.9rem] text-[#e2e1e1] dark:text-gray-300 w-4/5 font-inter tracking-wide leading-5">
            {description.slice(0, 120) + '...'}
          </p>
        </div>
      </motion.div>
    </a>
  )
}

export default Card
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/BookmarkButton.jsx client/src/components/Card.jsx
git commit -m "feat: add BookmarkButton heart icon to Card"
```

---

## Task 13: Migrate Resource Pages to API

**Files:**
- Modify: `client/src/components/books/Index.jsx`
- Modify: `client/src/components/tools/Index.jsx`
- Modify: `client/src/components/videos/Index.jsx`
- Modify: `client/src/components/challenges/Index.jsx`
- Modify: `client/src/components/websites/Index.jsx`
- Modify: `client/src/components/editor/Index.jsx`

All 6 resource pages follow the same pattern. Below is the complete replacement for each. The only difference per page is the `CATEGORY` constant.

- [ ] **Step 1: Replace `client/src/components/books/Index.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../Card'
import Filter from '../filter/Index'

const API = import.meta.env.VITE_API_URL
const CATEGORY = 'books'

const TAG_MAP = {
  html: 'html', css: 'css', js: 'javascript',
  tailwind: 'tailwindcss', nextjs: 'nextjs', react: 'reactjs',
}

const Index = () => {
  const [filter, setFilter] = useState('html')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const location = useLocation()
  const searchQuery = new URLSearchParams(location.search).get('search') || ''

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const tag = TAG_MAP[filter] || filter
        const search = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
        const res = await fetch(`${API}/api/resources?category=${CATEGORY}&tag=${tag}&page=${page}${search}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        setData(json.data)
        setPages(json.pages)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filter, page, searchQuery])

  const handleFilterChange = (target) => { setFilter(target); setPage(1) }

  return (
    <div className="m-8 mt-32 lg:mt-8">
      <Filter onStateChange={handleFilterChange} />
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <>
          <div className="flex flex-wrap gap-5">
            {data.length > 0 ? (
              data.map((res, i) => (
                <Card key={res._id} _id={res._id} title={res.title} link={res.link}
                  description={res.description} i={i} img={res.img} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No resources found.</p>
            )}
          </div>
          {pages > 1 && (
            <div className="flex gap-3 mt-8 items-center">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 bg-[#545454] text-white rounded-lg disabled:opacity-40">Prev</button>
              <span className="text-gray-600 dark:text-gray-300">Page {page} of {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-4 py-2 bg-[#545454] text-white rounded-lg disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Index
```

- [ ] **Step 2: Replace `client/src/components/tools/Index.jsx`**

Copy the exact same file as Step 1, change only:
```js
const CATEGORY = 'tools'
```

- [ ] **Step 3: Replace `client/src/components/videos/Index.jsx`**

Copy the exact same file as Step 1, change only:
```js
const CATEGORY = 'videos'
```

- [ ] **Step 4: Replace `client/src/components/challenges/Index.jsx`**

Copy the exact same file as Step 1, change only:
```js
const CATEGORY = 'challenges'
```

- [ ] **Step 5: Replace `client/src/components/websites/Index.jsx`**

Copy the exact same file as Step 1, change only:
```js
const CATEGORY = 'websites'
```

- [ ] **Step 6: Replace `client/src/components/editor/Index.jsx`**

Copy the exact same file as Step 1, change only:
```js
const CATEGORY = 'editors'
```

- [ ] **Step 7: Verify in browser**

Start both servers:
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Navigate to `http://localhost:5173/Books` — confirm cards load from API, filter buttons change results, search works.

- [ ] **Step 8: Commit**

```bash
git add client/src/components/
git commit -m "feat: migrate all resource pages to fetch from backend API with pagination"
```

---

## Task 14: SideNav Auth Links

**Files:**
- Modify: `client/src/components/nav/SideNav.jsx`

- [ ] **Step 1: Read current SideNav.jsx**

Read `client/src/components/nav/SideNav.jsx` to find the exact location to add auth links. Add the following import and block before the closing `</nav>` or `</div>` of the sidebar.

Add import at top:
```jsx
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
```

Add inside the sidebar component, after the existing NavItems:
```jsx
const { user, logout } = useAuth()
const navigate = useNavigate()

// Auth section at bottom of sidebar:
<div className="mt-auto border-t border-gray-600 pt-4 flex flex-col gap-2">
  {user ? (
    <>
      <p className="text-gray-300 text-sm px-2">Hi, {user.name}</p>
      <NavLink to="/bookmarks" className="text-gray-300 hover:text-white px-2 py-1 rounded">
        My Bookmarks
      </NavLink>
      <NavLink to="/submit" className="text-gray-300 hover:text-white px-2 py-1 rounded">
        Submit Resource
      </NavLink>
      {user.role === 'admin' && (
        <NavLink to="/admin" className="text-yellow-400 hover:text-yellow-300 px-2 py-1 rounded">
          Admin
        </NavLink>
      )}
      <button
        onClick={() => { logout(); navigate('/') }}
        className="text-left text-red-400 hover:text-red-300 px-2 py-1 rounded"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <NavLink to="/login" className="text-gray-300 hover:text-white px-2 py-1 rounded">Login</NavLink>
      <NavLink to="/register" className="text-gray-300 hover:text-white px-2 py-1 rounded">Register</NavLink>
    </>
  )}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/nav/SideNav.jsx
git commit -m "feat: add auth-aware links to SideNav"
```

---

## Task 15: Bookmarks Page

**Files:**
- Create: `client/src/pages/Bookmarks.jsx`

- [ ] **Step 1: Create `client/src/pages/Bookmarks.jsx`**

```jsx
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

const Bookmarks = () => {
  const { token } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${API}/api/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setBookmarks(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookmarks()
  }, [token])

  return (
    <div className="m-8 mt-32 lg:mt-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Bookmarks</h1>
      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && bookmarks.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No bookmarks yet. Save resources by clicking the heart icon on any card.</p>
      )}
      <div className="flex flex-wrap gap-5">
        {bookmarks.map((res, i) => (
          <Card key={res._id} _id={res._id} title={res.title} link={res.link}
            description={res.description} i={i} img={res.img} bookmarked={true} />
        ))}
      </div>
    </div>
  )
}

export default Bookmarks
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/Bookmarks.jsx
git commit -m "feat: add Bookmarks page"
```

---

## Task 16: Submit Resource Page

**Files:**
- Create: `client/src/pages/SubmitResource.jsx`

- [ ] **Step 1: Create `client/src/pages/SubmitResource.jsx`**

```jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

const CATEGORIES = ['books', 'tools', 'videos', 'challenges', 'editors', 'websites']
const TAGS = ['html', 'css', 'javascript', 'reactjs', 'tailwindcss', 'nextjs']

const SubmitResource = () => {
  const { token } = useAuth()
  const [form, setForm] = useState({ title: '', description: '', link: '', img: '', category: 'tools', tag: 'javascript' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`${API}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Submission failed')
      setStatus({ type: 'success', message: 'Resource submitted for review! Thank you.' })
      setForm({ title: '', description: '', link: '', img: '', category: 'tools', tag: 'javascript' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "border rounded-lg p-3 w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
  const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300"

  return (
    <div className="m-8 mt-32 lg:mt-8 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Submit a Resource</h1>
      {status && (
        <p className={`mb-4 text-sm ${status.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {status.message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div><label className={labelClass}>Title</label>
          <input required className={inputClass} value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div><label className={labelClass}>Description</label>
          <textarea required rows={3} className={inputClass} value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <div><label className={labelClass}>Link (URL)</label>
          <input required type="url" className={inputClass} value={form.link}
            onChange={e => setForm({ ...form, link: e.target.value })} /></div>
        <div><label className={labelClass}>Image URL</label>
          <input required type="url" className={inputClass} value={form.img}
            onChange={e => setForm({ ...form, img: e.target.value })} /></div>
        <div><label className={labelClass}>Category</label>
          <select className={inputClass} value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>
        <div><label className={labelClass}>Tag</label>
          <select className={inputClass} value={form.tag}
            onChange={e => setForm({ ...form, tag: e.target.value })}>
            {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select></div>
        <button type="submit" disabled={loading}
          className="bg-[#545454] text-white py-3 rounded-lg hover:bg-[#3a3a3a] transition-colors disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </div>
  )
}

export default SubmitResource
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/SubmitResource.jsx
git commit -m "feat: add Submit Resource page"
```

---

## Task 17: Admin Dashboard

**Files:**
- Create: `client/src/pages/AdminDashboard.jsx`

- [ ] **Step 1: Create `client/src/pages/AdminDashboard.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

const AdminDashboard = () => {
  const { token } = useAuth()
  const [pending, setPending] = useState([])
  const [resources, setResources] = useState([])
  const [stats, setStats] = useState({ total: 0, pendingCount: 0 })
  const [loading, setLoading] = useState(true)

  const authHeader = { Authorization: `Bearer ${token}` }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pendingRes, resourcesRes] = await Promise.all([
        fetch(`${API}/api/submissions`, { headers: authHeader }),
        fetch(`${API}/api/resources?page=1`, { headers: authHeader }),
      ])
      const pendingData = await pendingRes.json()
      const resourcesData = await resourcesRes.json()
      setPending(pendingData)
      setResources(resourcesData.data)
      setStats({ total: resourcesData.total, pendingCount: pendingData.length })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [token])

  const approve = async (id) => {
    await fetch(`${API}/api/submissions/${id}/approve`, { method: 'PATCH', headers: authHeader })
    fetchData()
  }

  const reject = async (id) => {
    await fetch(`${API}/api/submissions/${id}/reject`, { method: 'PATCH', headers: authHeader })
    fetchData()
  }

  const deleteResource = async (id) => {
    if (!confirm('Delete this resource?')) return
    await fetch(`${API}/api/resources/${id}`, { method: 'DELETE', headers: authHeader })
    fetchData()
  }

  if (loading) return <p className="m-8 mt-32 lg:mt-8 text-gray-500">Loading...</p>

  return (
    <div className="m-8 mt-32 lg:mt-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="flex gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center min-w-[120px]">
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Resources</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center min-w-[120px]">
          <p className="text-3xl font-bold text-yellow-500">{stats.pendingCount}</p>
          <p className="text-sm text-gray-500">Pending Review</p>
        </div>
      </div>

      {/* Pending Submissions */}
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Pending Submissions</h2>
      {pending.length === 0 ? (
        <p className="text-gray-400 mb-8">No pending submissions.</p>
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3">Title</th><th className="p-3">Category</th>
                <th className="p-3">Tag</th><th className="p-3">Submitted By</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(r => (
                <tr key={r._id} className="border-b dark:border-gray-700">
                  <td className="p-3"><a href={r.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{r.title}</a></td>
                  <td className="p-3">{r.category}</td>
                  <td className="p-3">{r.tag}</td>
                  <td className="p-3">{r.submittedBy?.name || 'Unknown'}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => approve(r._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve</button>
                    <button onClick={() => reject(r._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Resources */}
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">All Resources (first 20)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-3">Title</th><th className="p-3">Category</th>
              <th className="p-3">Tag</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(r => (
              <tr key={r._id} className="border-b dark:border-gray-700">
                <td className="p-3"><a href={r.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{r.title}</a></td>
                <td className="p-3">{r.category}</td>
                <td className="p-3">{r.tag}</td>
                <td className="p-3">
                  <button onClick={() => deleteResource(r._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard
```

- [ ] **Step 2: Make yourself admin**

After registering your account, run this in MongoDB Atlas shell or mongosh:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/AdminDashboard.jsx
git commit -m "feat: add Admin Dashboard with submissions review and resource management"
```

---

## Task 18: Deploy

**Files:**
- Create: `server/.gitignore`
- Create: `client/.gitignore` (update to exclude .env)

- [ ] **Step 1: Add .gitignore files**

`server/.gitignore`:
```
node_modules/
.env
```

`client/.gitignore` — add if not present:
```
node_modules/
dist/
.env
```

- [ ] **Step 2: Push both to GitHub**

```bash
cd /Users/shobs/Downloads/Development-Resources-App
git add .
git commit -m "chore: add gitignore files"
git remote add origin https://github.com/YOUR_USERNAME/dev-resources-app.git
git push -u origin main
```

- [ ] **Step 3: Set up MongoDB Atlas**

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free M0 cluster
2. Database Access → Add user with password
3. Network Access → Add IP `0.0.0.0/0`
4. Connect → Drivers → copy connection string
5. Paste into `server/.env` as `MONGODB_URI`
6. Run seed: `cd server && node scripts/seed.js`

- [ ] **Step 4: Deploy backend on Render**

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo → Root Directory: `server`
3. Build: `npm install` · Start: `node index.js`
4. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL=https://YOUR_APP.vercel.app`, `PORT=5000`
5. Deploy → copy the Render URL (e.g. `https://dev-resources-api.onrender.com`)

- [ ] **Step 5: Deploy frontend on Vercel**

1. Go to [vercel.com](https://vercel.com) → Import project from GitHub
2. Root Directory: `client` · Framework: Vite (auto-detected)
3. Add env var: `VITE_API_URL=https://dev-resources-api.onrender.com`
4. Deploy → copy Vercel URL → paste into Render's `CLIENT_URL` env var → redeploy Render

- [ ] **Step 6: Final smoke test**

- Visit Vercel URL → resources load on all pages
- Register an account → JWT stored → Login/Logout works
- Heart icon appears on cards → save a bookmark → check `/bookmarks`
- Submit a resource → goes to pending
- Make yourself admin via Atlas shell → visit `/admin` → approve the submission → verify it appears in resources

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "chore: finalize deployment configuration"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] JWT auth — Tasks 4, 5, 9, 10
- [x] Role-based access (user/admin) — Tasks 4, 11
- [x] Bookmarks — Tasks 8, 12, 15
- [x] Resource submission + approval — Tasks 8, 16, 17
- [x] Admin dashboard (pending, resources, stats) — Task 17
- [x] All resource pages fetch from API — Task 13
- [x] Pagination — Task 13
- [x] Search via URL params — Task 13
- [x] Dark mode preserved — all components use existing dark: classes
- [x] Seed script — Task 7
- [x] Monorepo restructure — Task 1
- [x] Free deployment (Vercel + Render + Atlas) — Task 18
- [x] SideNav auth links — Task 14

**Type consistency:**
- `login(token, user)` defined in AuthContext (Task 9), called identically in Login (Task 10) and Register (Task 10) ✓
- `protect` and `adminOnly` defined in middleware (Task 4), imported identically in routes (Tasks 5, 6, 8) ✓
- `BookmarkButton` receives `resourceId` and `initialBookmarked` props — Card passes `_id` as `resourceId` ✓
- `useAuth()` returns `{ user, token, login, logout }` — all consuming components use these exact names ✓
