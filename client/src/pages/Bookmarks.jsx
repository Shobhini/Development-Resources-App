import { useEffect, useState } from 'react'
import Card from '../components/Card'
import CardSkeleton from '../components/CardSkeleton'
import { useAuth } from '../context/AuthContext'

import API from '../lib/api'

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : bookmarks.length === 0
            ? <p className="text-gray-500 dark:text-gray-400 col-span-full">No bookmarks yet. Save resources by clicking the heart icon on any card.</p>
            : bookmarks.map((res, i) => (
                <Card key={res._id} _id={res._id} title={res.title} link={res.link}
                  description={res.description} i={i} img={res.img} bookmarked={true} />
              ))
        }
      </div>
    </div>
  )
}

export default Bookmarks
