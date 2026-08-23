import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'
import { getMonday, toISODate } from '@/lib/week'

type Params = {
  slug: string
}

function formatHeure(dateString: string) {
  return new Date(dateString).toLocaleTimeString('fr-BE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'activites-recurrentes',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
  })

  const activite = docs[0]

  if (!activite) {
    return {
      title: 'Activité introuvable',
    }
  }

  return {
    title: activite.titre,
    description: activite.descriptionCourte ?? undefined,
  }
}

export default async function ActiviteRecurrentePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'activites-recurrentes',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
  })

  const activite = docs[0]

  if (!activite) {
    notFound()
  }

  const aujourdHuiIso = toISODate(new Date())

  // 1. Récupérer les séances à venir (futures)
  const { docs: occurencesFutures } = await payload.find({
    collection: 'activites',
    where: {
      and: [
        {
          activiteRecurrente: {
            equals: activite.id,
          },
        },
        {
          date: {
            greater_than_equal: aujourdHuiIso,
          },
        },
      ],
    },
    sort: 'date', // De la plus proche à la plus lointaine
    limit: 20,
  })

  // 2. Récupérer les séances passées
  const { docs: occurencesPassees } = await payload.find({
    collection: 'activites',
    where: {
      and: [
        {
          activiteRecurrente: {
            equals: activite.id,
          },
        },
        {
          date: {
            less_than: aujourdHuiIso,
          },
        },
      ],
    },
    sort: '-date', // De la plus récente passée à la plus ancienne
    limit: 20,
  })

  const image = typeof activite.miniAffiche === 'object' ? (activite.miniAffiche as Media) : null

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/activites"
        className="mb-6 inline-block rounded-full bg-header px-4 py-2 text-sm text-header-foreground"
      >
        ← Retour aux activités
      </Link>

      <article className="rounded-md bg-card px-8 py-8 text-card-foreground shadow-md">
        {image?.url && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-md">
            <Image
              src={image.url}
              alt={image.alt ?? activite.titre}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h1 className="mb-4 text-4xl font-bold">{activite.titre}</h1>

        {activite.descriptionCourte && (
          <p className="mb-6 text-lg opacity-80">{activite.descriptionCourte}</p>
        )}

        {activite.descriptionLongue && (
          <div className="prose max-w-none">
            {typeof activite.descriptionLongue === 'object' ? (
              <RichText data={activite.descriptionLongue as any} />
            ) : (
              <p>{activite.descriptionLongue}</p>
            )}
          </div>
        )}

        {/* SECTION : SÉANCES À VENIR */}
        <section className="mt-10 border-t pt-6">
          <h2 className="mb-4 text-2xl font-semibold">Prochaines séances</h2>

          {occurencesFutures.length === 0 ? (
            <p className="text-muted-foreground italic">Aucune séance planifiée.</p>
          ) : (
            <ul className="space-y-2">
              {occurencesFutures.map((occ: any) => {
                const weekParam = toISODate(getMonday(new Date(occ.date)))

                return (
                  <li key={occ.id}>
                    <Link
                      href={`/programme?week=${weekParam}`}
                      className="block rounded border p-3 hover:opacity-80"
                    >
                      <strong>{new Date(occ.date).toLocaleDateString('fr-BE')}</strong>
                      {' — '}
                      {formatHeure(occ.heureDebut)}
                      {occ.heureFin && ` → ${formatHeure(occ.heureFin)}`}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* SECTION : SÉANCES PASSÉES */}
        <section className="mt-10 border-t pt-6">
          <h2 className="mb-4 text-2xl font-semibold">Séances passées</h2>

          {occurencesPassees.length === 0 ? (
            <p className="text-muted-foreground italic">Aucune séance passée.</p>
          ) : (
            <ul className="space-y-2">
              {occurencesPassees.map((occ: any) => {
                const weekParam = toISODate(getMonday(new Date(occ.date)))

                return (
                  <li key={occ.id}>
                    <Link
                      href={`/programme?week=${weekParam}`}
                      className="block rounded border p-3 opacity-60 hover:opacity-100"
                    >
                      <strong>{new Date(occ.date).toLocaleDateString('fr-BE')}</strong>
                      {' — '}
                      {formatHeure(occ.heureDebut)}
                      {occ.heureFin && ` → ${formatHeure(occ.heureFin)}`}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </article>
    </main>
  )
}