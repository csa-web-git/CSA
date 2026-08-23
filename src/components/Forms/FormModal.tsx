// src/components/forms/FormModal.tsx
'use client'

import { useEffect } from 'react'

export function FormModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  // Fermeture sur Échap
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-card text-card-foreground p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}