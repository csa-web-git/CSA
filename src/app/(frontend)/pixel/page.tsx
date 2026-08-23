'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { CountdownTimer } from '@/components/pixel/CountdownTimer'
import { PixelArchives } from '@/components/pixel/PixelArchives'

const WIDTH = 128
const HEIGHT = 128
const PIXEL_SIZE = 4 // taille d'affichage de chaque pixel en px
const COOLDOWN_MS = 5 * 60 * 1000
const STORAGE_KEY = 'pixel-last-placed'

const PALETTE = [
    '#000000', '#ffffff', '#ff0000', '#00cc00',
    '#0000ff', '#ffff00', '#ff6600', '#ff00ff',
    '#00ffff', '#8b4513', '#808080', '#c0c0c0',
    '#006400', '#00008b', '#8b0000', '#ffa500',
]

export default function PixelPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [pixels, setPixels] = useState<string[]>([])
    const [selectedColor, setSelectedColor] = useState('#000000')
    const [cooldownRemaining, setCooldownRemaining] = useState(0)
    const [loading, setLoading] = useState(true)
    const [placing, setPlacing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Calcul du prochain lundi UTC
    function getNextMonday(): number {
        const now = new Date()
        const day = now.getUTCDay()
        const daysUntilMonday = day === 0 ? 1 : 8 - day
        const next = new Date(now)
        next.setUTCDate(now.getUTCDate() + daysUntilMonday)
        next.setUTCHours(0, 0, 0, 0)
        return next.getTime()
    }

    // Charge le canvas au montage
    useEffect(() => {
        fetch('/api/pixel/canvas')
            .then((r) => r.json())
            .then((data) => {
                setPixels(data.pixels)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    // Calcule le cooldown restant
    useEffect(() => {
        const update = () => {
            const last = Number(localStorage.getItem(STORAGE_KEY) ?? 0)
            const remaining = Math.max(0, COOLDOWN_MS - (Date.now() - last))
            setCooldownRemaining(remaining)
        }
        update()
        const interval = setInterval(update, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!canvasRef.current || pixels.length === 0) return
        const ctx = canvasRef.current.getContext('2d')!

        // Pixels
        for (let i = 0; i < pixels.length; i++) {
            const x = (i % WIDTH) * PIXEL_SIZE
            const y = Math.floor(i / WIDTH) * PIXEL_SIZE
            ctx.fillStyle = pixels[i]
            ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE)
        }

        // Grille — seulement si PIXEL_SIZE >= 4
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

    const handleCanvasClick = useCallback(
        async (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (cooldownRemaining > 0 || placing) return

            const rect = canvasRef.current!.getBoundingClientRect()
            const scaleX = (WIDTH * PIXEL_SIZE) / rect.width
            const scaleY = (HEIGHT * PIXEL_SIZE) / rect.height
            const x = Math.floor(((e.clientX - rect.left) * scaleX) / PIXEL_SIZE)
            const y = Math.floor(((e.clientY - rect.top) * scaleY) / PIXEL_SIZE)

            if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return

            const lastPlaced = Number(localStorage.getItem(STORAGE_KEY) ?? 0)

            setPlacing(true)
            setError(null)

            const res = await fetch('/api/pixel/place', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ x, y, color: selectedColor, lastPlaced }),
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem(STORAGE_KEY, String(data.timestamp))
                setCooldownRemaining(COOLDOWN_MS)
                // Met à jour le pixel localement sans recharger tout
                setPixels((prev) => {
                    const next = [...prev]
                    next[y * WIDTH + x] = selectedColor
                    return next
                })
            } else {
                setError(data.error ?? 'Erreur.')
            }

            setPlacing(false)
        },
        [cooldownRemaining, placing, selectedColor],
    )

    const formatCooldown = (ms: number) => {
        const s = Math.ceil(ms / 1000)
        const m = Math.floor(s / 60)
        const sec = s % 60
        return m > 0 ? `${m}m${sec}s` : `${sec}s`
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-8 space-y-6">
            <div className="rounded-md bg-card text-card-foreground px-6 py-6 shadow-md">
                <h1 className="text-2xl font-bold font-display mb-1">Canvas participatif</h1>
                <p className="text-sm opacity-70 mb-4">
                    Cliquez sur un pixel pour y placer votre couleur. Un pixel toutes les 5 minutes.
                    Le canvas se remet à zéro chaque lundi.
                </p>

                {/* Palette de couleurs */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {PALETTE.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className="h-7 w-7 rounded border-2 transition-transform hover:scale-110"
                            style={{
                                backgroundColor: color,
                                borderColor: selectedColor === color ? 'white' : 'transparent',
                                outline: selectedColor === color ? '2px solid #888' : 'none',
                            }}
                            title={color}
                        />
                    ))}
                    {/* Color picker libre */}
                    <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="h-7 w-7 cursor-pointer rounded border-2 border-transparent"
                        title="Couleur personnalisée"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-4 text-sm">
                    {cooldownRemaining > 0 ? (
                        <CountdownTimer
                            label="Prochain pixel"
                            targetMs={Date.now() + cooldownRemaining}
                            onExpire={() => setCooldownRemaining(0)}
                            className="flex items-center gap-1 text-red-400"
                        />
                    ) : (
                        <span className="text-green-400 font-medium text-sm">
                            ✓ Vous pouvez placer un pixel
                        </span>
                    )}

                    <CountdownTimer
                        label="Reset canvas"
                        targetMs={getNextMonday()}
                        className="flex items-center gap-1 opacity-70"
                    />
                </div>

                {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

                {/* Canvas */}
                {loading ? (
                    <div className="flex items-center justify-center h-64 opacity-50">
                        Chargement du canvas…
                    </div>
                ) : (
                    <div className="overflow-auto rounded border border-card-foreground/20 w-full">
                        <canvas
                            ref={canvasRef}
                            width={WIDTH * PIXEL_SIZE}
                            height={HEIGHT * PIXEL_SIZE}
                            onClick={handleCanvasClick}
                            className="block"
                            style={{
                                cursor: cooldownRemaining > 0 ? 'not-allowed' : 'crosshair',
                                imageRendering: 'pixelated',
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </div>
                )}

                {/* archive */}
                <div className="rounded-md bg-card text-card-foreground px-6 py-6 shadow-md">
                    <h2 className="text-lg font-bold font-display mb-4">Canvas précédents</h2>
                    <PixelArchives />
                </div>

                <p className="mt-3 text-xs opacity-50 text-right">
                    {WIDTH}×{HEIGHT} pixels
                </p>
            </div>
        </div>
    )
}