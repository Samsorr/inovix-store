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
            Europese laboratoria. De gemiddelde zuiverheid bedraagt ≥99%. Alle
            analyses worden uitgevoerd conform ISO/IEC 17025.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Certificate of Analysis
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum dolor sit amet. Bij elke levering wordt een batch-
            specifiek Certificate of Analysis meegezonden waarin de zuiverheid,
            retentietijd, massadetectie en fysische eigenschappen van de
            betreffende lot zijn vastgelegd. Het CoA is tevens digitaal
            opvraagbaar in uw account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Traceerbaarheid
          </h2>
          <p className="mt-3 text-muted-foreground">
            Elke batch heeft een uniek lotnummer dat herleidbaar is tot de
            syntheseproductielijn, de gebruikte grondstoffen en het
            bijbehorende Certificate of Analysis. Traceerbaarheid wordt
            minimaal tien jaar bewaard.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Productieomgeving
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum. Synthese vindt plaats in gecontroleerde
            cleanroomfaciliteiten die voldoen aan GMP-richtlijnen. Temperatuur,
            vochtigheid en kruisbesmettingsrisico&apos;s worden continu
            gemonitord.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Snelle EU-verzending
          </h2>
          <p className="mt-3 text-muted-foreground">
            Gelyofiliseerde peptiden worden zorgvuldig verpakt in
            beschermende verpakkingen en snel verzonden binnen de
            Europese Unie. Elke zending wordt getrackt tot aflevering.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Regelgeving
          </h2>
          <p className="mt-3 text-muted-foreground">
            Inovix voldoet aan de relevante Europese wet- en regelgeving voor
            onderzoeksverbindingen. Producten vallen buiten de reikwijdte van
            de geneesmiddelenwet aangezien ze niet voor humane of veterinaire
            toepassing bestemd zijn. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Gebruiksbeperkingen
          </h2>
          <p className="mt-3 text-muted-foreground">
            Door een bestelling te plaatsen bevestigt de klant dat de
            producten uitsluitend gebruikt zullen worden voor in-vitro
            laboratoriumonderzoek. Doorverkoop aan particulieren of gebruik in
            humane of veterinaire toepassingen is uitdrukkelijk niet
            toegestaan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Meldingen en klachten
          </h2>
          <p className="mt-3 text-muted-foreground">
            Afwijkingen of vermoedens van oneigenlijk gebruik kunnen worden
            gemeld via compliance@inovix.eu. Meldingen worden vertrouwelijk
            behandeld en conform ons interne protocol onderzocht.
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-navy-500/50">
        Laatst bijgewerkt: [datum]. De volledige compliance-documentatie wordt
        afgerond vóór de officiële lancering.
      </p>
    </div>
  )
}
