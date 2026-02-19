'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface LoaderProps {
  isVisible: boolean
  onComplete?: () => void
  duration?: number
  message?: string
}

export default function Loader({
  isVisible,
  onComplete,
  duration = 2000,
  message = "Building trust, one home at a time"
}: LoaderProps) {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'loading' | 'exit'>('enter')
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Animation sequence
    const timer1 = setTimeout(() => {
      setAnimationPhase('loading')
    }, 300)

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, duration / 50)

    // Exit animation
    const timer2 = setTimeout(() => {
      setAnimationPhase('exit')
    }, duration - 500)

    // Complete
    const timer3 = setTimeout(() => {
      onComplete?.()
    }, duration)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearInterval(progressInterval)
    }
  }, [isVisible, duration, onComplete])

  if (!isVisible || !mounted) return null

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center
        bg-gradient-to-br from-gray-50 via-white to-teal-50
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-800
        transition-all duration-500 ease-out
        ${animationPhase === 'exit' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
      `}
      style={{
        background: `
          radial-gradient(circle at 30% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.05) 0%, transparent 50%),
          linear-gradient(135deg, #fafafa 0%, #ffffff 50%, #f0fdfa 100%)
        `
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-teal-200/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-blue-200/20 rounded-full blur-lg animate-float-fast"></div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center space-y-8">

        {/* Logo Container */}
        <div
          className={`
            relative transition-all duration-700 ease-out
            ${animationPhase === 'enter' ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
          `}
        >
          {/* Logo Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-emerald-400/20 to-blue-400/20 rounded-3xl blur-2xl scale-110 animate-pulse-slow"></div>

          {/* Logo Background */}
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 flex items-center justify-center overflow-hidden">
            {/* Logo Image */}
            <div className="relative w-16 h-16 lg:w-20 lg:h-20">
              <Image
                src="/logo.jpeg"
                alt="GharBazaar"
                fill
                className="object-contain rounded-xl"
                priority
              />
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
        </div>

        {/* Brand Name */}
        <div
          className={`
            text-center transition-all duration-700 delay-200 ease-out
            ${animationPhase === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
          `}
        >
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            GharBazaar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            India's Leading Property Platform
          </p>
        </div>

        {/* Loading Animation */}
        <div
          className={`
            relative transition-all duration-700 delay-400 ease-out
            ${animationPhase === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
          `}
        >
          {/* Circular Progress Ring */}
          <div className="relative w-20 h-20 lg:w-24 lg:h-24">
            {/* Background Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-300 ease-out drop-shadow-sm"
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Floating Dots Animation */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce-1"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce-2"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce-3"></div>
          </div>
        </div>

        {/* Loading Message */}
        <div
          className={`
            text-center transition-all duration-700 delay-600 ease-out
            ${animationPhase === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
          `}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light tracking-wide max-w-xs">
            {message}
          </p>
        </div>

        {/* Trust Indicators */}
        <div
          className={`
            flex items-center space-x-6 transition-all duration-700 delay-800 ease-out
            ${animationPhase === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
          `}
        >
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>Trusted</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span>Transparent</span>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes bounce-1 {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes bounce-2 {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes bounce-3 {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-1 {
          animation: bounce-1 1.4s ease-in-out infinite;
        }
        
        .animate-bounce-2 {
          animation: bounce-2 1.4s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        
        .animate-bounce-3 {
          animation: bounce-3 1.4s ease-in-out infinite;
          animation-delay: 0.4s;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-float-delayed,
          .animate-float-fast,
          .animate-shimmer,
          .animate-pulse-slow,
          .animate-bounce-1,
          .animate-bounce-2,
          .animate-bounce-3 {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}