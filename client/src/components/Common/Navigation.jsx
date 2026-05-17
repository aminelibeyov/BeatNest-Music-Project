import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Navigation = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-black border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-green-500 text-2xl font-bold">
            ♪ BeatNest
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to="/search" className="text-slate-400 hover:text-white transition">Search</Link>
                <Link to="/library" className="text-slate-400 hover:text-white transition">Library</Link>
                <Link to="/wishlist" className="text-slate-400 hover:text-white transition">Liked Songs</Link>
                <Link to="/premium" className="text-slate-400 hover:text-white transition">Premium</Link>
                
                {user.role === 'admin' && (
                  <div className="relative group">
                    <button className="text-slate-400 hover:text-white transition">Admin</button>
                    <div className="absolute left-0 mt-2 w-48 bg-slate-900 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                      <Link to="/admin/approval" className="block px-4 py-2 text-slate-400 hover:text-white">
                        Song Approval
                      </Link>
                      <Link to="/admin/panel" className="block px-4 py-2 text-slate-400 hover:text-white">
                        Dashboard
                      </Link>
                    </div>
                  </div>
                )}

                <Link to="/dashboard" className="text-slate-400 hover:text-white transition">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-400 hover:text-white transition">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {user ? (
              <>
                <Link
                  to="/search"
                  className="block px-4 py-2 text-slate-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search
                </Link>
                <Link
                  to="/library"
                  className="block px-4 py-2 text-slate-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Library
                </Link>
                <Link
                  to="/wishlist"
                  className="block px-4 py-2 text-slate-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Liked Songs
                </Link>
                <Link
                  to="/premium"
                  className="block px-4 py-2 text-slate-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Premium
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/approval"
                      className="block px-4 py-2 text-slate-400 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Song Approval
                    </Link>
                    <Link
                      to="/admin/panel"
                      className="block px-4 py-2 text-slate-400 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </>
                )}
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-slate-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-slate-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-green-500 text-black font-bold rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
