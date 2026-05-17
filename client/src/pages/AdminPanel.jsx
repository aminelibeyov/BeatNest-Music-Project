import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user || user.role !== 'admin') {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-blue-600">0</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">Total Songs</h3>
            <p className="text-4xl font-bold text-green-600">0</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">Categories</h3>
            <p className="text-4xl font-bold text-purple-600">0</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">Active Users</h3>
            <p className="text-4xl font-bold text-orange-600">0</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Recent Users</h3>
            <p className="text-gray-600">No recent users</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Recent Songs</h3>
            <p className="text-gray-600">No recent songs</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
