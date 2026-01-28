'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'

interface FilterOption {
    label: string
    value: string
}

interface AdvancedFiltersProps {
    onFilterChange: (filters: any) => void
    initialFilters?: any
}

export default function AdvancedFilters({ onFilterChange, initialFilters = {} }: AdvancedFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState(initialFilters)

    const propertyTypes: FilterOption[] = [
        { label: 'All Types', value: '' },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Villa', value: 'villa' },
        { label: 'Independent House', value: 'house' },
        { label: 'Plot/Land', value: 'plot' },
        { label: 'Commercial', value: 'commercial' },
    ]

    const bedroomOptions: FilterOption[] = [
        { label: 'Any', value: '' },
        { label: '1 BHK', value: '1' },
        { label: '2 BHK', value: '2' },
        { label: '3 BHK', value: '3' },
        { label: '4+ BHK', value: '4' },
    ]

    const furnishedOptions: FilterOption[] = [
        { label: 'Any', value: '' },
        { label: 'Furnished', value: 'furnished' },
        { label: 'Semi-Furnished', value: 'semi-furnished' },
        { label: 'Unfurnished', value: 'unfurnished' },
    ]

    const amenities = [
        'Parking',
        'Gym',
        'Swimming Pool',
        'Garden',
        'Security',
        'Power Backup',
        'Lift',
        'Club House',
    ]

    const handleFilterUpdate = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handleReset = () => {
        setFilters({})
        onFilterChange({})
    }

    const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length

    return (
        <div className="relative">
            {/* Filter Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
                <Filter size={18} />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                    </span>
                )}
                <ChevronDown
                    size={18}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Filter Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 p-6 max-w-4xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Advanced Filters</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Property Type */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Property Type
                            </label>
                            <select
                                value={filters.propertyType || ''}
                                onChange={(e) => handleFilterUpdate('propertyType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            >
                                {propertyTypes.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Bedrooms */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Bedrooms
                            </label>
                            <select
                                value={filters.bedrooms || ''}
                                onChange={(e) => handleFilterUpdate('bedrooms', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            >
                                {bedroomOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Bathrooms */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Bathrooms
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={filters.bathrooms || ''}
                                onChange={(e) => handleFilterUpdate('bathrooms', e.target.value)}
                                placeholder="Any"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Price Range */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Price Range (₹)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    value={filters.minPrice || ''}
                                    onChange={(e) => handleFilterUpdate('minPrice', e.target.value)}
                                    placeholder="Min Price"
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => handleFilterUpdate('maxPrice', e.target.value)}
                                    placeholder="Max Price"
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Area Range */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Area (sq.ft)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    value={filters.minArea || ''}
                                    onChange={(e) => handleFilterUpdate('minArea', e.target.value)}
                                    placeholder="Min Area"
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    value={filters.maxArea || ''}
                                    onChange={(e) => handleFilterUpdate('maxArea', e.target.value)}
                                    placeholder="Max Area"
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Furnished Status */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Furnished
                            </label>
                            <select
                                value={filters.furnished || ''}
                                onChange={(e) => handleFilterUpdate('furnished', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            >
                                {furnishedOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Amenities */}
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium mb-2">
                                Amenities
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {amenities.map(amenity => (
                                    <label
                                        key={amenity}
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.amenities?.includes(amenity) || false}
                                            onChange={(e) => {
                                                const current = filters.amenities || []
                                                const updated = e.target.checked
                                                    ? [...current, amenity]
                                                    : current.filter((a: string) => a !== amenity)
                                                handleFilterUpdate('amenities', updated)
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                        >
                            Reset All
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
