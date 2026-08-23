'use client'

import { useState } from 'react'
import { CreatePostForm } from './CreatePostForm'

type ForumType = { id: string | number; name: string }

export function ForumNewPostButton({ forumTypes }: { forumTypes: ForumType[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-6 flex flex-col items-center">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="
            flex h-16 w-16 items-center justify-center
            rounded-full border-4 border-dashed
            border-black text-3xl font-bold
            hover:scale-105 transition
          "
        >
          +
        </button>
      ) : (
        <div className="w-full max-w-3xl">
          <CreatePostForm forumTypes={forumTypes}/>

          <div className="mt-2 text-center">
            <button
              onClick={() => setOpen(false)}
              className="text-sm underline"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}