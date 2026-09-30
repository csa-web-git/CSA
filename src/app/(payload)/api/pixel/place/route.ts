import { list, put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const CANVAS_KEY = 'pixel/canvas.json'
const WIDTH = 128
const HEIGHT = 128
const COOLDOWN_MS = 5 * 60 * 1000 // 5 minutes

const Schema = z.object({
  x: z.number().int().min(0).max(WIDTH - 1),
  y: z.number().int().min(0).max(HEIGHT - 1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  lastPlaced: z.number().optional(), // timestamp depuis le client
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données de pixel invalides.' }, { status: 400 })
    }

    const { x, y, color } = parsed.data

    // 1. Charger le canvas depuis Vercel Blob
    const { blobs } = await list({ prefix: 'pixel/' })
    const blob = blobs.find((b) => b.pathname === CANVAS_KEY)

    let pixels: string[]
    if (!blob) {
      pixels = Array(WIDTH * HEIGHT).fill('#ffffff')
    } else {
      const res = await fetch(blob.url, { cache: 'no-store' })
      const data = await res.json()
      pixels = data.pixels
    }

    // 2. Mettre à jour le pixel cliqué
    const index = y * WIDTH + x
    pixels[index] = color

    // 3. Réécrire le canvas mis à jour sur Vercel Blob
    await put(CANVAS_KEY, JSON.stringify({ pixels }), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    return NextResponse.json({
      ok: true,
      timestamp: Date.now(),
    })
  } catch (e: any) {
    console.error('Erreur lors du placement du pixel:', e)
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde du canvas.' }, { status: 500 })
  }
}