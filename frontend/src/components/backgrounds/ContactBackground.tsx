'use client'

import InteractiveBackground from '../InteractiveBackground'

export default function ContactBackground() {
    return (
        <InteractiveBackground
            imageUrl="/images/hero-contact-v5.png"
            brightness={0.55}
            glowColor="rgba(20,184,166,0.08)"
            topAnchored={true}
        />
    )
}
