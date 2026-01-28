// Payment utility functions for GharBazaar

export interface PaymentService {
  id: string
  name: string
  amount: number
  description: string
  validity: string
  includes: string[]
  excludes: string[]
  popular?: boolean
}

export const PAYMENT_SERVICES: Record<string, PaymentService> = {
  'property-listing': {
    id: 'property-listing',
    name: 'Property Listing',
    amount: 1000,
    description: 'List your property on GharBazaar platform with full visibility',
    validity: 'Till property is sold or rented',
    includes: [
      'Property listing on platform',
      'Photo gallery (up to 20 images)',
      'Property details & description',
      'Contact form for inquiries',
      'Basic analytics dashboard',
      'Search visibility boost'
    ],
    excludes: [
      'No brokerage charges',
      'No commission on sale/rent',
      'No auto-renewal',
      'No hidden fees'
    ],
    popular: true
  },
  'premium-access': {
    id: 'premium-access',
    name: 'Premium Access',
    amount: 500,
    description: 'Enhanced features for property search and discovery',
    validity: '30 days from activation',
    includes: [
      'Advanced search filters',
      'Priority customer support',
      'Detailed property analytics',
      'Direct owner contact details',
      'Save unlimited favorites',
      'Early access to new listings'
    ],
    excludes: [
      'No listing charges',
      'No commission fees',
      'No auto-renewal',
      'No hidden costs'
    ]
  },
  'premium-access-quarterly': {
    id: 'premium-access-quarterly',
    name: 'Premium Access (3 Months)',
    amount: 900,
    description: 'Extended premium access with additional benefits',
    validity: '90 days from activation',
    includes: [
      'All Premium Access features',
      'Quarterly market reports',
      'Investment opportunity alerts',
      'Dedicated relationship manager',
      'Priority listing notifications',
      'Extended search history'
    ],
    excludes: [
      'No listing charges',
      'No commission fees',
      'No auto-renewal',
      'No hidden costs'
    ]
  },
  'assisted-deal': {
    id: 'assisted-deal',
    name: 'Assisted Deal Support',
    amount: 199,
    description: 'Professional assistance for property transactions',
    validity: 'Till deal completion or 90 days',
    includes: [
      'Dedicated relationship manager',
      'Document verification support',
      'Legal consultation (basic)',
      'Negotiation assistance',
      'Deal closure support',
      'Post-deal follow-up'
    ],
    excludes: [
      'Commission only if deal closes (1%)',
      'No upfront brokerage',
      'No forced services',
      'No hidden charges'
    ]
  },
  'verification-service': {
    id: 'verification-service',
    name: 'Property Verification',
    amount: 299,
    description: 'Professional property verification and documentation',
    validity: 'One-time service',
    includes: [
      'Physical property inspection',
      'Document verification',
      'Legal title check',
      'Market valuation report',
      'Verification certificate',
      'Digital verification badge'
    ],
    excludes: [
      'No recurring charges',
      'No commission fees',
      'No hidden costs',
      'No forced upgrades'
    ]
  }
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
  popular?: boolean
  enabled?: boolean
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: 'smartphone',
    popular: true,
    enabled: true
  },
  {
    id: 'card',
    name: 'Debit/Credit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: 'credit-card',
    enabled: true
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: 'building',
    enabled: true
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    description: 'Paytm, Amazon Pay, etc.',
    icon: 'wallet',
    enabled: true
  }
]

export interface PaymentRequest {
  serviceId: string
  amount: number
  userDetails: {
    name: string
    email: string
    phone: string
  }
  paymentMethod: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
  redirectUrl?: string
}

// Utility functions
export const getServiceById = (serviceId: string): PaymentService | null => {
  return PAYMENT_SERVICES[serviceId] || null
}

export const formatAmount = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`
}

export const generateTransactionId = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `GHB${timestamp}${random}`
}

export const validatePaymentRequest = (request: PaymentRequest): string[] => {
  const errors: string[] = []
  
  if (!request.serviceId || !PAYMENT_SERVICES[request.serviceId]) {
    errors.push('Invalid service selected')
  }
  
  if (!request.amount || request.amount <= 0) {
    errors.push('Invalid amount')
  }
  
  if (!request.userDetails.name?.trim()) {
    errors.push('Name is required')
  }
  
  if (!request.userDetails.email?.trim()) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.userDetails.email)) {
    errors.push('Invalid email format')
  }
  
  if (!request.userDetails.phone?.trim()) {
    errors.push('Phone number is required')
  } else if (!/^[6-9]\d{9}$/.test(request.userDetails.phone.replace(/\D/g, ''))) {
    errors.push('Invalid phone number')
  }
  
  if (!request.paymentMethod) {
    errors.push('Payment method is required')
  }
  
  return errors
}

// Mock payment processing (replace with actual payment gateway integration)
export const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  // Validate request
  const errors = validatePaymentRequest(request)
  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join(', ')
    }
  }
  
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Simulate success/failure (90% success rate)
  const isSuccess = Math.random() > 0.1
  
  if (isSuccess) {
    return {
      success: true,
      transactionId: generateTransactionId(),
      redirectUrl: `/payment/success?service=${encodeURIComponent(PAYMENT_SERVICES[request.serviceId].name)}&amount=${request.amount}&txnId=${generateTransactionId()}`
    }
  } else {
    const errorMessages = [
      'Payment declined by bank',
      'Insufficient funds',
      'Network timeout',
      'Invalid card details',
      'Transaction limit exceeded'
    ]
    
    return {
      success: false,
      error: errorMessages[Math.floor(Math.random() * errorMessages.length)],
      redirectUrl: `/payment/failed?service=${encodeURIComponent(PAYMENT_SERVICES[request.serviceId].name)}&amount=${request.amount}&error=${encodeURIComponent('Payment processing failed')}`
    }
  }
}

// Payment analytics and tracking
export const trackPaymentEvent = (event: string, data: any) => {
  // Track payment events for analytics
  console.log('Payment Event:', event, data)
  
  // In production, integrate with analytics services like:
  // - Google Analytics
  // - Mixpanel
  // - Custom analytics
}

// Payment security utilities
export const sanitizePaymentData = (data: any) => {
  // Remove sensitive information before logging
  const sanitized = { ...data }
  delete sanitized.cardNumber
  delete sanitized.cvv
  delete sanitized.pin
  return sanitized
}

export const isValidAmount = (amount: number, serviceId: string): boolean => {
  const service = PAYMENT_SERVICES[serviceId]
  return service && amount === service.amount
}

// Payment URL generators
export const generatePaymentUrl = (serviceId: string, amount?: number): string => {
  const service = PAYMENT_SERVICES[serviceId]
  if (!service) return '/payment'
  
  const params = new URLSearchParams({
    service: serviceId,
    amount: (amount || service.amount).toString()
  })
  
  return `/payment?${params.toString()}`
}

export const generateSuccessUrl = (service: string, amount: number, txnId: string): string => {
  const params = new URLSearchParams({
    service,
    amount: amount.toString(),
    txnId
  })
  
  return `/payment/success?${params.toString()}`
}

export const generateFailureUrl = (service: string, amount: number, error: string): string => {
  const params = new URLSearchParams({
    service,
    amount: amount.toString(),
    error
  })
  
  return `/payment/failed?${params.toString()}`
}

// Export all services for easy access
export const getAllServices = (): PaymentService[] => {
  return Object.values(PAYMENT_SERVICES)
}

export const getPopularServices = (): PaymentService[] => {
  return Object.values(PAYMENT_SERVICES).filter(service => service.popular)
}