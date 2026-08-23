'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  postId: number
}

export function CreateCommentForm({
  postId,
}: Props) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault()

    setLoading(true)

    const form = e.currentTarget

    const body = {
      postId,
      authorPseudo: (
        form.elements.namedItem('authorPseudo') as HTMLInputElement
      ).value,
      content: (
        form.elements.namedItem('content') as HTMLTextAreaElement
      ).value,
    }

    const response = await fetch(
      '/api/forum/comment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    if (!response.ok) {
      alert('Erreur')
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
      className="space-y-4 rounded-lg border p-4"
    >
      <h3 className="font-semibold">
        Ajouter un commentaire
      </h3>

      <input
        name="authorPseudo"
        required
        placeholder="Pseudo"
        className="w-full rounded border p-2"
      />

      <textarea
        name="content"
        required
        rows={4}
        placeholder="Votre commentaire"
        className="w-full rounded border p-2"
      />

      <button
        disabled={loading}
        className="rounded bg-header px-4 py-2 text-white"
      >
        {loading ? 'Publication...' : 'Commenter'}
      </button>
    </form>
  )
}