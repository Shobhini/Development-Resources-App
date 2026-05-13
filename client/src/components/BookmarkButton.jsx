import { useState } from 'react'
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
