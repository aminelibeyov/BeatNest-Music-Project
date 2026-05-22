import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-toastify'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTrendingSongs()
    }
  }, [user])

  const fetchTrendingSongs = async () => {
    try {
      const response = await api.get('/songs', {
        params: {
          limit: 12,
          sort: '-plays'
        }
      })
      setSongs(response.data.data.songs || [])
    } catch (error) {
      console.log('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const famousArtists = [
    {
      name: 'Eminem',
      image: '🎤',
      genre: 'Hip-Hop/Rap',
      famousSong: 'Lose Yourself',
      bio: 'One of the best-selling music artists of all time and the most successful rapper ever',
      achievement: 'Multiple Grammy Awards, Billboard #1 Artist'
    },
    {
      name: 'The Weeknd',
      image: '🌙',
      genre: 'R&B/Synthwave',
      famousSong: 'Blinding Lights',
      bio: 'Canadian singer-songwriter known for his distinctive falsetto and dark production',
      achievement: 'Spotify\'s Most-Streamed Artist, Grammy Winner'
    },
    {
      name: 'Drake',
      image: '🏆',
      genre: 'Hip-Hop/R&B',
      famousSong: 'One Dance',
      bio: 'Canadian rapper, singer, and songwriter with the most certified records in history',
      achievement: 'Billboard Artist of the Decade, Record-Breaking Streams'
    },
    {
      name: 'Billie Eilish',
      image: '👁️',
      genre: 'Alternative/Pop',
      famousSong: 'Bad Guy',
      bio: 'Youngest artist to win Grammy Awards in the major categories at 18 years old',
      achievement: 'Multiple Grammy Awards, Global Phenomenon'
    }
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-white text-6xl font-bold mb-4">Welcome to BeatNest</h1>
          <p className="text-slate-400 text-xl mb-8">Your Ultimate Music Discovery & Streaming Platform</p>

          <div className="flex gap-4 justify-center mb-20">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition text-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 border-2 border-green-500 text-green-500 font-bold rounded-full hover:bg-green-500 hover:text-black transition text-lg"
            >
              Login
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-slate-800/50 p-8 rounded-lg backdrop-blur hover:bg-slate-700/50 transition">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-white text-xl font-bold mb-2">Stream Music</h3>
              <p className="text-slate-400">Access millions of songs and playlists from artists worldwide</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-lg backdrop-blur hover:bg-slate-700/50 transition">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-white text-xl font-bold mb-2">Share Your Music</h3>
              <p className="text-slate-400">Upload and share your favorite creations with the community</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-lg backdrop-blur hover:bg-slate-700/50 transition">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-white text-xl font-bold mb-2">Discover Artists</h3>
              <p className="text-slate-400">Find new artists, genres, and musical experiences</p>
            </div>
          </div>
        </div>

        {/* About Music Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-white text-4xl font-bold mb-12 text-center">🎼 About Music & BeatNest</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-green-500 text-2xl font-bold mb-4">What is Music?</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Music is the universal language of humanity. It's an art form that combines sounds and silences in time to produce form and structure. From ancient civilizations to modern times, music has been an integral part of human culture, expression, and emotion.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Music has the power to inspire, heal, energize, and connect people across boundaries of language, culture, and geography. Whether it's classical symphonies, contemporary pop, hip-hop beats, or experimental sounds, every genre tells a unique story.
                </p>
              </div>

              <div>
                <h3 className="text-green-500 text-2xl font-bold mb-4">Why BeatNest?</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  BeatNest is a modern music platform designed for music lovers and artists alike. We provide a space where you can discover emerging talents, stream millions of songs, and share your own musical creations with the world.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Our mission is to democratize music by connecting artists directly with listeners, supporting both established and upcoming musicians, and creating a community where music thrives. Join us in celebrating the power of music.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Music History Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-white text-4xl font-bold mb-12 text-center">📚 A Brief History of Music</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition">
                <h4 className="text-green-500 text-xl font-bold mb-3">Ancient Era (Before 500 AD)</h4>
                <p className="text-slate-300">
                  Music emerged as an essential part of religious ceremonies, entertainment, and communication. Ancient instruments like lyres, harps, and drums were used in Egypt, Greece, and Mesopotamia.
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition">
                <h4 className="text-green-500 text-xl font-bold mb-3">Medieval & Renaissance (500-1700)</h4>
                <p className="text-slate-300">
                  Classical music foundations were established. Composers like Bach and Mozart created symphonies and concertos. Musical notation systems were developed for better composition and documentation.
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition">
                <h4 className="text-green-500 text-xl font-bold mb-3">Modern Era (1800-1950)</h4>
                <p className="text-slate-300">
                  Birth of popular music and jazz. Recording technology emerged, allowing music to be preserved and distributed. Radio became the primary medium for music broadcasting globally.
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition">
                <h4 className="text-green-500 text-xl font-bold mb-3">Digital Age (1950-Present)</h4>
                <p className="text-slate-300">
                  Rock, hip-hop, electronic, and streaming music revolutionized the industry. Digital production tools enabled anyone to make music. Streaming platforms changed how we consume music forever.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Famous Artists Section */}
        <div className="bg-gradient-to-r from-purple-900 to-slate-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-white text-4xl font-bold mb-12 text-center">🌟 Legendary Artists</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {famousArtists.map((artist, index) => (
                <div key={index} className="bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition">
                  <div className="bg-gradient-to-br from-green-500 to-purple-600 p-12 flex items-center justify-center text-6xl">
                    {artist.image}
                  </div>
                  <div className="p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">{artist.name}</h3>
                    <p className="text-green-400 font-semibold mb-2">{artist.genre}</p>
                    <p className="text-slate-300 text-sm mb-4">{artist.bio}</p>
                    <div className="border-t border-slate-700 pt-4 mb-4">
                      <p className="text-slate-400 text-sm mb-2"><strong>Famous Song:</strong></p>
                      <p className="text-white font-bold">"{artist.famousSong}"</p>
                    </div>
                    <p className="text-yellow-400 text-xs font-semibold">✓ {artist.achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-b from-slate-900 to-black py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-white text-3xl font-bold mb-6">Ready to Explore Your Next Favorite Song?</h2>
            <p className="text-slate-400 text-lg mb-8">Join thousands of music lovers discovering new sounds every day on BeatNest</p>
            <button
              onClick={() => navigate('/register')}
              className="px-12 py-4 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition text-lg"
            >
              Start Your Music Journey Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-white text-5xl font-bold mb-2">Welcome back, {user.firstName}! 👋</h1>
          <p className="text-slate-400">Discover what's trending</p>
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div
            onClick={() => navigate('/search')}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 cursor-pointer hover:from-blue-500 hover:to-blue-700 transition h-48 flex flex-col justify-end"
          >
            <h2 className="text-white text-3xl font-bold">🔍 Search Music</h2>
            <p className="text-blue-100 mt-2">Find your favorite songs</p>
          </div>

          <div
            onClick={() => navigate('/premium')}
            className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-8 cursor-pointer hover:from-purple-500 hover:to-purple-700 transition h-48 flex flex-col justify-end"
          >
            <h2 className="text-white text-3xl font-bold">⭐ Go Premium</h2>
            <p className="text-purple-100 mt-2">Unlock exclusive features</p>
          </div>
        </div>

        {/* Trending Songs */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
          </div>
        ) : songs.length > 0 ? (
          <div>
            <h2 className="text-white text-3xl font-bold mb-8">🔥 Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {songs.map((song) => (
                <div
                  key={song._id}
                  onClick={() => navigate(`/song/${song._id}`)}
                  className="bg-slate-800 hover:bg-slate-700 rounded-lg overflow-hidden cursor-pointer transition group"
                >
                  <div className="relative overflow-hidden h-48 bg-gradient-to-br from-slate-700 to-slate-900">
                    {song.coverImage ? (
                      <img
                        src={song.coverImage}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold truncate group-hover:text-green-500 transition">
                      {song.title}
                    </h3>
                    <p className="text-slate-400 text-sm truncate">{song.artist}</p>
                    <p className="text-slate-500 text-xs mt-2">🎧 {song.plays} plays</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-20">
            <p className="text-xl">No songs available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
