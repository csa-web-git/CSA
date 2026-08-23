'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export type BanderoleSlide = {
  id: string
  imageUrl: string
  imageAlt: string
  activiteSlug?: string | null
}

const INTERVAL_MS = 7000
const TRANSITION_MS = 500

// Slider pur — aucune décision de layout ici
function BanderoleSlider({ slides }: { slides: BanderoleSlide[] }) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
        setTransitioning(false)
      }, TRANSITION_MS)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null

  const slide = slides[current]

  const inner = (
    <div
      className="relative h-full w-full overflow-hidden bg-black"
      style={{
        opacity: transitioning ? 0 : 1,
        transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
      }}
    >
      <img
        src={slide.imageUrl}
        alt={slide.imageAlt}
        className="h-full w-full object-contain"
      />
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`block h-1 rounded-full transition-all duration-300 ${
                i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )

  return slide.activiteSlug ? (
    <Link href={`/programme/${slide.activiteSlug}`} className="block h-full w-full">
      {inner}
    </Link>
  ) : (
    <div className="h-full w-full">{inner}</div>
  )
}

// Export utilisé dans page.tsx — gère uniquement le rendu du slider,
// le placement mobile/desktop est géré directement dans page.tsx
export { BanderoleSlider }
export type { BanderoleSlide as BanderoleSlideType }