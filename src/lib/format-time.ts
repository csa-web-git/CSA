/**
 * Formate un créneau horaire en français.
 * Accepte des chaînes ISO (sortie Payload) ou des objets Date.
 *
 * formatTimeRange("2026-05-18T09:00:00Z", "2026-05-18T12:00:00Z")
 *   → "09:00 – 12:00"
 */
export function formatTimeRange(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined,
): string {
  if (!start || !end) return ''
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${fmt.format(new Date(start))} – ${fmt.format(new Date(end))}`
}

export function formatTime(value: string | Date | null | undefined): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}
