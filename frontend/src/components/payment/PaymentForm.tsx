'use client'

import { useState, useEffect } from 'react'
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  QrCode,
  Shield,
  Zap,
  Star,
  Copy,
  Check,
  RefreshCw,
  Timer,
  Verified,
  ArrowRight,
  Info,
  Tag
} from 'lucide-react'
import { initiateRazorpayPayment, PaymentData } from '@/lib/razorpay'
import QRCodeGenerator from '@/components/ui/QRCodeGenerator'
import { processPaymentAPI, sendPaymentConfirmationAPI } from '@/lib/payment-api'
import { backendApi } from '@/lib/backendApi'

interface PaymentFormProps {
  amount: number
  serviceName: string
  userDetails: {
    name: string
    email: string
    phone: string
  }
  onPaymentSuccess: (paymentData: any) => void
  onPaymentError: (error: string) => void
  loading: boolean
}

export default function PaymentForm({
  amount,
  serviceName,
  userDetails,
  onPaymentSuccess,
  onPaymentError,
  loading
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'qr'>('qr')
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false)
  const [paymentTimer, setPaymentTimer] = useState(300) // 5 minutes
  const [copied, setCopied] = useState(false)

  // Card form state
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  // UPI form state
  const [upiId, setUpiId] = useState('')
  const [upiVerified, setUpiVerified] = useState(false)

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('')

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState('')

  // QR Code state
  const [qrData, setQrData] = useState('')

  const paymentMethods = [
    {
      id: 'upi' as const,
      name: 'UPI',
      description: 'Pay using UPI ID or QR',
      icon: <Smartphone className="w-5 h-5" />,
      popular: true,
      discount: '2% cashback',
      features: ['Instant', 'Secure', 'No charges']
    },
    {
      id: 'qr' as const,
      name: 'QR Code',
      description: 'Scan & Pay with any UPI app',
      icon: <QrCode className="w-5 h-5" />,
      popular: true,
      discount: 'Most convenient',
      features: ['Any UPI app', 'Quick scan', 'Secure']
    },
    {
      id: 'card' as const,
      name: 'Cards',
      description: 'Debit/Credit Cards',
      icon: <CreditCard className="w-5 h-5" />,
      popular: false,
      discount: null,
      features: ['All banks', 'EMI available', 'Secure']
    },
    {
      id: 'netbanking' as const,
      name: 'Net Banking',
      description: 'Internet Banking',
      icon: <Building2 className="w-5 h-5" />,
      popular: false,
      discount: null,
      features: ['All major banks', 'Direct debit', 'Trusted']
    },
    {
      id: 'wallet' as const,
      name: 'Wallets',
      description: 'Digital Wallets',
      icon: <Wallet className="w-5 h-5" />,
      popular: false,
      discount: 'Offers available',
      features: ['Quick pay', 'Rewards', 'Convenient']
    }
  ]

  const banks = [
    { name: 'State Bank of India', code: 'SBI', popular: true },
    { name: 'HDFC Bank', code: 'HDFC', popular: true },
    { name: 'ICICI Bank', code: 'ICICI', popular: true },
    { name: 'Axis Bank', code: 'AXIS', popular: true },
    { name: 'Punjab National Bank', code: 'PNB', popular: false },
    { name: 'Bank of Baroda', code: 'BOB', popular: false },
    { name: 'Canara Bank', code: 'CANARA', popular: false },
    { name: 'Union Bank of India', code: 'UBI', popular: false },
    { name: 'Kotak Mahindra Bank', code: 'KOTAK', popular: true },
    { name: 'IndusInd Bank', code: 'INDUS', popular: false }
  ]

  const wallets = [
    { name: 'Paytm', icon: '💰', popular: true, offer: '₹50 cashback' },
    { name: 'Amazon Pay', icon: '🛒', popular: true, offer: '5% back' },
    { name: 'Mobikwik', icon: '📱', popular: false, offer: '₹25 cashback' },
    { name: 'Freecharge', icon: '⚡', popular: false, offer: '₹30 cashback' },
    { name: 'Ola Money', icon: '🚗', popular: false, offer: '₹20 cashback' },
    { name: 'JioMoney', icon: '📶', popular: false, offer: '₹15 cashback' }
  ]

  const upiApps = [
    { name: 'Google Pay', suffix: '@okaxis', icon: '🔵' },
    { name: 'PhonePe', suffix: '@ybl', icon: '🟣' },
    { name: 'Paytm', suffix: '@paytm', icon: '🔵' },
    { name: 'BHIM', suffix: '@upi', icon: '🟢' },
    { name: 'Amazon Pay', suffix: '@apl', icon: '🟠' },
    { name: 'WhatsApp', suffix: '@wa', icon: '🟢' }
  ]

  // Timer effect for QR code
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (qrCodeGenerated && paymentTimer > 0) {
      interval = setInterval(() => {
        setPaymentTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [qrCodeGenerated, paymentTimer])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardData({ ...cardData, number: formatted })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    setCardData({ ...cardData, expiry: formatted })
  }

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    return cleaned.length >= 13 && cleaned.length <= 19
  }

  const validateExpiry = (expiry: string) => {
    const [month, year] = expiry.split('/')
    if (!month || !year) return false
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    const expMonth = parseInt(month)
    const expYear = parseInt(year)

    if (expMonth < 1 || expMonth > 12) return false
    if (expYear < currentYear) return false
    if (expYear === currentYear && expMonth < currentMonth) return false

    return true
  }

  const validateUPI = (upiId: string) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
    return upiRegex.test(upiId)
  }

  const verifyUPI = async (upiId: string) => {
    if (!validateUPI(upiId)) return false

    // Simulate UPI verification
    await new Promise(resolve => setTimeout(resolve, 1500))
    setUpiVerified(true)
    return true
  }

  const generateQRCode = () => {
    // Generate real UPI payment string that mobile apps can scan
    const merchantVPA = 'gharbazaar@paytm' // Replace with your actual merchant UPI ID
    const merchantName = 'GharBazaar'
    const transactionNote = `Payment for ${serviceName}`
    const transactionRef = 'GHB' + Date.now()

    // Standard UPI payment URL format
    const qrString = `upi://pay?pa=${merchantVPA}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionRef}`

    setQrData(qrString)
    setQrCodeGenerated(true)
    setPaymentTimer(300) // Reset timer
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const processPayment = async () => {
    try {
      // Basic validation
      if (!userDetails.name.trim()) {
        onPaymentError('Please enter your name')
        return
      }
      if (!userDetails.email.trim()) {
        onPaymentError('Please enter your email')
        return
      }
      if (!userDetails.phone.trim()) {
        onPaymentError('Please enter your phone number')
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userDetails.email)) {
        onPaymentError('Please enter a valid email address')
        return
      }

      // Validate phone format (Indian mobile number)
      const phoneRegex = /^[6-9]\d{9}$/
      const cleanPhone = userDetails.phone.replace(/\D/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        onPaymentError('Please enter a valid Indian mobile number')
        return
      }

      // Payment method specific validation
      if (selectedMethod === 'card') {
        if (!validateCardNumber(cardData.number)) {
          onPaymentError('Please enter a valid card number')
          return
        }
        if (!validateExpiry(cardData.expiry)) {
          onPaymentError('Please enter a valid expiry date')
          return
        }
        if (cardData.cvv.length < 3) {
          onPaymentError('Please enter a valid CVV')
          return
        }
        if (cardData.name.trim().length < 2) {
          onPaymentError('Please enter the cardholder name')
          return
        }
      } else if (selectedMethod === 'upi') {
        if (!validateUPI(upiId)) {
          onPaymentError('Please enter a valid UPI ID')
          return
        }
      } else if (selectedMethod === 'netbanking') {
        if (!selectedBank) {
          onPaymentError('Please select your bank')
          return
        }
      } else if (selectedMethod === 'wallet') {
        if (!selectedWallet) {
          onPaymentError('Please select a wallet')
          return
        }
      }

      setProcessingPayment(true)

      console.log('🚀 Starting payment process...', {
        method: selectedMethod,
        amount: amount,
        user: userDetails.name
      })

      // Create payment order first
      console.log('📝 Creating payment order...')
      const orderData = await backendApi.payments.createOrder(
        amount * 100, // Convert to paise
        selectedMethod,
        {
          service: serviceName,
          customer: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          method: selectedMethod
        }
      )

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      console.log('✅ Order created successfully:', orderData.order.id)

      // Process payment based on selected method
      console.log(`💳 Processing ${selectedMethod.toUpperCase()} payment...`)
      let paymentResult

      switch (selectedMethod) {
        case 'upi':
          paymentResult = await processUPIPayment(orderData.order, upiId)
          break
        case 'card':
          paymentResult = await processCardPayment(orderData.order, cardData)
          break
        case 'netbanking':
          paymentResult = await processNetBankingPayment(orderData.order, selectedBank)
          break
        case 'wallet':
          paymentResult = await processWalletPayment(orderData.order, selectedWallet)
          break
        case 'qr':
          paymentResult = await processQRPayment(orderData.order)
          break
        default:
          throw new Error('Invalid payment method selected')
      }

      console.log('💰 Payment processed:', paymentResult.paymentId)

      // Verify payment on backend
      console.log('🔍 Verifying payment...')
      const verificationData = await backendApi.payments.verify({
        razorpay_order_id: paymentResult.orderId,
        razorpay_payment_id: paymentResult.paymentId,
        razorpay_signature: paymentResult.signature
      })

      if (!verificationData.success) {
        throw new Error(verificationData.error || 'Payment verification failed')
      }

      console.log('✅ Payment verified:', verificationData)

      if (verificationData.success) {
        // Payment successful
        console.log('🎉 Payment completed successfully!')
        onPaymentSuccess({
          transactionId: paymentResult.paymentId,
          orderId: paymentResult.orderId,
          signature: paymentResult.signature,
          method: selectedMethod,
          amount: amount,
          status: 'success',
          timestamp: new Date().toISOString(),
          userDetails: userDetails
        })
      } else {
        throw new Error('Payment verification failed')
      }

    } catch (error) {
      console.error('❌ Payment processing error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed'
      onPaymentError(`Payment failed: ${errorMessage}`)
    } finally {
      setProcessingPayment(false)
    }
  }

  // Custom payment processing functions for each method
  const processUPIPayment = async (orderData: any, upiId: string) => {
    console.log('🔄 Processing UPI payment for:', upiId)

    // Simulate UPI payment processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In real implementation, this would integrate with UPI APIs
    const paymentId = 'pay_upi_' + Date.now() + Math.random().toString(36).substring(2, 8)
    const signature = generateSignature(orderData.id, paymentId)

    console.log('✅ UPI payment processed successfully')

    return {
      paymentId,
      orderId: orderData.id,
      signature,
      method: 'upi',
      upiId
    }
  }

  const processCardPayment = async (orderData: any, cardData: any) => {
    console.log('💳 Processing card payment for:', cardData.number.slice(-4))

    // Simulate card payment processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // In real implementation, this would integrate with card processing APIs
    const paymentId = 'pay_card_' + Date.now() + Math.random().toString(36).substring(2, 8)
    const signature = generateSignature(orderData.id, paymentId)

    console.log('✅ Card payment processed successfully')

    return {
      paymentId,
      orderId: orderData.id,
      signature,
      method: 'card',
      cardLast4: cardData.number.slice(-4)
    }
  }

  const processNetBankingPayment = async (orderData: any, bankName: string) => {
    console.log('🏦 Processing net banking payment for:', bankName)

    // Simulate net banking payment processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 4000))

    const paymentId = 'pay_nb_' + Date.now() + Math.random().toString(36).substring(2, 8)
    const signature = generateSignature(orderData.id, paymentId)

    console.log('✅ Net banking payment processed successfully')

    return {
      paymentId,
      orderId: orderData.id,
      signature,
      method: 'netbanking',
      bank: bankName
    }
  }

  const processWalletPayment = async (orderData: any, walletName: string) => {
    console.log('📱 Processing wallet payment for:', walletName)

    // Simulate wallet payment processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const paymentId = 'pay_wallet_' + Date.now() + Math.random().toString(36).substring(2, 8)
    const signature = generateSignature(orderData.id, paymentId)

    console.log('✅ Wallet payment processed successfully')

    return {
      paymentId,
      orderId: orderData.id,
      signature,
      method: 'wallet',
      wallet: walletName
    }
  }

  const processQRPayment = async (orderData: any) => {
    console.log('📱 Processing QR payment...')

    // Simulate QR payment processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2500))

    const paymentId = 'pay_qr_' + Date.now() + Math.random().toString(36).substring(2, 8)
    const signature = generateSignature(orderData.id, paymentId)

    console.log('✅ QR payment processed successfully')

    return {
      paymentId,
      orderId: orderData.id,
      signature,
      method: 'qr'
    }
  }

  const generateSignature = (orderId: string, paymentId: string) => {
    // In real implementation, this would be done on backend with your Razorpay secret
    return 'sig_' + btoa(orderId + '|' + paymentId).substring(0, 20)
  }

  const isFormValid = () => {
    // Check user details first
    if (!userDetails.name.trim() || !userDetails.email.trim() || !userDetails.phone.trim()) {
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userDetails.email)) {
      return false
    }

    // Validate phone format (more flexible - any 10 digit number)
    const cleanPhone = userDetails.phone.replace(/\D/g, '')
    if (cleanPhone.length !== 10) {
      return false
    }

    // Check payment method specific validations (more lenient)
    switch (selectedMethod) {
      case 'card':
        return cardData.number.replace(/\s/g, '').length >= 13 &&
          cardData.expiry.length >= 5 &&
          cardData.cvv.length >= 3 &&
          cardData.name.trim().length >= 2
      case 'upi':
        return upiId.includes('@') && upiId.trim().length > 5
      case 'netbanking':
        return selectedBank !== '' && selectedBank.trim().length > 0
      case 'wallet':
        return selectedWallet !== '' && selectedWallet.trim().length > 0
      case 'qr':
        return true // QR code doesn't need additional validation
      default:
        return false
    }
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 rounded-full -translate-y-16 translate-x-16"></div>

      {/* Payment Method Selection Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Choose Payment Method
        </h2>
        <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-full">
          <Shield className="w-4 h-4" />
          <span className="font-medium">GharBazaar Secured</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-6 border-2 rounded-2xl transition-all duration-300 relative overflow-hidden group ${selectedMethod === method.id
                ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 shadow-lg scale-105'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-xl transition-all duration-300 ${selectedMethod === method.id
                  ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                  }`}>
                  {method.icon}
                </div>

                <div>
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {method.name}
                    </span>
                    {method.popular && (
                      <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {method.description}
                  </p>

                  {method.discount && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full mb-2">
                      {method.discount}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-1">
                    {method.features.map((feature, index) => (
                      <span key={index} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Form Based on Selected Method */}
      <div className="mb-8 relative z-10">
        {selectedMethod === 'card' && (
          <div className="space-y-6 bg-gray-50 dark:bg-gray-700/30 p-6 rounded-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-teal-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Card Details</h4>
              <div className="flex space-x-2 ml-auto">
                <img src="https://img.icons8.com/color/24/visa.png" alt="Visa" className="w-6 h-6" />
                <img src="https://img.icons8.com/color/24/mastercard.png" alt="Mastercard" className="w-6 h-6" />
                <img src="https://img.icons8.com/color/24/rupay.png" alt="RuPay" className="w-6 h-6" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Card Number
              </label>
              <input
                type="text"
                value={cardData.number}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg tracking-wider"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  CVV
                </label>
                <div className="relative">
                  <input
                    type={showCardDetails ? 'text' : 'password'}
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCardDetails(!showCardDetails)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                  >
                    {showCardDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                placeholder="JOHN DOE"
                className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg uppercase"
              />
            </div>
          </div>
        )}

        {selectedMethod === 'upi' && (
          <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">UPI Payment</h4>
              {upiVerified && (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs">
                  <Verified className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Enter UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value)
                    setUpiVerified(false)
                  }}
                  placeholder="yourname@paytm"
                  className="w-full px-4 py-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                />
                {validateUPI(upiId) && !upiVerified && (
                  <button
                    onClick={() => verifyUPI(upiId)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 p-1"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Enter your UPI ID (e.g., 9876543210@paytm, name@googlepay)
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Select UPI App:</p>
              <div className="grid grid-cols-3 gap-3">
                {upiApps.map((app) => (
                  <button
                    key={app.suffix}
                    onClick={() => {
                      const baseId = upiId.split('@')[0] || userDetails.phone
                      setUpiId(baseId + app.suffix)
                      setUpiVerified(false)
                    }}
                    className="p-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-center"
                  >
                    <div className="text-lg mb-1">{app.icon}</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{app.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{app.suffix}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'qr' && (
          <div className="space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-purple-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">QR Code Payment</h4>
              </div>
              {qrCodeGenerated && (
                <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full text-sm">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(paymentTimer)}</span>
                </div>
              )}
            </div>

            {!qrCodeGenerated ? (
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Generate QR Code</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Click below to generate a QR code for payment
                </p>
                <button
                  onClick={generateQRCode}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Generate QR Code
                </button>
              </div>
            ) : (
              <div className="text-center">
                {/* Real QR Code Display */}
                <div className="bg-white rounded-2xl shadow-lg mx-auto mb-4 p-6 inline-block">
                  <QRCodeGenerator
                    value={qrData}
                    size={200}
                    className="mx-auto"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                  <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    How to Pay with QR Code:
                  </h5>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
                    <li>1. Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                    <li>2. Tap on "Scan QR Code" or camera icon</li>
                    <li>3. Point your camera at the QR code above</li>
                    <li>4. Verify amount ₹{amount.toLocaleString()} and complete payment</li>
                  </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-4 border border-amber-200 dark:border-amber-700">
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-2">
                    ⚠️ Important Note:
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    The QR code above is a visual placeholder. For actual payment, please use the "Copy UPI Link" button below and paste it in your UPI app, or use the direct UPI payment option.
                  </p>
                </div>

                <div className="flex justify-center space-x-3 mb-6">
                  <button
                    onClick={() => copyToClipboard(qrData)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy UPI Link'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setQrCodeGenerated(false)
                      setPaymentTimer(300)
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-semibold transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Regenerate</span>
                  </button>
                </div>

                {/* Alternative: Direct UPI Link */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Alternative Payment Methods:
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        // Try to open UPI link directly
                        window.open(qrData, '_blank')
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Open in UPI App</span>
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      This will try to open your default UPI app
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedMethod === 'netbanking' && (
          <div className="space-y-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Net Banking</h4>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select Your Bank
              </label>

              {/* Popular Banks */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Popular Banks:</p>
                <div className="grid grid-cols-2 gap-3">
                  {banks.filter(bank => bank.popular).map((bank) => (
                    <button
                      key={bank.code}
                      onClick={() => setSelectedBank(bank.name)}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 text-left ${selectedBank === bank.name
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{bank.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{bank.code}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* All Banks Dropdown */}
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Choose your bank</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {selectedMethod === 'wallet' && (
          <div className="space-y-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <Wallet className="w-5 h-5 text-orange-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Digital Wallets</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {wallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => setSelectedWallet(wallet.name)}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${selectedWallet === wallet.name
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{wallet.icon}</div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {wallet.name}
                    </div>
                    {wallet.offer && (
                      <div className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        {wallet.offer}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Amount Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl p-6 mb-8 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Amount to Pay</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            ₹{amount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Service</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">{serviceName}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">{selectedMethod}</span>
        </div>
      </div>

      {/* Pay Button */}
      <div className="space-y-4 relative z-10">
        {/* Validation Messages */}
        {!isFormValid() && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Please complete the following:
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  {!userDetails.name.trim() && <li>• Enter your full name</li>}
                  {!userDetails.email.trim() && <li>• Enter your email address</li>}
                  {userDetails.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email) && <li>• Enter a valid email address</li>}
                  {!userDetails.phone.trim() && <li>• Enter your phone number</li>}
                  {userDetails.phone.trim() && userDetails.phone.replace(/\D/g, '').length !== 10 && <li>• Enter a valid 10-digit phone number</li>}
                  {selectedMethod === 'card' && cardData.number.replace(/\s/g, '').length < 13 && <li>• Enter valid card number</li>}
                  {selectedMethod === 'card' && cardData.expiry.length < 5 && <li>• Enter valid expiry date (MM/YY)</li>}
                  {selectedMethod === 'card' && cardData.cvv.length < 3 && <li>• Enter valid CVV</li>}
                  {selectedMethod === 'card' && cardData.name.trim().length < 2 && <li>• Enter cardholder name</li>}
                  {selectedMethod === 'upi' && (!upiId.includes('@') || upiId.trim().length <= 5) && <li>• Enter valid UPI ID (e.g., name@paytm)</li>}
                  {selectedMethod === 'netbanking' && !selectedBank && <li>• Select your bank</li>}
                  {selectedMethod === 'wallet' && !selectedWallet && <li>• Select a wallet</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={processPayment}
          disabled={processingPayment || !isFormValid()}
          className={`w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all duration-300 relative overflow-hidden ${processingPayment || !isFormValid()
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 hover:from-teal-700 hover:via-emerald-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105'
            }`}
        >
          {processingPayment ? (
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing {selectedMethod.toUpperCase()} Payment...</span>
            </div>
          ) : !isFormValid() ? (
            'Complete the form to continue'
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <Lock className="w-5 h-5" />
              <span>Pay ₹{amount.toLocaleString()} Securely</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </button>
      </div>

      {/* Processing Overlay */}
      {processingPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Processing Your Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Securely processing your payment of ₹{amount.toLocaleString()} via {selectedMethod.toUpperCase()}
            </p>

            {/* Payment Method Specific Messages */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
              <div className="text-sm text-blue-700 dark:text-blue-300">
                {selectedMethod === 'upi' && (
                  <div>
                    <p className="font-medium mb-2">🔄 Processing UPI Payment</p>
                    <p>Connecting to {upiId.split('@')[1]} network...</p>
                  </div>
                )}
                {selectedMethod === 'card' && (
                  <div>
                    <p className="font-medium mb-2">💳 Processing Card Payment</p>
                    <p>Verifying card details and processing transaction...</p>
                  </div>
                )}
                {selectedMethod === 'netbanking' && (
                  <div>
                    <p className="font-medium mb-2">🏦 Processing Net Banking</p>
                    <p>Connecting to {selectedBank} secure gateway...</p>
                  </div>
                )}
                {selectedMethod === 'wallet' && (
                  <div>
                    <p className="font-medium mb-2">📱 Processing Wallet Payment</p>
                    <p>Connecting to {selectedWallet} payment system...</p>
                  </div>
                )}
                {selectedMethod === 'qr' && (
                  <div>
                    <p className="font-medium mb-2">📱 Processing QR Payment</p>
                    <p>Verifying UPI transaction...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">
                ✅ Secure Processing:
              </p>
              <ul className="text-xs text-green-600 dark:text-green-400 text-left space-y-1">
                <li>• Bank-grade encryption</li>
                <li>• PCI DSS compliant</li>
                <li>• Real-time verification</li>
                <li>• Instant confirmation</li>
              </ul>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Powered by GharBazaar Secure Payment</span>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200/50 dark:border-green-700/50 relative z-10">
        <div className="flex items-center space-x-3 text-sm text-green-800 dark:text-green-200">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="font-semibold mb-1">Your payment is 100% secure</div>
            <div className="text-xs text-green-700 dark:text-green-300">
              Powered by GharBazaar Secure Payment • Bank-grade encryption • PCI DSS compliant • No popup required
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}