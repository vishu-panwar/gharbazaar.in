import { Shield, CheckCircle, Phone, FileCheck } from 'lucide-react'

export function TrustStrip() {
  const features = [
    { icon: FileCheck, text: 'RERA Coming Soon' },
    { icon: CheckCircle, text: 'Verified Sellers' },
    { icon: Shield, text: 'Secure Payments' },
    { icon: Phone, text: '24/7 Support' },
  ]

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center space-x-3">
              <feature.icon className="text-primary-600" size={24} />
              <span className="text-sm md:text-base font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
