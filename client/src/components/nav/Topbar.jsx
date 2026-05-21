import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Topbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="fixed top-0 right-0 z-50 flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 w-full lg:w-[calc(100%-15rem)]">
      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Hi, <span className="font-bold text-gray-800 dark:text-white">{user.name}</span>
            </span>
            <NavLink
              to="/bookmarks"
              className="text-sm px-3 py-1.5 rounded-lg bg-[#545454] text-white hover:bg-[#3a3a3a] transition-colors"
            >
              ♥ Bookmarks
            </NavLink>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="text-sm text-red-400 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="text-sm px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="text-sm px-4 py-1.5 rounded-lg bg-[#545454] text-white hover:bg-[#3a3a3a] transition-colors"
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </div>
  )
}

export default Topbar
