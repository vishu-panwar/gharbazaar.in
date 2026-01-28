'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Store, CheckCircle } from 'lucide-react'

interface ModeChangeToastProps {
  mode: 'buyer' | 'seller'
  show: boolean
}

export default function ModeChangeToast({ mode, show }: ModeChangeToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`flex items-center space-x-3 px-6 py-3 rounded-lg shadow-2xl ${
        mode === 'buyer' 
          ? 'bg-blue-600 text-white' 
          : 'bg-green-600 text-white'
      }`}>
        {mode === 'buyer' ? (
          <ShoppingCart size={20} />
        ) : (
          <Store size={20} />
        )}
        <span className="font-semibold">
          Switched to {mode === 'buyer' ? 'Buyer' : 'Seller'} Mode
        </span>
        <CheckCircle size={20} />
      </div>
    </div>
  )
}
