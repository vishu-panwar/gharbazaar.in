'use client'

import InteractiveBackground from '../InteractiveBackground'

export default function ContactBackground() {
    return (
        <InteractiveBackground
            imageUrl="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80"
            brightness={0.55}
            glowColor="rgba(20,184,166,0.15)"
            topAnchored={true}
            position="right"
        />
    )
}
