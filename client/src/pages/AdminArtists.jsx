import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const AdminArtists = () => {
  const navigate = useNavigate()
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  const fetchArtists = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      }
      const response = await api.get('/admin/artists', { params })
      const data = response.data.data
      setArtists(data.artists || [])
      setPagination((prev) => ({ ...prev, ...data.pagination }))
    } catch {
      toast.error('Failed to fetch artists')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search, sort, statusFilter])

  useEffect(() => {
    fetchArtists()
  }, [fetchArtists])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleStatusChange = async (artistId, newStatus) => {
    try {
      await api.put(`/admin/users/${artistId}/status`, { status: newStatus })
      toast.success(`Artist status updated to ${newStatus}`)
      fetchArtists()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="bg-slate-900/90 border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-white text-3xl font-bold">🎤 Artist Management</h1>
            <p className="text-slate-400 text-sm mt-1">View, search, and manage platform artists</p>
          </div>
          <button onClick={() => navigate('/panel/admin')} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500">
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search artists by name or email..."
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPagination((prev) => ({ ...prev, page: 1 }))
              }}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600/50"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600/50"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="firstName">Name A-Z</option>
              <option value="-firstName">Name Z-A</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500" />
          </div>
        ) : artists.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {artists.map((artist) => (
                <div
                  key={artist._id}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {artist.avatar ? (
                        <img src={artist.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        artist.firstName?.[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-xl font-bold truncate">
                        {artist.firstName} {artist.lastName}
                      </h3>
                      <p className="text-slate-400 text-sm truncate">{artist.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${
                        artist.status === 'active' ? 'bg-green-600/30 text-green-400' :
                        artist.status === 'suspended' ? 'bg-red-600/30 text-red-400' :
                        'bg-slate-600/30 text-slate-400'
                      }`}>
                        {artist.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-700/30 rounded-lg p-2 text-center">
                      <p className="text-slate-400 text-xs">Songs</p>
                      <p className="text-white font-bold">{artist.stats?.totalSongs || 0}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-2 text-center">
                      <p className="text-slate-400 text-xs">Plays</p>
                      <p className="text-white font-bold">{artist.stats?.totalPlays || 0}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-2 text-center">
                      <p className="text-slate-400 text-xs">Pending</p>
                      <p className="text-yellow-400 font-bold">{artist.stats?.pendingSongs || 0}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/panel/admin/artists/${artist._id}`)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500 text-sm"
                    >
                      View Profile & Stats
                    </button>
                    {artist.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(artist._id, 'suspended')}
                        className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/50 rounded-lg hover:bg-red-600/30 text-sm"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(artist._id, 'active')}
                        className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/50 rounded-lg hover:bg-green-600/30 text-sm"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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
                  Page {pagination.page} of {pagination.pages} ({pagination.total} artists)
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
            <div className="text-6xl mb-4">🎤</div>
            <h2 className="text-white text-2xl font-bold mb-2">No Artists Found</h2>
            <p className="text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminArtists
