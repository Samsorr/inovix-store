import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Algemene Voorwaarden",
  description:
    "De algemene verkoop- en leveringsvoorwaarden van Inovix voor bestellingen binnen de EU.",
  robots: { index: true, follow: true },
}

export default function VoorwaardenPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-10 text-[11px] uppercase tracking-wide text-navy-500/45"
      >
        <Link href="/" className="transition-colors hover:text-navy-500">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-navy-500">Algemene Voorwaarden</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-navy-500 md:text-4xl">
        Algemene Voorwaarden
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        Deze pagina bevat de verkoop- en leveringsvoorwaarden van Inovix voor
        bestellingen binnen de Europese Unie.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy-500 md:text-base">
        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Toepassingsgebied
          </h2>
          <p className="mt-3 text-muted-foreground">
            Deze voorwaarden zijn van toepassing op alle overeenkomsten tussen
            Inovix en de klant. Alle producten worden uitsluitend geleverd voor
            wetenschappelijk laboratoriumonderzoek.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Prijzen en betaling
          </h2>
          <p className="mt-3 text-muted-foreground">
            Alle prijzen zijn exclusief btw, tenzij anders vermeld. Betaling
            vindt plaats via Viva Wallet volgens de bij het bestelproces
            getoonde opties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Levering
          </h2>
          <p className="mt-3 text-muted-foreground">
            Bestellingen worden verzonden via een temperatuurgecontroleerde
            koelketen. Levering vindt plaats binnen de EU.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Herroepingsrecht
          </h2>
          <p className="mt-3 text-muted-foreground">
            Voor verzegelde producten die uit hygiënische of
            gezondheidsbeschermings-overwegingen niet geschikt zijn om terug te
            sturen, geldt het wettelijk herroepingsrecht niet zodra de
            verzegeling is verbroken. Voor overige producten geldt een
            bedenktijd van 14 dagen.
          </p>
        </section>

        <section className="border-l-2 border-mauve-400 bg-mauve-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-mauve-500">
            In opbouw
          </p>
          <p className="mt-2 text-sm text-mauve-500">
            De definitieve algemene voorwaarden worden door onze juridische
            adviseur opgesteld en zijn beschikbaar vóór de officiële lancering.
          </p>
        </section>
      </div>
    </div>
  )
}
