import { Crimson_Text, Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { Special_Elite } from 'next/font/google'
// import { FloatingFormButton } from '@/components/Forms/FloatingFormButton'


const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700'],
  display: 'swap',
})


const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-elite',
})

const bodyFont = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Centre Social Autogéré',
  description: 'Centre social autogéré — programme, équipes, hébergement, réservation de salle.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable} ${specialElite.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="px-4 py-10 space-y-10">{children}</main>
        {/* <FloatingFormButton /> */}
        <SiteFooter />
      </body>
    </html>
  )
}
