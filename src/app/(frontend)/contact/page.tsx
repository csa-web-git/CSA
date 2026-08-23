import { Panel } from '@/components/Panel'

export const metadata = {
  title: 'Contact — Collectif',
  description: 'Adresse, lien Signal et email pour nous contacter.',
}

export default function ContactPage() {
  return (
    <Panel title="Contact">
      <div className="space-y-3 text-sm leading-relaxed">
        <p>
          <span className="font-semibold">Adresse:</span>{' '}
          <a
            href="https://maps.app.goo.gl/2UHbABqNjd7ZTnqx7"
            target="_blank"
            rel="noopener noreferrer"
            className="
    text-orange-100
    border-b border-orange-200/40
    hover:text-white
    hover:border-orange-100
    transition
  "
          >
            Pl. Xavier Neujean 9, 4000 Liège
          </a>
        </p>
        {/* <p>
          <span className="font-semibold">Lien signal:</span> ..
        </p>
        <p>
          <span className="font-semibold">Adresse email:</span> csa@gmail.be
        </p> */}
      </div>
    </Panel>
  )
}
