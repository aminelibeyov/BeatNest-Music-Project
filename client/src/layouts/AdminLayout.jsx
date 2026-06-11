import React, { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/approval', label: 'Song Moderation', icon: '🎵' },
  { to: '/admin/artists', label: 'Artist Management', icon: '🎤' }
]

const AdminLayout = () => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!user || user.role !== 'admin') {
      navigate(user ? '/' : '/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900/90 border-r border-slate-700/50 fixed h-full z-30">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            <span>👨‍💼</span> Admin Panel
          </h2>
          <p className="text-slate-400 text-xs mt-1 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-800/50 transition"
          >
            ← Back to Site
          </button>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-full px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header + nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900/95 border-b border-slate-700/50">
        <div className="px-4 py-3 flex justify-between items-center border-b border-slate-700/30">
          <span className="text-white font-bold">👨‍💼 Admin Panel</span>
          <button onClick={() => navigate('/')} className="text-slate-400 text-sm">← Site</button>
        </div>
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'
              }`
            }
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-24 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
