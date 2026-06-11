import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const STATUS_TABS = [
  { key: 'pending', label: 'Pending', color: 'yellow' },
  { key: 'approved', label: 'Approved', color: 'green' },
  { key: 'rejected', label: 'Rejected', color: 'red' },
  { key: 'all', label: 'All', color: 'blue' }
]

const STATUS_BADGE = {
  pending: 'text-yellow-400 bg-yellow-600/20',
  approved: 'text-green-400 bg-green-600/20',
  rejected: 'text-red-400 bg-red-600/20'
}

const ShowMoreText = ({ text, limit = 150 }) => {
  const [expanded, setExpanded] = useState(false)
  if (!text) return null
  if (text.length <= limit) return <p className="text-slate-300 text-sm">{text}</p>
  return (
    <p className="text-slate-300 text-sm">
      {expanded ? text : `${text.slice(0, limit)}...`}
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-2 text-green-400 hover:text-green-300 text-xs font-bold"
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </p>
  )
}

const AdminApproval = () => {
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rejectionReasons, setRejectionReasons] = useState({})
  const [activeTab, setActiveTab] = useState('pending')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  const fetchSongs = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: activeTab,
        ...(search && { search })
      }
      const endpoint = activeTab === 'pending' ? '/approval/pending' : '/approval/songs'
      const response = await api.get(endpoint, { params: activeTab === 'pending' ? { page: params.page, limit: params.limit } : params })
      const data = response.data.data
      setSongs(data.songs || [])
      setPagination((prev) => ({ ...prev, ...data.pagination }))
    } catch {
      toast.error('Failed to fetch songs')
    } finally {
      setLoading(false)
    }
  }, [activeTab, pagination.page, pagination.limit, search])

  const fetchStats = async () => {
    try {
      const response = await api.get('/approval/stats')
      setStats(response.data.data)
    } catch {
      // silent
    }
  }

  useEffect(() => {
    fetchSongs()
    fetchStats()
  }, [fetchSongs])

  const handleApprove = async (songId) => {
    try {
      await api.post(`/approval/approve/${songId}`)
      toast.success('Song approved successfully!')
      fetchSongs()
      fetchStats()
    } catch {
      toast.error('Failed to approve song')
    }
  }

  const handleReject = async (songId) => {
    const reason = rejectionReasons[songId] || ''
    if (!reason.trim()) {
      toast.warning('Please provide a rejection reason')
      return
    }
    try {
      await api.post(`/approval/reject/${songId}`, { rejectionReason: reason })
      toast.success('Song rejected')
      setRejectionReasons({ ...rejectionReasons, [songId]: '' })
      fetchSongs()
      fetchStats()
    } catch {
      toast.error('Failed to reject song')
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="bg-slate-900/90 border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-white text-3xl font-bold">🎵 Song Moderation</h1>
            <p className="text-slate-400 text-sm mt-1">Review, approve, and track approval history</p>
          </div>
          <button onClick={() => navigate('/panel/admin')} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500">
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

      {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.key !== 'all' && stats && ` (${stats[tab.key]})`}
              </button>
            ))}
          </div>

          {/* Search */}
          {activeTab !== 'pending' && (
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title or artist..."
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="submit" className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500">
                Search
              </button>
            </form>
          )}

      {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500" />
          </div>
        ) : songs.length > 0 ? (
          <>
            <h2 className="text-white text-xl font-bold mb-6">
              {STATUS_TABS.find((t) => t.key === activeTab)?.label} Songs ({pagination.total})
            </h2>
            <div className="space-y-6">
              {songs.map((song) => {
                const status = song.approvalStatus?.status || 'pending'
                const isPending = status === 'pending'

                return (
                  <div
                    key={song._id}
                    className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-6 border border-slate-700/50"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={song.coverImage || 'https://via.placeholder.com/150'}
                        alt={song.title}
                        className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-white text-xl font-bold">{song.title}</h3>
                            <p className="text-slate-300">by {song.artist}</p>
                            <p className="text-slate-400 text-sm">{song.genre} • {song.category?.name}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${STATUS_BADGE[status] || ''}`}>
                              {status.toUpperCase()}
                            </span>
                            {song.artistId && (
                              <p className="text-slate-400 text-sm mt-2">
                                Uploaded by {song.artistId.firstName} {song.artistId.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        {song.description && (
                          <div className="mb-3 p-3 bg-slate-700/30 rounded-lg">
                            <p className="text-slate-400 text-xs font-bold mb-1">Description</p>
                            <ShowMoreText text={song.description} />
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                          <div className="bg-slate-700/30 rounded p-2">
                            <p className="text-slate-400 text-xs">Duration</p>
                            <p className="text-white">{song.duration ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}` : 'N/A'}</p>
                          </div>
                          <div className="bg-slate-700/30 rounded p-2">
                            <p className="text-slate-400 text-xs">Uploaded</p>
                            <p className="text-white">{new Date(song.createdAt).toLocaleDateString()}</p>
                          </div>
                          {song.approvalStatus?.approvedAt && (
                            <div className="bg-slate-700/30 rounded p-2">
                              <p className="text-slate-400 text-xs">Reviewed</p>
                              <p className="text-white">{new Date(song.approvalStatus.approvedAt).toLocaleDateString()}</p>
                            </div>
                          )}
                          {song.approvalStatus?.approvedBy && (
                            <div className="bg-slate-700/30 rounded p-2">
                              <p className="text-slate-400 text-xs">Reviewed By</p>
                              <p className="text-white">{song.approvalStatus.approvedBy.firstName} {song.approvalStatus.approvedBy.lastName}</p>
                            </div>
                          )}
                        </div>

                        {status === 'rejected' && song.approvalStatus?.rejectionReason && (
                          <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg">
                            <p className="text-red-400 text-xs font-bold">Rejection Reason</p>
                            <p className="text-red-300 text-sm">{song.approvalStatus.rejectionReason}</p>
                          </div>
                        )}

                        {song.audioUrl && (
                          <audio src={song.audioUrl} controls className="w-full h-10 rounded mb-4" />
                        )}
                      </div>
                    </div>

                    {isPending && (
                      <div className="border-t border-slate-700/50 pt-4 mt-4">
                        <textarea
                          placeholder="Rejection reason (required if rejecting)..."
                          value={rejectionReasons[song._id] || ''}
                          onChange={(e) => setRejectionReasons({ ...rejectionReasons, [song._id]: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600/50 text-sm mb-4"
                          rows="2"
                        />
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleApprove(song._id)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-emerald-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(song._id)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:from-red-500 hover:to-pink-500"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-slate-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-white text-2xl font-bold mb-2">No Songs Found</h2>
            <p className="text-slate-400">
              {activeTab === 'pending' ? 'All songs have been reviewed!' : 'No songs match this filter.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminApproval
