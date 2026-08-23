import type { Activite } from '@/payload-types'
import { formatDayHeader } from '@/lib/week'
import { ActiviteCard } from './programmeUtils'

type Props = {
  days: Date[]
  byDay: Record<number, Activite[]>
}

export function ProgrammeSemaineDesktop({ days, byDay }: Props) {
  return (
    <div className="hidden md:block">
      <div className="grid grid-cols-7 gap-x-2 border-b border-card-foreground/40 pb-2">
        {days.map((d) => {
          const h = formatDayHeader(d)
          return (
            <div key={d.toISOString()} className="text-center text-sm font-semibold">
              <div>{h.name}</div>
              <div className="text-xs opacity-70">{h.num} {h.month}</div>
            </div>
          )
        })}
      </div>
      <div className="grid min-h-[420px] grid-cols-7 gap-x-2 pt-4">
        {days.map((d, idx) => (
          <div
            key={d.toISOString()}
            className="space-y-3 border-r border-dashed border-card-foreground/40 pr-2 last:border-r-0"
          >
            {byDay[idx].map((a) => <ActiviteCard key={a.id} a={a} />)}
          </div>
        ))}
      </div>
    </div>
  )
}