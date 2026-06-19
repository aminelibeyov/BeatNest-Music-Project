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
      initials: 'EM',
      image: 'https://www.rollingstone.com/wp-content/uploads/2004/11/GettyImages-85623204v2.jpg?w=1581&h=1054&crop=1',
      genre: 'Hip-Hop/Rap',
      famousSong: 'Lose Yourself',
      bio: 'One of the best-selling music artists of all time and the most successful rapper ever',
      achievement: 'Multiple Grammy Awards, Billboard #1 Artist',
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'The Weeknd',
      initials: 'TW',
      image: 'https://people.com/thmb/5Ineswb_0M73p3F41bGgEI5bWOE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(767x453:769x455)/Abel-Tesfaye-The-Weeknd-hurry-up-tomorrow-051425-tout-85e96d2443a94312beed6480f6d1fa20.jpg',
      genre: 'R&B/Synthwave',
      famousSong: 'Blinding Lights',
      bio: 'Canadian singer-songwriter known for his distinctive falsetto and dark production',
      achievement: 'Spotify\'s Most-Streamed Artist, Grammy Winner',
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Drake',
      initials: 'DR',
      image: 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/18357/production/_121995199_gettyimages-1172292629.jpg',
      genre: 'Hip-Hop/R&B',
      famousSong: 'One Dance',
      bio: 'Canadian rapper, singer, and songwriter with the most certified records in history',
      achievement: 'Billboard Artist of the Decade, Record-Breaking Streams',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Billie Eilish',
      initials: 'BE',
      image: 'https://static.wikia.nocookie.net/gracieabrams/images/3/39/Billie_Eilish.jpeg/revision/latest?cb=20250318232144',
      genre: 'Alternative/Pop',
      famousSong: 'Bad Guy',
      bio: 'Youngest artist to win Grammy Awards in the major categories at 18 years old',
      achievement: 'Multiple Grammy Awards, Global Phenomenon',
      color: 'from-green-500 to-emerald-600'
    }
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900/80 via-slate-950 to-black overflow-hidden">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="hero-title text-white text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Welcome to BeatNest
          </h1>
          <p className="hero-subtitle text-slate-400 text-xl mb-8">
            Your Ultimate Music Discovery & Streaming Platform
          </p>

          <div className="hero-cta flex gap-4 justify-center mb-20">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold rounded-full hover:from-green-400 hover:to-emerald-500 transition-all duration-300 text-lg shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 border-2 border-green-500 text-green-400 font-bold rounded-full hover:bg-green-500/10 hover:border-green-400 transition-all duration-300 text-lg backdrop-blur-sm"
            >
              Login
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="card bg-gradient-to-br from-blue-600/20 to-blue-900/20 p-8 rounded-lg backdrop-blur hover:from-blue-500/30 hover:to-blue-800/30 transition transform hover:scale-105">
              <div className="text-4xl mb-4 animate-bounce-smooth">🎵</div>
              <h3 className="text-white text-xl font-bold mb-2">Stream Music</h3>
              <p className="text-slate-400">Access millions of songs and playlists from artists worldwide</p>
            </div>
            <div className="card bg-gradient-to-br from-purple-600/20 to-purple-900/20 p-8 rounded-lg backdrop-blur hover:from-purple-500/30 hover:to-purple-800/30 transition transform hover:scale-105">
              <div className="text-4xl mb-4 animate-bounce-smooth" style={{ animationDelay: '0.2s' }}>🎤</div>
              <h3 className="text-white text-xl font-bold mb-2">Share Your Music</h3>
              <p className="text-slate-400">Upload and share your favorite creations with the community</p>
            </div>
            <div className="card bg-gradient-to-br from-pink-600/20 to-pink-900/20 p-8 rounded-lg backdrop-blur hover:from-pink-500/30 hover:to-pink-800/30 transition transform hover:scale-105">
              <div className="text-4xl mb-4 animate-bounce-smooth" style={{ animationDelay: '0.4s' }}>⭐</div>
              <h3 className="text-white text-xl font-bold mb-2">Discover Artists</h3>
              <p className="text-slate-400">Find new artists, genres, and musical experiences</p>
            </div>
          </div>
        </div>

        {/* About Music Section */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm py-20 border-y border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-white text-4xl font-bold mb-12 text-center animate-fade-in-down">🎼 About Music & BeatNest</h2>
            
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
            <h2 className="text-white text-4xl font-bold mb-12 text-center animate-fade-in-down">📚 A Brief History of Music</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 hover:from-slate-700/80 hover:to-slate-800/80 rounded-lg transition border border-slate-700/50 hover:border-green-500/50 transform hover:scale-105" style={{ animationDelay: '0s' }}>
                <h4 className="text-green-400 text-xl font-bold mb-3">Ancient Era (Before 500 AD)</h4>
                <p className="text-slate-300">
                  Music emerged as an essential part of religious ceremonies, entertainment, and communication. Ancient instruments like lyres, harps, and drums were used in Egypt, Greece, and Mesopotamia.
                </p>
              </div>

              <div className="card bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 hover:from-slate-700/80 hover:to-slate-800/80 rounded-lg transition border border-slate-700/50 hover:border-blue-500/50 transform hover:scale-105" style={{ animationDelay: '0.1s' }}>
                <h4 className="text-blue-400 text-xl font-bold mb-3">Medieval & Renaissance (500-1700)</h4>
                <p className="text-slate-300">
                  Classical music foundations were established. Composers like Bach and Mozart created symphonies and concertos. Musical notation systems were developed for better composition and documentation.
                </p>
              </div>

              <div className="card bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 hover:from-slate-700/80 hover:to-slate-800/80 rounded-lg transition border border-slate-700/50 hover:border-purple-500/50 transform hover:scale-105" style={{ animationDelay: '0.2s' }}>
                <h4 className="text-purple-400 text-xl font-bold mb-3">Modern Era (1800-1950)</h4>
                <p className="text-slate-300">
                  Birth of popular music and jazz. Recording technology emerged, allowing music to be preserved and distributed. Radio became the primary medium for music broadcasting globally.
                </p>
              </div>

              <div className="card bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 hover:from-slate-700/80 hover:to-slate-800/80 rounded-lg transition border border-slate-700/50 hover:border-pink-500/50 transform hover:scale-105" style={{ animationDelay: '0.3s' }}>
                <h4 className="text-pink-400 text-xl font-bold mb-3">Digital Age (1950-Present)</h4>
                <p className="text-slate-300">
                  Rock, hip-hop, electronic, and streaming music revolutionized the industry. Digital production tools enabled anyone to make music. Streaming platforms changed how we consume music forever.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Famous Artists Section */}
        <div className="bg-gradient-to-r from-purple-950/50 to-slate-950/50 py-20 border-y border-slate-700/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-white text-4xl font-bold mb-12 text-center animate-fade-in-down">🌟 Legendary Artists</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {famousArtists.map((artist, index) => (
                <div 
                  key={index} 
                  className="card group bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl overflow-hidden hover:from-slate-700/80 hover:to-slate-800/80 transition duration-300 border border-slate-700/50 hover:border-green-500/50 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Artist Avatar */}
                  <div className={`relative overflow-hidden h-48`}>
                    <img 
                      src={artist.image} 
                      alt={artist.name} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  </div>

                  {/* Artist Info */}
                  <div className="p-6">
                    <h3 className="text-white text-xl font-bold mb-1 group-hover:text-green-400 transition">
                      {artist.name}
                    </h3>
                    <p className="text-green-400 font-semibold text-sm mb-3">
                      {artist.genre}
                    </p>
                    
                    <p className="text-slate-300 text-xs mb-4 line-clamp-2">
                      {artist.bio}
                    </p>

                    {/* Famous Song */}
                    <div className="border-t border-slate-700/50 pt-3 mb-3">
                      <p className="text-slate-400 text-xs font-medium mb-1">💿 Top Hit</p>
                      <p className="text-white text-sm font-bold truncate">
                        "{artist.famousSong}"
                      </p>
                    </div>

                    {/* Achievement Badge */}
                    <div className="bg-slate-700/30 rounded-lg p-2 border border-slate-600/30">
                      <p className="text-yellow-400 text-xs font-semibold text-center">
                        ⭐ {artist.achievement}
                      </p>
                    </div>
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
