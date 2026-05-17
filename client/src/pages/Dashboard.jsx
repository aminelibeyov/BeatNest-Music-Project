import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">BeatNest</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-4">Welcome, {user.firstName}!</h2>
          <p className="text-gray-600 mb-6">Email: {user.email}</p>
          <p className="text-gray-600 mb-6">Role: {user.role}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">My Profile</h3>
              <p className="text-gray-600">View and edit your profile information</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">My Songs</h3>
              <p className="text-gray-600">Manage your uploaded songs</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Favorites</h3>
              <p className="text-gray-600">View your favorite songs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
