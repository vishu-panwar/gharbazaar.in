'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface InteractiveBackgroundProps {
    imageUrl?: string
    brightness?: number
    glowColor?: string
    topAnchored?: boolean
    position?: 'center' | 'left' | 'right'
}

export default function InteractiveBackground({
    imageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    brightness = 0.45,
    glowColor = 'rgba(0,255,136,0.35)',
    topAnchored = false,
    position = 'center'
}: InteractiveBackgroundProps) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 150 }
    const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig)
    const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig)
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window
            mouseX.set(e.clientX / innerWidth - 0.5)
            mouseY.set(e.clientY / innerHeight - 0.5)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    return (
        <div className="absolute inset-0 overflow-hidden perspective-1000 z-0">
            <motion.div
                className="absolute bg-cover bg-no-repeat"
                style={{
                    top: '-5%',
                    left: '-5%',
                    right: '-5%',
                    bottom: '-5%',
                    backgroundImage: `url(${imageUrl})`,
                    filter: `brightness(${brightness})`,
                    backgroundPosition: position === 'right' ? 'right center' : position === 'left' ? 'left center' : 'center',
                    transformOrigin: topAnchored ? 'top' : 'center',
                    x,
                    y,
                    rotateX,
                    rotateY,
                    scale: 1.1 
                }}
            />
            <div
                className="absolute inset-0 animate-glow-float mix-blend-screen pointer-events-none z-[1]"
                style={{
                    background: `radial-gradient(circle at 50% 20%, ${glowColor}, transparent 60%)`
                }}
            />

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes glow-float {
                    0% { background-position: 40% 30%; }
                    100% { background-position: 60% 50%; }
                }
                
                .animate-glow-float {
                    animation: glow-float 6s ease-in-out infinite alternate;
                }
            `}</style>
        </div>
    )
}
