# Development Resources App — Fullstack Upgrade Design Spec

**Date:** 2026-05-13  
**Project:** Development Resources App  
**Goal:** Upgrade from a static React SPA into a fullstack platform with auth, bookmarks, resource submission, and an admin dashboard — all deployed for free.

---

## 1. Architecture Overview

```
Frontend (React + Vite)  →  Vercel (free)
        ↓ HTTP/REST
Backend (Node.js + Express)  →  Render.com (free)
        ↓
Database (MongoDB + Mongoose)  →  MongoDB Atlas (free M0 cluster)
```

### Monorepo Structure
```
Development-Resources-App/
├── client/       ← existing React + Vite frontend (moved here)
└── server/       ← new Node.js + Express backend
```

---

## 2. Backend API Design

### Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) for auth
- bcryptjs for password hashing
- cors, dotenv, express-validator

### Environment Variables (server)
```
MONGODB_URI=<Atlas connection string>
JWT_SECRET=<long random string>
CLIENT_URL=<Vercel frontend URL>
PORT=5000
```

### MongoDB Schemas

**User**
```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  createdAt: Date
}
```

**Resource**
```js
{
  title: String,
  description: String,
  link: String,
  img: String,
  category: 'books' | 'tools' | 'videos' | 'challenges' | 'editors' | 'websites',
  tag: 'html' | 'css' | 'javascript' | 'reactjs' | 'tailwindcss' | 'nextjs',
  status: 'approved' | 'pending',
  submittedBy: ObjectId (ref: User),
  createdAt: Date
}
```

**Bookmark**
```js
{
  userId: ObjectId (ref: User),
  resourceId: ObjectId (ref: Resource),
  createdAt: Date
}
```

### API Routes

#### Auth — `/api/auth`
| Method | Route | Body | Response | Auth |
|--------|-------|------|----------|------|
| POST | `/register` | `{ name, email, password }` | `{ token, user }` | None |
| POST | `/login` | `{ email, password }` | `{ token, user }` | None |

#### Resources — `/api/resources`
| Method | Route | Params/Body | Response | Auth |
|--------|-------|-------------|----------|------|
| GET | `/` | `?category=&tag=&search=&page=` | `{ data, total, page }` | None |
| GET | `/:id` | — | resource object | None |
| POST | `/` | resource fields | created resource | Admin |
| PUT | `/:id` | resource fields | updated resource | Admin |
| DELETE | `/:id` | — | `{ message }` | Admin |

#### Bookmarks — `/api/bookmarks`
| Method | Route | Body | Response | Auth |
|--------|-------|------|----------|------|
| GET | `/` | — | array of bookmarked resources | User |
| POST | `/` | `{ resourceId }` | created bookmark | User |
| DELETE | `/:resourceId` | — | `{ message }` | User |

#### Submissions — `/api/submissions`
| Method | Route | Body | Response | Auth |
|--------|-------|------|----------|------|
| POST | `/` | resource fields | `{ message }` | User |
| GET | `/` | — | pending submissions array | Admin |
| PATCH | `/:id/approve` | — | approved resource | Admin |
| PATCH | `/:id/reject` | — | `{ message }` | Admin |

### Auth Middleware
- `protect` — verifies JWT, attaches `req.user`
- `adminOnly` — checks `req.user.role === 'admin'`, returns 403 if not

### Data Migration
A one-time seed script (`server/scripts/seed.js`) reads all 35 local JSON files and inserts them into MongoDB as approved resources. Run once after Atlas is connected.

---

## 3. Frontend Changes

### Environment Variables (client)
```
VITE_API_URL=<Render backend URL>
```
Replace all `http://localhost:5000` with `import.meta.env.VITE_API_URL`.

### New Context: `AuthContext`
Located at `client/src/context/AuthContext.jsx`

- Stores `user` and `token` in state + localStorage
- Exposes `login(token, user)`, `logout()`
- `useAuth()` custom hook for consuming context

### New Pages

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | `Login.jsx` | Public |
| `/register` | `Register.jsx` | Public |
| `/bookmarks` | `Bookmarks.jsx` | Protected (logged in) |
| `/submit` | `SubmitResource.jsx` | Protected (logged in) |
| `/admin` | `AdminDashboard.jsx` | Admin only |

### New Route Wrappers
- **`ProtectedRoute`** — redirects to `/login` if not authenticated
- **`AdminRoute`** — redirects to `/` if not admin

### Changes to Existing Components

**`Card.jsx`**
- Add a bookmark icon (heart) in the top-right corner
- Filled/colored if resource is in user's bookmarks
- Clicking calls `POST /api/bookmarks` or `DELETE /api/bookmarks/:id`
- Shows nothing if user is not logged in

**`SideNav.jsx`**
- Logged out: show Login + Register links
- Logged in: show Bookmarks link + user name + Logout button

**All resource pages** (`books/Index.jsx`, `tools/Index.jsx`, etc.)
- Replace local JSON imports with `fetch(${VITE_API_URL}/api/resources?category=X&tag=Y)`
- Keep existing filter + search UI unchanged
- Add pagination controls (Prev / Next, page number)

**`filter/Index.jsx`**
- No change to UI
- Filter change now updates URL query param sent to backend

### Admin Dashboard (`/admin`)
Three sections:
1. **Pending Submissions** — table with Approve / Reject buttons
2. **All Resources** — table with Edit / Delete buttons
3. **Stats** — total users count, total resources count, pending count

### Submit Resource Form (`/submit`)
Fields: Title, Description, Link, Image URL, Category (dropdown), Tag (dropdown)  
On submit: `POST /api/submissions` → show success message

---

## 4. Deployment Plan

### Step 1 — MongoDB Atlas
1. Create free M0 cluster at mongodb.com/atlas
2. Create database user, whitelist `0.0.0.0/0`
3. Copy connection string

### Step 2 — Render.com (Backend)
1. Push `server/` to GitHub
2. New Web Service on render.com → connect repo → set root to `server/`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`
6. Deploy → copy the Render URL

### Step 3 — Vercel (Frontend)
1. Push `client/` to GitHub
2. Import on vercel.com → Vite auto-detected
3. Add environment variable: `VITE_API_URL=<Render URL>`
4. Deploy → copy Vercel URL → paste into Render's `CLIENT_URL`

### Step 4 — Seed Data
Run once locally after Atlas is connected:
```bash
cd server
node scripts/seed.js
```

---

## 5. Resume Bullet Points (After Build)

- Built a fullstack developer resource hub with JWT authentication, role-based access control, and an admin dashboard using React, Node.js, Express, and MongoDB
- Designed and implemented a REST API with 15+ endpoints covering auth, resource management, bookmarking, and community submissions
- Migrated a static JSON-based frontend to a live MongoDB Atlas database with a one-time seed script
- Deployed frontend on Vercel and backend on Render with environment-based configuration for zero-cost hosting
- Implemented protected and admin-only routes on both frontend (React Router) and backend (Express middleware)
