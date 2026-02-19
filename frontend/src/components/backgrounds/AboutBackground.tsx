'use client'

import InteractiveBackground from '../InteractiveBackground'

export default function AboutBackground() {
    return (
        <InteractiveBackground
            imageUrl="https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1600&q=80"
            brightness={0.55}
            glowColor="rgba(20,184,166,0.15)"
            position="right"
        />
    )
}
