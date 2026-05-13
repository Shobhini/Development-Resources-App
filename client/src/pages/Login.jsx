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
