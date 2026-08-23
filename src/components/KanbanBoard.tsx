'use client'

import Link from 'next/link'
import { useState } from 'react'

type Tache = {
  id: string | number
  titre: string
  statut: string
}

type Colonne = {
  statut: string
  label: string
}

const COLONNES: Colonne[] = [
  { statut: 'a-faire',  label: 'TODO'    },
  { statut: 'en-cours', label: 'OnGoing' },
  { statut: 'termine',  label: 'Done'    },
  { statut: 'bloque',   label: 'Blocked' },
]

// Couleur de l'onglet actif selon le statut
const COULEURS: Record<string, string> = {
  'a-faire':  'bg-accent text-accent-foreground',
  'en-cours': 'bg-blue-500 text-white',
  'termine':  'bg-green-600 text-white',
  'bloque':   'bg-red-500 text-white',
}

const COULEURS_CARTE: Record<string, string> = {
  'a-faire':  'bg-accent/80 text-accent-foreground',
  'en-cours': 'bg-blue-500/20 text-card-foreground border border-blue-400/40',
  'termine':  'bg-green-600/20 text-card-foreground border border-green-500/40',
  'bloque':   'bg-red-500/20 text-card-foreground border border-red-400/40',
}

export function KanbanBoard({ taches, equipeSlug }: { taches: Tache[]; equipeSlug: string }) {
  const [ongletActif, setOngletActif] = useState('a-faire')

  const parStatut = Object.fromEntries(
    COLONNES.map(({ statut }) => [
      statut,
      taches.filter((t) => t.statut === statut),
    ])
  )

  return (
    <>
      {/* ── MOBILE : onglets ── */}
      <div className="lg:hidden">
        {/* Barre d'onglets */}
        <div className="flex rounded-md overflow-hidden mb-4 border border-card-foreground/20">
          {COLONNES.map(({ statut, label }) => (
            <button
              key={statut}
              onClick={() => setOngletActif(statut)}
              className={[
                'flex-1 py-2 text-xs font-semibold transition-colors',
                ongletActif === statut
                  ? COULEURS[statut]
                  : 'bg-card-foreground/5 text-card-foreground/60 hover:bg-card-foreground/10',
              ].join(' ')}
            >
              {label}
              <span className="ml-1 text-[10px] opacity-70">
                ({parStatut[statut]?.length ?? 0})
              </span>
            </button>
          ))}
        </div>

        {/* Colonne active */}
        <div className="space-y-2 min-h-[120px]">
          {parStatut[ongletActif]?.length === 0 ? (
            <p className="text-center text-sm opacity-40 py-8">Aucune tâche</p>
          ) : (
            parStatut[ongletActif]?.map((tache) => (
              <KanbanCard
                key={tache.id}
                tache={tache}
                equipeSlug={equipeSlug}
              />
            ))
          )}
        </div>
      </div>

      {/* ── DESKTOP : grille 4 colonnes ── */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {COLONNES.map(({ statut, label }) => (
          <div key={statut}>
            <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-wide opacity-60">
              {label}
              <span className="ml-1 opacity-50">({parStatut[statut]?.length ?? 0})</span>
            </h2>
            <div className="space-y-2 min-h-[80px]">
              {parStatut[statut]?.length === 0 ? (
                <p className="text-center text-xs opacity-30 py-4">—</p>
              ) : (
                parStatut[statut]?.map((tache) => (
                  <KanbanCard
                    key={tache.id}
                    tache={tache}
                    equipeSlug={equipeSlug}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function KanbanCard({ tache, equipeSlug }: { tache: Tache; equipeSlug: string }) {
  const classes = COULEURS_CARTE[tache.statut] ?? COULEURS_CARTE['a-faire']
  return (
    <Link
      href={`/taches/${tache.id}`}
      className={[
        'block rounded-md px-3 py-2 text-sm font-medium shadow-sm',
        'hover:opacity-90 hover:-translate-y-0.5 transition-all text-center',
        classes,
      ].join(' ')}
    >
      {tache.titre}
    </Link>
  )
}