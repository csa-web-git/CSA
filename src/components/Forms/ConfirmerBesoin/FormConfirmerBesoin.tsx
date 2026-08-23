// src/components/forms/FormConfirmerBesoin.tsx
'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { confirmerBesoin } from './actions'

const inputBase =
  'w-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent'

type Besoin = { id: string | number; titre: string }

export function FormConfirmerBesoin({ onSuccess }: { onSuccess: () => void }) {
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  // Charge les besoins non comblés au montage
  useEffect(() => {
    fetch('/api/besoins-non-combles')
      .then((r) => r.json())
      .then((data) => setBesoins(data.besoins ?? []))
      .catch(() => setBesoins([]))
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const fd = new FormData(e.currentTarget)
    const res = await confirmerBesoin(fd)
    if (res.ok) {
      onSuccess()
    } else {
      setError(res.error)
      setState('error')
    }
  }

  if (besoins.length === 0) {
    return <p className="text-sm opacity-60 text-center py-4">Aucun besoin en attente pour le moment.</p>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="besoinId" className="font-semibold">Quel besoin ?</label>
        <select id="besoinId" name="besoinId" required className={inputBase + ' rounded-full'}>
          {besoins.map((b) => (
            <option key={b.id} value={b.id}>{b.titre}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="pseudo" className="font-semibold">Votre pseudo</label>
        <input id="pseudo" name="pseudo" required className={inputBase + ' rounded-full'} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      {state === 'error' && <p className="text-center text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
      >
        {state === 'loading' ? 'Envoi…' : 'Confirmer'}
      </button>
    </form>
  )
}