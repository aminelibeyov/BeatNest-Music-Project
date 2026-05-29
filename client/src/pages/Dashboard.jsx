import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      fetchSongs()
    }
  }, [user])

  const fetchSongs = async () => {
    try {
      const response = await api.get('/songs', {
        params: { limit: 20, sort: '-createdAt' }
      })
      setSongs(response.data.data.songs || [])
    } catch (error) {
      console.log('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  // Listener Dashboard
  if (user.role === 'user') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        {/* Header */}
        <div className="bg-black border-b border-slate-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-white text-2xl font-bold">Welcome, {user.firstName}! 🎵</h1>
              <p className="text-slate-400 text-sm mt-1">Enjoy your personalized music experience</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div
              onClick={() => navigate('/search')}
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 cursor-pointer hover:from-blue-500 hover:to-blue-700 transition transform hover:scale-105"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-white text-xl font-bold mb-2">Search Songs</h3>
              <p className="text-blue-100">Find your favorite music</p>
            </div>

            <div
              onClick={() => navigate('/wishlist')}
              className="bg-gradient-to-br from-pink-600 to-red-600 rounded-lg p-8 cursor-pointer hover:from-pink-500 hover:to-red-500 transition transform hover:scale-105"
            >
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-white text-xl font-bold mb-2">Liked Songs</h3>
              <p className="text-red-100">Your favorite collection</p>
            </div>

            <div
              onClick={() => navigate('/library')}
              className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-8 cursor-pointer hover:from-purple-500 hover:to-purple-700 transition transform hover:scale-105"
            >
              <div className="text-4xl mb-4">🎧</div>
              <h3 className="text-white text-xl font-bold mb-2">My Library</h3>
              <p className="text-purple-100">Your playlists & recently played</p>
            </div>
          </div>

          {/* Latest Songs */}
          <div>
            <h2 className="text-white text-3xl font-bold mb-8">🎵 Latest Songs</h2>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
              </div>
            ) : songs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {songs.map((song) => (
                  <div
                    key={song._id}
                    onClick={() => navigate(`/song/${song._id}`)}
                    className="bg-slate-800 hover:bg-slate-700 rounded-lg overflow-hidden cursor-pointer transition group"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center overflow-hidden">
                      {song.coverImage ? (
                        <img
                          src={song.coverImage}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                        />
                      ) : (
                        <div className="text-5xl">🎵</div>
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition"></div>
                      <button className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition bg-green-500 hover:bg-green-600 text-black p-3 rounded-full">
                        ▶️
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold truncate group-hover:text-green-500 transition">
                        {song.title}
                      </h3>
                      <p className="text-slate-400 text-sm truncate">{song.artist}</p>
                      <p className="text-slate-500 text-xs mt-2">🎧 {song.plays || 0} plays</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-20">
                <p className="text-xl">No songs available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Artist Dashboard
  if (user.role === 'artist') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        {/* Header */}
        <div className="bg-black border-b border-slate-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-white text-2xl font-bold">🎤 Artist Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Manage your music and connect with listeners</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Welcome & Stats */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-8 mb-8 border border-purple-500/30">
            <h2 className="text-white text-2xl font-bold mb-2">Welcome, {user.firstName}! 🎵</h2>
            <p className="text-slate-300 mb-6">Upload your music, reach new audiences, and grow your fanbase</p>

            <button
              onClick={() => navigate('/artist/upload')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold rounded-lg transition"
            >
              ➕ Upload New Song
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-white text-xl font-bold mb-2">My Songs</h3>
              <p className="text-slate-400 mb-4">Manage and track your uploaded songs</p>
              <button
                onClick={() => navigate('/artist/songs')}
                className="text-green-500 hover:text-green-400 font-bold transition"
              >
                View My Songs →
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-white text-xl font-bold mb-2">Analytics</h3>
              <p className="text-slate-400 mb-4">Track plays, listeners, and engagement</p>
              <button className="text-green-500 hover:text-green-400 font-bold transition">
                View Analytics →
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-white text-2xl font-bold mb-6">📈 Recent Activity</h2>
            <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700 text-center">
              <div className="text-6xl mb-4">🎶</div>
              <p className="text-slate-400 mb-6">Start uploading your songs to see activity here!</p>
              <button
                onClick={() => navigate('/artist/upload')}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition"
              >
                Upload Your First Song
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        <div className="bg-black border-b border-slate-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">👨‍💼 Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => navigate('/admin/panel')}
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 cursor-pointer hover:from-blue-500 hover:to-blue-700 transition"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-white text-xl font-bold">Admin Panel</h3>
              <p className="text-blue-100">Manage users and content</p>
            </div>

            <div
              onClick={() => navigate('/admin/approval')}
              className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-8 cursor-pointer hover:from-purple-500 hover:to-purple-700 transition"
            >
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-white text-xl font-bold">Song Approval</h3>
              <p className="text-purple-100">Review pending songs</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Dashboard
