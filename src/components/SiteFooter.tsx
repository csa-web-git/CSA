// src/components/SiteFooter.tsx
import Link from 'next/link'

// — Configuration en dur, à éditer directement ici —
const CONTACT = {
  adresse: 'Pl. Xavier Neujean 9, 4000 Liège',
  adresse_link: 'https://www.openstreetmap.org/?mlat=50.643188&mlon=5.568706#map=18/50.643186/5.568706',
  // telephone: '+32 4XX XX XX XX',
}

const SITES_AMIS = [
  { label: 'Stuut', url: 'https://stuut.info/' },
  // ajoute d'autres entrées ici
]

const RESEAUX = [
  { label: 'Instagram', url: 'https://www.instagram.com/csa.liege/' },
]

const ACCES_RAPIDES = [
  { label: 'Accueil',        href: '/' },
  { label: 'Programme',        href: '/programme' },
  { label: 'Activites',          href: '/activites' },
  { label: 'Soutien matériel', href: '/soutien-materiel' },
  { label: 'Communiques',            href: '/Communiques' },
  { label: 'Kiosk',            href: '/kiosk' },
]

export function SiteFooter() {
  return (
    <footer className="w-full bg-header text-header-foreground py-10 px-6 mt-auto">
      <div className="mx-auto max-w-7xl grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">

        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 font-display">
            Contact
          </h3>
          <ul className="space-y-1.5 text-sm opacity-80">
            <li><a href={CONTACT.adresse_link} target="_blank" rel="noopener noreferrer" className="text-orange-100 border-b border-orange-200/40 hover:text-white hover:border-orange-100 transition">
            {CONTACT.adresse}</a></li>
            {/* <li>
              <a href={`tel:${CONTACT.telephone.replace(/\s/g, '')}`} className="hover:opacity-70 transition-opacity">
                {CONTACT.telephone}
              </a>
            </li> */}
          </ul>
        </div>

        {/* Accès rapides */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 font-display">
            Accès rapides
          </h3>
          <ul className="space-y-1.5 text-sm opacity-80">
            {ACCES_RAPIDES.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:opacity-70 transition-opacity">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sites amis */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 font-display">
            Sites amis
          </h3>
          <ul className="space-y-1.5 text-sm opacity-80">
            {SITES_AMIS.map((site) => (
              <li key={site.url}>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  {site.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Réseaux */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 font-display">
            Réseaux
          </h3>
          <ul className="space-y-1.5 text-sm opacity-80">
            {RESEAUX.map((reseau) => (
              <li key={reseau.url}>
                <a href={reseau.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  {reseau.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </footer>
  )
}