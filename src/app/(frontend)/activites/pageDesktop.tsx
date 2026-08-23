import Link from 'next/link'

type Props = {
  activitesCSA: any[]
  activitesPonctuelles: any[]
}

export function ActivitesDesktop({
  activitesCSA,
  activitesPonctuelles,
}: Props) {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-foreground">
        Activités
      </h1>

      {/* ACTIVITÉS PERMANENTES */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          Activités permanentes
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {activitesCSA.map((activite: any) => (
            <Link
              key={activite.id}
              href={`/activites/${activite.slug}`}
            >
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-4 text-card-foreground transition-shadow hover:shadow-md">

                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded bg-muted">
                  {activite.miniAffiche?.url ? (
                    <div className="relative h-full w-full">
                      <img
                        src={activite.miniAffiche.url}
                        alt=""
                        className="absolute inset-0 h-full w-full scale-110 object-cover brightness-50 blur-md"
                      />

                      <img
                        src={activite.miniAffiche.url}
                        alt={activite.titre}
                        className="relative h-full w-full object-contain object-center"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground opacity-60">
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Permanente
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-card-foreground">
                  {activite.titre}
                </h3>

                {activite.descriptionCourte && (
                  <p className="mt-2 line-clamp-3 text-sm text-card-foreground/80">
                    {activite.descriptionCourte}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ACTIVITÉS PONCTUELLES */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          Activités ponctuelles à venir
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {activitesPonctuelles.map((activite: any) => {
            const titreActivite =
              activite.titre ??
              activite.nom ??
              'Activité ponctuelle'

            return (
              <Link
                key={activite.id}
                href={`/programme/${activite.slug}`}
              >
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-4 text-card-foreground transition-shadow hover:shadow-md">

                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded bg-muted">
                    {activite.image?.url ? (
                      <div className="relative h-full w-full">
                        <img
                          src={activite.image.url}
                          alt=""
                          className="absolute inset-0 h-full w-full scale-110 object-cover brightness-50 blur-md"
                        />

                        <img
                          src={activite.image.url}
                          alt={titreActivite}
                          className="relative h-full w-full object-contain object-center"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70">
                        <span className="rounded bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          {activite.type ?? 'Événement'}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-card-foreground">
                    {titreActivite}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-primary">
                    {new Date(activite.date).toLocaleDateString(
                      'fr-BE',
                      {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      },
                    )}
                  </p>

                  {activite.descriptionCourte && (
                    <p className="mt-2 line-clamp-2 text-sm text-card-foreground/80">
                      {activite.descriptionCourte}
                    </p>
                  )}
                </article>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}