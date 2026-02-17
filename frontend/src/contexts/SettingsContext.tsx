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

            const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
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
                // If unauthorized, use defaults
                if (response.status === 401) {
                    setSettings(defaultSettings)
                    setIsLoading(false)
                    return
                }
                throw new Error('Failed to fetch settings')
            }

            const data = await response.json()
            if (data.success && data.data) {
                setSettings(data.data)
                
                // Sync with localStorage for backward compatibility
                localStorage.setItem('user_settings', JSON.stringify(data.data))
                
                // Sync theme with next-themes
                if (data.data.theme && typeof window !== 'undefined') {
                    localStorage.setItem('theme', data.data.theme)
                }
                
                // Sync language with LocaleContext (triggers i18next)
                if (data.data.language && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('languageChange', { detail: data.data.language }))
                }
                
                // Sync currency with LocaleContext
                if (data.data.currency && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('currencyChange', { detail: data.data.currency }))
                }
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

            const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
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
                
                // Sync with localStorage
                localStorage.setItem('user_settings', JSON.stringify(data.data))
                
                // Sync theme with next-themes
                if (newSettings.theme && typeof window !== 'undefined') {
                    localStorage.setItem('theme', newSettings.theme)
                    // Trigger next-themes to re-read the theme
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: 'theme',
                        newValue: newSettings.theme,
                        storageArea: localStorage
                    }))
                }
                
                // Apply language change to i18next if language was updated
                if (newSettings.language && typeof window !== 'undefined') {
                    // Dispatch custom event for language change
                    window.dispatchEvent(new CustomEvent('languageChange', { detail: newSettings.language }))
                }
                
                // Apply currency change to LocaleContext if currency was updated
                if (newSettings.currency && typeof window !== 'undefined') {
                    // Dispatch custom event for currency change
                    window.dispatchEvent(new CustomEvent('currencyChange', { detail: newSettings.currency }))
                }
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

    // Initial fetch on mount
    useEffect(() => {
        fetchSettings()
    }, [])

    // Listen for authentication changes
    useEffect(() => {
        const handleAuthChange = () => {
            console.log('🔄 Auth state changed, refetching settings...')
            fetchSettings()
        }

        // Listen for custom auth events
        window.addEventListener('authStateChanged', handleAuthChange)
        
        // Also listen for storage changes (when token is set/removed)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_token' || e.key === 'token') {
                fetchSettings()
            }
        }
        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('authStateChanged', handleAuthChange)
            window.removeEventListener('storage', handleStorageChange)
        }
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
