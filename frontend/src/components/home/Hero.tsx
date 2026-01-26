'use client'

import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              Find Your Perfect Home.<br />
              <span className="text-accent-300">Sell Faster.</span><br />
              <span className="text-primary-200">Buy Smarter.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              GharBazaar is India's premium local real-estate marketplace where you can discover verified properties, connect with genuine buyers, and list your home for just ₹1000 — with full transparency, trust, and security.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
              <Link href="/listings" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 text-center whitespace-nowrap">
                Browse Properties
              </Link>
              <Link href="/pricing" className="btn-ghost bg-white/10 hover:bg-white/20 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-center whitespace-nowrap">
                View Pricing
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-base">✓</span>
                </div>
                <span className="text-primary-100 text-sm sm:text-base">Verified Sellers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-base">₹</span>
                </div>
                <span className="text-primary-100 text-sm sm:text-base">₹1000 Only</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-base">🔒</span>
                </div>
                <span className="text-primary-100 text-sm sm:text-base">Secure Platform</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative mt-8 lg:mt-0 order-first lg:order-last">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-md lg:max-w-none">
              {/* Using external image URL - Replace with your own image */}
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Real estate agent holding house keys"
                className="w-full h-auto object-cover aspect-[4/3] sm:aspect-[3/2]"
              />
            </div>
            {/* Floating Glass Card */}
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl text-gray-900 dark:text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 dark:border-gray-700/50 max-w-[200px] sm:max-w-xs">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg sm:text-2xl">🏠</span>
                </div>
                <div>
                  <p className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">1000+</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Properties Listed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
