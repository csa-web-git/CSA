// src/app/(frontend)/taches/[id]/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Equipe } from '@/payload-types'

export const dynamic = 'force-dynamic'

const LABELS: Record<string, string> = {
  'a-faire':  'À faire',
  'en-cours': 'En cours',
  'termine':  'Terminé',
  'bloque':   'Bloqué',
}

const STATUT_STYLES: Record<string, string> = {
  'a-faire':  'bg-accent/20 text-accent-foreground border border-accent/40',
  'en-cours': 'bg-blue-500/20 text-blue-200 border border-blue-400/40',
  'termine':  'bg-green-600/20 text-green-200 border border-green-500/40',
  'bloque':   'bg-red-500/20 text-red-200 border border-red-400/40',
}

export default async function TachePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payload = await getPayload({ config })

  let tache
  try {
    tache = await payload.findByID({
      collection: 'taches',
      id,
      depth: 1,
    })
  } catch {
    notFound()
  }

  if (!tache) notFound()

  const equipe = typeof tache.equipe === 'object' ? tache.equipe as Equipe : null
  const equipeSlug = equipe?.slug ?? String(equipe?.id)
  const statut = tache.statut as string

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 space-y-6">

      {/* Retour */}
      <Link
        href={`/equipes/${equipeSlug}`}
        className="inline-block px-4 py-2 text-sm font-medium transition-opacity rounded-full bg-header text-header-foreground"
      >
        ← Retour à l'équipe
      </Link>

      {/* Carte tâche */}
      <section className="rounded-md bg-card text-card-foreground px-8 py-8 shadow-md">
        <h1 className="text-2xl font-bold font-display text-center mb-8">
          {tache.titre as string}
        </h1>

        <dl className="space-y-4 text-sm">
          {/* Groupe */}
          <div className="flex gap-4 items-baseline">
            <dt className="w-28 shrink-0 opacity-60">Groupe</dt>
            <dd className="font-medium">{equipe?.nom ?? '—'}</dd>
          </div>

          {/* État */}
          <div className="flex gap-4 items-baseline">
            <dt className="w-28 shrink-0 opacity-60">État</dt>
            <dd>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUT_STYLES[statut] ?? ''}`}>
                {LABELS[statut] ?? statut}
              </span>
            </dd>
          </div>

          {/* Description */}
          {tache.description && (
            <div className="flex gap-4 items-baseline">
              <dt className="w-28 shrink-0 opacity-60">Description</dt>
              <dd className="leading-relaxed">{tache.description as string}</dd>
            </div>
          )}

          {/* Raison blocage */}
          {statut === 'bloque' && tache.raisonBlocage && (
            <div className="flex gap-4 items-baseline">
              <dt className="w-28 shrink-0 opacity-60">Blockage</dt>
              <dd className="leading-relaxed text-red-400">
                {tache.raisonBlocage as string}
              </dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  )
}