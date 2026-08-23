import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { CommuniqueFiller } from '@/components/CommuniqueFiller'

export const revalidate = 60

export default async function KioskPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'kiosk',
    sort: '-datePublication',
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Kiosk</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((k: any) => {
          const image = typeof k.image === 'object' ? k.image : null

          return (
            <Link key={k.id} href={`/kiosk/${k.slug}`}>
              <div className="group overflow-hidden rounded-2xl border border-card-foreground/10 bg-card text-card-foreground shadow transition hover:shadow-lg">
                <div className="relative h-40 w-full overflow-hidden">
                  {image?.url ? (
                    <div className="relative h-full w-full">
                      <img
                        src={image.url}
                        alt=""
                        className="absolute inset-0 h-full w-full scale-110 object-cover brightness-50 blur-md"
                      />
                      <img
                        src={image.url}
                        alt={k.titre}
                        className="relative h-full w-full object-contain object-center"
                      />
                    </div>
                  ) : (
                    <CommuniqueFiller type="document" />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold">{k.titre}</h2>
                  <p className="mt-1 text-sm text-card-foreground/70 line-clamp-2">
                    {k.descriptionCourte}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}