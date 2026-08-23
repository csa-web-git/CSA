import type { ReactNode } from 'react'

export function Panel({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`mx-auto w-full max-w-5xl rounded-md bg-card text-card-foreground px-8 py-8 shadow-md ${className}`}
    >
      {title && <h2 className="mb-6 text-center text-xl font-semibold">{title}</h2>}
      {children}
    </section>
  )
}
