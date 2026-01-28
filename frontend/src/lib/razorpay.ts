// Enhanced Razorpay integration for GharBazaar

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  method?: {
    upi?: boolean;
    card?: boolean;
    netbanking?: boolean;
    wallet?: boolean;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
    confirm_close?: boolean;
    animation?: boolean;
  };
  notes?: {
    [key: string]: string;
  };
  config?: {
    display: {
      language: string;
    };
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface PaymentData {
  serviceId: string;
  serviceName: string;
  amount: number;
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment with enhanced features
export const initiateRazorpayPayment = async (
  paymentData: PaymentData,
  onSuccess: (response: RazorpayResponse) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
    }

    // Get Razorpay key from environment
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      throw new Error('Payment gateway not configured. Please contact support.');
    }

    // Generate unique order reference
    const orderRef = generateTransactionRef();

    // Prepare enhanced Razorpay options
    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: paymentData.amount * 100, // Convert to paise
      currency: 'INR',
      name: 'GharBazaar',
      description: paymentData.serviceName,
      image: '/images/gharbazaar-logo.jpg',
      prefill: {
        name: paymentData.userDetails.name,
        email: paymentData.userDetails.email,
        contact: paymentData.userDetails.phone,
      },
      theme: {
        color: '#14b8a6', // Teal color matching GharBazaar theme
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      config: {
        display: {
          language: 'en'
        }
      },
      notes: {
        service_id: paymentData.serviceId,
        service_name: paymentData.serviceName,
        order_ref: orderRef,
        customer_name: paymentData.userDetails.name,
        customer_email: paymentData.userDetails.email,
      },
      handler: (response: RazorpayResponse) => {
        console.log('Payment successful:', response);
        trackRazorpayEvent('payment_success', {
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          amount: paymentData.amount,
          service: paymentData.serviceName
        });
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
          trackRazorpayEvent('payment_dismissed', {
            amount: paymentData.amount,
            service: paymentData.serviceName
          });
          onFailure({ error: 'Payment cancelled by user' });
        },
        confirm_close: true,
        animation: true,
      },
    };

    // Track payment initiation
    trackRazorpayEvent('payment_initiated', {
      amount: paymentData.amount,
      service: paymentData.serviceName,
      customer: paymentData.userDetails.email
    });

    // Create and open Razorpay instance
    const razorpay = new window.Razorpay(options);

    // Handle payment failure
    razorpay.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      trackRazorpayEvent('payment_failed', {
        error_code: response.error.code,
        error_description: response.error.description,
        amount: paymentData.amount,
        service: paymentData.serviceName
      });
      onFailure({
        error: response.error.description || 'Payment failed',
        code: response.error.code,
        reason: response.error.reason
      });
    });

    razorpay.open();

  } catch (error) {
    console.error('Razorpay initialization error:', error);
    trackRazorpayEvent('payment_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      amount: paymentData.amount,
      service: paymentData.serviceName
    });
    onFailure(error);
  }
};

// Verify payment on server (mock implementation)
export const verifyPayment = async (
  paymentId: string,
  orderId?: string,
  signature?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // In production, this should call your backend API
    // to verify the payment with Razorpay

    // Mock verification - always return success for demo
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Payment verified successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Payment verification failed'
    };
  }
};

// Generate transaction reference
export const generateTransactionRef = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GHB_${timestamp}_${random}`;
};

// Format amount for display
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Validate payment data
export const validatePaymentData = (data: PaymentData): string[] => {
  const errors: string[] = [];

  if (!data.serviceId?.trim()) {
    errors.push('Service ID is required');
  }

  if (!data.serviceName?.trim()) {
    errors.push('Service name is required');
  }

  if (!data.amount || data.amount <= 0) {
    errors.push('Valid amount is required');
  }

  if (!data.userDetails.name?.trim()) {
    errors.push('Name is required');
  }

  if (!data.userDetails.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userDetails.email)) {
    errors.push('Valid email is required');
  }

  if (!data.userDetails.phone?.trim()) {
    errors.push('Phone number is required');
  } else if (!/^[6-9]\d{9}$/.test(data.userDetails.phone.replace(/\D/g, ''))) {
    errors.push('Valid Indian phone number is required');
  }

  return errors;
};

// Payment analytics
export const trackRazorpayEvent = (event: string, data: any) => {
  console.log(`Razorpay Event: ${event}`, data);

  // In production, integrate with analytics services
  // Example: Google Analytics, Mixpanel, etc.

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, {
      event_category: 'Payment',
      event_label: 'Razorpay',
      value: data.amount || 0,
      custom_parameters: data
    });
  }
};

// Error handling utilities
export const handleRazorpayError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.error) {
    return error.error;
  }

  if (error?.description) {
    return error.description;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Payment processing failed. Please try again.';
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  currency: 'INR',
  theme_color: '#14b8a6',
  company_name: 'GharBazaar',
  company_logo: '/images/gharbazaar-logo.jpg',
  timeout: 300, // 5 minutes
  retry: {
    enabled: true,
    max_count: 3,
  },
} as const;