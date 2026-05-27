import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [trendingSongs, setTrendingSongs] = useState([])
  const [latestSongs, setLatestSongs] = useState([])
  const [wishlistSongs, setWishlistSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Popular artists data
  const popularArtists = [
    {
      name: 'Eminem',
      initials: 'EM',
      genre: 'Hip-Hop/Rap',
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'The Weeknd',
      initials: 'TW',
      genre: 'R&B/Synthwave',
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Drake',
      initials: 'DR',
      genre: 'Hip-Hop/R&B',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Billie Eilish',
      initials: 'BE',
      genre: 'Alternative/Pop',
      color: 'from-green-500 to-emerald-600'
    }
  ]

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      fetchAllData()
    }
  }, [user])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [trendingRes, latestRes, wishlistRes] = await Promise.all([
        api.get('/songs', { params: { limit: 12, sort: '-plays' } }),
        api.get('/songs', { params: { limit: 12, sort: '-createdAt' } }),
        api.get('/wishlist')
      ])

      setTrendingSongs(trendingRes.data.data.songs || [])
      setLatestSongs(latestRes.data.data.songs || [])
      setWishlistSongs(wishlistRes.data.data?.songs || [])
    } catch (error) {
      console.log('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Song Card Component
  const SongCard = ({ song }) => (
    <div
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
  )

  if (!user) {
    return null
  }

  // Listener Dashboard
  if (user.role === 'user') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        {/* Header */}
        <div className="bg-black border-b border-slate-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-white text-3xl font-bold">Welcome, {user.firstName}! 🎵</h1>
                <p className="text-slate-400 text-sm mt-1">Enjoy your personalized music experience</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Logout
              </button>
            </div>

            {/* Quick Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="🔍 Search songs, artists, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
            <div
              onClick={() => navigate('/search')}
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 cursor-pointer hover:from-blue-500 hover:to-blue-700 transition transform hover:scale-105"
            >
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-white text-lg font-bold">Search</h3>
              <p className="text-blue-100 text-sm">Find music</p>
            </div>

            <div
              onClick={() => navigate('/wishlist')}
              className="bg-gradient-to-br from-pink-600 to-red-600 rounded-lg p-6 cursor-pointer hover:from-pink-500 hover:to-red-500 transition transform hover:scale-105"
            >
              <div className="text-3xl mb-3">❤️</div>
              <h3 className="text-white text-lg font-bold">Liked Songs</h3>
              <p className="text-red-100 text-sm">{wishlistSongs.length} songs</p>
            </div>

            <div
              onClick={() => navigate('/library')}
              className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 cursor-pointer hover:from-purple-500 hover:to-purple-700 transition transform hover:scale-105"
            >
              <div className="text-3xl mb-3">🎧</div>
              <h3 className="text-white text-lg font-bold">Library</h3>
              <p className="text-purple-100 text-sm">Playlists</p>
            </div>

            <div
              onClick={() => navigate('/premium')}
              className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 cursor-pointer hover:from-yellow-500 hover:to-yellow-600 transition transform hover:scale-105"
            >
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="text-white text-lg font-bold">Premium</h3>
              <p className="text-yellow-100 text-sm">Go premium</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {/* Trending Songs Section */}
              <div className="mb-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-white text-3xl font-bold">🔥 Trending Now</h2>
                  <button
                    onClick={() => navigate('/search')}
                    className="text-green-500 hover:text-green-400 transition font-bold"
                  >
                    See All →
                  </button>
                </div>
                {trendingSongs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {trendingSongs.slice(0, 8).map((song) => (
                      <SongCard key={song._id} song={song} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-12">
                    <p className="text-lg">No trending songs available</p>
                  </div>
                )}
              </div>

              {/* Popular Artists Section */}
              <div className="mb-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-white text-3xl font-bold">🌟 Popular Artists</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularArtists.map((artist, index) => (
                    <div
                      key={index}
                      className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition cursor-pointer"
                    >
                      <div className={`bg-gradient-to-br ${artist.color} p-12 flex items-center justify-center h-40`}>
                        <div className="text-5xl font-bold text-white drop-shadow-lg">
                          {artist.initials}
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-white font-bold text-lg">{artist.name}</h3>
                        <p className="text-slate-400 text-sm">{artist.genre}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Songs Section */}
              <div className="mb-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-white text-3xl font-bold">🆕 Latest Releases</h2>
                  <button
                    onClick={() => navigate('/search')}
                    className="text-green-500 hover:text-green-400 transition font-bold"
                  >
                    See All →
                  </button>
                </div>
                {latestSongs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {latestSongs.slice(0, 8).map((song) => (
                      <SongCard key={song._id} song={song} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-12">
                    <p className="text-lg">No latest songs available</p>
                  </div>
                )}
              </div>

              {/* Your Favorite Songs Preview */}
              {wishlistSongs.length > 0 && (
                <div className="mb-16">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-white text-3xl font-bold">❤️ Your Favorite Songs</h2>
                    <button
                      onClick={() => navigate('/wishlist')}
                      className="text-green-500 hover:text-green-400 transition font-bold"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {wishlistSongs.slice(0, 5).map((item) => (
                      <div
                        key={item.songId._id}
                        onClick={() => navigate(`/song/${item.songId._id}`)}
                        className="bg-slate-800 hover:bg-slate-700 p-4 rounded-lg transition group flex items-center gap-4 cursor-pointer"
                      >
                        <img
                          src={item.songId.coverImage || 'https://via.placeholder.com/60'}
                          alt={item.songId.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-bold group-hover:text-green-500 transition">
                            {item.songId.title}
                          </h3>
                          <p className="text-slate-400 text-sm">{item.songId.artist}</p>
                        </div>
                        <span className="text-slate-500 text-sm">🎧 {item.songId.plays || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
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
