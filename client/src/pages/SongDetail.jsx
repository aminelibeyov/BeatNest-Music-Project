import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'

const SongDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: song, loading, error } = useFetch(`/songs/${id}`)

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          ← Back
        </button>

        {song && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {song.data.coverImage && (
                  <img
                    src={song.data.coverImage}
                    alt={song.data.title}
                    className="w-full rounded-lg"
                  />
                )}
              </div>

              <div>
                <h1 className="text-4xl font-bold mb-4">{song.data.title}</h1>
                <p className="text-xl text-gray-600 mb-4">Artist: {song.data.artist}</p>
                <p className="text-lg text-gray-600 mb-2">Genre: {song.data.genre}</p>
                <p className="text-lg text-gray-600 mb-2">Duration: {song.data.duration}s</p>
                <p className="text-lg text-gray-600 mb-6">Plays: {song.data.plays}</p>

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Description</h3>
                  <p className="text-gray-600">{song.data.description}</p>
                </div>

                <div className="flex gap-4">
                  <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Play
                  </button>
                  <button className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Like
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SongDetail
