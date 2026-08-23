// src/components/forms/FormSuggestion.tsx
'use client'

import { useState, type FormEvent } from 'react'
import { envoyerSuggestion } from './action'

const inputBase =
  'w-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent'

export function FormSuggestion({ onSuccess }: { onSuccess: () => void }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const fd = new FormData(e.currentTarget)
    const res = await envoyerSuggestion(fd)
    if (res.ok) {
      onSuccess()
    } else {
      setError(res.error)
      setState('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-sm">
      <div>
        <label htmlFor="content" className="block font-semibold mb-1">Votre suggestion :</label>
        <textarea
          id="content"
          name="content"
          rows={5}
          required
          placeholder="Une idée pour améliorer le site ?"
          className={inputBase + ' rounded-2xl'}
        />
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      {state === 'error' && <p className="text-center text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
      >
        {state === 'loading' ? 'Envoi…' : 'Envoyer la suggestion'}
      </button>
    </form>
  )
}