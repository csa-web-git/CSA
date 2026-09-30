'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { CountdownTimer } from '@/components/pixel/CountdownTimer'
import { PixelArchives } from '@/components/pixel/PixelArchives'

const WIDTH = 128
const HEIGHT = 128
const PIXEL_SIZE = 4
const STORAGE_KEY_RESERVE = 'pixel-reserve'
const STORAGE_KEY_LAST_RECHARGE = 'pixel-last-recharge'

const PALETTE = [
  '#000000', '#ffffff', '#ff0000', '#00cc00',
  '#0000ff', '#ffff00', '#ff6600', '#ff00ff',
  '#00ffff', '#8b4513', '#808080', '#c0c0c0',
  '#006400', '#00008b', '#8b0000', '#ffa500',
]

function getNextMonday(): number {
  const now = new Date()
  const day = now.getUTCDay()
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  const next = new Date(now)
  next.setUTCDate(now.getUTCDate() + daysUntilMonday)
  next.setUTCHours(0, 0, 0, 0)
  return next.getTime()
}

export default function PixelPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pixels, setPixels] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState('#000000')

  // Config depuis l'admin
  const [rechargeMs, setRechargeMs] = useState(60 * 1000)
  const [reserveMax, setReserveMax] = useState(10)

  // Réserve locale
  const [reserve, setReserve] = useState(10)
  const [lastRecharge, setLastRecharge] = useState(Date.now())
  const [nextRechargeMs, setNextRechargeMs] = useState(0)

  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [flash, setFlash] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null)

  // Charge la config
  useEffect(() => {
    fetch('/api/pixel/config')
      .then((r) => r.json())
      .then((data) => {
        setRechargeMs((data.rechargeMinutes ?? 1) * 60 * 1000)
        setReserveMax(data.reserveMax ?? 10)
      })
      .catch(() => {})
  }, [])

  // Initialise la réserve depuis localStorage
  useEffect(() => {
    if (reserveMax === 10 && rechargeMs === 60 * 1000) return // config pas encore chargée
    const storedReserve = Number(localStorage.getItem(STORAGE_KEY_RESERVE) ?? reserveMax)
    const storedLastRecharge = Number(localStorage.getItem(STORAGE_KEY_LAST_RECHARGE) ?? Date.now())

    // Calcule les pixels rechargés depuis la dernière visite
    const now = Date.now()
    const pixelsRecharged = Math.floor((now - storedLastRecharge) / rechargeMs)
    const newReserve = Math.min(reserveMax, storedReserve + pixelsRecharged)

    // Recalcule le timestamp de la dernière recharge effective
    const newLastRecharge = storedLastRecharge + pixelsRecharged * rechargeMs

    setReserve(newReserve)
    setLastRecharge(newLastRecharge)
    localStorage.setItem(STORAGE_KEY_RESERVE, String(newReserve))
    localStorage.setItem(STORAGE_KEY_LAST_RECHARGE, String(newLastRecharge))
  }, [reserveMax, rechargeMs])

  // Recharge automatique toutes les rechargeMs
  useEffect(() => {
    if (rechargeMs === 0) return
    const interval = setInterval(() => {
      const now = Date.now()
      setReserve((prev) => {
        if (prev >= reserveMax) return prev
        const newReserve = Math.min(reserveMax, prev + 1)
        localStorage.setItem(STORAGE_KEY_RESERVE, String(newReserve))
        return newReserve
      })
      setLastRecharge(now)
      localStorage.setItem(STORAGE_KEY_LAST_RECHARGE, String(now))
    }, rechargeMs)
    return () => clearInterval(interval)
  }, [rechargeMs, reserveMax])

  // Calcule le timer jusqu'à la prochaine recharge
  useEffect(() => {
    const update = () => {
      if (reserve >= reserveMax) {
        setNextRechargeMs(0)
        return
      }
      const elapsed = Date.now() - lastRecharge
      const remaining = Math.max(0, rechargeMs - elapsed)
      setNextRechargeMs(remaining)
    }
    update()
    const interval = setInterval(update, 500)
    return () => clearInterval(interval)
  }, [reserve, reserveMax, lastRecharge, rechargeMs])

  // Charge le canvas
  useEffect(() => {
    fetch('/api/pixel/canvas')
      .then((r) => r.json())
      .then((data) => {
        setPixels(data.pixels)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Dessine pixels + grille
  useEffect(() => {
    if (!canvasRef.current || pixels.length === 0) return
    const ctx = canvasRef.current.getContext('2d')!

    for (let i = 0; i < pixels.length; i++) {
      const x = (i % WIDTH) * PIXEL_SIZE
      const y = Math.floor(i / WIDTH) * PIXEL_SIZE
      ctx.fillStyle = pixels[i]
      ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE)
    }

    if (PIXEL_SIZE >= 4) {
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'
      ctx.lineWidth = 0.5
      for (let x = 0; x <= WIDTH; x++) {
        ctx.beginPath()
        ctx.moveTo(x * PIXEL_SIZE, 0)
        ctx.lineTo(x * PIXEL_SIZE, HEIGHT * PIXEL_SIZE)
        ctx.stroke()
      }
      for (let y = 0; y <= HEIGHT; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * PIXEL_SIZE)
        ctx.lineTo(WIDTH * PIXEL_SIZE, y * PIXEL_SIZE)
        ctx.stroke()
      }
    }
  }, [pixels])

  const getPixelCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect()
      const scaleX = (WIDTH * PIXEL_SIZE) / rect.width
      const scaleY = (HEIGHT * PIXEL_SIZE) / rect.height
      const x = Math.floor(((e.clientX - rect.left) * scaleX) / PIXEL_SIZE)
      const y = Math.floor(((e.clientY - rect.top) * scaleY) / PIXEL_SIZE)
      return { x, y }
    },
    [],
  )

  const handleCanvasClick = useCallback(
    async (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (reserve <= 0 || placing) return

      const { x, y } = getPixelCoords(e)
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return

      setPlacing(true)
      setError(null)

      const res = await fetch('/api/pixel/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          x, y,
          color: selectedColor,
          lastRecharge,
          reserve,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        const newReserve = reserve - 1
        setReserve(newReserve)
        localStorage.setItem(STORAGE_KEY_RESERVE, String(newReserve))
        setPixels((prev) => {
          const next = [...prev]
          next[y * WIDTH + x] = selectedColor
          return next
        })
        setFlash(true)
        setTimeout(() => setFlash(false), 300)
      } else {
        setError(data.error ?? 'Erreur.')
      }

      setPlacing(false)
    },
    [reserve, placing, selectedColor, lastRecharge, getPixelCoords],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getPixelCoords(e)
      if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
        setHovered({ x, y })
      }
    },
    [getPixelCoords],
  )

  const filledCount = pixels.filter((p) => p !== '#ffffff').length

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 space-y-6">
      <div className="rounded-md bg-card text-card-foreground px-6 py-6 shadow-md">
        <h1 className="text-2xl font-bold font-display mb-1">Canvas participatif</h1>
        <p className="text-sm opacity-70 mb-6">
          Vous avez une réserve de {reserveMax} pixels, rechargée d'1 pixel
          toutes les {rechargeMs / 60000} minute{rechargeMs / 60000 > 1 ? 's' : ''}.
          Le canvas se remet à zéro chaque lundi.
        </p>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Canvas — gauche */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-64 opacity-50 rounded border border-card-foreground/20">
                Chargement du canvas…
              </div>
            ) : (
              <>
                <div className="overflow-auto rounded border border-card-foreground/20 w-full">
                  <canvas
                    ref={canvasRef}
                    width={WIDTH * PIXEL_SIZE}
                    height={HEIGHT * PIXEL_SIZE}
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHovered(null)}
                    className="block"
                    style={{
                      cursor: reserve <= 0 ? 'not-allowed' : placing ? 'wait' : 'crosshair',
                      imageRendering: 'pixelated',
                      width: '100%',
                      height: 'auto',
                      opacity: flash ? 0.75 : 1,
                      transition: 'opacity 0.15s ease',
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  {hovered ? (
                    <p className="text-xs font-mono opacity-40">
                      x: {hovered.x}, y: {hovered.y}
                    </p>
                  ) : <span />}
                  <p className="text-xs opacity-40">
                    {filledCount} / {WIDTH * HEIGHT} pixels placés
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Contrôles — droite */}
          <div className="lg:w-52 flex flex-col gap-5 shrink-0">

            {/* Réserve */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">
                Réserve de pixels
              </p>
              {/* Barre de progression */}
              <div className="flex gap-1 flex-wrap mb-2">
                {Array.from({ length: reserveMax }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-sm transition-all"
                    style={{
                      backgroundColor: i < reserve ? selectedColor : 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold">
                {reserve} / {reserveMax} pixels
              </p>
              {reserve < reserveMax && nextRechargeMs > 0 && (
                <p className="text-xs opacity-60 mt-0.5">
                  +1 dans{' '}
                  <span className="font-mono">
                    {String(Math.floor(nextRechargeMs / 60000)).padStart(2, '0')}:
                    {String(Math.ceil((nextRechargeMs % 60000) / 1000)).padStart(2, '0')}
                  </span>
                </p>
              )}
              {reserve <= 0 && (
                <p className="text-xs text-red-400 mt-0.5">Réserve vide — patientez</p>
              )}
              {reserve >= reserveMax && (
                <p className="text-xs text-green-400 mt-0.5">Réserve pleine ✓</p>
              )}
            </div>

            {/* Préview couleur */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">
                Couleur sélectionnée
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-md border-2 border-card-foreground/30 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-sm font-mono opacity-70">{selectedColor}</span>
              </div>
            </div>

            {/* Palette */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">
                Palette
              </p>
              <div className="flex flex-wrap gap-2">
                {PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="h-8 w-8 rounded-full transition-all hover:scale-125"
                    style={{
                      backgroundColor: color,
                      boxShadow: selectedColor === color
                        ? `0 0 0 3px white, 0 0 0 5px ${color}`
                        : '0 1px 3px rgba(0,0,0,0.3)',
                      transform: selectedColor === color ? 'scale(1.15)' : undefined,
                    }}
                    title={color}
                  />
                ))}
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-full border-2 border-card-foreground/20"
                  title="Couleur personnalisée"
                />
              </div>
            </div>

            {/* Timer reset canvas */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">
                Reset canvas
              </p>
              <CountdownTimer
                label=""
                targetMs={getNextMonday()}
                className="flex items-center gap-1 text-sm opacity-70"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <p className="text-xs opacity-40 mt-auto">
              {WIDTH}×{HEIGHT} pixels · Reset chaque lundi
            </p>
          </div>
        </div>
      </div>

      {/* Archives */}
      <div className="rounded-md bg-card text-card-foreground px-6 py-6 shadow-md">
        <h2 className="text-lg font-bold font-display mb-4">Canvas précédents</h2>
        <PixelArchives />
      </div>
    </div>
  )
}