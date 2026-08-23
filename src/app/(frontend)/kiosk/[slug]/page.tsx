import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 60

export default async function KioskDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'kiosk',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const kiosk = docs[0] as any
  if (!kiosk) {
    notFound()
  }

  const pdfMedia = typeof kiosk.document === 'object' ? kiosk.document : null
  if (!pdfMedia?.url) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/kiosk"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au Kiosk
      </Link>

      <h1 className="mb-2 text-2xl font-bold">{kiosk.titre}</h1>
      <p className="mb-6 text-foreground/70">{kiosk.descriptionCourte}</p>

      <div className="overflow-hidden rounded-2xl border border-card-foreground/10 shadow">
        <iframe src={pdfMedia.url} title={kiosk.titre} className="h-[80vh] w-full" />
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