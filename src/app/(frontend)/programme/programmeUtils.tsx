import Link from 'next/link'
import type { Activite, Category } from '@/payload-types'

export function formatHeure(dateString: string) {
  return new Date(dateString).toLocaleTimeString('fr-BE', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getContrastColor(hex: string) {
  const color = hex.replace('#', '')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 160 ? '#111111' : '#FFFFFF'
}

export function getSecondaryTextColor(hex: string) {
  const color = hex.replace('#', '')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 160 ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.75)'
}

export function ActiviteCard({ a, compact = false }: { a: Activite; compact?: boolean }) {
  const cat =
    typeof a.categorie === 'object' && a.categorie !== null ? (a.categorie as Category) : null
  const bg = cat?.couleur ?? '#cccccc'
  const textColor = getContrastColor(bg)
  const secondaryColor = getSecondaryTextColor(bg)

  return (
    <Link
      href={`/programme/${a.slug}`}
      className="block w-full rounded-2xl shadow transition hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: bg,
        color: textColor,
        border: '1px solid rgba(0,0,0,0.08)',
        padding: compact ? '4px 8px' : '12px',
      }}
    >
      <div
        className={`font-semibold ${compact ? 'text-xs truncate' : 'mb-1'}`}
        style={{ color: textColor }}
      >
        {a.titre}
      </div>
      {!compact && (
        <div style={{ color: secondaryColor }}>
          {formatHeure(a.heureDebut)} - {formatHeure(a.heureFin)}
        </div>
      )}
    </Link>
  )
}