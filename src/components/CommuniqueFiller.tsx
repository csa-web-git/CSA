// src/components/communiques/CommuniqueFiller.tsx
import { FileText, ExternalLink } from 'lucide-react'

export function CommuniqueFiller({ type }: { type: 'document' | 'lien-externe' }) {
  const Icon = type === 'document' ? FileText : ExternalLink
  const label = type === 'document' ? 'Document' : 'Lien externe'

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70">
      <span className="flex items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
    </div>
  )
}