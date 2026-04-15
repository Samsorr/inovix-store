import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Clock, ArrowRight } from "lucide-react"

import { ContactForm } from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact | Inovix",
  description:
    "Neem contact op met Inovix voor vragen over onze onderzoekspeptiden, bestellingen of samenwerkingen.",
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-10 text-[11px] uppercase tracking-wide text-navy-500/45"
      >
        <Link href="/" className="transition-colors hover:text-navy-500">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-mauve-500">Contact</span>
      </nav>

      {/* Hero header */}
      <div className="mb-10 md:mb-14">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-mauve-500">
          Neem contact op
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-navy-500 md:text-4xl">
          Hoe kunnen wij u helpen?
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
          Heeft u een vraag over een product, uw bestelling of een mogelijke
          samenwerking? Vul het onderstaande formulier in en wij nemen zo snel
          mogelijk contact met u op.
        </p>
      </div>

      {/* Info badges */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mb-14">
        <div className="flex items-center gap-3 border border-border bg-surface-secondary px-5 py-3.5">
          <Mail className="size-4 shrink-0 text-teal-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              E-mail
            </p>
            <p className="text-sm font-medium text-navy-500">
              info@inovix.eu
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 border border-border bg-surface-secondary px-5 py-3.5">
          <Clock className="size-4 shrink-0 text-teal-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Reactietijd
            </p>
            <p className="text-sm font-medium text-navy-500">
              Binnen 24 uur
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Two-column: form left, context right */}
      <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-5 md:gap-16 md:py-14">
        {/* Form */}
        <div className="md:col-span-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-navy-500">
            Contactformulier
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            Velden met een * zijn verplicht.
          </p>
          <ContactForm />
        </div>

        {/* Sidebar context */}
        <aside className="md:col-span-2">
          <div className="border border-border p-6 md:p-8">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-navy-500">
              Veelgestelde onderwerpen
            </p>
            <ul className="flex flex-col gap-4">
              {[
                {
                  title: "Productinformatie",
                  desc: "Vragen over specificaties, zuiverheid of beschikbaarheid van onze peptiden.",
                },
                {
                  title: "Bestelling & verzending",
                  desc: "Status van uw bestelling, levertijden of retouren.",
                },
                {
                  title: "Samenwerking",
                  desc: "Interesse in een zakelijke samenwerking of groothandel.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-teal-400" />
                  <div>
                    <p className="text-sm font-medium text-navy-500">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
