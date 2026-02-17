// API hooks for Seller Dashboard

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

interface Property {
    id: string
    title: string
    location: string
    price: number
    propertyType: string
    area: string
    bedrooms?: number
    bathrooms?: number
    photos: string[]
    status: string
    verified: boolean
    views?: number
    inquiries?: number
}

interface Contract {
    id: string
    propertyId: string
    buyerId: string
    sellerId: string
    agreedPrice: number
    status: string
    createdAt: string
}

interface SellerAnalytics {
    totalListings: number
    activeListings: number
    totalViews: number
    totalInquiries: number
    revenue: string
}

export const useSellerProperties = () => {
    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('token')
                if (!token) {
                    setProperties([])
                    setIsLoading(false)
                    return
                }

                const response = await fetch(`${API_URL}/api/v1/properties?ownerId=me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch properties')
                }

                const data = await response.json()
                if (data.success) {
                    setProperties(data.data || [])
                }
            } catch (err: any) {
                console.error('Error fetching seller properties:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProperties()
    }, [])

    return { properties, isLoading, error }
}

export const useSellerContracts = () => {
    const [contracts, setContracts] = useState<Contract[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('token')
                if (!token) {
                    setContracts([])
                    setIsLoading(false)
                    return
                }

                const response = await fetch(`${API_URL}/api/v1/contracts?role=seller`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch contracts')
                }

                const data = await response.json()
                if (data.success) {
                    setContracts(data.data || [])
                }
            } catch (err: any) {
                console.error('Error fetching contracts:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchContracts()
    }, [])

    return { contracts, isLoading, error }
}

export const useSellerAnalytics = () => {
    const [analytics, setAnalytics] = useState<SellerAnalytics | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('token')
                if (!token) {
                    setAnalytics(null)
                    setIsLoading(false)
                    return
                }

                const response = await fetch(`${API_URL}/api/v1/analytics/seller`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch analytics')
                }

                const data = await response.json()
                if (data.success) {
                    setAnalytics(data.data)
                }
            } catch (err: any) {
                console.error('Error fetching analytics:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    return { analytics, isLoading, error }
}
