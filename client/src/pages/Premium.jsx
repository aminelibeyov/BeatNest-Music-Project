import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-toastify'

const Premium = () => {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    try {
      const response = await api.get('/premium/status')
      setSubscription(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch subscription')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (plan) => {
    try {
      const response = await api.post('/premium/subscribe', {
        plan,
        paymentMethod: 'stripe'
      })
      toast.success('Premium subscription activated!')
      checkSubscription()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed')
    }
  }

  const handleCancel = async () => {
    try {
      await api.post('/premium/cancel')
      toast.success('Subscription cancelled')
      checkSubscription()
    } catch (error) {
      toast.error('Failed to cancel subscription')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-white text-5xl font-bold text-center mb-4">Go Premium</h1>
        <p className="text-center text-slate-400 text-xl mb-16">
          Unlock exclusive features and enjoy unlimited music
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-green-500 transition">
            <h2 className="text-white text-3xl font-bold mb-4">Premium</h2>
            <p className="text-slate-400 mb-6">Individual plan</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">$9.99</span>
              <span className="text-slate-400 ml-2">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                '✓ Offline downloads',
                '✓ No ads',
                '✓ High quality audio',
                '✓ Unlimited skips',
                '✓ All features'
              ].map((feature, i) => (
                <li key={i} className="text-slate-300">{feature}</li>
              ))}
            </ul>

            {subscription?.plan === 'premium' && subscription?.isActive ? (
              <button
                onClick={handleCancel}
                className="w-full py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition"
              >
                Cancel Subscription
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe('premium')}
                className="w-full py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition"
              >
                Subscribe Now
              </button>
            )}
          </div>

          {/* Family Plan */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-3xl font-bold">Family</h2>
              <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold">POPULAR</span>
            </div>
            <p className="text-slate-400 mb-6">For up to 6 family members</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">$14.99</span>
              <span className="text-slate-400 ml-2">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                '✓ Offline downloads',
                '✓ No ads',
                '✓ High quality audio',
                '✓ Unlimited skips',
                '✓ Up to 6 accounts',
                '✓ Family mix playlist'
              ].map((feature, i) => (
                <li key={i} className="text-slate-300">{feature}</li>
              ))}
            </ul>

            {subscription?.plan === 'premium_family' && subscription?.isActive ? (
              <button
                onClick={handleCancel}
                className="w-full py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition"
              >
                Cancel Subscription
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe('premium_family')}
                className="w-full py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition"
              >
                Subscribe Now
              </button>
            )}
          </div>
        </div>

        {subscription?.isActive && (
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <p className="text-white mb-2">Current Plan: <span className="font-bold text-green-500">{subscription.plan.toUpperCase()}</span></p>
            <p className="text-slate-400">Expires on: {new Date(subscription.endDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Premium
