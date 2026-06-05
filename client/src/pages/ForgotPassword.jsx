import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email input, 2: reset code, 3: new password
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSendResetLink = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/forgot-password', { email })
      
      if (response.data.success) {
        setEmailSent(true)
        setStep(2)
        toast.success('✓ Reset link sent to your email! Check your inbox.')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send reset link'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!resetCode.trim()) {
      toast.error('Please enter the reset code from your email')
      return
    }

    if (!newPassword.trim()) {
      toast.error('Please enter a new password')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await api.post(`/auth/reset-password/${resetCode}`, {
        email,
        password: newPassword,
        confirmPassword
      })

      if (response.data.success) {
        toast.success('✓ Password reset successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to reset password'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep(1)
    setResetCode('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold mb-2">🎵 BeatNest</h1>
          <p className="text-slate-400 text-sm">Password Recovery</p>
        </div>

        {/* Reset Card */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-slate-700">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              <h2 className="text-white text-2xl font-bold mb-1 text-center">Forgot Your Password?</h2>
              <p className="text-slate-400 text-center text-sm mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSendResetLink} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600 placeholder-slate-500"
                  />
                  <p className="text-slate-500 text-xs mt-2">
                    We'll send a password reset link to this email address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>✓</span> Send Reset Link
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800 text-slate-400">or</span>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="block w-full py-3 text-center text-slate-300 hover:text-white transition font-medium"
                >
                  Back to Login
                </Link>
              </form>
            </>
          )}

          {/* Step 2: Reset Code Input */}
          {step === 2 && (
            <>
              <h2 className="text-white text-2xl font-bold mb-1 text-center">Check Your Email</h2>
              <p className="text-slate-400 text-center text-sm mb-8">
                We've sent a password reset link to <span className="text-green-400 font-bold">{email}</span>
              </p>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Reset Code / Token
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Paste the reset code from the email"
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600 placeholder-slate-500 font-mono text-sm"
                  />
                  <p className="text-slate-500 text-xs mt-2">
                    Check your email for the reset code or click the reset link.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs mt-2">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-3 text-slate-400 hover:text-slate-300"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <span>✓</span> Reset Password
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="w-full py-3 text-center text-slate-300 hover:text-white transition font-medium border border-slate-600 rounded-lg hover:border-slate-500"
                >
                  ← Back to Email
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-slate-400 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-bold transition">
              Sign In
            </Link>
          </p>
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-bold transition">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
          <p className="text-blue-300 text-xs leading-relaxed">
            <span className="font-bold">💡 Tip:</span> Check your spam folder if you don't see the reset email. The link expires in 1 hour.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
