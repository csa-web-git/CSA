import type { Activite } from '@/payload-types'
import { formatDayHeader } from '@/lib/week'
import { ActiviteCard } from './programmeUtils'

type Props = {
  days: Date[]
  byDay: Record<number, Activite[]>
}

export function ProgrammeSemaineMobile({ days, byDay }: Props) {
  return (
    <div className="space-y-4 md:hidden">
      {days.map((d, idx) => {
        const h = formatDayHeader(d)
        return (
          <div key={d.toISOString()} className="rounded-xl border border-card-foreground/20 p-3">
            <h3 className="mb-3 text-lg font-semibold">
              {h.name} {h.num} {h.month}
            </h3>
            {byDay[idx].length === 0 ? (
              <p className="text-sm opacity-50">Aucune activité</p>
            ) : (
              <div className="space-y-2">
                {byDay[idx].map((a) => <ActiviteCard key={a.id} a={a} />)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}