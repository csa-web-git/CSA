// src/app/(frontend)/soutien-materiel/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function SoutienMaterielPage() {
  const payload = await getPayload({ config })

  const { docs: besoins } = await payload.find({
    collection: 'besoins-materiels',
    limit: 200,
    sort: 'fait', // false avant true — non comblés d'abord
  })

  const aFaire = besoins.filter((b) => !b.fait)
  const combles = besoins.filter((b) => b.fait)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold font-display mb-6">
        Soutien matériel
      </h1>

      <div className="space-y-3 mb-10">
        <h2 className="text-sm font-semibold uppercase opacity-60">Recherchés</h2>
        {aFaire.map((besoin) => (
          <div key={besoin.id} className="rounded-md bg-card text-card-foreground px-6 py-4 shadow-sm">
            <h3 className="font-semibold">{besoin.titre}</h3>
            {besoin.description && <p className="mt-1 text-sm opacity-80">{besoin.description}</p>}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase opacity-60">Comblés</h2>
        {combles.map((besoin) => (
          <div key={besoin.id} className="rounded-md bg-card/40 text-card-foreground/50 px-6 py-4 shadow-sm">
            <h3 className="font-semibold line-through">{besoin.titre}</h3>
            {besoin.description && <p className="mt-1 text-sm opacity-70">{besoin.description}</p>}
          </div>
        ))}
        
        {besoins.length === 0 && (
          <p className="text-center text-sm opacity-50 py-8">
            Aucun besoin matériel pour le moment.
          </p>
        )}
      </div>    
    </div>
  )
}