// src/app/(frontend)/actions/envoyer-suggestion.ts
'use server'

import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const Schema = z.object({
  content: z.string().trim().min(1).max(2000),
  website: z.string().max(0).optional(),
})

export type SuggestionResult = { ok: true } | { ok: false; error: string }

export async function envoyerSuggestion(formData: FormData): Promise<SuggestionResult> {
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
        type: 'suggestion-site',
        statut: 'en-attente',
        donnees: {
          content: d.content,
        },
      },
    })
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'Enregistrement échoué.' }
  }
}