// src/components/forms/FormDormir.tsx
'use client'

import { useState, type FormEvent } from 'react'
import { passerUneNuit } from './actions'
import { Field } from '../Field'

const inputBase =
  'w-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent'

export function FormDormir({ onSuccess }: { onSuccess: () => void }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const fd = new FormData(e.currentTarget)
    const res = await passerUneNuit(fd)
    if (res.ok) {
      onSuccess()
    } else {
      setError(res.error)
      setState('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-sm">
      <form onSubmit={onSubmit} className="space-y-5 text-sm">
        <Field label="Pseudo" name="pseudo" required />
        <Field label="Date arrivée" name="dateArrivee" type="date" required />
        <Field label="Nbr de soirées souhaitées (1-3)" name="durée" type="number" min="1" max="3" required />
        <Field label="Nombre de personnes" name="nombre" type="number" min="1" required />
        <Field label="Mixité/non-mixité:" name="mixite" required />        
        <div>
          <label htmlFor="message" className="block font-semibold mb-2">Plus d'infos :</label>
          <textarea id="message" name="message" rows={5} className={inputBase + ' rounded-2xl'} />
        </div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
        {state === 'error' && <p className="text-center text-sm text-red-200">{error}</p>}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={state === 'loading'}
            className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
          >
            {state === 'loading' ? 'Envoi…' : 'Passer une nuit →'}
          </button>
        </div>
      </form>
    </form>
  )
}