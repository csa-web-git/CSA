import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ActivitesMobile } from './pageMobile'
import { ActivitesDesktop } from './pageDesktop'

export const dynamic = 'force-dynamic'

export default async function ActivitesPage() {
  // récupération Payload
  const payload = await getPayload({ config })

  const [{ docs: activitesCSA }, { docs: activitesPonctuelles }] = await Promise.all([
    payload.find({
      collection: 'activites-recurrentes',
      limit: 100,
      depth: 1,
    }),

    payload.find({
      collection: 'activites',
      where: {
        and: [
          {
            date: {
              greater_than_equal: new Date().toISOString(),
            },
          },
          {
            afficherActivitePonctuelle: {
              equals: true,
            },
          },
        ],
      },
      sort: 'date',
      limit: 20,
    }),
  ])

  return (
    <>
      <div className="hidden md:block">
        <ActivitesDesktop
          activitesCSA={activitesCSA}
          activitesPonctuelles={activitesPonctuelles}
        />
      </div>

      <div className="md:hidden">
        <ActivitesMobile
          activitesCSA={activitesCSA}
          activitesPonctuelles={activitesPonctuelles}
        />
      </div>
    </>
  )
}