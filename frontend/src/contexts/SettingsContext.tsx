'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface NotificationPreferences {
    push: boolean
    email: boolean
    sms: boolean
}

export interface UserSettings {
    id?: string
    userId?: string
    theme: 'light' | 'dark' | 'system'
    language: 'en' | 'hi' | 'mr'
    currency: 'INR' | 'USD'
    timezone: string
    emailFrequency: 'realtime' | 'daily' | 'weekly' | 'never'
    notificationPreferences: NotificationPreferences
    createdAt?: string
    updatedAt?: string
}

interface SettingsContextType {
    settings: UserSettings | null
    updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>
    isLoading: boolean
    error: string | null
    refreshSettings: () => Promise<void>
}

const defaultSettings: UserSettings = {
    theme: 'system',
    language: 'en',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    emailFrequency: 'realtime',
    notificationPreferences: {
        push: true,
        email: true,
        sms: false
    }
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider')
    }
    return context
}

interface SettingsProviderProps {
    children: ReactNode
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const [settings, setSettings] = useState<UserSettings | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSettings = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const token = localStorage.getItem('token')
            if (!token) {
                // Not logged in, use default settings
                setSettings(defaultSettings)
                setIsLoading(false)
                return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch settings')
            }

            const data = await response.json()
            if (data.success && data.data) {
                setSettings(data.data)
            } else {
                setSettings(defaultSettings)
            }
        } catch (err: any) {
            console.error('Error fetching settings:', err)
            setError(err.message)
            setSettings(defaultSettings) // Fallback to defaults
        } finally {
            setIsLoading(false)
        }
    }

    const updateSettings = async (newSettings: Partial<UserSettings>) => {
        try {
            setError(null)

            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Not authenticated')
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSettings)
            })

            if (!response.ok) {
                throw new Error('Failed to update settings')
            }

            const data = await response.json()
            if (data.success && data.data) {
                setSettings(data.data)
            }
        } catch (err: any) {
            console.error('Error updating settings:', err)
            setError(err.message)
            throw err
        }
    }

    const refreshSettings = async () => {
        await fetchSettings()
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    // Apply theme changes instantly
    useEffect(() => {
        if (!settings) return

        const root = document.documentElement
        if (settings.theme === 'dark') {
            root.classList.add('dark')
        } else if (settings.theme === 'light') {
            root.classList.remove('dark')
        } else {
            // System preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }
    }, [settings?.theme])

    const value: SettingsContextType = {
        settings,
        updateSettings,
        isLoading,
        error,
        refreshSettings
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}
