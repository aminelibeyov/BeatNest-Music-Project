import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'

const Search = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    genre: '',
    artist: ''
  })

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await api.get('/songs', {
        params: {
          search: searchQuery,
          genre: filters.genre || undefined,
          limit: 50
        }
      })

      setResults(response.data.data.songs || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-white text-4xl font-bold mb-6">Search Music</h1>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search songs, artists, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition"
              >
                Search
              </button>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Filter by genre..."
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                className="flex-1 px-4 py-2 bg-slate-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-bold mb-6">
              Found {results.length} results
            </h2>
            {results.map((song) => (
              <div
                key={song._id}
                onClick={() => navigate(`/song/${song._id}`)}
                className="bg-slate-800 hover:bg-slate-700 p-4 rounded-lg cursor-pointer transition group flex items-center gap-4"
              >
                <img
                  src={song.coverImage || 'https://via.placeholder.com/80'}
                  alt={song.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-white font-bold group-hover:text-green-500 transition">
                    {song.title}
                  </h3>
                  <p className="text-slate-400">{song.artist}</p>
                  <p className="text-slate-500 text-sm">{song.genre}</p>
                </div>
                <span className="text-slate-400">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        ) : searchQuery && (
          <div className="text-center text-slate-400 py-20">
            <p className="text-xl">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
