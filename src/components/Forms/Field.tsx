const inputBase =
  'w-full border border-card-foreground/20 bg-background/95 px-4 py-2 text-foreground shadow-inner outline-none focus:ring-2 focus:ring-accent'

export function Field({
  label, name, type = 'text', required = false, min, max, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; min?: string; max?: string; placeholder?: string; }) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-center gap-4">
      <label htmlFor={name} className="text-right font-semibold">{label} :</label>
      <input id={name} name={name} type={type} required={required} min={min} max={max} placeholder={placeholder} className={inputBase + ' rounded-full'} />
    </div>
  )
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-md bg-card text-card-foreground px-8 py-8 shadow-md">
      <h2 className="mb-6 text-center text-xl font-bold font-display">{title}</h2>
      {children}
    </section>
  )
}

