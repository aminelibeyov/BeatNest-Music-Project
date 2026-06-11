import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const AdminPanel = () => {
  const { user, logout } = useAuth()
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
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: 'Pop',
    description: '',
    language: 'English',
    duration: '',
    releaseDate: ''
  })
  const [files, setFiles] = useState({ audio: null, cover: null })
  const [preview, setPreview] = useState({ audio: null, cover: null })

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target
    if (fileList?.[0]) {
      setFiles((prev) => ({ ...prev, [name]: fileList[0] }))
      if (name === 'cover') {
        const reader = new FileReader()
        reader.onloadend = () => setPreview((prev) => ({ ...prev, cover: reader.result }))
        reader.readAsDataURL(fileList[0])
      } else if (name === 'audio') {
        setPreview((prev) => ({ ...prev, audio: fileList[0].name }))
      }
    }
  }

  const resetForm = () => {
    setFormData({ title: '', artist: '', genre: 'Pop', description: '', language: 'English', duration: '', releaseDate: '' })
    setFiles({ audio: null, cover: null })
    setPreview({ audio: null, cover: null })
  }

  const handleUploadSong = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return toast.error('Song title is required')
    if (!formData.artist.trim()) return toast.error('Artist name is required')
    if (!files.audio) return toast.error('Audio file is required')

    setUploading(true)
    const uploadData = new FormData()
    Object.entries(formData).forEach(([key, val]) => uploadData.append(key, val))
    uploadData.append('audio', files.audio)
    if (files.cover) uploadData.append('cover', files.cover)

    try {
      await api.post('/songs/upload', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Song added successfully!')
      setShowUploadForm(false)
      resetForm()
      fetchAdminStats()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add song')
    } finally {
      setUploading(false)
    }
  }

  const StatCard = ({ icon, title, value, color, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${color} rounded-xl p-6 border border-white/10 shadow-xl hover:scale-105 transition-all ${onClick ? 'cursor-pointer' : ''}`}
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="bg-gradient-to-r from-slate-900/80 via-slate-900/90 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-white text-3xl font-bold flex items-center gap-3">
              <span>👨‍💼</span> Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back, {user?.firstName}!</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/panel/admin/approval')} className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold rounded-lg">
              🎵 Song Approval {stats.pendingApprovals > 0 && `(${stats.pendingApprovals})`}
            </button>
            <button onClick={() => navigate('/panel/admin/artists')} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg">
              🎤 Artists
            </button>
            <button onClick={() => { logout(); navigate('/') }} className="px-5 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <StatCard icon="👥" title="Total Users" value={stats.totalUsers} color="from-blue-600/20 to-blue-900/20" />
              <StatCard icon="🎵" title="Total Songs" value={stats.totalSongs} color="from-green-600/20 to-green-900/20" />
              <StatCard icon="🎤" title="Total Artists" value={stats.totalArtists} color="from-purple-600/20 to-purple-900/20" onClick={() => navigate('/panel/admin/artists')} />
              <StatCard icon="⏳" title="Pending Approval" value={stats.pendingApprovals} color="from-yellow-600/20 to-orange-900/20" onClick={() => navigate('/panel/admin/approval')} />
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-2xl font-bold">⭐ Add New Song</h2>
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className={`px-6 py-2 rounded-lg font-bold ${showUploadForm ? 'bg-red-600' : 'bg-green-600'} text-white`}
                >
                  {showUploadForm ? '✕ Close' : '+ Add Song'}
                </button>
              </div>
              {showUploadForm && (
                <form onSubmit={handleUploadSong} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Song Title *" className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600" />
                    <input name="artist" value={formData.artist} onChange={handleInputChange} placeholder="Artist Name *" className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600" />
                    <select name="genre" value={formData.genre} onChange={handleInputChange} className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600">
                      {['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Electronic', 'Other'].map((g) => <option key={g}>{g}</option>)}
                    </select>
                    <input name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Duration (mm:ss)" className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600" />
                  </div>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" rows="2" className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="file" name="audio" accept=".mp3,.wav,.flac,.m4a" onChange={handleFileChange} className="text-slate-300" />
                    <input type="file" name="cover" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="text-slate-300" />
                  </div>
                  {preview.cover && <img src={preview.cover} alt="Cover" className="w-32 h-32 object-cover rounded-lg" />}
                  <button type="submit" disabled={uploading} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Add Song to Platform'}
                  </button>
                </form>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <button onClick={() => navigate('/panel/admin/approval')} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg">🎵 Review Pending Songs</button>
              <button onClick={() => navigate('/panel/admin/artists')} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg">🎤 Manage Artists</button>
              <button onClick={() => navigate('/panel/admin/approval')} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg">📋 Approval History</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-white text-lg font-bold mb-4">Recent Activity</h3>
                {stats.recentActivities?.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {stats.recentActivities.map((a, i) => (
                      <div key={i} className="text-slate-300 text-sm border-b border-slate-700/30 pb-2">
                        {a.type === 'song_upload' ? `🎵 ${a.title} — ${a.status}` : `👤 ${a.title} registered`}
                        <span className="text-slate-500 text-xs block">{new Date(a.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No recent activity.</p>
                )}
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-white text-lg font-bold mb-4">Moderation Focus</h3>
                {stats.pendingApprovals > 0 ? (
                  <>
                    <p className="text-slate-300 mb-4">
                      <span className="text-yellow-400 font-bold text-2xl">{stats.pendingApprovals}</span> songs waiting for review.
                    </p>
                    <button onClick={() => navigate('/panel/admin/approval')} className="w-full bg-yellow-600 text-white font-bold py-3 rounded-lg">
                      Start Reviewing →
                    </button>
                  </>
                ) : (
                  <p className="text-slate-300">✨ All songs are reviewed!</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
