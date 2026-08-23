import type { Activite } from '@/payload-types'
import { toISODate } from '@/lib/week'
import { ActiviteCard } from './programmeUtils'

type Props = {
  monthWeeks: Date[][]
  byDate: Record<string, Activite[]>
  isInMonth: (d: Date) => boolean
}

const FR_DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function ProgrammeMois({ monthWeeks, byDate, isInMonth }: Props) {
  const today = toISODate(new Date())

  return (
    <div className="hidden md:block">
      <div className="mb-1 grid grid-cols-7 gap-1">
        {FR_DAYS_SHORT.map((name) => (
          <div
            key={name}
            className="py-1 text-center text-xs font-semibold uppercase tracking-wide opacity-60"
          >
            {name}
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {monthWeeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((d) => {
              const key = toISODate(d)
              const acts = byDate[key] ?? []
              const inMonth = isInMonth(d)
              const isToday = key === today
              return (
                <div
                  key={key}
                  className={`min-h-[90px] rounded-lg border p-1 ${
                    isToday
                      ? 'border-card-foreground/60 bg-card-foreground/10'
                      : inMonth
                      ? 'border-card-foreground/20 bg-card-foreground/5'
                      : 'border-transparent opacity-30'
                  }`}
                >
                  <div
                    className={`mb-1 text-right text-xs font-semibold ${
                      isToday ? 'text-card-foreground' : 'opacity-60'
                    }`}
                  >
                    {d.getDate()}
                  </div>
                  <div className="space-y-0.5">
                    {acts.map((a) => <ActiviteCard key={a.id} a={a} compact />)}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}