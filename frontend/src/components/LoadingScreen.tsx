'use client'

import Loader from '@/components/ui/Loader'

export default function LoadingScreen() {
  return (
    <Loader 
      isVisible={true} 
      message="Preparing your GharBazaar experience..."
      duration={3000}
    />
  )
}