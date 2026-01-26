'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface PaymentContextType {
    hasPaid: boolean
    setPaid: () => void
    clearPayment: () => void
}

const PaymentContext = createContext<PaymentContextType>({} as PaymentContextType)

export const usePayment = () => {
    const context = useContext(PaymentContext)
    if (!context) {
        throw new Error('usePayment must be used within PaymentProvider')
    }
    return context
}

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
    const [hasPaid, setHasPaid] = useState(false)

    // Load payment status from localStorage on mount
    useEffect(() => {
        const storedPaymentStatus = localStorage.getItem('gharbazaar_payment_status')
        if (storedPaymentStatus === 'paid') {
            setHasPaid(true)
        }
    }, [])

    const setPaid = () => {
        setHasPaid(true)
        localStorage.setItem('gharbazaar_payment_status', 'paid')
    }

    const clearPayment = () => {
        setHasPaid(false)
        localStorage.removeItem('gharbazaar_payment_status')
    }

    const value = {
        hasPaid,
        setPaid,
        clearPayment,
    }

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    )
}
