// src/components/forms/FormAjouterActivite.tsx
'use client'

import { useState, type FormEvent } from 'react'
import { ajouterActivite } from './action'

const inputBase =
  'w-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent'

export function FormAjouterActivite({ onSuccess }: { onSuccess: () => void }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const fd = new FormData(e.currentTarget)
    const res = await ajouterActivite(fd)
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
        <label htmlFor="titre" className="font-semibold">Titre</label>
        <input id="titre" name="titre" required className={inputBase + ' rounded-full'} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="font-semibold">Date</label>
        <input id="date" name="date" type="date" required className={inputBase + ' rounded-full'} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="heureDebut" className="font-semibold">Début</label>
          <input id="heureDebut" name="heureDebut" type="time" required className={inputBase + ' rounded-full'} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="heureFin" className="font-semibold">Fin</label>
          <input id="heureFin" name="heureFin" type="time" required className={inputBase + ' rounded-full'} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="lieu" className="font-semibold">Lieu</label>
        <input id="lieu" name="lieu" placeholder="Salle principale, jardin…" className={inputBase + ' rounded-full'} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="organisateurs" className="font-semibold">Organisateurs</label>
        <input id="organisateurs" name="organisateurs" required className={inputBase + ' rounded-full'} />
      </div>

      <div>
        <label htmlFor="description" className="block font-semibold mb-1">Description :</label>
        <textarea id="description" name="description" rows={4} className={inputBase + ' rounded-2xl'} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="image" className="font-semibold">Photo (optionnel)</label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={inputBase + ' rounded-full file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground'}
        />
        <p className="text-xs text-foreground/60">JPEG, PNG ou WebP, 5 Mo max.</p>
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      {state === 'error' && <p className="text-center text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
      >
        {state === 'loading' ? 'Envoi…' : 'Proposer cette activité'}
      </button>
    </form>
  )
}