import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

import API from '../lib/api'

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
