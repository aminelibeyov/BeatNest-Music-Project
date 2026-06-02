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
    pendingApprovals: 0
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
  const [files, setFiles] = useState({
    audio: null,
    cover: null
  })
  const [preview, setPreview] = useState({
    audio: null,
    cover: null
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data.data || stats)
    } catch (error) {
      console.log('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target
    if (fileList && fileList[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: fileList[0]
      }))

      // Create preview
      if (name === 'cover') {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(prev => ({
            ...prev,
            cover: reader.result
          }))
        }
        reader.readAsDataURL(fileList[0])
      } else if (name === 'audio') {
        setPreview(prev => ({
          ...prev,
          audio: fileList[0].name
        }))
      }
    }
  }

  const handleUploadSong = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Song title is required')
      return
    }
    if (!formData.artist.trim()) {
      toast.error('Artist name is required')
      return
    }
    if (!files.audio) {
      toast.error('Audio file is required')
      return
    }

    setUploading(true)
    const uploadData = new FormData()
    uploadData.append('title', formData.title)
    uploadData.append('artist', formData.artist)
    uploadData.append('genre', formData.genre)
    uploadData.append('description', formData.description)
    uploadData.append('language', formData.language)
    uploadData.append('duration', formData.duration)
    uploadData.append('releaseDate', formData.releaseDate)
    uploadData.append('audio', files.audio)
    if (files.cover) {
      uploadData.append('cover', files.cover)
    }

    try {
      await api.post('/songs/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('✓ Song added successfully!')
      setShowUploadForm(false)
      resetForm()
      fetchAdminStats()
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add song'
      toast.error(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      genre: 'Pop',
      description: '',
      language: 'English',
      duration: '',
      releaseDate: ''
    })
    setFiles({
      audio: null,
      cover: null
    })
    setPreview({
      audio: null,
      cover: null
    })
  }

  const StatCard = ({ icon, title, value, color, delay }) => (
    <div 
      className={`bg-gradient-to-br ${color} rounded-xl p-8 backdrop-blur border border-white/10 shadow-xl transform hover:scale-105 transition-all duration-300`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-300 text-sm font-medium mb-2">{title}</p>
          <p className="text-white text-5xl font-bold">{value}</p>
        </div>
        <div className="text-6xl opacity-20">{icon}</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900/80 via-slate-900/90 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-white text-3xl font-bold flex items-center gap-3">
              <span className="text-3xl">👨‍💼</span> Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back, {user?.firstName}!</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin/approval')}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-orange-500/50 transform hover:scale-105"
            >
              🎵 Song Approval
            </button>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard 
                icon="👥" 
                title="Total Users" 
                value={stats.totalUsers} 
                color="from-blue-600/20 to-blue-900/20"
                delay="0s"
              />
              <StatCard 
                icon="🎵" 
                title="Total Songs" 
                value={stats.totalSongs} 
                color="from-green-600/20 to-green-900/20"
                delay="0.1s"
              />
              <StatCard 
                icon="🎤" 
                title="Total Artists" 
                value={stats.totalArtists} 
                color="from-purple-600/20 to-purple-900/20"
                delay="0.2s"
              />
              <StatCard 
                icon="⏳" 
                title="Pending Approval" 
                value={stats.pendingApprovals} 
                color="from-yellow-600/20 to-orange-900/20"
                delay="0.3s"
              />
            </div>

            {/* Upload Song Section */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-slate-700/50 backdrop-blur-sm mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                  <span>⭐</span> Add New Song to Platform
                </h2>
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
                    showUploadForm
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                  }`}
                >
                  {showUploadForm ? '✕ Close' : '+ Add Song'}
                </button>
              </div>

              {showUploadForm ? (
                <form onSubmit={handleUploadSong} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div>
                      <label className="block text-slate-300 text-sm font-bold mb-2">
                        Song Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter song title"
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-bold mb-2">
                        Artist Name *
                      </label>
                      <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleInputChange}
                        placeholder="Enter artist name"
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-bold mb-2">
                        Genre
                      </label>
                      <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600/50"
                      >
                        <option>Pop</option>
                        <option>Rock</option>
                        <option>Hip-Hop</option>
                        <option>R&B</option>
                        <option>Jazz</option>
                        <option>Classical</option>
                        <option>Electronic</option>
                        <option>Country</option>
                        <option>Latin</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-bold mb-2">
                        Language
                      </label>
                      <input
                        type="text"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        placeholder="e.g., English, Spanish"
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-bold mb-2">
                        Duration (mm:ss)
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 3:45"
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-bold mb-2">
                        Release Date
                      </label>
                      <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600/50"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-slate-300 text-sm font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter song description or lyrics preview"
                      rows="3"
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600/50"
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Audio Upload */}
                    <div>
                      <label className="block text-slate-300 text-sm font-bold mb-2">
                        Audio File (.mp3, .wav) *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="audio"
                          accept=".mp3,.wav,.flac,.m4a"
                          onChange={handleFileChange}
                          className="hidden"
                          id="audio-input"
                        />
                        <label
                          htmlFor="audio-input"
                          className="block w-full px-4 py-3 bg-slate-700 text-slate-300 rounded-lg border-2 border-dashed border-slate-600 cursor-pointer hover:border-green-500 hover:text-green-400 transition text-center font-medium"
                        >
                          {files.audio ? (
                            <div>
                              <p className="text-green-400">✓ {files.audio.name}</p>
                              <p className="text-xs text-slate-400">Click to change</p>
                            </div>
                          ) : (
                            <div>
                              <p>🎵 Choose Audio File</p>
                              <p className="text-xs text-slate-400">MP3, WAV, FLAC supported</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Cover Upload */}
                    <div>
                      <label className="block text-slate-300 text-sm font-bold mb-2">
                        Cover Image (.jpg, .png)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="cover"
                          accept=".jpg,.jpeg,.png,.gif"
                          onChange={handleFileChange}
                          className="hidden"
                          id="cover-input"
                        />
                        <label
                          htmlFor="cover-input"
                          className="block w-full px-4 py-3 bg-slate-700 text-slate-300 rounded-lg border-2 border-dashed border-slate-600 cursor-pointer hover:border-green-500 hover:text-green-400 transition text-center font-medium"
                        >
                          {preview.cover ? (
                            <div>
                              <p className="text-green-400">✓ Image selected</p>
                              <p className="text-xs text-slate-400">Click to change</p>
                            </div>
                          ) : (
                            <div>
                              <p>🖼️ Choose Cover Image</p>
                              <p className="text-xs text-slate-400">JPG, PNG supported</p>
                            </div>
                          )}
                        </label>
                      </div>

                      {/* Cover Preview */}
                      {preview.cover && (
                        <div className="mt-3">
                          <img
                            src={preview.cover}
                            alt="Cover preview"
                            className="w-full h-40 object-cover rounded-lg border border-slate-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <span>✓</span> Add Song to Platform
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadForm(false)
                        resetForm()
                      }}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-lg mb-4">
                    Click the "Add Song" button to upload a new song to the platform
                  </p>
                  <div className="flex justify-center gap-8 text-4xl opacity-30">
                    <span>🎵</span>
                    <span>🎧</span>
                    <span>🎤</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-slate-700/50 backdrop-blur-sm mb-12">
              <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <span>⚡</span> Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/admin/approval')}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50"
                >
                  🎵 Review Pending Songs
                </button>
                <button
                  onClick={() => navigate('/search')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                >
                  🔍 Browse All Songs
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
                >
                  📊 View Statistics
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <span>📋</span> Admin Features
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Upload songs directly to platform
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Review and approve user uploads
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Manage user accounts and roles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Monitor platform statistics
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🎯</span> Current Focus
                </h3>
                {stats.pendingApprovals > 0 ? (
                  <div>
                    <p className="text-slate-300 mb-4">
                      You have <span className="text-yellow-400 font-bold">{stats.pendingApprovals}</span> songs waiting for approval.
                    </p>
                    <button
                      onClick={() => navigate('/admin/approval')}
                      className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      Review Now →
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-300 text-lg">
                    ✨ All songs are approved! Everything is up to date.
                  </p>
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
