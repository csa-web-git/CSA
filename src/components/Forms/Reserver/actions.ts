'use server'

import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const Schema = z.object({
  organisation: z.string().trim().min(1).max(200),
  dateArrivee: z.string().trim().min(1).max(50),
  dateSortie: z.string().trim().min(1).max(50),
  privePublic: z.string().trim().min(1).max(200),
  nombre: z.coerce.number().int().min(1).max(1000),
  salle: z.string().trim().max(200).optional(),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot
})

export type ReservationResult = { ok: true } | { ok: false; error: string }

export async function reserverSalle(formData: FormData): Promise<ReservationResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = Schema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: 'Formulaire invalide.' }
  }

  const d = parsed.data

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'soumissions',
      data: {
        type: 'reservation-salle',
        statut: 'en-attente',
        donnees: {
          organisation: d.organisation,
          dateArrivee: d.dateArrivee,
          dateSortie: d.dateSortie,
          privePublic: d.privePublic,
          nombre: d.nombre,
          salle: d.salle ?? null,
          message: d.message ?? null,
        },
      },
    })
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'Enregistrement échoué.' }
  }
}