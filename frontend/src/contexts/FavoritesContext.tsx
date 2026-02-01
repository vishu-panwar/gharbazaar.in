'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Property } from '@/components/PropertyCard'
import { backendApi } from '@/lib/backendApi'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface FavoritesContextType {
    favorites: Property[]
    addFavorite: (property: Property) => void
    removeFavorite: (id: string | number) => void
    toggleFavorite: (property: Property) => void
    isFavorite: (id: string | number | undefined) => boolean
    clearAllFavorites: () => void
    getFavoritesCount: () => number
    loading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function useFavorites() {
    const context = useContext(FavoritesContext)
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider')
    }
    return context
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [favorites, setFavorites] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)

    // Initial Load
    useEffect(() => {
        const loadInitialFavorites = async () => {
            setLoading(true)
            
            // 1. Try to load from backend if user is logged in
            if (user) {
                try {
                    const response = await backendApi.favorites.get()
                    if (response.success) {
                        const dbFavorites = response.properties || []
                        
                        // 2. Sync with localStorage if it's the first time
                        const stored = localStorage.getItem('gharbazaar_favorites')
                        if (stored) {
                            const localFavorites = JSON.parse(stored)
                            if (localFavorites.length > 0) {
                                const localIds = localFavorites.map((p: any) => p._id || p.id)
                                // Trigger sync in background
                                const syncResponse = await backendApi.favorites.sync(localIds)
                                if (syncResponse.success) {
                                    setFavorites(syncResponse.properties || [])
                                    localStorage.removeItem('gharbazaar_favorites')
                                } else {
                                    setFavorites(dbFavorites)
                                }
                            } else {
                                setFavorites(dbFavorites)
                            }
                        } else {
                            setFavorites(dbFavorites)
                        }
                    }
                } catch (error) {
                    console.error('Error loading backend favorites:', error)
                }
            } else {
                // 3. Fallback to localStorage for guest users
                const stored = localStorage.getItem('gharbazaar_favorites')
                if (stored) {
                    try {
                        setFavorites(JSON.parse(stored))
                    } catch (error) {
                        console.error('Error loading local favorites:', error)
                    }
                }
            }
            
            setIsLoaded(true)
            setLoading(false)
        }

        loadInitialFavorites()
    }, [user])

    // Save favorites to localStorage whenever they change (ONLY for guest users now)
    useEffect(() => {
        if (isLoaded && !user) {
            localStorage.setItem('gharbazaar_favorites', JSON.stringify(favorites))
        }
    }, [favorites, isLoaded, user])

    const toggleFavorite = async (property: Property) => {
        const propId = property._id || property.id
        if (!propId) return;

        // Optimistic UI update
        const alreadyFavorite = isFavorite(propId)
        if (alreadyFavorite) {
            setFavorites(prev => prev.filter(p => (p._id || p.id) !== propId))
        } else {
            setFavorites(prev => [...prev, { ...property, isFavorite: true }])
        }

        // Backend Sync
        if (user) {
            try {
                const response = await backendApi.favorites.toggle(propId.toString())
                if (!response.success) {
                    toast.error('Failed to update favorites')
                    // Rollback if failed
                    if (alreadyFavorite) {
                        setFavorites(prev => [...prev, property])
                    } else {
                        setFavorites(prev => prev.filter(p => (p._id || p.id) !== propId))
                    }
                }
            } catch (error) {
                console.error('Error toggling favorite on backend:', error)
                toast.error('Connection error')
            }
        }
    }

    const addFavorite = (property: Property) => {
        if (!isFavorite(property._id || property.id)) {
            toggleFavorite(property)
        }
    }

    const removeFavorite = (id: string | number) => {
        const property = favorites.find(p => (p._id || p.id) === id)
        if (property && isFavorite(id)) {
            toggleFavorite(property)
        }
    }

    const isFavorite = (id: string | number | undefined) => {
        if (!id) return false
        return favorites.some(p => (p._id || p.id) === id)
    }

    const clearAllFavorites = () => {
        setFavorites([])
        // Backend clear not implemented yet, so we just clear local state
    }

    const getFavoritesCount = () => {
        return favorites.length
    }

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addFavorite,
            removeFavorite,
            toggleFavorite,
            isFavorite,
            clearAllFavorites,
            getFavoritesCount,
            loading
        }}>
            {children}
        </FavoritesContext.Provider>
    )
}
