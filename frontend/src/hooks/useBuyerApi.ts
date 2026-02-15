// API hooks for Buyer Dashboard

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
    sellerId: string
}

interface Bid {
    id: string
    propertyId: string
    buyerId: string
    bidAmount: number
    status: string
    createdAt: string
    property?: Property
}

interface BuyerProfile {
    propertiesViewed: number
    savedProperties: number
    budget: string
    preferredCities: string[]
    preferredTypes: string[]
}

export const useProperties = (params?: { limit?: number; featured?: boolean }) => {
    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setIsLoading(true)
                const query = new URLSearchParams()
                if (params?.limit) query.append('limit', params.limit.toString())
                if (params?.featured) query.append('featured', 'true')

                const response = await fetch(`${API_URL}/api/v1/properties?${query.toString()}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch properties')
                }

                const data = await response.json()
                if (data.success) {
                    setProperties(data.data || [])
                }
            } catch (err: any) {
                console.error('Error fetching properties:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProperties()
    }, [params?.limit, params?.featured])

    return { properties, isLoading, error }
}

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('token')
                if (!token) {
                    setFavorites([])
                    setIsLoading(false)
                    return
                }

                const response = await fetch(`${API_URL}/api/v1/favorites`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch favorites')
                }

                const data = await response.json()
                if (data.success) {
                    setFavorites(data.data || [])
                }
            } catch (err: any) {
                console.error('Error fetching favorites:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFavorites()
    }, [])

    return { favorites, isLoading, error }
}

export const useBuyerBids = () => {
    const [bids, setBids] = useState<Bid[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBids = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('token')
                if (!token) {
                    setBids([])
                    setIsLoading(false)
                    return
                }

                const response = await fetch(`${API_URL}/api/v1/bids?role=buyer`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch bids')
                }

                const data = await response.json()
                if (data.success) {
                    setBids(data.data || [])
                }
            } catch (err: any) {
                console.error('Error fetching bids:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBids()
    }, [])

    return { bids, isLoading, error }
}

export const useBuyerProfile = () => {
    const [profile, setProfile] = useState<BuyerProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('token')
                if (!token) {
                    setProfile(null)
                    setIsLoading(false)
                    return
                }

                const response = await fetch(`${API_URL}/api/v1/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch profile')
                }

                const data = await response.json()
                if (data.success && data.data?.buyerProfile) {
                    setProfile(data.data.buyerProfile)
                }
            } catch (err: any) {
                console.error('Error fetching profile:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])

    return { profile, isLoading, error }
}
