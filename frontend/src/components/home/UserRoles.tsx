'use client'

import Link from 'next/link'
import { Users, Briefcase, Shield, ArrowRight, Check } from 'lucide-react'

export function UserRoles() {
  const roles = [
    {
      title: 'For Buyers & Sellers',
      description: 'List properties, find your dream home, and connect with genuine buyers',
      icon: Users,
      color: 'primary',
      features: [
        'List unlimited properties',
        'Advanced search & filters',
        'Real-time messaging',
        'Bid management system',
        'Save favorites',
        'KYC verification'
      ],
      cta: 'Get Started',
      href: '/signup',
      gradient: 'from-primary-600 to-primary-800'
    },
    {
      title: 'For Employees',
      description: 'Join our team to verify listings, support users, and manage operations',
      icon: Briefcase,
      color: 'blue',
      features: [
        'KYC verification panel',
        'Property approval system',
        'Chat support tools',
        'Issue management',
        'Lead tracking',
        'Performance dashboard'
      ],
      cta: 'Employee Login',
      href: '/employee/login',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      title: 'Admin Portal',
      description: 'Complete control panel for platform management and analytics',
      icon: Shield,
      color: 'purple',
      features: [
        'User management',
        'Revenue analytics',
        'Employee oversight',
        'Subscription control',
        'Fraud detection',
        'System administration'
      ],
      cta: 'Admin Login',
      href: '/admin/login',
      gradient: 'from-purple-600 to-purple-800'
    }
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Built for Everyone
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Whether you're buying, selling, supporting, or managing - GharBazaar has the perfect dashboard for you
          </p>
        </div>

        {/* Role Cards with Glass Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              {/* Header with Glass Effect */}
              <div className={`bg-gradient-to-br ${role.gradient} p-8 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-lg">
                    <role.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{role.title}</h3>
                  <p className="text-white/90">{role.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="p-8">
                <ul className="space-y-3 mb-8">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={role.href}
                  className={`
                    flex items-center justify-center space-x-2 w-full py-3 px-6 rounded-xl font-semibold transition-all
                    bg-gradient-to-r ${role.gradient} text-white hover:shadow-lg group-hover:scale-105
                  `}
                >
                  <span>{role.cta}</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-6 py-3 rounded-full">
            <span className="text-2xl">🎉</span>
            <span className="font-semibold">Join 10,000+ users already on GharBazaar</span>
          </div>
        </div>
      </div>
    </section>
  )
}
