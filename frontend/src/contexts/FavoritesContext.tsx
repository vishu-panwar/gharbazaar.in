'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Property } from '@/components/PropertyCard'

interface FavoritesContextType {
    favorites: Property[]
    addFavorite: (property: Property) => void
    removeFavorite: (id: number) => void
    toggleFavorite: (property: Property) => void
    isFavorite: (id: number) => boolean
    clearAllFavorites: () => void
    getFavoritesCount: () => number
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
    const [favorites, setFavorites] = useState<Property[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load favorites from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('gharbazaar_favorites')
        if (stored) {
            try {
                setFavorites(JSON.parse(stored))
            } catch (error) {
                console.error('Error loading favorites:', error)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('gharbazaar_favorites', JSON.stringify(favorites))
        }
    }, [favorites, isLoaded])

    const addFavorite = (property: Property) => {
        setFavorites(prev => {
            // Check if already exists
            if (prev.some(p => p.id === property.id)) {
                return prev
            }
            return [...prev, { ...property, isFavorite: true }]
        })
    }

    const removeFavorite = (id: number) => {
        setFavorites(prev => prev.filter(p => p.id !== id))
    }

    const toggleFavorite = (property: Property) => {
        if (isFavorite(property.id)) {
            removeFavorite(property.id)
        } else {
            addFavorite(property)
        }
    }

    const isFavorite = (id: number) => {
        return favorites.some(p => p.id === id)
    }

    const clearAllFavorites = () => {
        setFavorites([])
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
            getFavoritesCount
        }}>
            {children}
        </FavoritesContext.Provider>
    )
}
