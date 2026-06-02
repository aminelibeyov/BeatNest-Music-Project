import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const PageLoader = () => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [location])

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black z-50 flex items-center justify-center pointer-events-none animate-fade-in">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 animate-pulse"></div>
          </div>

          {/* Loader Content */}
          <div className="relative z-10 text-center">
            {/* Animated Logo */}
            <div className="mb-8">
              <div className="text-6xl font-bold mb-2 animate-bounce-smooth">
                🎵
              </div>
            </div>

            {/* Animated Text */}
            <h2 className="text-white text-2xl font-bold mb-2 animate-fade-in-down">
              Loading
            </h2>

            {/* Animated Dots */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>

            {/* Circular Progress */}
            <div className="relative w-20 h-20 mx-auto mb-8">
              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.2)"
                  strokeWidth="3"
                />
                {/* Animated progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                  className="animate-spin"
                  style={{
                    animation: 'spin 2s linear infinite'
                  }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-green-400">...</span>
              </div>
            </div>

            {/* Loading Bar */}
            <div className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                style={{
                  animation: 'slideRight 0.6s ease-in-out forwards'
                }}
              ></div>
            </div>

            {/* Subtitle */}
            <p className="text-slate-400 text-xs mt-6 font-medium">Getting things ready...</p>
          </div>

          <style>{`
            @keyframes slideRight {
              from {
                width: 0;
              }
              to {
                width: 100%;
              }
            }

            @keyframes spin {
              from {
                transform: rotate(0deg);
                stroke-dashoffset: 283;
              }
              to {
                transform: rotate(360deg);
                stroke-dashoffset: -283;
              }
            }
          `}</style>
        </div>
      )}
    </>
  )
}

export default PageLoader
