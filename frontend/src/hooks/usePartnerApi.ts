// API hooks for Partner portal

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

interface PartnerStats {
    totalReferrals: number
    activeLeads: number
    convertedLeads: number
    totalEarnings: number
    thisMonthEarnings: number
    lastMonthEarnings: number
    pendingPayments: number
    conversionRate: number
    avgResponseTime: string
    partnerRank: number
    totalPartners: number
}

interface Lead {
    id: string
    customerName: string
    type: 'buyer' | 'seller'
    propertyType: string
    location: string
    status: string
    expectedCommission: number
    submittedAt: string
}

export const usePartnerStats = () => {
    const [stats, setStats] = useState<PartnerStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('token')

                const response = await fetch(`${API_URL}/api/v1/partners/dashboard`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch partner stats')
                }

                const data = await response.json()
                if (data.success) {
                    setStats(data.data)
                }
            } catch (err: any) {
                console.error('Error fetching partner stats:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    return { stats, isLoading, error }
}

export const usePartnerLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('token')

                const response = await fetch(`${API_URL}/api/v1/partners/leads`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch partner leads')
                }

                const data = await response.json()
                if (data.success) {
                    setLeads(data.data || [])
                }
            } catch (err: any) {
                console.error('Error fetching partner leads:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeads()
    }, [])

    return { leads, isLoading, error }
}
