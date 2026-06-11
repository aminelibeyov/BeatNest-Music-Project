import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AdminPanel = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSongs: 0,
    totalArtists: 0,
    pendingApprovals: 0,
    approvedSongs: 0,
    rejectedSongs: 0,
    totalPlays: 0,
    activeUsers: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data.data || stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon, title, value, color, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${color} rounded-xl p-6 backdrop-blur border border-white/10 shadow-xl transform hover:scale-105 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-300 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-4xl font-bold">{value ?? 0}</p>
        </div>
        <div className="text-5xl opacity-20">{icon}</div>
      </div>
    </div>
  )

  const activityIcon = (type) => (type === 'song_upload' ? '🎵' : '👤')
  const activityLabel = (activity) => {
    if (activity.type === 'song_upload') {
      return `Song "${activity.title}" uploaded by ${activity.subtitle}`
    }
    return `New ${activity.status} registered: ${activity.title}`
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back, {user?.firstName}!</p>
      </div>

      <div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500" />
          </div>
        ) : (
          <>
            {/* Platform Overview */}
            <h2 className="text-white text-xl font-bold mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <StatCard icon="👥" title="Total Users" value={stats.totalUsers} color="from-blue-600/20 to-blue-900/20" />
              <StatCard icon="🎵" title="Total Songs" value={stats.totalSongs} color="from-green-600/20 to-green-900/20" />
              <StatCard
                icon="🎤"
                title="Total Artists"
                value={stats.totalArtists}
                color="from-purple-600/20 to-purple-900/20"
                onClick={() => navigate('/admin/artists')}
              />
              <StatCard
                icon="⏳"
                title="Pending Approval"
                value={stats.pendingApprovals}
                color="from-yellow-600/20 to-orange-900/20"
                onClick={() => navigate('/admin/approval')}
              />
            </div>

            {/* Content Moderation Metrics */}
            <h2 className="text-white text-xl font-bold mb-4">Content Moderation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <StatCard icon="✅" title="Approved Songs" value={stats.approvedSongs} color="from-emerald-600/20 to-emerald-900/20" onClick={() => navigate('/admin/approval')} />
              <StatCard icon="❌" title="Rejected Songs" value={stats.rejectedSongs} color="from-red-600/20 to-red-900/20" onClick={() => navigate('/admin/approval')} />
              <StatCard icon="▶️" title="Total Plays" value={stats.totalPlays} color="from-cyan-600/20 to-cyan-900/20" />
              <StatCard icon="🟢" title="Active Users" value={stats.activeUsers} color="from-teal-600/20 to-teal-900/20" />
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-10">
              <h2 className="text-white text-xl font-bold mb-5">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/admin/approval')}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  🎵 Review Pending Songs
                </button>
                <button
                  onClick={() => navigate('/admin/artists')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  🎤 Manage Artists
                </button>
                <button
                  onClick={() => navigate('/admin/approval')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  📋 Approval History
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-white text-lg font-bold mb-4">Recent Activity</h3>
                {stats.recentActivities?.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {stats.recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-700/30 last:border-0">
                        <span className="text-xl">{activityIcon(activity.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-300 text-sm truncate">{activityLabel(activity)}</p>
                          <div className="flex gap-2 mt-1">
                            {activity.status && (
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">{activity.status}</span>
                            )}
                            <span className="text-slate-500 text-xs">
                              {new Date(activity.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No recent activity.</p>
                )}
              </div>

              {/* Pending Focus */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-white text-lg font-bold mb-4">Moderation Focus</h3>
                {stats.pendingApprovals > 0 ? (
                  <div>
                    <p className="text-slate-300 mb-4">
                      <span className="text-yellow-400 font-bold text-2xl">{stats.pendingApprovals}</span> songs are waiting for your review.
                      Songs remain hidden from the public until approved.
                    </p>
                    <button
                      onClick={() => navigate('/admin/approval')}
                      className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-orange-500"
                    >
                      Start Reviewing →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">✨</div>
                    <p className="text-slate-300">All songs are reviewed. The moderation queue is clear.</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <h4 className="text-slate-400 text-sm font-bold mb-3">Admin Capabilities</h4>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Song moderation with approval history</li>
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Artist search, profiles & statistics</li>
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Platform analytics & activity tracking</li>
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Content visibility control (pending → approved)</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
