'use client'

import Link from 'next/link'
import { 
  CreditCard, 
  FileText, 
  Home, 
  Award,
  ArrowRight,
  Shield
} from 'lucide-react'

export default function PaymentNavigation() {
  const services = [
    {
      id: 'property-due-diligence',
      name: 'Property Due Diligence',
      price: '₹15,000',
      description: 'Complete legal & technical verification',
      icon: <FileText className="w-6 h-6" />,
      color: 'blue'
    },
    {
      id: 'property-listing-premium',
      name: 'Premium Property Listing',
      price: '₹5,000',
      description: 'Professional listing with maximum visibility',
      icon: <Home className="w-6 h-6" />,
      color: 'emerald'
    },
    {
      id: 'end-to-end-assistance',
      name: 'End-to-End Assistance',
      price: '₹25,000',
      description: 'Complete property transaction support',
      icon: <Award className="w-6 h-6" />,
      color: 'purple'
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Professional Real Estate Services
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from our comprehensive range of property services
        </p>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/payment?service=${service.id}`}
            className="block p-6 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 hover:shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-${service.color}-100 dark:bg-${service.color}-900/30 rounded-xl flex items-center justify-center text-${service.color}-600 dark:text-${service.color}-400`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {service.price}
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
        <div className="flex items-center space-x-3 text-sm text-green-800 dark:text-green-200">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <div className="font-semibold">100% Secure Payment</div>
            <div className="text-xs text-green-700 dark:text-green-300">
              Bank-grade encryption • PCI DSS compliant • RBI approved
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}