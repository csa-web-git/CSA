import { getPayload } from 'payload'
import config from '@payload-config'
import type { Activite, Category } from '@/payload-types'
import { getWeekRange, toISODate } from './week'

/**
 * Récupère les activités d'une semaine donnée (lundi -> dimanche).
 * Appelé depuis un Server Component — pas de HTTP interne.
 */
export async function getActivitesForWeek(weekISO: string | undefined): Promise<{
  activites: Activite[]
  categories: Category[]
}> {
  const payload = await getPayload({ config })
  const ref = weekISO ? new Date(weekISO) : new Date()
  const range = getWeekRange(ref)

  const [activitesRes, categoriesRes] = await Promise.all([
    payload.find({
      collection: 'activites',
      where: {
        and: [
          { date: { greater_than_equal: toISODate(range.monday) } },
          { date: { less_than_equal: toISODate(range.days[6]) } },
        ],
      },
      depth: 2, // peuple categorie + image
      limit: 200,
      sort: 'date',
    }),
    payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'ordre',
    }),
  ])

  return {
    activites: activitesRes.docs as Activite[],
    categories: categoriesRes.docs as Category[],
  }
}

export async function getActiviteBySlug(slug: string): Promise<Activite | null> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'activites',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return (res.docs[0] as Activite) ?? null
}
