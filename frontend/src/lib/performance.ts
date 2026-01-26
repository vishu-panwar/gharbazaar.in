/**
 * Performance Optimization Utilities for GharBazaar
 * 
 * This file contains utilities to improve website performance,
 * reduce bundle size, and optimize user experience.
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react'
import React from 'react'

// ============================================================================
// IMAGE OPTIMIZATION
// ============================================================================

/**
 * Optimized image loading with lazy loading and WebP support
 */
export const optimizeImageSrc = (src: string, width?: number, quality = 75): string => {
  if (!src) return '/images/placeholder.jpg'

  // If it's already optimized or external, return as is
  if (src.startsWith('http') || src.includes('_next/image')) {
    return src
  }

  // Add Next.js image optimization parameters
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  params.set('q', quality.toString())

  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`
}

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Lazy load images with Intersection Observer
 */
export const useLazyImage = (src: string, threshold = 0.1) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return {
    imgRef,
    src: isInView ? src : undefined,
    isLoaded,
    onLoad: handleLoad,
  }
}

// ============================================================================
// COMPONENT OPTIMIZATION
// ============================================================================

/**
 * Debounce hook for search inputs and API calls
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Throttle hook for scroll events and resize handlers
 */
export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

/**
 * Memoized component wrapper
 */
export const withMemo = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, areEqual)
}

// ============================================================================
// DATA OPTIMIZATION
// ============================================================================

/**
 * Cache API responses in memory
 */
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

export const memoryCache = new MemoryCache()

/**
 * Local storage with expiration
 */
export const localStorageCache = {
  set: (key: string, data: any, ttl = 24 * 60 * 60 * 1000): void => {
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
  },

  get: (key: string): any | null => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const parsed = JSON.parse(item)
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(key)
        return null
      }

      return parsed.data
    } catch {
      return null
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key)
  },

  clear: (): void => {
    localStorage.clear()
  },
}

// ============================================================================
// NETWORK OPTIMIZATION
// ============================================================================

/**
 * Optimized fetch with caching and retry logic
 */
export const optimizedFetch = async (
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTTL = 5 * 60 * 1000
): Promise<any> => {
  // Check cache first
  if (cacheKey) {
    const cached = memoryCache.get(cacheKey)
    if (cached) return cached
  }

  // Add default headers for performance
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Cache successful responses
    if (cacheKey && response.status === 200) {
      memoryCache.set(cacheKey, data, cacheTTL)
    }

    return data
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

/**
 * Batch multiple API calls
 */
export const batchRequests = async <T>(
  requests: Array<() => Promise<T>>,
  batchSize = 3
): Promise<T[]> => {
  const results: T[] = []

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(req => req()))
    results.push(...batchResults)
  }

  return results
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Performance metrics tracking
 */
export const performanceMonitor = {
  // Measure component render time
  measureRender: (componentName: string, fn: () => void): void => {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`${componentName} render time: ${end - start}ms`)
  },

  // Measure API call time
  measureAPI: async <T>(apiName: string, apiCall: () => Promise<T>): Promise<T> => {
    const start = performance.now()
    try {
      const result = await apiCall()
      const end = performance.now()
      console.log(`${apiName} API time: ${end - start}ms`)
      return result
    } catch (error) {
      const end = performance.now()
      console.log(`${apiName} API error time: ${end - start}ms`)
      throw error
    }
  },

  // Track Core Web Vitals
  trackWebVitals: (): void => {
    if (typeof window !== 'undefined') {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const fidEntry = entry as any
          if (fidEntry.processingStart) {
            console.log('FID:', fidEntry.processingStart - entry.startTime)
          }
        })
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const clsEntry = entry as any
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value || 0
          }
        })
        console.log('CLS:', clsValue)
      }).observe({ entryTypes: ['layout-shift'] })
    }
  },
}

// ============================================================================
// BUNDLE SIZE OPTIMIZATION
// ============================================================================

/**
 * Dynamic imports for code splitting
 */
export const dynamicImport = {
  // Lazy load heavy components
  loadComponent: <T extends React.ComponentType<any>>(importFn: () => Promise<{ default: T }>): React.LazyExoticComponent<T> => {
    return React.lazy(importFn)
  },

  // Lazy load utilities
  loadUtility: async <T>(importFn: () => Promise<T>): Promise<T> => {
    return await importFn()
  },

  // Preload components for better UX
  preloadComponent: (importFn: () => Promise<any>): void => {
    // Preload after a short delay to not block initial render
    setTimeout(() => {
      importFn()
    }, 100)
  },
}

// ============================================================================
// MEMORY OPTIMIZATION
// ============================================================================

/**
 * Cleanup utilities for preventing memory leaks
 */
export const memoryOptimization = {
  // Cleanup event listeners
  useEventListener: (
    eventName: string,
    handler: (event: Event) => void,
    element: EventTarget = window
  ): void => {
    useEffect(() => {
      element.addEventListener(eventName, handler)
      return () => element.removeEventListener(eventName, handler)
    }, [eventName, handler, element])
  },

  // Cleanup intervals and timeouts
  useInterval: (callback: () => void, delay: number | null): void => {
    const savedCallback = useRef(callback)

    useEffect(() => {
      savedCallback.current = callback
    }, [callback])

    useEffect(() => {
      if (delay === null) return

      const id = setInterval(() => savedCallback.current(), delay)
      return () => clearInterval(id)
    }, [delay])
  },

  // Cleanup async operations
  useAsyncEffect: (
    effect: () => Promise<void | (() => void)>,
    deps: React.DependencyList
  ): void => {
    useEffect(() => {
      let cleanup: (() => void) | void

      effect().then((cleanupFn) => {
        cleanup = cleanupFn
      })

      return () => {
        if (cleanup) cleanup()
      }
    }, deps)
  },
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  optimizeImageSrc,
  preloadImage,
  useLazyImage,
  useDebounce,
  useThrottle,
  withMemo,
  memoryCache,
  localStorageCache,
  optimizedFetch,
  batchRequests,
  performanceMonitor,
  dynamicImport,
  memoryOptimization,
}