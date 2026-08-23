'use client'

import { useState, type FormEvent } from 'react'
import { reserverSalle } from './actions'

export default function ReserverSallePage() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const fd = new FormData(e.currentTarget)
    const res = await reserverSalle(fd)
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
          Votre demande a été envoyée. Une personne du Groupe Activités vous recontactera.
        </p>
      </Panel>
    )
  }

  return (
    <Panel title="Réserver une salle">
      <form onSubmit={onSubmit} className="space-y-5 text-sm">
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
    </Panel>
  )
}

const inputBase =
  'w-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent'

function Field({
  label, name, type = 'text', required = false, placeholder, min,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; min?: string }) {
  return (
    <div className="flex flex-col gap-1 sm:grid sm:grid-cols-[180px_1fr] sm:items-center sm:gap-4">
      <label htmlFor={name} className="font-semibold sm:text-right">{label} :</label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} min={min} className={inputBase + ' rounded-full'} />
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
