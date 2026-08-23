'use client'

import { useEffect, useRef, useState } from 'react'

const WIDTH = 128
const HEIGHT = 128
const PIXEL_SIZE = 2 // plus petit pour les miniatures

type Archive = { date: string; url: string }

function ArchiveCanvas({ url, date }: { url: string; date: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(url, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!canvasRef.current) return
        const ctx = canvasRef.current.getContext('2d')!
        for (let i = 0; i < data.pixels.length; i++) {
          const x = (i % WIDTH) * PIXEL_SIZE
          const y = Math.floor(i / WIDTH) * PIXEL_SIZE
          ctx.fillStyle = data.pixels[i]
          ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE)
        }
        setLoaded(true)
      })
  }, [url])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="overflow-hidden rounded border border-card-foreground/20">
        <canvas
          ref={canvasRef}
          width={WIDTH * PIXEL_SIZE}
          height={HEIGHT * PIXEL_SIZE}
          style={{ imageRendering: 'pixelated', display: 'block' }}
        />
      </div>
      <span className="text-xs opacity-60">
        Semaine du {new Date(date).toLocaleDateString('fr-BE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </span>
    </div>
  )
}

export function PixelArchives() {
  const [archives, setArchives] = useState<Archive[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pixel/archives')
      .then((r) => r.json())
      .then((data) => {
        setArchives(data.archives ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <p className="text-sm opacity-50 text-center py-4">Chargement des archives…</p>
  )

  if (archives.length === 0) return (
    <p className="text-sm opacity-50 text-center py-4">
      Aucun canvas archivé pour le moment. Le premier apparaîtra après le prochain reset.
    </p>
  )

  return (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {archives.map((a) => (
        <ArchiveCanvas key={a.date} url={a.url} date={a.date} />
      ))}
    </div>
  )
}