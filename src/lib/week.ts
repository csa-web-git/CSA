/**
 * Logique de calcul de semaine (lundi -> dimanche)
 * Indépendant de toute lib pour rester léger.
 */

export type WeekRange = {
  monday: Date
  sunday: Date
  days: Date[]
}

export function getMonday(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

export function getWeekRange(ref: Date, offset = 0): WeekRange {
  const monday = getMonday(ref)
  monday.setDate(monday.getDate() + offset * 7)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d)
  }
  const sunday = new Date(days[6])
  sunday.setHours(23, 59, 59, 999)
  return { monday, sunday, days }
}

export function toISODate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function fromISODate(s: string | undefined | null): Date {
  if (!s) return new Date()
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return new Date()
  return new Date(y, m - 1, d)
}

export function shiftWeek(iso: string, weeks: number): string {
  const d = fromISODate(iso)
  d.setDate(d.getDate() + weeks * 7)
  return toISODate(getMonday(d))
}

const FR_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
export const FR_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

export function formatDayHeader(d: Date): { name: string; num: number; month: string } {
  return {
    name: FR_DAYS[(d.getDay() + 6) % 7],
    num: d.getDate(),
    month: FR_MONTHS[d.getMonth()],
  }
}

export function formatRange(range: WeekRange): string {
  const a = range.monday
  const b = range.days[6]
  const sameMonth = a.getMonth() === b.getMonth()
  if (sameMonth) {
    return `${a.getDate()} - ${b.getDate()} ${FR_MONTHS[a.getMonth()]} ${a.getFullYear()}`
  }
  return `${a.getDate()} ${FR_MONTHS[a.getMonth()]} - ${b.getDate()} ${FR_MONTHS[b.getMonth()]} ${b.getFullYear()}`
}

// ─── Helpers mois ────────────────────────────────────────────────────────────

/** "2026-05" */
export function toISOMonth(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function shiftMonth(isoMonth: string, delta: number): string {
  const [y, m] = isoMonth.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return toISOMonth(d)
}

/** Plage start/end couvrant tout le mois. */
export function getMonthRange(isoMonth: string): { start: Date; end: Date } {
  const [y, m] = isoMonth.split('-').map(Number)
  const start = new Date(y, m - 1, 1)
  start.setHours(0, 0, 0, 0)
  const end = new Date(y, m, 0)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

/**
 * Retourne les semaines couvrant le mois (lundi → dimanche).
 * Certaines dates peuvent être hors du mois (padding).
 */
export function getMonthWeeks(isoMonth: string): Date[][] {
  const [y, m] = isoMonth.split('-').map(Number)
  const firstDay = new Date(y, m - 1, 1)
  const lastDay = new Date(y, m, 0)
  const current = getMonday(firstDay)
  const weeks: Date[][] = []
  while (current <= lastDay) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

export function formatMonthHeader(isoMonth: string): string {
  const [y, m] = isoMonth.split('-').map(Number)
  return `${FR_MONTHS[m - 1]} ${y}`
}