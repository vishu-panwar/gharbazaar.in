import Link from 'next/link'
import { Check, Star, Briefcase } from 'lucide-react'

export function PricingPreview() {
  const plans = [
    {
      name: 'BASIC PLAN',
      price: 1000,
      duration: 'One Time',
      badge: 'Perfect for homeowners',
      icon: Star,
      features: [
        '1 Property Listing',
        'Live Forever',
        'Photo/Video Uploads',
        'Buyer Messaging',
        'Bid/Offer System',
        'Map View Support',
        'Dashboard Access',
      ],
    },
    {
      name: 'PRO PLAN',
      price: 199,
      duration: 'month',
      badge: 'For small agents',
      icon: TrendingUp,
      features: [
        'Everything in BASIC',
        'Up to 10 Listings',
        'Priority Ranking',
        'Verified Agent Badge',
        'Advanced Lead Info',
      ],
      popular: true,
    },
    {
      name: 'BUSINESS PLAN',
      price: 999,
      duration: 'month',
      badge: 'For real-estate agencies',
      icon: Briefcase,
      features: [
        'Everything in PRO',
        'Unlimited Listings',
        'Team Accounts',
        'Bulk Upload',
        'CRM Dashboard',
        'Premium Support',
      ],
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-800/50">
      <div className="text-center mb-12">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Start with ₹1000 — No Hidden Charges, No Brokerage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative ${plan.popular ? 'ring-2 ring-primary-600 scale-105 bg-white/90 dark:bg-gray-800/90' : ''}`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-sm px-4 py-1 rounded-full font-bold">
                🔥 MOST POPULAR
              </span>
            )}
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <plan.icon className="text-primary-600" size={32} />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-2">{plan.name}</h3>
              <p className="text-sm text-accent-600 dark:text-accent-400 font-medium mb-4">
                {plan.badge}
              </p>
              <div className="text-5xl font-bold text-primary-600 mb-1">
                ₹{plan.price.toLocaleString()}
              </div>
              <p className="text-gray-600 dark:text-gray-400">{plan.duration}</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start space-x-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              href="/pricing" 
              className={`btn-primary w-full text-center ${plan.popular ? 'bg-accent-500 hover:bg-accent-600' : ''}`}
            >
              {plan.price === 1000 ? 'Get Started' : 'Choose Plan'}
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          All plans include secure payments via Razorpay
        </p>
        <Link href="/pricing" className="text-primary-600 hover:underline font-medium">
          View detailed pricing comparison →
        </Link>
      </div>
    </section>
  )
}

import { TrendingUp } from 'lucide-react'

