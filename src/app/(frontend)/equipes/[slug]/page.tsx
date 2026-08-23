import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { KanbanBoard } from '@/components/KanbanBoard'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function EquipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs: equipes } = await payload.find({
    collection: 'equipes',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const equipe = equipes[0]
  if (!equipe) notFound()

  const { docs: taches } = await payload.find({
    collection: 'taches',
    where: { equipe: { equals: equipe.id } },
    limit: 200,
    depth: 0,
  })

  const imgObj = equipe.image as Media | null
  const imgUrl = typeof imgObj === 'object' && imgObj !== null ? imgObj.url ?? null : null
  const imgAlt = typeof imgObj === 'object' && imgObj !== null ? imgObj.alt ?? '' : ''

  const tachesFormatees = taches.map((t) => ({
    id: t.id,
    titre: t.titre as string,
    statut: t.statut as string,
  }))

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">

      {/* Header équipe */}
      <section className="rounded-md bg-card text-card-foreground px-8 py-6 shadow-md">
        <div className="flex flex-wrap items-center gap-6">

          {/* Image */}
          {imgUrl && (
            <div className="relative h-20 w-20 shrink-0 rounded-full bg-accent/30 shadow-inner">
              <Image
                src={imgUrl}
                alt={imgAlt}
                width={56}
                height={56}
                className="absolute inset-0 m-auto object-contain"
              />
            </div>
          )}

          {/* Nom + description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold font-display">{equipe.nom}</h1>
            {equipe.descriptionCourte && (
              <p className="mt-1 text-sm opacity-80">{equipe.descriptionCourte}</p>
            )}
          </div>

          {/* Infos sidebar */}
          <div className="text-sm space-y-1 opacity-80 text-right shrink-0">
            {equipe.membres != null && equipe.membres > 0 && (
              <p>Nombre de membres : <strong>{equipe.membres}</strong></p>
            )}
            {equipe.referent && (
              <p>Personne de contact : <strong>{equipe.referent}</strong></p>
            )}
          </div>
        </div>
      </section>

      {/* Kanban */}
      <section className="rounded-md bg-card text-card-foreground px-6 py-6 shadow-md">
        <KanbanBoard taches={tachesFormatees} equipeSlug={slug} />
      </section>

      {/* Retour */}
      <Link
        href="/equipes"
        className="inline-block px-4 py-2 text-sm font-medium transition-opacity rounded-full bg-header text-header-foreground"
      >
        ← Retour aux équipes
      </Link>
    </div>
  )
}