"use client"

import React from 'react'

interface Props {
  open: boolean
  title?: string
  description?: string
  onInstall: () => void
  onClose: () => void
}

export default function PWAInstallModal({ open, title = 'Install GharBazaar', description = 'Install the app to your device for a faster, app-like experience.', onInstall, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>

        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Dismiss</button>
          <button onClick={onInstall} className="px-4 py-2 rounded-lg bg-emerald-500 text-white">Install</button>
        </div>
      </div>
    </div>
  )
}
