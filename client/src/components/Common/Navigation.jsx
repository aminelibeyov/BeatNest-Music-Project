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
    <nav className="bg-gradient-to-r from-slate-900/80 via-slate-900/90 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - with animation */}
          <Link to="/" className="text-green-400 text-2xl font-bold hover:text-green-300 transition-all duration-300 flex items-center gap-2 group">
            <span className="inline-block group-hover:animate-bounce-smooth">♪</span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-emerald-400">BeatNest</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link 
                  to="/search" 
                  className="text-slate-300 hover:text-green-400 transition-all duration-300 font-medium relative group"
                >
                  Search
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/library" 
                  className="text-slate-300 hover:text-green-400 transition-all duration-300 font-medium relative group"
                >
                  Library
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/wishlist" 
                  className="text-slate-300 hover:text-green-400 transition-all duration-300 font-medium relative group"
                >
                  Liked Songs
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/premium" 
                  className="text-slate-300 hover:text-yellow-400 transition-all duration-300 font-medium relative group"
                >
                  Premium
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                {user.role === 'admin' && (
                  <div className="relative group">
                    <Link to="/panel/admin" className="text-slate-300 hover:text-red-400 transition-all duration-300 font-medium relative">
                      Panel
                      <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-red-400 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <div className="absolute left-0 mt-0 w-56 bg-slate-900/95 backdrop-blur-md rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-700/50 overflow-hidden">
                      <Link 
                        to="/panel/admin" 
                        className="block px-4 py-3 text-slate-300 hover:text-green-400 hover:bg-slate-800/50 transition-all duration-300 border-b border-slate-700/30"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/panel/admin/approval" 
                        className="block px-4 py-3 text-slate-300 hover:text-green-400 hover:bg-slate-800/50 transition-all duration-300 border-b border-slate-700/30"
                      >
                        Song Moderation
                      </Link>
                      <Link 
                        to="/panel/admin/artists" 
                        className="block px-4 py-3 text-slate-300 hover:text-green-400 hover:bg-slate-800/50 transition-all duration-300"
                      >
                        Artist Management
                      </Link>
                    </div>
                  </div>
                )}

                <Link 
                  to="/dashboard" 
                  className="text-slate-300 hover:text-blue-400 transition-all duration-300 font-medium relative group"
                >
                  Profile
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-slate-300 hover:text-green-400 transition-all duration-300 font-medium relative group"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-3xl hover:text-green-400 transition-all duration-300 font-bold transform hover:scale-110"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 animate-fade-in-down">
            {user ? (
              <>
                <Link
                  to="/search"
                  className="block px-4 py-3 text-slate-300 hover:text-green-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔍 Search
                </Link>
                <Link
                  to="/library"
                  className="block px-4 py-3 text-slate-300 hover:text-green-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🎧 Library
                </Link>
                <Link
                  to="/wishlist"
                  className="block px-4 py-3 text-slate-300 hover:text-green-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ❤️ Liked Songs
                </Link>
                <Link
                  to="/premium"
                  className="block px-4 py-3 text-slate-300 hover:text-yellow-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⭐ Premium
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/panel/admin"
                      className="block px-4 py-3 text-slate-300 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🛠️ Panel Dashboard
                    </Link>
                    <Link
                      to="/panel/admin/approval"
                      className="block px-4 py-3 text-slate-300 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🎵 Song Moderation
                    </Link>
                    <Link
                      to="/panel/admin/artists"
                      className="block px-4 py-3 text-slate-300 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🎤 Artist Management
                    </Link>
                  </>
                )}
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-slate-300 hover:text-green-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all duration-300 text-center"
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
