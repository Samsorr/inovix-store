import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informatie over hoe Inovix uw persoonsgegevens verwerkt in overeenstemming met de AVG (GDPR).",
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
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
        <span className="font-medium text-navy-500">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-navy-500 md:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        Deze pagina beschrijft hoe Inovix persoonsgegevens verwerkt in
        overeenstemming met de Algemene Verordening Gegevensbescherming (AVG /
        GDPR) en de Nederlandse Uitvoeringswet AVG.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy-500 md:text-base">
        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Verwerkingsverantwoordelijke
          </h2>
          <p className="mt-3 text-muted-foreground">
            Inovix | [Bedrijfsnaam] | [Adres] | [KvK-nummer] | [BTW-nummer] |
            privacy@inovix.eu
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Welke gegevens verwerken wij?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Bij een bestelling, accountregistratie of contactaanvraag
            verwerken wij onder andere: naam, e-mailadres, afleveradres,
            factuuradres, betaalgegevens en bestelgeschiedenis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Waarvoor gebruiken wij uw gegevens?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Uw gegevens worden uitsluitend gebruikt voor het verwerken van
            bestellingen, klantcommunicatie, fraudepreventie en het voldoen aan
            wettelijke verplichtingen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Uw rechten
          </h2>
          <p className="mt-3 text-muted-foreground">
            U heeft recht op inzage, rectificatie, verwijdering, beperking,
            overdraagbaarheid en bezwaar. Neem contact op via privacy@inovix.eu.
          </p>
        </section>

        <section className="border-l-2 border-mauve-400 bg-mauve-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-mauve-500">
            In opbouw
          </p>
          <p className="mt-2 text-sm text-mauve-500">
            Deze privacyverklaring wordt momenteel door onze juridische adviseur
            opgesteld. De definitieve versie is beschikbaar vóór de officiële
            lancering.
          </p>
        </section>
      </div>
    </div>
  )
}
