import { useState } from 'react'
import { motion } from 'framer-motion'
import API from '../lib/api'

const SUGGESTIONS = [
  'Become a React developer from scratch',
  'Learn HTML and CSS basics',
  'Master JavaScript fundamentals',
  'Get started with Next.js',
  'Learn Tailwind CSS for styling',
]

const LearningPath = () => {
  const [goal, setGoal] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!goal.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API}/api/learning-path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to generate path')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="m-8 mt-32 lg:mt-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Learning Path Generator
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Tell us your goal and AI will build a step-by-step path from our resource library.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="e.g. Become a React developer from scratch"
          className="flex-1 border rounded-lg px-4 py-3 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#545454]"
        />
        <button
          type="submit"
          disabled={loading || !goal.trim()}
          className="px-6 py-3 bg-[#545454] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Building...' : 'Build Path'}
        </button>
      </form>

      {/* Suggestion chips */}
      {!result && (
        <div className="flex flex-wrap gap-2 mb-8">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => setGoal(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 mb-6">{error}</p>}

      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0 mt-1" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Path for: <span className="font-semibold text-gray-700 dark:text-gray-200">"{result.goal}"</span>
          </p>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="flex flex-col gap-6">
              {result.path.map(({ step, reason, resource }, i) => (
                <motion.div
                  key={resource._id}
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  {/* step circle */}
                  <div className="w-8 h-8 rounded-full bg-[#545454] text-white flex items-center justify-center text-sm font-bold shrink-0 z-10">
                    {step}
                  </div>

                  {/* card */}
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex gap-4 items-start">
                      {resource.img && (
                        <img
                          src={resource.img}
                          alt={resource.title}
                          className="w-16 h-12 object-cover rounded-md shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-[#545454] dark:group-hover:text-gray-300 transition-colors">
                            {resource.title}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 capitalize">
                            {resource.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {resource.tag}
                          </span>
                        </div>
                        <p className="text-sm text-blue-500 dark:text-blue-400 italic mb-1">
                          {reason}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {resource.description.slice(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setGoal('') }}
            className="mt-8 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            ← Generate another path
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default LearningPath
