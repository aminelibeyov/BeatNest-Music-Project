import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-20 text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to BeatNest</h1>
        <p className="text-xl mb-8">Your Music Hub - Stream, Share, and Enjoy Amazing Music</p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded hover:bg-gray-100 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white bg-opacity-20 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Stream</h3>
            <p>Access millions of songs and playlists</p>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Share</h3>
            <p>Share your music with the world</p>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Discover</h3>
            <p>Find new artists and genres</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
