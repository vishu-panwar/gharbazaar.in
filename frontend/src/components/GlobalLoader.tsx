'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import Loader from '@/components/ui/Loader'

interface LoaderContextType {
  showLoader: (message?: string, duration?: number) => void
  hideLoader: () => void
  isVisible: boolean
}

const LoaderContext = createContext<LoaderContextType>({} as LoaderContextType)

export const useLoader = () => {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider')
  }
  return context
}

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('Loading...')
  const [duration, setDuration] = useState(2000)

  const showLoader = (msg?: string, dur?: number) => {
    setMessage(msg || 'Loading...')
    setDuration(dur || 2000)
    setIsVisible(true)
  }

  const hideLoader = () => {
    setIsVisible(false)
  }

  const value = {
    showLoader,
    hideLoader,
    isVisible
  }

  return (
    <LoaderContext.Provider value={value}>
      <Loader 
        isVisible={isVisible}
        message={message}
        duration={duration}
        onComplete={hideLoader}
      />
      {children}
    </LoaderContext.Provider>
  )
}