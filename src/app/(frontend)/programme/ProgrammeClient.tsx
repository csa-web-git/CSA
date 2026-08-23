'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useTransition, useState } from 'react'
import type { Activite, Category } from '@/payload-types'
import {
  formatDayHeader,
  formatRange,
  formatMonthHeader,
  getWeekRange,
  getMonthWeeks,
  shiftWeek,
  shiftMonth,
  toISODate,
  fromISODate,
} from '@/lib/week'
import { Legende } from '@/components/Legende'
import { ActiviteCard } from './programmeUtils'
import { ProgrammeMois } from './ProgrammeMois'
import { ProgrammeMoisMobile } from './ProgrammeMoisMobile'
import { ProgrammeSemaineMobile } from './ProgrammeSemaineMobile'
import { ProgrammeSemaineDesktop } from './ProgrammeSemaineDesktop'

type Props = {
  vue: 'semaine' | 'mois'
  weekISO: string
  monthISO: string
  activites: Activite[]
  categories: Category[]
}

export function ProgrammeClient({ vue, weekISO, monthISO, activites, categories }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const range = useMemo(() => getWeekRange(fromISODate(weekISO)), [weekISO])

  const byDay = useMemo(() => {
    const map: Record<number, Activite[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    for (const a of activites) {
      const d = new Date(a.date)
      const idx = (d.getDay() + 6) % 7
      map[idx].push(a)
    }
    for (const day of Object.values(map)) {
      day.sort((a, b) => new Date(a.heureDebut).getTime() - new Date(b.heureDebut).getTime())
    }
    return map
  }, [activites])

  const byDate = useMemo(() => {
    const map: Record<string, Activite[]> = {}
    for (const a of activites) {
      const key = a.date.substring(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(a)
    }
    for (const day of Object.values(map)) {
      day.sort((a, b) => new Date(a.heureDebut).getTime() - new Date(b.heureDebut).getTime())
    }
    return map
  }, [activites])

  const monthWeeks = useMemo(
    () => (vue === 'mois' ? getMonthWeeks(monthISO) : []),
    [vue, monthISO],
  )

  const [monthYear, monthNum] = monthISO.split('-').map(Number)
  const isInMonth = (d: Date) => d.getFullYear() === monthYear && d.getMonth() === monthNum - 1

  const goWeek = (delta: number) =>
    startTransition(() =>
      router.push(`/programme?week=${shiftWeek(weekISO, delta)}`, { scroll: false }),
    )

  const goMonth = (delta: number) =>
    startTransition(() =>
      router.push(`/programme?vue=mois&month=${shiftMonth(monthISO, delta)}`, { scroll: false }),
    )

  const switchVue = (next: 'semaine' | 'mois') =>
    startTransition(() =>
      router.push(
        next === 'mois'
          ? `/programme?vue=mois&month=${monthISO}`
          : `/programme?week=${weekISO}`,
        { scroll: false },
      ),
    )

  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-card p-4 text-card-foreground shadow-xl md:p-8">

      {/* ── Toggle vue ── */}
      <div className="mb-4 flex justify-center gap-2">
        {(['semaine', 'mois'] as const).map((v) => (
          <button
            key={v}
            onClick={() => switchVue(v)}
            disabled={pending}
            className={`rounded-full px-5 py-1.5 text-sm font-medium capitalize transition ${
              vue === v
                ? 'bg-header text-header-foreground shadow'
                : 'bg-header/30 text-card-foreground hover:bg-header/50'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* ── Navigation ── */}
      <header className="mb-6 flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-6">
        <button
          onClick={() => vue === 'semaine' ? goWeek(-1) : goMonth(-1)}
          disabled={pending}
          className="rounded-full bg-header/80 px-4 py-2 text-sm font-medium text-header-foreground shadow transition hover:bg-header disabled:opacity-50"
        >
          ← {vue === 'semaine' ? 'Semaine' : 'Mois'} précédent{vue === 'semaine' ? 'e' : ''}
        </button>
        <h2 className="text-center text-lg font-bold capitalize">
          {vue === 'semaine' ? formatRange(range) : formatMonthHeader(monthISO)}
        </h2>
        <button
          onClick={() => vue === 'semaine' ? goWeek(1) : goMonth(1)}
          disabled={pending}
          className="rounded-full bg-header/80 px-4 py-2 text-sm font-medium text-header-foreground shadow transition hover:bg-header disabled:opacity-50"
        >
          {vue === 'semaine' ? 'Semaine' : 'Mois'} suivant{vue === 'semaine' ? 'e' : ''} →
        </button>
      </header>

      {/* ── Vue semaine mobile ── */}
      {vue === 'semaine' && (
        <ProgrammeSemaineMobile days={range.days} byDay={byDay} />
      )}

      {/* ── Vue semaine desktop ── */}
      {vue === 'semaine' && (
        <ProgrammeSemaineDesktop days={range.days} byDay={byDay} />
      )}

      {/* ── Vue mois mobile ── */}
      {vue === 'mois' && (
        <ProgrammeMoisMobile
          monthWeeks={monthWeeks}
          byDate={byDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          isInMonth={isInMonth}
        />
      )}

      {/* ── Vue mois desktop ── */}
      {vue === 'mois' && (
        <ProgrammeMois
          monthWeeks={monthWeeks}
          byDate={byDate}
          isInMonth={isInMonth}
        />
      )}

      <div className="mt-6 flex justify-center md:justify-end">
        <Legende categories={categories} />
      </div>
    </div>
  )
}