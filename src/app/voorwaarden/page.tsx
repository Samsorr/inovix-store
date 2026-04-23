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
            Inovix en de klant. Alle producten worden uitsluitend geleverd
            voor wetenschappelijk laboratoriumonderzoek en zijn niet bestemd
            voor menselijke of veterinaire consumptie.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Bestelproces
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum dolor sit amet. Een overeenkomst komt tot stand nadat
            Inovix de bestelling schriftelijk of per e-mail heeft bevestigd.
            Inovix behoudt zich het recht voor bestellingen zonder opgave van
            redenen te weigeren, met name bij vermoeden van oneigenlijk
            gebruik.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Prijzen en betaling
          </h2>
          <p className="mt-3 text-muted-foreground">
            Alle prijzen zijn in euro en inclusief de wettelijk verschuldigde
            btw, tenzij anders vermeld. Betaling vindt plaats via Viva Wallet
            volgens de bij het bestelproces getoonde opties. Bij niet-tijdige
            betaling is de klant van rechtswege in verzuim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Levering
          </h2>
          <p className="mt-3 text-muted-foreground">
            Bestellingen worden zorgvuldig verpakt en snel verzonden binnen
            de Europese Unie. De opgegeven levertermijnen zijn indicatief;
            overschrijding geeft geen recht op schadevergoeding of
            ontbinding.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Eigendomsvoorbehoud
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum. Alle geleverde producten blijven eigendom van Inovix
            totdat de klant de volledige koopsom, inclusief eventuele
            bijkomende kosten, heeft voldaan.
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
            bedenktijd van veertien dagen na ontvangst.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Garantie en conformiteit
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum dolor sit amet. Inovix staat in voor de zuiverheid en
            samenstelling zoals vermeld in het Certificate of Analysis dat
            bij elke batch wordt geleverd. Klachten dienen binnen zeven dagen
            na ontvangst schriftelijk te worden gemeld.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Aansprakelijkheid
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum. De aansprakelijkheid van Inovix is beperkt tot het
            factuurbedrag van de betreffende bestelling. Inovix is niet
            aansprakelijk voor schade die voortvloeit uit oneigenlijk gebruik
            van de producten of gebruik buiten de beoogde onderzoekscontext.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Overmacht
          </h2>
          <p className="mt-3 text-muted-foreground">
            In geval van overmacht is Inovix gerechtigd de uitvoering van de
            overeenkomst op te schorten. Onder overmacht wordt onder meer
            verstaan: leveranciersuitval, transportstoringen, pandemieën en
            overheidsmaatregelen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Intellectuele eigendom
          </h2>
          <p className="mt-3 text-muted-foreground">
            Alle inhoud, waaronder teksten, afbeeldingen, productnamen en
            analysecertificaten, is eigendom van Inovix. Verveelvoudiging
            zonder voorafgaande schriftelijke toestemming is niet toegestaan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Toepasselijk recht
          </h2>
          <p className="mt-3 text-muted-foreground">
            Op alle overeenkomsten is Nederlands recht van toepassing.
            Geschillen worden voorgelegd aan de bevoegde rechter in het
            arrondissement waar Inovix is gevestigd, tenzij dwingend recht
            anders voorschrijft.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Wijzigingen
          </h2>
          <p className="mt-3 text-muted-foreground">
            Inovix is gerechtigd deze voorwaarden te wijzigen. De meest
            actuele versie is te allen tijde beschikbaar op deze pagina.
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-navy-500/50">
        Laatst bijgewerkt: [datum]. De definitieve algemene voorwaarden worden
        door onze juridische adviseur afgerond vóór de officiële lancering.
      </p>
    </div>
  )
}
