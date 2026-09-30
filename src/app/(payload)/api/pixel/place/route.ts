// src/app/api/pixel/place/route.ts
import { list, put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const CANVAS_KEY = 'pixel/canvas.json'
const WIDTH = 128
const HEIGHT = 128

const Schema = z.object({
  x: z.number().int().min(0).max(WIDTH - 1),
  y: z.number().int().min(0).max(HEIGHT - 1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  lastRecharge: z.number(), // timestamp de la dernière recharge côté client
  reserve: z.number().int().min(0), // réserve actuelle déclarée par le client
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
  }

  const { x, y, color, lastRecharge, reserve } = parsed.data

  // Lit la config
  const payload = await getPayload({ config })
  const p = await payload.findGlobal({ slug: 'parametres-pixel' })
  const rechargeMs = (p.rechargeMinutes ?? 1) * 60 * 1000
  const reserveMax = p.reserveMax ?? 10

  // Calcule la réserve réelle côté serveur
  const now = Date.now()
  const pixelsRecharged = Math.floor((now - lastRecharge) / rechargeMs)
  const trueReserve = Math.min(reserveMax, reserve + pixelsRecharged)

  if (trueReserve <= 0) {
    const nextRecharge = lastRecharge + (Math.floor(reserve === 0 ? 1 : 0) + 1 - reserve % 1) * rechargeMs
    const remainingMs = Math.max(0, nextRecharge - now)
    return NextResponse.json(
      { error: `Plus de pixels disponibles.`, remainingMs },
      { status: 429 },
    )
  }

  try {
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

    pixels[y * WIDTH + x] = color

    await put(CANVAS_KEY, JSON.stringify({ pixels }), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    return NextResponse.json({ ok: true, timestamp: now })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur écriture canvas.' }, { status: 500 })
  }
}