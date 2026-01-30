'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Property } from '@/components/PropertyCard'

interface FavoritesContextType {
    favorites: Property[]
    addFavorite: (property: Property) => void
    removeFavorite: (id: string | number) => void
    toggleFavorite: (property: Property) => void
    isFavorite: (id: string | number | undefined) => boolean
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
            const propId = property._id || property.id
            if (prev.some(p => (p._id || p.id) === propId)) {
                return prev
            }
            return [...prev, { ...property, isFavorite: true }]
        })
    }

    const removeFavorite = (id: string | number) => {
        setFavorites(prev => prev.filter(p => (p._id || p.id) !== id))
    }

    const toggleFavorite = (property: Property) => {
        const propId = property._id || property.id
        if (isFavorite(propId)) {
            if (propId) removeFavorite(propId)
        } else {
            addFavorite(property)
        }
    }

    const isFavorite = (id: string | number | undefined) => {
        if (!id) return false
        return favorites.some(p => (p._id || p.id) === id)
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
