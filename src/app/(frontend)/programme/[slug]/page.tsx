import { getActiviteBySlug } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Category, Media } from '@/payload-types'
import { getMonday, toISODate } from '@/lib/week'

type Params = { slug: string }

function formatHeure(dateString: string) {
  return new Date(dateString).toLocaleTimeString('fr-BE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const a = await getActiviteBySlug(slug)
  if (!a) return { title: 'Activité introuvable' }
  return {
    title: `${a.titre} — Programme`,
    description: a.descriptionCourte ?? undefined,
    openGraph: {
      title: a.titre,
      description: a.descriptionCourte ?? undefined,
      images: typeof a.image === 'object' && a.image !== null ? [(a.image as Media).url ?? ''] : [],
    },
  }
}

export default async function ProgrammePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const a = await getActiviteBySlug(slug)
  if (!a) notFound()

  const cat =
    typeof a.categorie === 'object' && a.categorie !== null ? (a.categorie as Category) : null
  const img = typeof a.image === 'object' && a.image !== null ? (a.image as Media) : null

  const date = new Date(a.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const weekParam = toISODate(getMonday(new Date(a.date)))

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 space-y-6">
      <Link
        href={`/programme?week=${weekParam}`}
        className="inline-block px-4 py-2 text-sm font-medium transition-opacity rounded-full bg-header text-header-foreground"
      >
        ← Retour au planning
      </Link>

      <article className="rounded-md bg-card text-card-foreground px-8 py-8 shadow-md">
        <header>
          {cat && (
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: cat.couleur }}
            >
              {cat.nom}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-bold">{a.titre}</h1>
          <p className="mt-2 text-sm opacity-70 capitalize">
            {date} — {formatHeure(a.heureDebut)} — {formatHeure(a.heureFin)} - {a.lieu}
          </p>
        </header>

        {img?.url && (
          <div className="mt-6 w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src={img.url}
              alt={img.alt ?? a.titre}
              width={img.width ?? 1200} 
              height={img.height ?? 675} 
              className="h-auto w-full object-scale-down" 
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {a.descriptionCourte && (
          <p className="mt-6 text-lg leading-relaxed">{a.descriptionCourte}</p>
        )}

        {a.descriptionLongue && (
          <div className="prose prose-neutral mt-6 max-w-none">
            <RichText data={a.descriptionLongue as any} />
          </div>
        )}

        
        {a.organisateurs && (
          <footer className="mt-10 border-t border-card-foreground/20 pt-6 text-sm">
            <p>
              <strong>Organisateurs :</strong> {a.organisateurs}
            </p>
          </footer>
        )}
      </article>
    </div>
  )
}
