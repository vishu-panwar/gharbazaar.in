'use client'

import InteractiveBackground from '../InteractiveBackground'

export default function FounderBackground() {
    return (
        <InteractiveBackground
            imageUrl="/hero-founder.jpeg"
            brightness={0.55}
            glowColor="rgba(20,184,166,0.15)"
            topAnchored={true}
            position="right"
        />
    )
}
