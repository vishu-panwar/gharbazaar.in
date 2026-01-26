'use client'

import { useEffect, useRef } from 'react'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  className?: string
}

export default function QRCodeGenerator({ value, size = 200, className = '' }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return

    // Simple QR code generation using canvas
    // In production, you'd use a proper QR code library like 'qrcode'
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    // Set canvas size
    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    // Generate a simple pattern (placeholder for real QR code)
    // This is just a visual placeholder - in production use a real QR library
    const moduleSize = size / 25
    ctx.fillStyle = '#000000'

    // Create a simple pattern that looks like a QR code
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // Create a pseudo-random pattern based on the value
        const hash = value.charCodeAt((i * 25 + j) % value.length)
        if ((hash + i + j) % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    // Add corner squares (typical QR code feature)
    const cornerSize = moduleSize * 7
    
    // Top-left corner
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, cornerSize, cornerSize)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(moduleSize, moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize)
    ctx.fillStyle = '#000000'
    ctx.fillRect(2 * moduleSize, 2 * moduleSize, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize)

    // Top-right corner
    ctx.fillStyle = '#000000'
    ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(size - cornerSize + moduleSize, moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize)
    ctx.fillStyle = '#000000'
    ctx.fillRect(size - cornerSize + 2 * moduleSize, 2 * moduleSize, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize)

    // Bottom-left corner
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(moduleSize, size - cornerSize + moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize)
    ctx.fillStyle = '#000000'
    ctx.fillRect(2 * moduleSize, size - cornerSize + 2 * moduleSize, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize)

  }, [value, size])

  return (
    <div className={`inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg"
        style={{ width: size, height: size }}
      />
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">
          Note: This is a visual placeholder. 
        </p>
        <p className="text-xs text-gray-400">
          Use the "Copy UPI Link" button for actual payment.
        </p>
      </div>
    </div>
  )
}