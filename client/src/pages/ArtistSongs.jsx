import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-toastify'

const ArtistSongs = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalPlays: 0,
    approvedSongs: 0,
    pendingSongs: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'artist') {
      navigate('/dashboard')
    } else {
      fetchArtistSongs()
    }
  }, [user])

  const fetchArtistSongs = async () => {
    try {
      const response = await api.get('/songs/artist/my-songs')
      const artistSongs = response.data.data.songs || []
      setSongs(artistSongs)

      // Calculate stats
      const approved = artistSongs.filter(s => s.status === 'approved').length
      const pending = artistSongs.filter(s => s.status === 'pending').length
      const totalPlays = artistSongs.reduce((sum, s) => sum + (s.plays || 0), 0)

      setStats({
        totalSongs: artistSongs.length,
        totalPlays,
        approvedSongs: approved,
        pendingSongs: pending
      })
    } catch (error) {
      console.log('Error fetching songs:', error)
      setSongs([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (songId) => {
    if (!window.confirm('Are you sure you want to delete this song?')) {
      return
    }

    try {
      await api.delete(`/songs/${songId}`)
      toast.success('Song deleted successfully')
      fetchArtistSongs()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete song')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/30 border-green-500/30 text-green-400'
      case 'rejected':
        return 'bg-red-900/30 border-red-500/30 text-red-400'
      case 'pending':
        return 'bg-yellow-900/30 border-yellow-500/30 text-yellow-400'
      default:
        return 'bg-slate-700/30 border-slate-500/30 text-slate-400'
    }
  }

  if (!user || user.role !== 'artist') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white transition mb-6"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-white text-4xl font-bold mb-2">📊 My Songs</h1>
          <p className="text-slate-400">Manage your uploaded songs and track performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
            <div className="text-3xl mb-2">📈</div>
            <p className="text-slate-400 text-sm">Total Songs</p>
            <p className="text-white text-3xl font-bold">{stats.totalSongs}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-lg p-6">
            <div className="text-3xl mb-2">✓</div>
            <p className="text-slate-400 text-sm">Approved</p>
            <p className="text-white text-3xl font-bold">{stats.approvedSongs}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 rounded-lg p-6">
            <div className="text-3xl mb-2">⏳</div>
            <p className="text-slate-400 text-sm">Pending Review</p>
            <p className="text-white text-3xl font-bold">{stats.pendingSongs}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-lg p-6">
            <div className="text-3xl mb-2">🎧</div>
            <p className="text-slate-400 text-sm">Total Plays</p>
            <p className="text-white text-3xl font-bold">{stats.totalPlays}</p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/artist/upload')}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold rounded-lg transition"
          >
            ➕ Upload New Song
          </button>
        </div>

        {/* Songs List */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-6">🎵 Your Songs</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
            </div>
          ) : songs.length > 0 ? (
            <div className="space-y-4">
              {songs.map((song) => (
                <div
                  key={song._id}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-bold mb-1">{song.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{song.description}</p>

                      <div className="flex items-center gap-4 flex-wrap mb-4">
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <span>🎭</span>
                          <span>{song.genre}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <span>🎧</span>
                          <span>{song.plays || 0} plays</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <span>📅</span>
                          <span>{new Date(song.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(song.status)}`}>
                        {song.status === 'approved' && '✓ Approved'}
                        {song.status === 'pending' && '⏳ Pending Review'}
                        {song.status === 'rejected' && '✗ Rejected'}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/song/${song._id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDelete(song._id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {song.status === 'rejected' && song.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded text-red-300 text-sm">
                      <strong>Rejection Reason:</strong> {song.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-slate-400 mb-6">You haven't uploaded any songs yet</p>
              <button
                onClick={() => navigate('/artist/upload')}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition"
              >
                Upload Your First Song
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistSongs
