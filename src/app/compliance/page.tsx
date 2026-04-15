import type { Metadata } from "next"
import Link from "next/link"
import { FlaskConical } from "lucide-react"

export const metadata: Metadata = {
  title: "Compliance",
  description:
    "Informatie over de kwaliteits- en complianceverplichtingen van Inovix: onderzoeksgebruik, GMP, en regelgeving.",
  robots: { index: true, follow: true },
}

export default function CompliancePage() {
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
        <span className="font-medium text-navy-500">Compliance</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-navy-500 md:text-4xl">
        Compliance
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        Inovix levert uitsluitend aan onderzoekers en laboratoria binnen de EU.
        Alle producten worden geproduceerd in GMP-gecertificeerde faciliteiten
        en afgeleverd met een Certificate of Analysis.
      </p>

      <div className="mt-8 flex items-center gap-3 border border-mauve-200 bg-mauve-50 px-5 py-4">
        <FlaskConical className="size-5 shrink-0 text-mauve-500" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-mauve-500">
          Alle producten zijn uitsluitend bestemd voor wetenschappelijk
          laboratoriumonderzoek. Niet voor menselijke consumptie of medische
          toepassing.
        </p>
      </div>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy-500 md:text-base">
        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Kwaliteitsstandaarden
          </h2>
          <p className="mt-3 text-muted-foreground">
            Elk product wordt geanalyseerd via HPLC en LC-MS door onafhankelijke
            Europese laboratoria. De gemiddelde zuiverheid bedraagt ≥99%.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Traceerbaarheid
          </h2>
          <p className="mt-3 text-muted-foreground">
            Elke batch heeft een uniek lotnummer dat herleidbaar is tot de
            syntheseproductielijn en het bijbehorende Certificate of Analysis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Regelgeving
          </h2>
          <p className="mt-3 text-muted-foreground">
            Inovix voldoet aan de relevante Europese wet- en regelgeving voor
            onderzoeksverbindingen. Producten vallen buiten de reikwijdte van de
            geneesmiddelenwet aangezien ze niet voor humane of veterinaire
            toepassing bestemd zijn.
          </p>
        </section>

        <section className="border-l-2 border-mauve-400 bg-mauve-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-mauve-500">
            In opbouw
          </p>
          <p className="mt-2 text-sm text-mauve-500">
            De volledige compliance-documentatie wordt momenteel afgerond en is
            beschikbaar vóór de officiële lancering.
          </p>
        </section>
      </div>
    </div>
  )
}
