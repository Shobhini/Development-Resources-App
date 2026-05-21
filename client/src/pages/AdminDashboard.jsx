import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

import API from '../lib/api'

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
