'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

type ForumType = { id: string | number; name: string }

export function CreatePostForm({ forumTypes }: { forumTypes: ForumType[] }) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)


  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault()

    setLoading(true)

    const form = e.currentTarget

    const body = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      authorPseudo: (
        form.elements.namedItem('authorPseudo') as HTMLInputElement
      ).value,
      type: (form.elements.namedItem('type') as HTMLSelectElement).value,
      content: (
        form.elements.namedItem('content') as HTMLTextAreaElement
      ).value,
    }

    const response = await fetch('/api/forum/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      alert('Erreur lors de la création du sujet')
      setLoading(false)
      return
    }

    form.reset()
    router.refresh()
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border p-4 bg-card text-card-foreground"
    >
      <h2 className="font-semibold">
        Nouveau sujet
      </h2>

      <input
        name="title"
        required
        placeholder="Titre"
        className="w-full rounded border p-2"
      />

      <input
        name="authorPseudo"
        required
        placeholder="Pseudo"
        className="w-full rounded border p-2"
      />

      <select
        name="type"
        required
        className="w-full rounded border p-2"
      >
        <option value="">
          Choisir un type
        </option>

        {forumTypes.map((type) => (
          <option
            key={type.id}
            value={type.id}
          >
            {type.name}
          </option>
        ))}
      </select>

      <textarea
        name="content"
        required
        rows={5}
        placeholder="Votre message"
        className="w-full rounded border p-2"
      />

      <button
        disabled={loading}
        className="rounded bg-primary px-4 py-2 text-white"
      >
        {loading ? 'Publication...' : 'Publier'}
      </button>
    </form>
  )
}