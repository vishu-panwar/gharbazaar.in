// Payment API simulation - In production, this will call your backend

export interface PaymentRequest {
  amount: number
  serviceName: string
  paymentMethod: string
  userDetails: {
    name: string
    email: string
    phone: string
  }
  promoCode?: string
}

export interface PaymentResponse {
  success: boolean
  transactionId: string
  orderId: string
  signature: string
  message: string
  timestamp: string
}

// Simulate payment processing API call
export const processPaymentAPI = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate transaction details
  const transactionId = 'ghb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8).toUpperCase()
  const orderId = 'order_' + Date.now()
  const signature = 'sig_' + Math.random().toString(36).substring(2, 15)
  
  // Simulate 95% success rate
  const isSuccess = Math.random() > 0.05
  
  if (isSuccess) {
    return {
      success: true,
      transactionId,
      orderId,
      signature,
      message: 'Payment processed successfully',
      timestamp: new Date().toISOString()
    }
  } else {
    throw new Error('Payment failed due to insufficient funds or network error')
  }
}

// Simulate payment verification
export const verifyPaymentAPI = async (transactionId: string): Promise<boolean> => {
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In production, this would verify with Razorpay/payment gateway
  return true
}

// Create order API simulation
export const createOrderAPI = async (amount: number, currency: string = 'INR') => {
  // Simulate order creation
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    orderId: 'order_' + Date.now(),
    amount: amount * 100, // Convert to paise
    currency,
    status: 'created'
  }
}

// Send payment confirmation email
export const sendPaymentConfirmationAPI = async (paymentData: PaymentResponse & PaymentRequest) => {
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('Payment confirmation email sent:', {
    to: paymentData.userDetails.email,
    transactionId: paymentData.transactionId,
    amount: paymentData.amount
  })
  
  return { success: true, message: 'Confirmation email sent' }
}

// Get payment status
export const getPaymentStatusAPI = async (transactionId: string) => {
  // Simulate status check
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    transactionId,
    status: 'completed',
    amount: 1000,
    timestamp: new Date().toISOString()
  }
}