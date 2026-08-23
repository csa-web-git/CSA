'use client'

import { useState, type FormEvent } from 'react'
import { passerUneNuit } from './actions'

export default function PasserUneNuitPage() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const res = await passerUneNuit(new FormData(e.currentTarget))
    if (res.ok) setState('done')
    else {
      setError(res.error)
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <Panel title="Merci !">
        <p className="text-center text-sm">
          Votre demande a été envoyée. Le Groupe Accueil vous recontactera rapidement.
        </p>
      </Panel>
    )
  }

  return (
    <Panel title="Passer une nuit">
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
    </Panel>
  )
}

const inputBase =
  'w-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent'

function Field({
  label, name, type = 'text', required = false, min, max,
}: { label: string; name: string; type?: string; required?: boolean; min?: string; max?: string }) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-center gap-4">
      <label htmlFor={name} className="text-right font-semibold">{label} :</label>
      <input id={name} name={name} type={type} required={required} min={min} max={max} className={inputBase + ' rounded-full'} />
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-md bg-card text-card-foreground px-8 py-8 shadow-md">
      <h2 className="mb-6 text-center text-xl font-bold font-display">{title}</h2>
      {children}
    </section>
  )
}
