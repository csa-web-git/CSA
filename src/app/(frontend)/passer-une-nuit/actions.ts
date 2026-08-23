'use server'

import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const Schema = z.object({
  pseudo: z.string().trim().min(1).max(100),
  dateArrivee: z.string().trim().min(1).max(50),
  durée: z.coerce.number().int().min(1).max(3),
  nombre: z.coerce.number().int().min(1).max(50),
  mixite: z.string().trim().min(1).max(200),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot
})

export type NuitResult = { ok: true } | { ok: false; error: string }

export async function passerUneNuit(formData: FormData): Promise<NuitResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = Schema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'Formulaire invalide.' }

  const d = parsed.data

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'soumissions',
      data: {
        type: 'passer-nuit',
        statut: 'en-attente',
        donnees: {
          pseudo: d.pseudo,
          dateArrivee: d.dateArrivee,
          duree: d.durée,
          nombre: d.nombre,
          mixite: d.mixite,
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