'use client'

import { useEffect, useRef } from 'react'
import type { Activite, Category } from '@/payload-types'
import { formatDayHeader, toISODate, FR_MONTHS } from '@/lib/week'
import { ActiviteCard } from './programmeUtils'

type Props = {
  monthWeeks: Date[][]
  byDate: Record<string, Activite[]>
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
  isInMonth: (d: Date) => boolean
}

const FR_DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function DayDrawer({
  dateISO,
  activites,
  onClose,
}: {
  dateISO: string | null
  activites: Activite[]
  onClose: () => void
}) {
  const startY = useRef<number | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startY.current === null) return
    const delta = e.changedTouches[0].clientY - startY.current
    if (delta > 60) onClose()
    startY.current = null
  }

  if (!dateISO) return null

  const [y, m, d] = dateISO.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const h = formatDayHeader(date)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-card text-card-foreground shadow-2xl"
        style={{ maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-card-foreground/30" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-card-foreground/20">
          <h3 className="text-lg font-bold capitalize">
            {h.name} {h.num} {FR_MONTHS[m - 1]}
          </h3>
          <button
            onClick={onClose}
            className="text-card-foreground/60 hover:text-card-foreground text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 space-y-3">
          {activites.length === 0 ? (
            <p className="text-center text-sm opacity-50 py-6">Aucune activité ce jour</p>
          ) : (
            activites.map((a) => <ActiviteCard key={a.id} a={a} />)
          )}
        </div>
      </div>
    </>
  )
}

export function ProgrammeMoisMobile({
  monthWeeks,
  byDate,
  selectedDate,
  onSelectDate,
  isInMonth,
}: Props) {
  const today = toISODate(new Date())

  return (
    <div className="md:hidden">
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
              const isSelected = key === selectedDate

              return (
                <button
                  key={key}
                  onClick={() => inMonth && onSelectDate(isSelected ? null : key)}
                  disabled={!inMonth}
                  className={`
                    relative flex flex-col items-center rounded-lg py-1.5 transition
                    ${!inMonth ? 'opacity-20 cursor-default' : 'cursor-pointer hover:bg-card-foreground/10'}
                    ${isSelected ? 'ring-2 ring-card-foreground' : ''}
                    ${isToday ? 'bg-card-foreground/15' : ''}
                  `}
                >
                  <span
                    className={`text-sm font-semibold leading-none mb-1 ${
                      isToday ? 'text-card-foreground' : 'text-card-foreground/80'
                    }`}
                  >
                    {d.getDate()}
                  </span>
                  <div className="flex gap-0.5 flex-wrap justify-center min-h-[8px]">
                    {acts.slice(0, 3).map((a) => {
                      const cat =
                        typeof a.categorie === 'object' && a.categorie !== null
                          ? (a.categorie as Category)
                          : null
                      return (
                        <span
                          key={a.id}
                          className="block h-1.5 w-1.5 rounded-full"
                          style={{ background: cat?.couleur ?? '#cccccc' }}
                        />
                      )
                    })}
                    {acts.length > 3 && (
                      <span className="text-[8px] leading-none opacity-60">+</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <DayDrawer
        dateISO={selectedDate}
        activites={selectedDate ? (byDate[selectedDate] ?? []) : []}
        onClose={() => onSelectDate(null)}
      />
    </div>
  )
}