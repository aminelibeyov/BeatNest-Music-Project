import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-toastify'

const AdminApproval = () => {
  const { user } = useAuth()
  const [songs, setSongs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState({})

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/'
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
      toast.success('Song approved!')
      fetchPendingSongs()
      fetchStats()
    } catch (error) {
      toast.error('Failed to approve song')
    }
  }

  const handleReject = async (songId) => {
    const reason = rejectionReason[songId] || 'No reason provided'
    try {
      await api.post(`/approval/reject/${songId}`, { rejectionReason: reason })
      toast.success('Song rejected')
      setRejectionReason({ ...rejectionReason, [songId]: '' })
      fetchPendingSongs()
      fetchStats()
    } catch (error) {
      toast.error('Failed to reject song')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-white text-5xl font-bold mb-12">Admin Panel - Song Approval</h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-6">
              <p className="text-yellow-400 text-sm font-bold">Pending</p>
              <p className="text-white text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-green-600/20 border border-green-600 rounded-lg p-6">
              <p className="text-green-400 text-sm font-bold">Approved</p>
              <p className="text-white text-3xl font-bold">{stats.approved}</p>
            </div>
            <div className="bg-red-600/20 border border-red-600 rounded-lg p-6">
              <p className="text-red-400 text-sm font-bold">Rejected</p>
              <p className="text-white text-3xl font-bold">{stats.rejected}</p>
            </div>
            <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-6">
              <p className="text-blue-400 text-sm font-bold">Total</p>
              <p className="text-white text-3xl font-bold">{stats.total}</p>
            </div>
          </div>
        )}

        {songs.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-bold">Pending Songs ({songs.length})</h2>
            {songs.map((song) => (
              <div key={song._id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex gap-6">
                  <img
                    src={song.coverImage || 'https://via.placeholder.com/120'}
                    alt={song.title}
                    className="w-32 h-32 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-2">{song.title}</h3>
                    <p className="text-slate-400 mb-1">Artist: {song.artist}</p>
                    <p className="text-slate-400 mb-1">Uploaded by: {song.artistId.firstName} {song.artistId.lastName}</p>
                    <p className="text-slate-400 mb-1">Email: {song.artistId.email}</p>
                    <p className="text-slate-400 mb-4">Genre: {song.genre}</p>
                    <p className="text-slate-300 mb-4">{song.description}</p>

                    <div className="space-y-3">
                      <textarea
                        placeholder="Rejection reason (if rejecting)..."
                        value={rejectionReason[song._id] || ''}
                        onChange={(e) => setRejectionReason({ ...rejectionReason, [song._id]: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        rows="2"
                      />
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleApprove(song._id)}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReject(song._id)}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-20">
            <p className="text-xl">No pending songs for approval</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminApproval
