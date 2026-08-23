// src/app/(frontend)/actions/confirmer-besoin.ts
'use server'

import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const Schema = z.object({
  besoinId: z.string().trim().min(1),
  pseudo: z.string().trim().min(1).max(100),
  website: z.string().max(0).optional(),
})

export type ConfirmerBesoinResult = { ok: true } | { ok: false; error: string }

export async function confirmerBesoin(formData: FormData): Promise<ConfirmerBesoinResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = Schema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'Formulaire invalide.' }
  if (parsed.data.website) return { ok: false, error: 'Formulaire invalide.' }

  const d = parsed.data
  try {
    const payload = await getPayload({ config })

    // Récupère le titre du besoin pour le contexte de la soumission
    const besoin = await payload.findByID({
      collection: 'besoins-materiels',
      id: d.besoinId,
    })

    await payload.create({
      collection: 'soumissions',
      data: {
        type: 'confirmation-besoin',
        statut: 'en-attente',
        donnees: {
          besoinId: d.besoinId,
          besoinTitre: besoin?.titre ?? 'Inconnu',
          pseudo: d.pseudo,
        },
      },
    })
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'Enregistrement échoué.' }
  }
}