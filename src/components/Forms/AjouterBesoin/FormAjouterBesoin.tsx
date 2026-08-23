// src/components/forms/FormAjouterBesoin.tsx
'use client'

import { useState, type FormEvent } from 'react'
import { ajouterBesoin } from './actions'

const inputBase =
  'w-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent'

export function FormAjouterBesoin({ onSuccess }: { onSuccess: () => void }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const fd = new FormData(e.currentTarget)
    const res = await ajouterBesoin(fd)
    if (res.ok) {
      onSuccess()
    } else {
      setError(res.error)
      setState('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="titre" className="font-semibold">Titre du besoin</label>
        <input id="titre" name="titre" required className={inputBase + ' rounded-full'} />
      </div>
      <div>
        <label htmlFor="description" className="block font-semibold mb-1">Description :</label>
        <textarea id="description" name="description" rows={4} className={inputBase + ' rounded-2xl'} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      {state === 'error' && <p className="text-center text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
      >
        {state === 'loading' ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  )
}