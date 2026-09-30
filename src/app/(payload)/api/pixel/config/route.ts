// src/app/api/pixel/config/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  const payload = await getPayload({ config })
  const p = await payload.findGlobal({ slug: 'parametres-pixel' })
  return NextResponse.json({
    rechargeMinutes: p.rechargeMinutes ?? 1,
    reserveMax: p.reserveMax ?? 10,
  })
}