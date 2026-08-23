import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function EquipesPage() {
  const payload = await getPayload({ config })
  const { docs: equipes } = await payload.find({
    collection: 'equipes',
    limit: 50,
    sort: 'ordre',
  })

  return (
    <section className="mx-auto w-full max-w-6xl rounded-md bg-card text-card-foreground px-8 py-8 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold font-display">
        Comment sommes-nous organisés ?
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {equipes.map((e) => {
          const slug = (e as { slug?: string }).slug ?? String(e.id)

          const imgObj = (e as { image?: Media }).image

          // --- ZONE OPTIMISÉE GRÂCE À MEDIA.TS ---
          let imgUrl: string | null = null
          let imgAlt = ''

          if (typeof imgObj === 'object' && imgObj !== null) {
            imgAlt = imgObj.alt ?? ''

            const sizes = imgObj.sizes as Record<string, { url?: string }> | undefined
            imgUrl = sizes?.square?.url ?? imgObj.url ?? null
          }
          // ----------------------------------------

          return (
            <Link
              key={e.id}
              href={`/equipes/${slug}`}
              className="flex flex-col items-center text-center rounded-md p-3 hover:bg-background/10 transition-colors group"
            >
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent/30 shadow-inner">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={imgAlt || (e.nom as string)}
                    width={56} // plus petit que 80 — laisse de l'espace
                    height={56}
                    className="object-contain transition-transform group-hover:scale-105"
                    sizes="56px"
                  />
                ) : (
                  <span className="text-xl font-bold opacity-40">
                    {(e.nom as string)?.charAt(0)}
                  </span>
                )}
              </div>

              <h3 className="mt-4 font-semibold group-hover:text-accent transition-colors">
                {e.nom as string}
              </h3>
              <p className="mt-2 text-xs leading-relaxed opacity-90">
                {(e as { descriptionCourte?: string }).descriptionCourte ?? ''}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
