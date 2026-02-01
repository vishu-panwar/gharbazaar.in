import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { backendApi } from '@/lib/backendApi'

interface Plan {
    id: string
    name: string
    type: 'buyer' | 'seller'
    features: {
        viewLimit?: number
        contactAccess?: boolean
        mapAccess?: boolean
        bidAccess?: boolean
        listingLimit?: number
        [key: string]: any
    }
    expiryDate?: string
}

interface PaymentContextType {
    hasPaid: boolean // Keep for backward compatibility
    currentPlan: Plan | null
    setPaid: () => void // Keep for backward compatibility
    setPlan: (plan: Plan) => void
    clearPayment: () => void
    hasFeature: (feature: string) => boolean
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
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)

    // Load payment status from localStorage on mount
    useEffect(() => {
        // Backward compatibility: check old boolean flag
        const storedPaymentStatus = localStorage.getItem('gharbazaar_payment_status')
        if (storedPaymentStatus === 'paid') {
            setHasPaid(true)
        }

        // New: load plan data
        const storedPlan = localStorage.getItem('gharbazaar_user_plan')
        if (storedPlan) {
            try {
                const plan = JSON.parse(storedPlan)
                setCurrentPlan(plan)
                setHasPaid(true) // If they have a plan, they've paid
            } catch (e) {
                console.error('Error parsing stored plan:', e)
            }
        }
    }, [])

    const setPaid = async () => {
        // Fallback for when we don't have a plan context (rare)
        setHasPaid(true)
        localStorage.setItem('gharbazaar_payment_status', 'paid')
    }

    const setPlan = async (plan: any) => {
        try {
            // Call backend to persist payment/plan
            const response = await backendApi.plans.purchase(
                plan.id,
                `pay_${Math.random().toString(36).substring(7)}` // Mock payment ID
            );

            if (response.success) {
                setCurrentPlan(plan)
                setHasPaid(true)
                localStorage.setItem('gharbazaar_user_plan', JSON.stringify(plan))
                localStorage.setItem('gharbazaar_payment_status', 'paid')
            }
        } catch (error) {
            console.error('Failed to purchase plan on backend:', error);
            // Fallback for demo
            setCurrentPlan(plan)
            setHasPaid(true)
        }
    }

    const clearPayment = () => {
        setHasPaid(false)
        setCurrentPlan(null)
        localStorage.removeItem('gharbazaar_payment_status')
        localStorage.removeItem('gharbazaar_user_plan')
    }

    const hasFeature = (feature: string): boolean => {
        if (!currentPlan) return hasPaid // Fallback to old boolean check

        const featureValue = currentPlan.features[feature]
        if (typeof featureValue === 'boolean') return featureValue
        if (typeof featureValue === 'number') return featureValue > 0
        return false
    }

    const value = {
        hasPaid,
        currentPlan,
        setPaid,
        setPlan,
        clearPayment,
        hasFeature,
    }

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    )
}
