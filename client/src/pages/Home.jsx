import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-toastify'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTrendingSongs()
    }
  }, [user])

  const fetchTrendingSongs = async () => {
    try {
      const response = await api.get('/songs', {
        params: {
          limit: 12,
          sort: '-plays'
        }
      })
      setSongs(response.data.data.songs || [])
    } catch (error) {
      console.log('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-white text-6xl font-bold mb-4">Welcome to BeatNest</h1>
          <p className="text-slate-400 text-xl mb-8">Discover, create, and share your favorite music</p>

          <div className="flex gap-4 justify-center mb-20">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition text-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 border-2 border-green-500 text-green-500 font-bold rounded-full hover:bg-green-500 hover:text-black transition text-lg"
            >
              Login
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-lg backdrop-blur">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-white text-xl font-bold mb-2">Stream Music</h3>
              <p className="text-slate-400">Access millions of songs and playlists</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-lg backdrop-blur">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-white text-xl font-bold mb-2">Share Your Music</h3>
              <p className="text-slate-400">Upload and share your favorite creations</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-lg backdrop-blur">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-white text-xl font-bold mb-2">Discover Artists</h3>
              <p className="text-slate-400">Find new artists and genres</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-white text-5xl font-bold mb-2">Welcome back, {user.firstName}! 👋</h1>
          <p className="text-slate-400">Discover what's trending</p>
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div
            onClick={() => navigate('/search')}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 cursor-pointer hover:from-blue-500 hover:to-blue-700 transition h-48 flex flex-col justify-end"
          >
            <h2 className="text-white text-3xl font-bold">🔍 Search Music</h2>
            <p className="text-blue-100 mt-2">Find your favorite songs</p>
          </div>

          <div
            onClick={() => navigate('/premium')}
            className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-8 cursor-pointer hover:from-purple-500 hover:to-purple-700 transition h-48 flex flex-col justify-end"
          >
            <h2 className="text-white text-3xl font-bold">⭐ Go Premium</h2>
            <p className="text-purple-100 mt-2">Unlock exclusive features</p>
          </div>
        </div>

        {/* Trending Songs */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
          </div>
        ) : songs.length > 0 ? (
          <div>
            <h2 className="text-white text-3xl font-bold mb-8">🔥 Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {songs.map((song) => (
                <div
                  key={song._id}
                  onClick={() => navigate(`/song/${song._id}`)}
                  className="bg-slate-800 hover:bg-slate-700 rounded-lg overflow-hidden cursor-pointer transition group"
                >
                  <div className="relative overflow-hidden h-48 bg-gradient-to-br from-slate-700 to-slate-900">
                    {song.coverImage ? (
                      <img
                        src={song.coverImage}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold truncate group-hover:text-green-500 transition">
                      {song.title}
                    </h3>
                    <p className="text-slate-400 text-sm truncate">{song.artist}</p>
                    <p className="text-slate-500 text-xs mt-2">🎧 {song.plays} plays</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-20">
            <p className="text-xl">No songs available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
