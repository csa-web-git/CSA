import { put, list } from '@vercel/blob'
import { NextResponse } from 'next/server'

const CANVAS_KEY = 'pixel/canvas.json'
const WIDTH = 128
const HEIGHT = 128

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  }

  try {
    // 1. Lit le canvas actuel
    const { blobs } = await list({ prefix: 'pixel/' })
    const current = blobs.find((b) => b.pathname === CANVAS_KEY)

    if (current) {
      // 2. Archive le canvas actuel avec la date du lundi
      const dateStr = new Date().toISOString().slice(0, 10)
      const res = await fetch(current.url, { cache: 'no-store' })
      const data = await res.json()

      await put(`pixel/archive/${dateStr}.json`, JSON.stringify(data), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true
      })
    }

    // 3. Recrée un canvas vide
    const pixels = Array(WIDTH * HEIGHT).fill('#ffffff')
    await put(CANVAS_KEY, JSON.stringify({ pixels }), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true
    })

    return NextResponse.json({ ok: true, reset: new Date().toISOString() })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur reset.' }, { status: 500 })
  }
}