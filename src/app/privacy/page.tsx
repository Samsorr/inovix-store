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
        <Link href="/" className="inline-flex items-center py-1.5 -my-1.5 transition-colors hover:text-navy-500">
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
            Inovix | [Bedrijfsnaam B.V.] | [Straatnaam 00, 0000 AA Plaats] |
            KvK: [00000000] | BTW: NL[000000000]B01 | privacy@inovix.eu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Welke gegevens verwerken wij?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Bij een bestelling, accountregistratie of contactaanvraag
            verwerken wij onder andere: naam, e-mailadres, afleveradres,
            factuuradres, betaalgegevens (afgehandeld door onze
            betaaldienstverlener), bestelgeschiedenis, IP-adres en
            apparaatgegevens voor fraudepreventie.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Waarvoor gebruiken wij uw gegevens?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Uw gegevens worden uitsluitend gebruikt voor het verwerken van
            bestellingen, klantcommunicatie, fraudepreventie, boekhoudkundige
            verplichtingen en het voldoen aan wettelijke verplichtingen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Rechtsgrondslag
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum dolor sit amet. De verwerking is gebaseerd op: (a) de
            uitvoering van de overeenkomst wanneer u een bestelling plaatst;
            (b) een wettelijke verplichting voor boekhouding en fiscale
            rapportage; (c) uw toestemming voor marketingcommunicatie en
            optionele cookies; (d) ons gerechtvaardigd belang bij
            fraudepreventie en verbetering van onze dienstverlening.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Bewaartermijnen
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum. Bestelgegevens worden zeven jaar bewaard conform de
            fiscale bewaarplicht. Accountgegevens worden bewaard zolang uw
            account actief is en tot twaalf maanden na de laatste activiteit.
            Marketingtoestemmingen worden bewaard tot intrekking.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Delen met derden
          </h2>
          <p className="mt-3 text-muted-foreground">
            Wij delen uw gegevens uitsluitend met verwerkers die noodzakelijk
            zijn voor onze dienstverlening: betaaldienstverlener, vervoerders,
            e-mailprovider, hostingdienst en boekhouder. Met elke verwerker is
            een verwerkersovereenkomst gesloten. Wij verkopen uw gegevens
            nooit aan derden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Cookies
          </h2>
          <p className="mt-3 text-muted-foreground">
            Inovix gebruikt noodzakelijke cookies voor de werking van de
            website en optionele cookies voor functionaliteit, analyse en
            marketing. U kunt uw cookievoorkeuren op elk moment aanpassen via
            de cookiebanner onderaan de pagina.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Doorgifte buiten de EU
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum. Indien wij gegevens doorgeven aan verwerkers buiten
            de Europese Economische Ruimte, doen wij dat uitsluitend op basis
            van door de Europese Commissie goedgekeurde
            standaardcontractbepalingen of een adequaatheidsbesluit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Beveiliging
          </h2>
          <p className="mt-3 text-muted-foreground">
            Wij nemen passende technische en organisatorische maatregelen om
            uw gegevens te beschermen tegen verlies, misbruik en ongeautoriseerde
            toegang, waaronder TLS-versleuteling, toegangscontrole en
            periodieke beveiligingsaudits.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Uw rechten
          </h2>
          <p className="mt-3 text-muted-foreground">
            U heeft recht op inzage, rectificatie, verwijdering, beperking,
            overdraagbaarheid en bezwaar. Ook kunt u een eerder verleende
            toestemming op elk moment intrekken. Verzoeken kunt u indienen via
            privacy@inovix.eu. Wij reageren binnen één maand.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Klacht indienen
          </h2>
          <p className="mt-3 text-muted-foreground">
            Bent u het niet eens met de wijze waarop wij uw gegevens verwerken?
            Dan heeft u het recht een klacht in te dienen bij de Autoriteit
            Persoonsgegevens via{" "}
            <a
              href="https://autoriteitpersoonsgegevens.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 underline-offset-2 hover:underline"
            >
              autoriteitpersoonsgegevens.nl
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Wijzigingen
          </h2>
          <p className="mt-3 text-muted-foreground">
            Deze privacyverklaring kan van tijd tot tijd worden aangepast. De
            meest actuele versie is te allen tijde beschikbaar op deze pagina.
            Bij materiële wijzigingen informeren wij u vooraf.
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-navy-500/50">
        Laatst bijgewerkt: [datum]. Dit document wordt door onze juridische
        adviseur afgerond vóór de officiële lancering.
      </p>
    </div>
  )
}
