import type { Metadata } from "next"
import Link from "next/link"
import { Building2, Mail, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Juridische informatie",
  description:
    "Bedrijfsgegevens, registratienummers en contactinformatie van Inovix conform EU-wetgeving.",
  robots: { index: true, follow: true },
}

export default function JuridischPage() {
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
        <span className="font-medium text-navy-500">Juridisch</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-navy-500 md:text-4xl">
        Juridische informatie
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        Conform de Europese regelgeving publiceren wij hieronder de volledige
        bedrijfs- en contactgegevens van de exploitant van deze website.
      </p>

      <section className="mt-10 border border-border bg-surface-secondary p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center border border-border bg-white">
            <Building2 className="size-5 text-teal-400" />
          </div>
          <h2 className="text-lg font-bold text-navy-500 sm:text-xl">
            Bedrijfsgegevens
          </h2>
        </div>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500/50">
              Handelsnaam
            </dt>
            <dd className="mt-1 text-sm text-navy-500">
              Inovix [Bedrijfsnaam B.V.]
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500/50">
              Rechtsvorm
            </dt>
            <dd className="mt-1 text-sm text-navy-500">
              Besloten Vennootschap
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500/50">
              Vestigingsadres
            </dt>
            <dd className="mt-1 text-sm text-navy-500">
              [Straatnaam 00]
              <br />
              [0000 AA] [Plaats]
              <br />
              Nederland
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500/50">
              KvK-nummer
            </dt>
            <dd className="mt-1 font-mono text-sm text-navy-500">
              [00000000]
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500/50">
              BTW-identificatienummer
            </dt>
            <dd className="mt-1 font-mono text-sm text-navy-500">
              NL[000000000]B01
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500/50">
              Bevoegd vertegenwoordiger
            </dt>
            <dd className="mt-1 text-sm text-navy-500">
              [Naam], [Functie]
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 border border-border bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-navy-500 sm:text-xl">Contact</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-teal-400" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-500/50">
                E-mail
              </p>
              <a
                href="mailto:info@inovix.eu"
                className="mt-1 block text-sm text-navy-500 underline-offset-2 hover:text-teal-400 hover:underline"
              >
                info@inovix.eu
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-teal-400" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-500/50">
                Telefoon
              </p>
              <p className="mt-1 text-sm text-navy-500">
                [+31 (0)00 000 0000]
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy-500 md:text-base">
        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Toezichthouder
          </h2>
          <p className="mt-3 text-muted-foreground">
            Inovix is geregistreerd bij de Kamer van Koophandel en staat onder
            toezicht van de relevante Nederlandse en Europese autoriteiten voor
            e-commerce en productveiligheid. Specifieke toezichtsinformatie
            wordt aangevuld vóór lancering.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Geschillenbeslechting
          </h2>
          <p className="mt-3 text-muted-foreground">
            Conform artikel 14 lid 1 van de ODR-Verordening wijzen wij u op het
            platform voor online geschillenbeslechting van de Europese
            Commissie. U vindt dit platform op{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 underline-offset-2 hover:underline"
            >
              ec.europa.eu/consumers/odr
            </a>
            . Inovix is niet verplicht deel te nemen aan een geschillenprocedure
            voor een consumentengeschillencommissie.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Aansprakelijkheid
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. De inhoud
            van deze website is met uiterste zorg samengesteld. Inovix
            aanvaardt echter geen aansprakelijkheid voor eventuele onjuistheden
            of onvolledigheden. Aan de informatie op deze website kunnen geen
            rechten worden ontleend.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
            Auteursrecht
          </h2>
          <p className="mt-3 text-muted-foreground">
            Alle inhoud op deze website | inclusief teksten, afbeeldingen,
            merken en vormgeving | is eigendom van Inovix of de betreffende
            rechthebbenden. Verveelvoudiging of openbaarmaking zonder
            voorafgaande schriftelijke toestemming is niet toegestaan.
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-navy-500/50">
        Laatst bijgewerkt: [datum]. De definitieve bedrijfsgegevens worden
        ingevuld zodra de juridische entiteit is geregistreerd.
      </p>
    </div>
  )
}
