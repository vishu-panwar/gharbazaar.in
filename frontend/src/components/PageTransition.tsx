'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // No transitions - instant page swap for seamless navigation
    return <>{children}</>
}
