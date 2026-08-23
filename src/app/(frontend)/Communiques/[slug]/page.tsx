// src/app/(frontend)/communiques/[slug]/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 60

export default async function CommuniqueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'communiques',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const communique = docs[0] as any

  // Un lien externe n'a pas de page de détail : on ne sert que les documents ici
  if (!communique || communique.type !== 'document') {
    notFound()
  }

  const pdfMedia = typeof communique.document === 'object' ? communique.document : null
  if (!pdfMedia?.url) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/Communiques"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux communiqués
      </Link>
      <h1 className="mb-2 text-2xl font-bold">{communique.titre}</h1>
      <p className="mb-6 text-foreground/70">{communique.descriptionCourte}</p>

      <div className="overflow-hidden rounded-2xl border border-card-foreground/10 shadow">
        <iframe src={pdfMedia.url} title={communique.titre} className="h-[80vh] w-full" />
      </div>

      <a
        href={pdfMedia.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm font-semibold text-primary underline"
      >
        Ouvrir le PDF dans un nouvel onglet
      </a>
    </div>
  )
}