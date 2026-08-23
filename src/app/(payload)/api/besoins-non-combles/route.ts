// src/app/api/besoins-non-combles/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'besoins-materiels',
    where: { fait: { equals: false } },
    limit: 100,
  })

  return NextResponse.json({
    besoins: docs.map((d) => ({ id: d.id, titre: d.titre })),
  })
}