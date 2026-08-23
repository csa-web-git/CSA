'use client'

import { useEffect, useState } from 'react'

function formatDuration(ms: number) {
  if (ms <= 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  if (days > 0) return `${days}j ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function CountdownTimer({
  label,
  targetMs,
  onExpire,
  className,
}: {
  label: string
  targetMs: number      // timestamp cible en ms
  onExpire?: () => void
  className?: string
}) {
  const [remaining, setRemaining] = useState(Math.max(0, targetMs - Date.now()))

  useEffect(() => {
    const interval = setInterval(() => {
      const r = Math.max(0, targetMs - Date.now())
      setRemaining(r)
      if (r === 0) onExpire?.()
    }, 1000)
    return () => clearInterval(interval)
  }, [targetMs, onExpire])

  return (
    <div className={className}>
      <span className="text-xs opacity-60 uppercase tracking-wide">{label}</span>
      <span className="ml-2 font-mono font-semibold tabular-nums">
        {remaining > 0 ? formatDuration(remaining) : '—'}
      </span>
    </div>
  )
}