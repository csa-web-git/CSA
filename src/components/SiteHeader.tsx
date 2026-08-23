'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mainLinks = [
  { href: '/programme', label: 'Programme' },
  { href: '/activites', label: 'Activites' },
  { href: '/soutien-materiel', label: 'Soutien' },
  { href: '/Communiques', label: 'Communiques' },
  { href: '/kiosk', label: 'Kiosk' },
  { href: '/pixel', label: 'Pixel!'}
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="w-full bg-header py-5 px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 flex-wrap">
        {menuOpen 
        && (
        <div className="md:hidden mt-4 flex flex-col gap-2">
          {[...mainLinks].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={[
                'rounded-md px-4 py-3 text-center font-medium',
                isActive(l.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground',
              ].join(' ')}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )
      }


        <Link href="/" className="font-display text-base font-bold leading-tight text-header-foreground block">
          Centre
          <br />
          Social
          <br />
          Autogéré
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-header-foreground text-3xl"
        >
        ☰
        </button>

        <div className="hidden md:flex flex-1 items-center justify-center gap-3 flex-wrap">
          {mainLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                'rounded-md px-6 py-3 text-sm font-medium shadow-sm transition-colors',
                isActive(l.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              ].join(' ')}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
