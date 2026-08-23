// src/components/forms/FormReserver.tsx
'use client'

import { useState, type FormEvent } from 'react'
import { reserverSalle } from './actions'
import { Field } from '../Field'

const inputBase =
  'w-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent'

export function FormReserver({ onSuccess }: { onSuccess: () => void }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const fd = new FormData(e.currentTarget)
    const res = await reserverSalle(fd)
    if (res.ok) {
      onSuccess()
    } else {
      setError(res.error)
      setState('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-sm">
      <Field label="Organisation/collectif" name="organisation" required/>
        <Field label="Date arrivée" name="dateArrivee" type="datetime-local" required />
        <Field label="Date sortie" name="dateSortie" type="datetime-local" required />
        <Field label="Privé/public" name="privePublic" placeholder='Information ouverte au publique?' required/>
        <Field label="Nombre de personnes estimées" name="nombre" type="number" min="1" required />
        <Field label="Salle souhaitée" name="salle" placeholder="Rez-de-chaussée/Réunion1/Réunion2" />
        <div>
          <label htmlFor="message" className="block font-semibold mb-2">Plus d'infos :</label>
          <textarea id="message" name="message" rows={5} placeholder='Informations bonnes à savoir: Qui représentez-vous? Comment avez-vous entendu parler de nous? Est-ce que vous connaissez certaines personnes du CSA? Avez-vous des besoins/des suggestions particuliers? ' className={inputBase + ' rounded-2xl'} />
        </div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
        {state === 'error' && <p className="text-center text-sm text-red-200">{error}</p>}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={state === 'loading'}
            className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
          >
            {state === 'loading' ? 'Envoi…' : 'Réserve une salle →'}
          </button>
        </div>
    </form>
  )
}
