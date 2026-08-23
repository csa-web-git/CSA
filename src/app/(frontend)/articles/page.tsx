'use client'

import { useState } from 'react'
import { Panel } from '@/components/Panel'
import { Lightbulb, AlertCircle, Palette } from 'lucide-react'

type Article = { id: string; title: string; icon: typeof Lightbulb; body: string[] }

const articles: Article[] = [
  {
    id: 'projet',
    title: 'Notre Projet',
    icon: Lightbulb,
    body: [
      "Le projet est né d'une rencontre entre habitant·es du quartier et collectifs militants au printemps 2024.",
      "Le rez-de-chaussée accueille la cantine et la salle d'assemblée, le premier étage les ateliers et le second les bureaux mis à disposition d'autres associations.",
    ],
  },
  {
    id: 'problemes',
    title: 'Les problèmes actuels',
    icon: AlertCircle,
    body: [
      "Le bâtiment souffre d'infiltrations en toiture et l'électricité reste partielle au second étage.",
      'Sur le plan juridique, une médiation est en cours avec la propriétaire.',
    ],
  },
  {
    id: 'peinture',
    title: 'Activité peinture: 17/05',
    icon: Palette,
    body: [
      "L'atelier peinture du 17 mai a réuni une quinzaine de participant·es dans la cour arrière.",
      'Merci à toutes les personnes qui ont apporté du matériel et préparé le goûter !',
    ],
  },
]

export default function ArticlesPage() {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = articles.find((a) => a.id === openId)

  if (open) {
    const Icon = open.icon
    return (
      <>
        <button
          onClick={() => setOpenId(null)}
          className="mx-auto block rounded-full bg-secondary/80 px-4 py-2 text-sm font-medium text-secondary-foreground shadow hover:bg-secondary"
        >
          ← Retour aux articles
        </button>
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-md bg-background/80 shadow-inner">
            <Icon className="h-10 w-10" />
          </div>
        </div>
        <Panel title={open.title}>
          <div className="space-y-4 text-sm leading-relaxed">
            {open.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Panel>
      </>
    )
  }

  return (
    <Panel title="Articles">
      <div className="flex justify-center items-center w-full py-4">
        <span className="font-semibold">A venir..</span>
      </div>
      {/* Ancienne liste d'articles */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        { {articles.map((a) => {
          const Icon = a.icon
          return (
            <button
              key={a.id}
              onClick={() => setOpenId(a.id)}
              className="flex flex-col items-center gap-3 rounded-md bg-background/30 p-6 text-center transition-colors hover:bg-background/50"
            >
              <Icon className="h-10 w-10" />
              <span className="font-semibold">{a.title}</span>
            </button>
          )
        })} }
      </div>*/}
    </Panel>
  )
}
