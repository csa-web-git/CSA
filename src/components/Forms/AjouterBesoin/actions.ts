// src/app/(frontend)/actions/ajouter-besoin.ts
'use server'

import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const Schema = z.object({
  titre: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(),
})

export type AjouterBesoinResult = { ok: true } | { ok: false; error: string }

export async function ajouterBesoin(formData: FormData): Promise<AjouterBesoinResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = Schema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'Formulaire invalide.' }
  if (parsed.data.website) return { ok: false, error: 'Formulaire invalide.' }

  const d = parsed.data
  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'soumissions',
      data: {
        type: 'ajout-besoin',
        statut: 'en-attente',
        donnees: {
          titre: d.titre,
          description: d.description ?? null,
        },
      },
    })
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'Enregistrement échoué.' }
  }
}