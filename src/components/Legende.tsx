import type { Category } from '@/payload-types'

type LegendeProps = {
  categories: Category[]
}

export function Legende({ categories }: LegendeProps) {
  return (
    <div className="ml-auto w-fit rounded-md bg-header/80 p-3 text-xs text-header-foreground">
      <div className="mb-2 text-center font-bold">LÉGENDE</div>
      <ul className="space-y-1">
        {categories?.map((c) => (
          <li key={c.id} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-4 rounded"
              style={{ backgroundColor: c.couleur ?? '#ccc' }}
            />
            <span>{c.nom}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
