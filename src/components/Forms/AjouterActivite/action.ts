// src/app/(frontend)/actions/ajouter-activite.ts
'use server'

import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const Schema = z.object({
  titre: z.string().trim().min(1).max(200),
  date: z.string().trim().min(1).max(50),
  heureDebut: z.string().trim().min(1).max(20),
  heureFin: z.string().trim().min(1).max(20),
  lieu: z.string().trim().max(200).optional(),
  organisateurs: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(),
})

const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export type AjouterActiviteResult = { ok: true } | { ok: false; error: string }

export async function ajouterActivite(formData: FormData): Promise<AjouterActiviteResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = Schema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'Formulaire invalide.' }
  if (parsed.data.website) return { ok: false, error: 'Formulaire invalide.' }

  const d = parsed.data

  const file = formData.get('image')
  let imageFile: File | null = null
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { ok: false, error: "Format d'image non supporté (JPEG, PNG ou WebP uniquement)." }
    }
    if (file.size > MAX_SIZE) {
      return { ok: false, error: 'Image trop lourde (5 Mo maximum).' }
    }
    imageFile = file
  }

  try {
    const payload = await getPayload({ config })

    let imageId: string | number | null = null
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const uniqueName = `${Date.now()}-${imageFile.name}`
      const media = await payload.create({
        collection: 'media',
        data: { alt: `Photo proposée pour : ${d.titre}` },
        file: {
          data: buffer,
          mimetype: imageFile.type,
          name: uniqueName,
          size: imageFile.size,
        },
      })
      imageId = media.id
    }

    await payload.create({
      collection: 'soumissions',
      data: {
        type: 'ajout-activite',
        statut: 'en-attente',
        donnees: {
          titre: d.titre,
          date: d.date,
          heureDebut: d.heureDebut,
          heureFin: d.heureFin,
          lieu: d.lieu ?? null,
          organisateurs: d.organisateurs,
          description: d.description ?? null,
          image: imageId,
        },
      },
    })
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'Enregistrement échoué.' }
  }
}