'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SellerSubscriptionContextType {
    currentPlan: 'none' | 'basic-seller' | 'premium-seller' | 'pro-seller'
    listingsRemaining: number // -1 means unlimited
    listingsUsed: number
    expiryDate: Date | null
    setSubscription: (planId: string) => void
    useListingSlot: () => boolean
    canAddListing: () => boolean
    clearSubscription: () => void
}

const SellerSubscriptionContext = createContext<SellerSubscriptionContextType | undefined>(undefined)

export const useSellerSubscription = () => {
    const context = useContext(SellerSubscriptionContext)
    if (context === undefined) {
        throw new Error('useSellerSubscription must be used within a SellerSubscriptionProvider')
    }
    return context
}

// Plan configurations
const PLAN_CONFIG = {
    'basic-seller': { listings: 3, durationMonths: 1 },
    'premium-seller': { listings: 10, durationMonths: 3 },
    'pro-seller': { listings: -1, durationMonths: 6 }, // -1 = unlimited
}

export const SellerSubscriptionProvider = ({ children }: { children: ReactNode }) => {
    const [currentPlan, setCurrentPlan] = useState<'none' | 'basic-seller' | 'premium-seller' | 'pro-seller'>('none')
    const [listingsRemaining, setListingsRemaining] = useState<number>(0)
    const [listingsUsed, setListingsUsed] = useState<number>(0)
    const [expiryDate, setExpiryDate] = useState<Date | null>(null)

    // Load subscription from localStorage on mount
    useEffect(() => {
        const savedSubscription = localStorage.getItem('sellerSubscription')
        if (savedSubscription) {
            try {
                const parsed = JSON.parse(savedSubscription)
                const expiry = parsed.expiryDate ? new Date(parsed.expiryDate) : null

                // Check if subscription is expired
                if (expiry && expiry > new Date()) {
                    setCurrentPlan(parsed.currentPlan)
                    setListingsRemaining(parsed.listingsRemaining)
                    setListingsUsed(parsed.listingsUsed)
                    setExpiryDate(expiry)
                } else {
                    // Expired - clear subscription
                    localStorage.removeItem('sellerSubscription')
                }
            } catch (error) {
                console.error('Error loading seller subscription:', error)
            }
        }
    }, [])

    // Save subscription to localStorage when it changes
    const saveSubscription = (plan: string, remaining: number, used: number, expiry: Date | null) => {
        const subscriptionData = {
            currentPlan: plan,
            listingsRemaining: remaining,
            listingsUsed: used,
            expiryDate: expiry?.toISOString() || null
        }
        localStorage.setItem('sellerSubscription', JSON.stringify(subscriptionData))
    }

    const setSubscription = (planId: string) => {
        const config = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG]
        if (!config) return

        const expiry = new Date()
        expiry.setMonth(expiry.getMonth() + config.durationMonths)

        setCurrentPlan(planId as 'basic-seller' | 'premium-seller' | 'pro-seller')
        setListingsRemaining(config.listings)
        setListingsUsed(0)
        setExpiryDate(expiry)
        saveSubscription(planId, config.listings, 0, expiry)
    }

    const useListingSlot = (): boolean => {
        // Unlimited plan
        if (listingsRemaining === -1) {
            setListingsUsed(prev => {
                const newUsed = prev + 1
                saveSubscription(currentPlan, -1, newUsed, expiryDate)
                return newUsed
            })
            return true
        }

        // Check if slots available
        if (listingsRemaining > 0) {
            setListingsRemaining(prev => {
                const newRemaining = prev - 1
                setListingsUsed(used => {
                    const newUsed = used + 1
                    saveSubscription(currentPlan, newRemaining, newUsed, expiryDate)
                    return newUsed
                })
                return newRemaining
            })
            return true
        }

        return false
    }

    const canAddListing = (): boolean => {
        // No subscription
        if (currentPlan === 'none') return false

        // Check expiry
        if (expiryDate && expiryDate < new Date()) return false

        // Unlimited plan
        if (listingsRemaining === -1) return true

        // Check remaining slots
        return listingsRemaining > 0
    }

    const clearSubscription = () => {
        setCurrentPlan('none')
        setListingsRemaining(0)
        setListingsUsed(0)
        setExpiryDate(null)
        localStorage.removeItem('sellerSubscription')
    }

    return (
        <SellerSubscriptionContext.Provider value={{
            currentPlan,
            listingsRemaining,
            listingsUsed,
            expiryDate,
            setSubscription,
            useListingSlot,
            canAddListing,
            clearSubscription
        }}>
            {children}
        </SellerSubscriptionContext.Provider>
    )
}
