'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const usePageLoader = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const navigateWithLoader = (path: string, message?: string) => {
    setIsLoading(true)
    
    // Show loader for smooth transition
    setTimeout(() => {
      router.push(path)
      
      // Hide loader after navigation
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }, 100)
  }

  return {
    isLoading,
    navigateWithLoader,
    setIsLoading
  }
}