import { getPayload } from 'payload'
import config from '@payload-config'
import { ProgrammeClient } from './ProgrammeClient'
import {
  getMonday,
  getWeekRange,
  getMonthRange,
  fromISODate,
  toISODate,
  toISOMonth,
} from '@/lib/week'
import type { Activite, Category } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function ProgrammePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; vue?: string; month?: string }>
}) {
  const { week, vue = 'semaine', month } = await searchParams
  const payload = await getPayload({ config })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 50,
  })

  if (vue === 'mois') {
    const monthISO = month ?? toISOMonth(new Date())
    const { start, end } = getMonthRange(monthISO)

    const { docs: activites } = await payload.find({
      collection: 'activites',
      where: {
        date: {
          greater_than_equal: start.toISOString(),
          less_than_equal: end.toISOString(),
        },
      },
      limit: 500,
      sort: ['date', 'heureDebut'],
      depth: 2,
    })

    return (
      <section className="mx-auto w-full max-w-6xl rounded-md bg-card text-card-foreground px-8 py-8 shadow-md">
        <ProgrammeClient
          vue="mois"
          monthISO={monthISO}
          weekISO={toISODate(getMonday(new Date()))}
          activites={activites as Activite[]}
          categories={categories as Category[]}
        />
      </section>
    )
  }

  // Vue semaine (comportement existant)
  const base = fromISODate(week)
  const { monday: start, sunday: end } = getWeekRange(base)

  const { docs: activites } = await payload.find({
    collection: 'activites',
    where: {
      date: {
        greater_than_equal: start.toISOString(),
        less_than_equal: end.toISOString(),
      },
    },
    limit: 200,
    sort: ['date', 'heureDebut'],
    depth: 2,
  })

  return (
    <section className="mx-auto w-full max-w-6xl rounded-md bg-card text-card-foreground px-8 py-8 shadow-md">
      <ProgrammeClient
        vue="semaine"
        weekISO={toISODate(start)}
        monthISO={toISOMonth(base)}
        activites={activites as Activite[]}
        categories={categories as Category[]}
      />
    </section>
  )
}