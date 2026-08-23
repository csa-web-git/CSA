// src/components/forum/VoteButtons.tsx

'use client'

import { useEffect, useState } from 'react'

type VoteType = 'like' | 'dislike'

type VoteButtonsProps = {
  entityId: string | number
  entityType: 'post' | 'comment'
  initialLikes: number
  initialDislikes: number
}

export function VoteButtons({
  entityId,
  entityType,
  initialLikes,
  initialDislikes,
}: VoteButtonsProps) {
  const storageKey = `${entityType}-vote-${entityId}`

  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)

  const [userVote, setUserVote] = useState<VoteType | null>(null)

  useEffect(() => {
    const vote = localStorage.getItem(storageKey) as VoteType | null

    if (vote) {
      setUserVote(vote)
    }
  }, [storageKey])

  async function vote(voteType: VoteType) {
    // Annulation — reclic sur le même vote
    if (userVote === voteType) {
      if (voteType === 'like') setLikes((v) => v - 1)
      else setDislikes((v) => v - 1)
      setUserVote(null)
      localStorage.removeItem(storageKey)
      try {
        await fetch('/api/forum/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entityId, entityType, voteType, cancel: true }),
        })
      } catch {
        // rollback
        if (voteType === 'like') setLikes((v) => v + 1)
        else setDislikes((v) => v + 1)
        setUserVote(voteType)
        localStorage.setItem(storageKey, voteType)
      }
      return
    }

    // Nouveau vote
    if (voteType === 'like') setLikes((v) => v + 1)
    else setDislikes((v) => v + 1)
    setUserVote(voteType)
    localStorage.setItem(storageKey, voteType)
    try {
      await fetch('/api/forum/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, entityType, voteType, cancel: false }),
      })
    } catch {
      if (voteType === 'like') setLikes((v) => v - 1)
      else setDislikes((v) => v - 1)
      setUserVote(null)
      localStorage.removeItem(storageKey)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          vote('like')
        }}
        className={[
          'rounded-md px-3 py-1 text-sm transition',
          userVote === 'like'
            ? 'bg-green-600 text-white'
            : 'bg-secondary hover:opacity-80',
        ].join(' ')}
      >
        👍 {likes}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          vote('dislike')
        }}
        className={[
          'rounded-md px-3 py-1 text-sm transition',
          userVote === 'dislike'
            ? 'bg-red-600 text-white'
            : 'bg-secondary hover:opacity-80',
        ].join(' ')}
      >
        👎 {dislikes}
      </button>
    </div>
  )
}