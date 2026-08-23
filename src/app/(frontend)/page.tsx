import Link from 'next/link'
import { Panel } from '@/components/Panel'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BanderoleSlider, BanderoleSlideType } from '@/components/banderole/BanderoleAcceuil'
import { MapCSA } from '@/components/MapCSA'


export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Accueil — Collectif',
  description: 'Présentation du collectif, de notre projet, et de comment nous soutenir.',
  openGraph: {
    title: 'Accueil — Collectif',
    description: 'Qui sommes-nous, que faisons-nous, comment nous soutenir.',
  },
}

const activities = [
  {
    icon: '/icons/lutte.png',
    title: 'Ouvrir des espaces de luttes',
    desc: "De manière autogérée, se rencontrer, s'organiser, résister, être solidaires. Offrir gratuitement des locaux à des collectifs autonomes.",
  },
  {
    icon: '/icons/partage.png',
    title: 'Partage de savoir et savoir-faire',
    desc: "Une bibliothèque, un infokiosk, des chantiers collectifs, ...",
  },
  {
    icon: '/icons/activite.png',
    title: 'Des activités',
    desc: 'Des soirées de soutien, des ciné-clubs, des documentaires, des débats, des conférences, des arpentages, ...',
  },
  {
    icon: '/icons/atelier.png',
    title: 'Des ateliers',
    desc: 'Du krump, de la poésie, de la couture, de la mécanique vélo, de la sérigraphie, ...',
  },
  {
    icon: '/icons/rencontre.png',
    title: 'Tisser du lien',
    desc: 'Des moments de détente conviviaux, un jardin et de la compagnie, une garderie, une donnerie, une cuisine collective, des repas populaires, ...',
  },
  {
    icon: '/icons/selfcare.png',
    title: 'Prendre soin',
    desc: "Des séances de psy, de kiné et de massage, un groupe de gestion de conflits, du soutien mutuel, ...",
  },
]

export default async function HomePage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'banderole-slides',
    sort: 'ordre',
    limit: 20,
    depth: 1,
  })

  const slides: BanderoleSlideType[] = docs
    .filter((s: any) => typeof s.image === 'object' && s.image?.url)
    .map((s: any) => ({
      id: String(s.id),
      imageUrl: s.image.url as string,
      imageAlt: s.image.alt ?? '',
      activiteSlug:
        typeof s.activite === 'object' && s.activite?.slug
          ? (s.activite.slug as string)
          : null,
    }))

  return (
    <>
      {/* Banderole mobile : bande horizontale au-dessus du contenu */}
      {slides.length > 0 && (
        <div className="lg:hidden w-full h-72 overflow-hidden">
          <BanderoleSlider slides={slides} />
        </div>
      )}

      <div className="flex items-start">
        {/* Contenu principal */}
        <main className="flex-1 min-w-0 space-y-6 py-6">
          <Panel>
            <div className="gap-6">
              <img
                src="/visu/AG.jpg"
                alt="Assemblée Générale"
                className="w-full max-h-[500px] rounded-2xl object-contain"
              />
            </div>
          </Panel>

          <Panel title="Qui sommes nous?">
            <div className="space-y-4 text-xl leading-relaxed text-center">
              <p>
                En avril 2026, en plein centre de Liège, est né le Centre Social Autogéré. Dans un
                monde qui se militarise et dans une ville qui se gentrifie, nous avons décidé de nous
                réapproprier collectivement un espace laissé à l'abandon et à la spéculation depuis
                des années, pour en faire un lieu de rencontres, de luttes, d'échanges, de créativité,
                de soins et de soutien mutuel.
              </p>
              <p>
                Nous nous organisons horizontalement, sans être affiliés à aucuns partis politique,
                syndicats ou institutions. Nous mettons l'accent sur la pluralité de nos idées et de
                nos pratiques et sur la diversité de nos identités et de nos origines.
              </p>
              <p>
                Nous nous battons férocement et joyeusement pour la dignité de toutes et tous, nous
                sommes activement solidaires avec toutes les personnes opprimées par le système
                techno-capitaliste actuel et nous vous invitons chaleureusement à venir nous rencontrer
                pour tisser ensemble des liens subversifs et non-marchands.
              </p>
              <p>SHOOT ARIZONA !!!</p>
            </div>
          </Panel>

          <Panel>
            <div className="gap-6">
              <img
                src="/visu/acceuil.jpg"
                alt="Après-midi portes ouvertes"
                className="w-full max-h-[500px] rounded-2xl object-contain"
              />
            </div>
          </Panel>

          <section className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
            <video
              controls
              muted
              className="aspect-[3/4] w-full max-w-[400px] rounded-md shadow-md object-cover"
            >
              <source src="/media/presentation.mp4" type="video/mp4" />
            </video>
          </section>

          <Panel title="Que faisons-nous?">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              {activities.map((a) => (
                <div key={a.title} className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background text-foreground shadow-inner">
                    <img
                      src={a.icon}
                      alt={a.title}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-semibold text-xl">{a.title}</h3>
                  <p className="mt-2 text-l leading-7 opacity-90">{a.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                href="/activites"
                className="rounded-full px-8 py-3 text-black bg-accent hover:font-semibold hover:text-accent-foreground"
              >
                Rejoins-nous!
              </Link>
            </div>
          </Panel>

          <Panel title="Comment nous soutenir?">
            <div className="space-y-4 text-xl leading-relaxed text-center">
              <p>
                La meilleure manière de soutenir le Centre Social Autogéré, c'est de venir y mettre
                de l'énergie! Que ce soit en proposant une activité ou en y participant, en rejoignant
                un des nombreux groupes de travail déjà existants ou en venant donner un coup de main
                ponctuel, chaque geste est apprécié!
              </p>
              <p><b>Viens nous rencontrer : </b></p>
                <ul>
                  <li> - tous les 1er et 3ème dimanche du mois, entre 14 et 18h, pour une prise de contact conviviale ; </li>
                  <li> - tous les 5 et 20 de chaque mois, à 18h, pour participer aux Assemblées Générales!</li>
                </ul>                
              
              <p>
                Nous avons également besoin de matos de toutes sortes, tu trouveras la liste de ce que nous cherchons en {' '}
                <Link
                  href="/soutien-materiel"
                  className="font-semibold text-accent underline underline-offset-4 transition hover:text-accent-foreground"
                >
                  [cliquant ici.]
                </Link>
              </p>
              <p>
                Enfin, même si l'argent c'est (vraiment très) mal, et qu'on veut en finir
                définitivement avec lui et le capitalisme, pour le moment on en a quand même (un peu)
                besoin pour faire tenir le lieu et alimenter nos luttes. Alors si tu en as envie, saches 
                que nous acceptons les dons! N'hésite pas à nous contacter via le formulaire, 
                nous t'expliquerons comment faire et à quoi ça nous sert!
              </p>
            </div>
          </Panel>
          <Panel title="Nous trouver">
            <MapCSA />
          </Panel>
        </main>

        {/* Banderole desktop : colonne droite sticky */}
        {slides.length > 0 && (
          <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-0 h-screen overflow-hidden">
            <BanderoleSlider slides={slides} />
          </aside>
        )}
      </div>
    </>
  )
}