import { list, put, head } from '@vercel/blob'
import { NextResponse } from 'next/server'

const CANVAS_KEY = 'pixel/canvas.json'
const WIDTH = 128
const HEIGHT = 128
const DEFAULT_COLOR = '#ffffff'

// Initialise un canvas vide (tout blanc)
function emptyCanvas(): string[] {
  return Array(WIDTH * HEIGHT).fill(DEFAULT_COLOR)
}

export async function GET() {
  try {
    // Vérifie si le canvas existe déjà dans le blob
    const { blobs } = await list({ prefix: 'pixel/' })
    const exists = blobs.some((b) => b.pathname === CANVAS_KEY)

    if (!exists) {
      // Premier appel — crée le canvas vide
      const pixels = emptyCanvas()
      await put(CANVAS_KEY, JSON.stringify({ pixels }), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true
      })
      return NextResponse.json({ pixels })
    }

    // Lit le canvas existant
    const blob = blobs.find((b) => b.pathname === CANVAS_KEY)!
    const res = await fetch(blob.url, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur lecture canvas.' }, { status: 500 })
  }
}