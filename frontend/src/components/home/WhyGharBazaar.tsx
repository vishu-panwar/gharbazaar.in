'use client'

import { Shield, Zap, TrendingUp, Lock, MessageCircle, Map, FileCheck, CheckCircle, Star, Award } from 'lucide-react'

export function WhyGharBazaar() {
  const features = [
    {
      icon: Shield,
      emoji: '🔰',
      title: 'Verified Local Listings',
      description: 'Browse 100% user-verified properties — plots, homes, commercial spaces, agricultural land.',
      details: 'Every property is manually verified by our team. We check documents, seller identity, and ensure all information is accurate before listing goes live.',
      color: 'from-green-500 to-emerald-600',
      stats: '100% Verified',
    },
    {
      icon: Zap,
      emoji: '⚡',
      title: 'One-Time ₹1000 Listing Fee',
      description: 'No hidden charges. No brokerage. List once, stay live forever.',
      details: 'Pay just ₹1000 once and your property stays listed until sold. No monthly fees, no commission, no surprises. Complete transparency.',
      color: 'from-amber-500 to-orange-600',
      stats: 'Zero Brokerage',
    },
    {
      icon: TrendingUp,
      emoji: '⭐',
      title: 'Buyer Bidding System',
      description: 'Buyers can make offers directly, increasing your chances of selling faster.',
      details: 'Receive multiple offers from interested buyers. Compare bids, negotiate directly, and close deals faster with our transparent bidding system.',
      color: 'from-blue-500 to-indigo-600',
      stats: '3x Faster Sales',
    },
    {
      icon: Lock,
      emoji: '🔐',
      title: 'Secure Google Login + Phone OTP',
      description: 'No fake accounts. Only verified users.',
      details: 'Every user is verified through Google OAuth or phone OTP. We ensure a safe, trusted community with zero tolerance for fake accounts.',
      color: 'from-purple-500 to-violet-600',
      stats: '100% Secure',
    },
    {
      icon: MessageCircle,
      emoji: '💬',
      title: 'Real-Time Chat',
      description: 'Message buyers/sellers instantly with Socket.IO real-time chat.',
      details: 'Connect instantly with potential buyers or sellers. Real-time messaging, typing indicators, and instant notifications keep you always connected.',
      color: 'from-pink-500 to-rose-600',
      stats: 'Instant Connect',
    },
    {
      icon: Map,
      emoji: '🗺️',
      title: 'Smart Map Search',
      description: 'Find properties by area, landmark, metro station, or distance.',
      details: 'Advanced location-based search with interactive maps. Filter by distance, nearby landmarks, metro stations, schools, and more.',
      color: 'from-cyan-500 to-blue-600',
      stats: 'Smart Search',
    },
    {
      icon: FileCheck,
      emoji: '🛡️',
      title: 'Future RERA Integration',
      description: 'Legal transparency and safe transactions coming soon.',
      details: 'We\'re working on RERA integration for complete legal compliance. Soon you\'ll have access to verified legal documents and secure transactions.',
      color: 'from-teal-500 to-green-600',
      stats: 'Coming Soon',
    },
  ]

  const trustBadges = [
    { icon: CheckCircle, text: '1000+ Properties', color: 'text-green-600' },
    { icon: Star, text: '500+ Happy Sellers', color: 'text-amber-600' },
    { icon: Award, text: 'Trusted Platform', color: 'text-blue-600' },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full text-sm font-bold mb-6 shadow-lg">
            <Star size={16} className="animate-pulse" />
            <span>WHY CHOOSE US</span>
          </div>
          
          <h2 className="font-heading font-bold text-5xl md:text-6xl mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Why GharBazaar?
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            India's most trusted platform for buying and selling properties with complete transparency, 
            security, and zero brokerage fees
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-2">
                <badge.icon size={24} className={badge.color} />
                <span className="font-semibold text-gray-700 dark:text-gray-300">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-transparent hover:-translate-y-2 hover:bg-white/90 dark:hover:bg-gray-800/90"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Gradient Border on Hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" 
                   style={{ background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}>
              </div>

              {/* Stats Badge */}
              <div className="absolute -top-3 -right-3 px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full shadow-lg">
                {feature.stats}
              </div>

              {/* Icon with Emoji */}
              <div className="relative mb-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  <feature.icon size={36} className="text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 text-4xl">{feature.emoji}</div>
              </div>

              {/* Content */}
              <h3 className="font-heading font-bold text-2xl mb-4 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 font-medium">
                {feature.description}
              </p>

              {/* Detailed Description */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
                  {feature.details}
                </p>
              </div>

              {/* Hover Effect Line */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${feature.color} group-hover:w-full transition-all duration-500 rounded-b-3xl`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative z-10">
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of property owners who trust GharBazaar for transparent, 
              secure, and hassle-free real estate transactions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-bold px-10 py-5 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Get Started for ₹1000 →
              </a>
              <a 
                href="/pricing" 
                className="inline-block bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 font-bold px-10 py-5 rounded-xl text-lg transition-all"
              >
                View All Plans
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-primary-100">
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>No Hidden Charges</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>100% Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
