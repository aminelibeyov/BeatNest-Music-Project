import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const AdminApproval = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rejectionReasons, setRejectionReasons] = useState({})
  const [expandedSong, setExpandedSong] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/')
      return
    }
    fetchPendingSongs()
    fetchStats()
  }, [])

  const fetchPendingSongs = async () => {
    try {
      const response = await api.get('/approval/pending')
      setSongs(response.data.data.songs || [])
    } catch (error) {
      toast.error('Failed to fetch pending songs')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/approval/stats')
      setStats(response.data.data)
    } catch (error) {
      console.log('Stats error:', error)
    }
  }

  const handleApprove = async (songId) => {
    try {
      await api.post(`/approval/approve/${songId}`)
      toast.success('✓ Song approved successfully!')
      fetchPendingSongs()
      fetchStats()
      setExpandedSong(null)
    } catch (error) {
      toast.error('Failed to approve song')
    }
  }

  const handleReject = async (songId) => {
    const reason = rejectionReasons[songId] || 'No reason provided'
    if (!reason.trim()) {
      toast.warning('Please provide a rejection reason')
      return
    }
    try {
      await api.post(`/approval/reject/${songId}`, { rejectionReason: reason })
      toast.success('✗ Song rejected')
      setRejectionReasons({ ...rejectionReasons, [songId]: '' })
      fetchPendingSongs()
      fetchStats()
      setExpandedSong(null)
    } catch (error) {
      toast.error('Failed to reject song')
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  const filteredSongs = songs

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading pending songs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900/80 via-slate-900/90 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-white text-3xl font-bold flex items-center gap-3">
                <span className="text-3xl">🎵</span> Song Approval System
              </h1>
              <p className="text-slate-400 text-sm mt-1">Review and approve user-submitted songs</p>
            </div>
            <button
              onClick={() => navigate('/admin/panel')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
                <p className="text-yellow-400 text-xs font-bold">PENDING</p>
                <p className="text-white text-2xl font-bold">{stats.pending}</p>
              </div>
              <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
                <p className="text-green-400 text-xs font-bold">APPROVED</p>
                <p className="text-white text-2xl font-bold">{stats.approved}</p>
              </div>
              <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4">
                <p className="text-red-400 text-xs font-bold">REJECTED</p>
                <p className="text-white text-2xl font-bold">{stats.rejected}</p>
              </div>
              <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
                <p className="text-blue-400 text-xs font-bold">TOTAL</p>
                <p className="text-white text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredSongs.length > 0 ? (
          <div>
            <h2 className="text-white text-2xl font-bold mb-8">
              Pending Songs ({filteredSongs.length})
            </h2>
            <div className="space-y-6">
              {filteredSongs.map((song, index) => (
                <div 
                  key={song._id}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Song Header */}
                  <div className="flex gap-6 mb-6">
                    {/* Cover Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={song.coverImage || 'https://via.placeholder.com/150'}
                        alt={song.title}
                        className="w-40 h-40 rounded-lg object-cover shadow-lg border border-slate-600/50"
                      />
                    </div>

                    {/* Song Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white text-2xl font-bold mb-2">{song.title}</h3>
                          <p className="text-slate-300 text-lg mb-1">
                            <span className="text-slate-400">Artist:</span> {song.artist}
                          </p>
                          <p className="text-slate-300 text-lg mb-4">
                            <span className="text-slate-400">Genre:</span> {song.genre}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-xs mb-2">Submitted by</p>
                          <p className="text-white font-bold">
                            {song.artistId?.firstName} {song.artistId?.lastName}
                          </p>
                          <p className="text-slate-400 text-sm">{song.artistId?.email}</p>
                        </div>
                      </div>

                      {/* Description */}
                      {song.description && (
                        <div className="mb-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                          <p className="text-slate-300 text-sm">
                            <span className="text-slate-400 font-bold">Description:</span> {song.description}
                          </p>
                        </div>
                      )}

                      {/* Song Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <p className="text-slate-400 text-xs">Duration</p>
                          <p className="text-white font-bold">{song.duration || 'N/A'}</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <p className="text-slate-400 text-xs">Language</p>
                          <p className="text-white font-bold">{song.language || 'English'}</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <p className="text-slate-400 text-xs">Release Date</p>
                          <p className="text-white font-bold">{song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                          <p className="text-slate-400 text-xs">Status</p>
                          <p className="text-yellow-400 font-bold">⏳ Pending</p>
                        </div>
                      </div>

                      {/* Audio Player */}
                      {song.audioUrl && (
                        <div className="mb-6 bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                          <p className="text-slate-400 text-xs mb-2">Audio Preview</p>
                          <audio
                            src={song.audioUrl}
                            controls
                            className="w-full h-10 rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approval Section */}
                  <div className="border-t border-slate-700/50 pt-6">
                    <div className="bg-slate-700/20 rounded-lg p-4 mb-6 border border-slate-600/30">
                      <label className="text-slate-300 text-sm font-bold block mb-2">
                        Rejection Reason (required if rejecting)
                      </label>
                      <textarea
                        placeholder="Provide a clear and constructive reason if you reject this song..."
                        value={rejectionReasons[song._id] || ''}
                        onChange={(e) => setRejectionReasons({ ...rejectionReasons, [song._id]: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-slate-600/50 text-sm placeholder-slate-500"
                        rows="3"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleApprove(song._id)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
                      >
                        <span>✓</span> Approve Song
                      </button>
                      <button
                        onClick={() => handleReject(song._id)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
                      >
                        <span>✗</span> Reject Song
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-white text-3xl font-bold mb-2">No Pending Songs</h2>
            <p className="text-slate-400 text-lg mb-8">All songs have been reviewed! Great work.</p>
            <button
              onClick={() => navigate('/admin/panel')}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminApproval
