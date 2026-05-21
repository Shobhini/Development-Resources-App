import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import API from '../lib/api'

const TAG_MAP = {
  html: 'html', css: 'css', js: 'javascript',
  tailwind: 'tailwindcss', nextjs: 'nextjs', react: 'reactjs',
}

const useResources = (category) => {
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
        const res = await fetch(`${API}/api/resources?category=${category}&tag=${tag}&page=${page}${search}`)
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
  }, [category, filter, page, searchQuery])

  const handleFilterChange = (target) => { setFilter(target); setPage(1) }

  return { data, loading, error, page, pages, setPage, handleFilterChange }
}

export default useResources
