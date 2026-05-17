import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-toastify'

const Library = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    isPublic: false
  })

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const response = await api.get('/playlists')
      setPlaylists(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch playlists')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/playlists', newPlaylist)
      toast.success('Playlist created!')
      setNewPlaylist({ name: '', description: '', isPublic: false })
      setShowCreateForm(false)
      fetchPlaylists()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create playlist')
    }
  }

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Delete this playlist?')) return
    try {
      await api.delete(`/playlists/${playlistId}`)
      toast.success('Playlist deleted')
      fetchPlaylists()
    } catch (error) {
      toast.error('Failed to delete playlist')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-white text-5xl font-bold">Your Library</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition"
          >
            + New Playlist
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreatePlaylist} className="bg-slate-800 p-6 rounded-lg mb-12">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Playlist name..."
                value={newPlaylist.name}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                placeholder="Description (optional)..."
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              />
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={newPlaylist.isPublic}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, isPublic: e.target.checked })}
                  className="w-4 h-4"
                />
                Make public
              </label>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 bg-slate-600 text-white font-bold rounded hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => navigate(`/playlist/${playlist._id}`)}
                className="bg-slate-800 hover:bg-slate-700 p-6 rounded-lg cursor-pointer transition group"
              >
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 h-32 rounded mb-4 flex items-center justify-center">
                  <span className="text-4xl">🎵</span>
                </div>
                <h3 className="text-white font-bold text-lg group-hover:text-green-500 transition">{playlist.name}</h3>
                <p className="text-slate-400 text-sm">{playlist.songs.length} songs</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeletePlaylist(playlist._id)
                  }}
                  className="mt-4 px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-20">
            <p className="text-xl mb-4">No playlists yet</p>
            <p>Create your first playlist to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Library
