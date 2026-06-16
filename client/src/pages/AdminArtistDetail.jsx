import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-600/20 border-yellow-600/50',
  approved: 'text-green-400 bg-green-600/20 border-green-600/50',
  rejected: 'text-red-400 bg-red-600/20 border-red-600/50'
}

const AdminArtistDetail = () => {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [songFilter, setSongFilter] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  const fetchArtist = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(songFilter !== 'all' && { status: songFilter })
      }
      const response = await api.get(`/admin/artists/${artistId}`, { params })
      setData(response.data.data)
      setPagination((prev) => ({ ...prev, ...response.data.data.pagination }))
    } catch {
      toast.error('Failed to fetch artist details')
      navigate('/panel/admin/artists')
    } finally {
      setLoading(false)
    }
  }, [artistId, pagination.page, pagination.limit, songFilter, navigate])

  useEffect(() => {
    fetchArtist()
  }, [fetchArtist])

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500" />
      </div>
    )
  }

  const { artist, stats, songs, recentActivity } = data || {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="bg-slate-900/90 border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-white text-3xl font-bold">{artist?.firstName} {artist?.lastName}</h1>
            <p className="text-slate-400 text-sm mt-1">{artist?.email}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin/artists')} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm">← Artists</button>
            <button onClick={() => navigate('/admin')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Dashboard</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Artist Profile */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
              {artist?.avatar ? (
                <img src={artist.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                artist?.firstName?.[0]?.toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <p className="text-slate-300 mb-2">{artist?.bio || 'No bio provided.'}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="text-slate-400">Joined: {new Date(artist?.createdAt).toLocaleDateString()}</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  artist?.status === 'active' ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'
                }`}>
                  {artist?.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <h2 className="text-white text-2xl font-bold mb-4">Artist Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Songs', value: stats?.totalSongs, color: 'from-blue-600/20 to-blue-900/20' },
            { label: 'Approved', value: stats?.approvedSongs, color: 'from-green-600/20 to-green-900/20' },
            { label: 'Pending', value: stats?.pendingSongs, color: 'from-yellow-600/20 to-yellow-900/20' },
            { label: 'Rejected', value: stats?.rejectedSongs, color: 'from-red-600/20 to-red-900/20' },
            { label: 'Total Plays', value: stats?.totalPlays, color: 'from-purple-600/20 to-purple-900/20' },
            { label: 'Total Likes', value: stats?.totalLikes, color: 'from-pink-600/20 to-pink-900/20' }
          ].map((item) => (
            <div key={item.label} className={`bg-gradient-to-br ${item.color} rounded-xl p-4 border border-white/10`}>
              <p className="text-slate-400 text-xs mb-1">{item.label}</p>
              <p className="text-white text-2xl font-bold">{item.value ?? 0}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        {recentActivity?.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-8">
            <h3 className="text-white text-lg font-bold mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {recentActivity.map((song) => (
                <div key={song._id} className="flex justify-between items-center py-2 border-b border-slate-700/30 last:border-0">
                  <span className="text-slate-300">{song.title}</span>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${STATUS_COLORS[song.approvalStatus?.status] || ''}`}>
                      {song.approvalStatus?.status}
                    </span>
                    <span className="text-slate-500 text-xs">{new Date(song.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Songs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-white text-2xl font-bold">Uploaded Content</h2>
          <select
            value={songFilter}
            onChange={(e) => {
              setSongFilter(e.target.value)
              setPagination((prev) => ({ ...prev, page: 1 }))
            }}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600/50"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {songs?.length > 0 ? (
          <div className="space-y-4">
            {songs.map((song) => (
              <div key={song._id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col md:flex-row gap-4">
                <img
                  src={song.coverImage || 'https://via.placeholder.com/80'}
                  alt={song.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="text-white font-bold">{song.title}</h4>
                  <p className="text-slate-400 text-sm">{song.genre} • {song.category?.name}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                    <span>Plays: {song.plays || 0}</span>
                    <span>Likes: {song.likes || 0}</span>
                    <span>Uploaded: {new Date(song.createdAt).toLocaleDateString()}</span>
                  </div>
                  {song.approvalStatus?.status === 'rejected' && song.approvalStatus?.rejectionReason && (
                    <p className="text-red-400 text-sm mt-2">Reason: {song.approvalStatus.rejectionReason}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded text-xs font-bold border ${STATUS_COLORS[song.approvalStatus?.status] || ''}`}>
                    {song.approvalStatus?.status}
                  </span>
                  {song.approvalStatus?.approvedBy && (
                    <span className="text-slate-500 text-xs">
                      by {song.approvalStatus.approvedBy.firstName} {song.approvalStatus.approvedBy.lastName}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-slate-400">Page {pagination.page} of {pagination.pages}</span>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No songs found for this filter.</p>
        )}
      </div>
    </div>
  )
}

export default AdminArtistDetail
