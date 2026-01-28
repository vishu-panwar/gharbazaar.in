'use client'

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

    return (
        <div className="absolute inset-0 overflow-hidden">
            <div
                className={`absolute inset-0 bg-cover bg-center`}
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    filter: `brightness(${brightness})`,
                    backgroundPosition: position,
                    transformOrigin: topAnchored ? 'top' : 'center'
                }}
            />
            <div
                className="absolute inset-0 animate-glow-float mix-blend-screen pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 20%, ${glowColor}, transparent 60%)`
                }}
            />

            <style jsx>{`
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
