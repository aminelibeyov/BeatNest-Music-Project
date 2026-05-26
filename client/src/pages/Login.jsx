import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/login', formData)
      login(response.data.data.user, response.data.data.token)
      toast.success('Login successful! Welcome back! 🎵')
      navigate('/dashboard')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold mb-2">🎵 BeatNest</h1>
          <p className="text-slate-400 text-sm">Your Ultimate Music Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-slate-700">
          <h2 className="text-white text-2xl font-bold mb-1 text-center">Welcome Back</h2>
          <p className="text-slate-400 text-center text-sm mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">📧</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700/50 border transition focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-green-500 focus:border-green-500'
                  } text-white placeholder-slate-400`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">✗ {errors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700/50 border transition focus:outline-none focus:ring-2 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-green-500 focus:border-green-500'
                  } text-white placeholder-slate-400`}
                />
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">✗ {errors.password}</p>}
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center text-slate-300 hover:text-white transition cursor-pointer">
                <input type="checkbox" className="mr-2 rounded" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-green-400 hover:text-green-300 transition">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-black transition mt-2 ${
                loading
                  ? 'bg-slate-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 active:scale-95'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span> Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-600"></div>
            <span className="px-3 text-slate-400 text-sm">OR</span>
            <div className="flex-1 border-t border-slate-600"></div>
          </div>

          {/* Social/Demo Login */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setFormData({ email: 'demo@beatnest.com', password: 'demo123456' })
              }}
              className="w-full py-2 px-4 rounded-lg bg-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-600/50 transition border border-slate-600"
            >
              👤 Demo Login
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 font-bold hover:text-green-300 transition">
              Register here
            </Link>
          </p>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-slate-500 text-xs">
          <p>🎵 Stream music, discover artists, connect with fans</p>
        </div>
      </div>
    </div>
  )
}

export default Login
