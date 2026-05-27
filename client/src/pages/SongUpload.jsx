import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-toastify'

const SongUpload = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Pop',
    audioFile: null,
    coverImage: null,
    lyrics: ''
  })
  const [audioFileName, setAudioFileName] = useState('')
  const [coverImageFileName, setCoverImageFileName] = useState('')

  if (!user || user.role !== 'artist') {
    navigate('/dashboard')
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('audio/')) {
        setFormData(prev => ({
          ...prev,
          audioFile: file
        }))
        setAudioFileName(file.name)
      } else {
        toast.error('Please select an audio file (mp3, wav, etc.)')
      }
    }
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({
          ...prev,
          coverImage: file
        }))
        setCoverImageFileName(file.name)
      } else {
        toast.error('Please select an image file')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Please enter a song title')
      return
    }

    if (!formData.audioFile) {
      toast.error('Please upload an audio file')
      return
    }

    setLoading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('genre', formData.genre)
      uploadFormData.append('lyrics', formData.lyrics)
      uploadFormData.append('audioFile', formData.audioFile)
      if (formData.coverImage) {
        uploadFormData.append('coverImage', formData.coverImage)
      }

      const response = await api.post('/songs', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Song uploaded successfully! Awaiting admin approval... 🎵')
      navigate('/artist/songs')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload song'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const genres = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Electronic', 'Classical', 'Country', 'Latin', 'Other']

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black py-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white transition mb-6"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-white text-4xl font-bold mb-2">🎵 Upload New Song</h1>
          <p className="text-slate-400">Share your music with the BeatNest community</p>
        </div>

        {/* Upload Form */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Song Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter song title"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your song..."
                rows="3"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-none"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Audio File 🎵 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFileChange}
                  className="hidden"
                  id="audioFile"
                />
                <label
                  htmlFor="audioFile"
                  className="block w-full px-4 py-3 rounded-lg bg-slate-700/50 border-2 border-dashed border-slate-600 text-slate-300 hover:border-green-500 hover:bg-slate-700/70 transition cursor-pointer text-center"
                >
                  {audioFileName ? (
                    <div>
                      <p className="text-green-500 font-medium">✓ {audioFileName}</p>
                      <p className="text-xs text-slate-400">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg mb-1">📁 Click or drag audio file here</p>
                      <p className="text-xs text-slate-400">MP3, WAV, OGG, or other audio formats</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Cover Image 🖼️
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                  id="coverImage"
                />
                <label
                  htmlFor="coverImage"
                  className="block w-full px-4 py-3 rounded-lg bg-slate-700/50 border-2 border-dashed border-slate-600 text-slate-300 hover:border-blue-500 hover:bg-slate-700/70 transition cursor-pointer text-center"
                >
                  {coverImageFileName ? (
                    <div>
                      <p className="text-blue-500 font-medium">✓ {coverImageFileName}</p>
                      <p className="text-xs text-slate-400">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg mb-1">📁 Click or drag image here</p>
                      <p className="text-xs text-slate-400">PNG, JPG, or other image formats (optional)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Lyrics */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Lyrics
              </label>
              <textarea
                name="lyrics"
                value={formData.lyrics}
                onChange={handleChange}
                placeholder="Enter song lyrics..."
                rows="5"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-bold text-black transition ${
                  loading
                    ? 'bg-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 active:scale-95'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span> Uploading...
                  </span>
                ) : (
                  '🚀 Upload Song'
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center">
              Your song will be reviewed by our team and made public once approved.
            </p>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-blue-400 font-bold mb-3">💡 Tips for Success</h3>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>• Use a descriptive title that accurately represents your song</li>
            <li>• Add high-quality cover artwork (at least 300x300px)</li>
            <li>• Include complete lyrics if available</li>
            <li>• Choose the most appropriate genre for better discoverability</li>
            <li>• Ensure your audio file is in a supported format (MP3, WAV, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SongUpload
