import { LogIn, Upload, CreditCard, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export function HowItWorks() {
  const steps = [
    {
      icon: LogIn,
      number: '1',
      title: 'Login',
      description: 'Sign in using Google or your phone number.',
    },
    {
      icon: Upload,
      number: '2',
      title: 'Add Your Property',
      description: 'Upload photos, details, and choose your listing plan.',
    },
    {
      icon: CreditCard,
      number: '3',
      title: 'Pay ₹1000 (Razorpay Secure)',
      description: 'Your listing goes live instantly.',
    },
    {
      icon: TrendingUp,
      number: '4',
      title: 'Get Buyers & Offers',
      description: 'Track views, bids, messages — all inside your dashboard.',
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Simple 4-step process to list and sell your property
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center space-y-4 h-full">
              <div className="relative">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto">
                  <step.icon className="text-primary-600" size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
              </div>
              <h3 className="font-heading font-bold text-xl">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="w-8 h-0.5 bg-primary-300 dark:bg-primary-700"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Section with Glass Effect */}
      <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden shadow-2xl">
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h3 className="font-heading font-bold text-2xl md:text-3xl mb-4">
            Ready to Post Your Property?
          </h3>
          <p className="text-lg text-primary-100 mb-6 max-w-2xl mx-auto">
            List your home today for just ₹1000 and reach real buyers instantly.
          </p>
          <Link href="/sell" className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105">
            List Property Now →
          </Link>
        </div>
      </div>
    </section>
  )
}
