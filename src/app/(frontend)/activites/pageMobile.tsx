'use client'

import { useState } from 'react'
import Link from 'next/link'

type Props = {
  activitesCSA: any[]
  activitesPonctuelles: any[]
}

export function ActivitesMobile({
  activitesCSA,
  activitesPonctuelles,
}: Props) {
  const [tab, setTab] = useState<'permanentes' | 'ponctuelles'>(
    'permanentes',
  )

  return (
    <main className="pb-8">
      {/* Onglets fixes */}
      <div className="sticky top-0 z-50 border-b border-border bg-background px-4 py-3">
        <div className="flex overflow-hidden rounded-lg border border-border">
          <button
            onClick={() => setTab('permanentes')}
            className={[
              'flex-1 py-3 text-sm font-semibold transition-colors',
              tab === 'permanentes'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-card-foreground',
            ].join(' ')}
          >
            Permanentes
          </button>

          <button
            onClick={() => setTab('ponctuelles')}
            className={[
              'flex-1 py-3 text-sm font-semibold transition-colors',
              tab === 'ponctuelles'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-card-foreground',
            ].join(' ')}
          >
            Ponctuelles
          </button>
        </div>
      </div>

      <div className="p-4">
        {tab === 'permanentes' && (
          <div className="space-y-4">
            {activitesCSA.map((activite: any) => (
              <Link
                key={activite.id}
                href={`/activites/${activite.slug}`}
              >
                <article className="flex gap-4 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-sm">

                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded bg-muted">
                    {activite.miniAffiche?.url ? (
                      <img
                        src={activite.miniAffiche.url}
                        alt={activite.titre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        CSA
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">
                      {activite.titre}
                    </h3>

                    {activite.descriptionCourte && (
                      <p className="mt-2 text-sm opacity-80 line-clamp-3">
                        {activite.descriptionCourte}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {tab === 'ponctuelles' && (
          <div className="space-y-4">
            {activitesPonctuelles.map((activite: any) => {
              const titre =
                activite.titre ??
                activite.nom ??
                'Activité'

              return (
                <Link
                  key={activite.id}
                  href={`/programme/${activite.slug}`}
                >
                  <article className="flex gap-4 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-sm">

                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded bg-muted">
                      {activite.image?.url ? (
                        <img
                          src={activite.image.url}
                          alt={titre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          Event
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">
                        {titre}
                      </h3>

                      <p className="mt-1 text-xs text-primary">
                        {new Date(
                          activite.date,
                        ).toLocaleDateString('fr-BE', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>

                      {activite.descriptionCourte && (
                        <p className="mt-2 text-sm opacity-80 line-clamp-2">
                          {activite.descriptionCourte}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}