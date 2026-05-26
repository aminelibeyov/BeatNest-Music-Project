import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const getPasswordStrength = (pwd) => {
    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 8) strength++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
    if (/\d/.test(pwd)) strength++
    if (/[^a-zA-Z\d]/.test(pwd)) strength++
    return strength
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value))
    }

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
      await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role
      })

      toast.success('Registration successful! Please check your email to verify your account. 📧')
      navigate('/login')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const passwordStrengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const passwordStrengthColors = ['bg-red-600', 'bg-orange-600', 'bg-yellow-600', 'bg-blue-600', 'bg-green-600']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold mb-2">🎵 BeatNest</h1>
          <p className="text-slate-400 text-sm">Your Ultimate Music Platform</p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-slate-700">
          <h2 className="text-white text-2xl font-bold mb-1 text-center">Join BeatNest</h2>
          <p className="text-slate-400 text-center text-sm mb-8">Create your account to start streaming music</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={`w-full px-4 py-2 rounded-lg bg-slate-700/50 border transition focus:outline-none focus:ring-2 ${
                    errors.firstName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-green-500 focus:border-green-500'
                  } text-white placeholder-slate-400 text-sm`}
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">✗ {errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`w-full px-4 py-2 rounded-lg bg-slate-700/50 border transition focus:outline-none focus:ring-2 ${
                    errors.lastName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-green-500 focus:border-green-500'
                  } text-white placeholder-slate-400 text-sm`}
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">✗ {errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">📧</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700/50 border transition focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-green-500 focus:border-green-500'
                  } text-white placeholder-slate-400 text-sm`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">✗ {errors.email}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 rounded-lg bg-slate-700/30 border border-slate-600 cursor-pointer hover:bg-slate-700/50 transition">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-white text-sm">👤 Listener</span>
                </label>
                <label className="flex items-center p-3 rounded-lg bg-slate-700/30 border border-slate-600 cursor-pointer hover:bg-slate-700/50 transition">
                  <input
                    type="radio"
                    name="role"
                    value="artist"
                    checked={formData.role === 'artist'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-white text-sm">🎤 Artist</span>
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700/50 border transition focus:outline-none focus:ring-2 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-green-500 focus:border-green-500'
                  } text-white placeholder-slate-400 text-sm`}
                />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition ${
                          i < passwordStrength ? passwordStrengthColors[passwordStrength - 1] : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    Strength: <span className="text-slate-300 font-medium">{passwordStrengthLabels[Math.min(passwordStrength, 4)]}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1">✗ {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">🔐</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700/50 border transition focus:outline-none focus:ring-2 ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-green-500 focus:border-green-500'
                  } text-white placeholder-slate-400 text-sm`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">✗ {errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-black transition mt-6 ${
                loading
                  ? 'bg-slate-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 active:scale-95'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span> Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-600"></div>
            <span className="px-3 text-slate-400 text-sm">ALREADY MEMBER?</span>
            <div className="flex-1 border-t border-slate-600"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-slate-400 text-sm">
            <Link to="/login" className="text-green-400 font-bold hover:text-green-300 transition">
              Sign in to your account
            </Link>
          </p>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-slate-500 text-xs">
          <p>🎵 Stream millions of songs • Support your favorite artists • Join our community</p>
        </div>
      </div>
    </div>
  )
}

export default Register
