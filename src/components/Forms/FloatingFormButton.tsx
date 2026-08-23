// src/components/forms/FloatingFormButton.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FormModal } from './FormModal'
import { FormDormir } from './Dormir/FormDormir'
import { FormReserver } from './Reserver/FormReserver'
import { FormAjouterBesoin } from './AjouterBesoin/FormAjouterBesoin'
import { FormConfirmerBesoin } from './ConfirmerBesoin/FormConfirmerBesoin'
import { FormAjouterActivite } from './AjouterActivite/FormAjouterActivite'
import { FormSuggestion } from './Suggestion/FormSuggestion'

type FormKey = 'dormir' | 'reserver' | 'ajouter-besoin' | 'confirmer-besoin' | 'ajouter-activite' | 'suggestion'

// Toutes les options possibles, dans l'ordre d'affichage de la combobox
const ALL_OPTIONS: { key: FormKey; label: string }[] = [
  { key: 'dormir', label: 'Passer une nuit' },
  { key: 'reserver', label: 'Réserver une salle' },
  { key: 'ajouter-besoin', label: 'Ajouter un besoin' },
  { key: 'confirmer-besoin', label: 'Confirmer un besoin comblé' },
  { key: 'ajouter-activite', label: 'Proposer une activité' },
  { key: 'suggestion', label: 'Faire une suggestion pour le site'}
]

// Mapping route → formulaire par défaut à pré-sélectionner
const DEFAULT_BY_ROUTE: Record<string, FormKey> = {
  '/': 'suggestion',
  '/soutien-materiel': 'ajouter-besoin',
  '/programme': 'ajouter-activite',
  '/activite': 'ajouter-activite',
}

const FALLBACK_DEFAULT: FormKey = 'dormir'

export function FloatingFormButton() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [activeForm, setActiveForm] = useState<FormKey>(FALLBACK_DEFAULT)
  const [feedback, setFeedback] = useState<'success' | null>(null)

  useEffect(() => {
    setActiveForm(DEFAULT_BY_ROUTE[pathname] ?? FALLBACK_DEFAULT)
  }, [pathname])

  const currentOption = ALL_OPTIONS.find((o) => o.key === activeForm)

  const handleClose = () => {
    setOpen(false)
    setFeedback(null)
  }

  const handleSuccess = () => {
    setFeedback('success')
    // Fermeture automatique après un court délai
    setTimeout(() => {
      setOpen(false)
      setFeedback(null)
    }, 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-accent text-accent-foreground px-5 py-3 text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
      >
        Nous contacter
      </button>

      <FormModal open={open} onClose={handleClose} title={currentOption?.label ?? ''}>
        {feedback === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-3xl">
              ✓
            </div>
            <p className="font-semibold">Demande envoyée !</p>
            <p className="text-sm opacity-70">Merci, votre demande va être examinée.</p>
          </div>
        ) : (
          <>
            <select
              value={activeForm}
              onChange={(e) => setActiveForm(e.target.value as FormKey)}
              className="w-full mb-5 rounded-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent"
            >
              {ALL_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            {activeForm === 'dormir' && <FormDormir onSuccess={handleSuccess} />}
            {activeForm === 'reserver' && <FormReserver onSuccess={handleSuccess} />}
            {activeForm === 'ajouter-besoin' && <FormAjouterBesoin onSuccess={handleSuccess} />}
            {activeForm === 'confirmer-besoin' && <FormConfirmerBesoin onSuccess={handleSuccess} />}
            {activeForm === 'ajouter-activite' && <FormAjouterActivite onSuccess={handleSuccess} />}
            {activeForm === 'suggestion' && <FormSuggestion onSuccess={handleSuccess} />}
          </>
        )}
      </FormModal>
    </>
  )
}
