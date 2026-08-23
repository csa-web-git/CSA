import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'pixel/archive/' })

    const archives = blobs
      .map((b) => ({
        date: b.pathname.replace('pixel/archive/', '').replace('.json', ''),
        url: b.url,
      }))
      .sort((a, b) => b.date.localeCompare(a.date)) // plus récent en premier

    return NextResponse.json({ archives })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur lecture archives.' }, { status: 500 })
  }
}