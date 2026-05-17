import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-toastify'

const Wishlist = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist')
      setWishlist(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (songId) => {
    try {
      await api.delete(`/wishlist/${songId}`)
      toast.success('Removed from wishlist')
      fetchWishlist()
    } catch (error) {
      toast.error('Failed to remove song')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-white text-5xl font-bold mb-12">♥ Liked Songs</h1>

        {wishlist?.songs && wishlist.songs.length > 0 ? (
          <div className="space-y-4">
            {wishlist.songs.map((item) => (
              <div
                key={item.songId._id}
                className="bg-slate-800 hover:bg-slate-700 p-4 rounded-lg transition group flex items-center gap-4"
              >
                <img
                  src={item.songId.coverImage || 'https://via.placeholder.com/80'}
                  alt={item.songId.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/song/${item.songId._id}`)}>
                  <h3 className="text-white font-bold group-hover:text-green-500 transition">
                    {item.songId.title}
                  </h3>
                  <p className="text-slate-400">{item.songId.artist}</p>
                </div>
                <button
                  onClick={() => removeFromWishlist(item.songId._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-20">
            <p className="text-xl mb-4">No liked songs yet</p>
            <button
              onClick={() => navigate('/search')}
              className="px-6 py-2 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition"
            >
              Find Music
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
