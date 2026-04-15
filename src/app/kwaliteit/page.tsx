import type { Metadata } from "next"
import Link from "next/link"
import { FlaskConical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/ScrollReveal"
import { HideDefaultNavbar } from "@/components/HideDefaultNavbar"
import { KwaliteitHero } from "@/components/kwaliteit/KwaliteitHero"
import { StatsBar } from "@/components/kwaliteit/StatsBar"
import { KwaliteitProcessTimeline } from "@/components/kwaliteit/ProcessTimeline"
import { MethodCards } from "@/components/kwaliteit/MethodCards"
import { CertWall } from "@/components/kwaliteit/CertWall"
import { CoaPreview } from "@/components/kwaliteit/CoaPreview"
import { QualitySeal } from "@/components/kwaliteit/QualitySeal"

export const metadata: Metadata = {
  title: "Kwaliteit & Analyse | Inovix",
  description:
    "Ontdek de kwaliteitsstandaarden van Inovix. ≥99% zuiverheid, 6 tests per batch, HPLC-analyse, LC-MS verificatie en onafhankelijke Europese laboratoriumcontrole.",
}

const eduSteps = [
  {
    num: 1,
    title: "Productidentificatie",
    desc: "Controleer productnaam, lotnummer en productiedatum. Deze moeten overeenkomen met het etiket op uw product.",
  },
  {
    num: 2,
    title: "Zuiverheid (HPLC)",
    desc: "Het belangrijkste getal op het certificaat. Geeft het percentage actief peptide aan. Inovix specificeert ≥99% voor alle producten.",
  },
  {
    num: 3,
    title: "Moleculaire Identiteit (MS)",
    desc: "Het gemeten molecuulgewicht moet overeenkomen met de theoretische waarde. Een afwijking van <0.1% is normaal en acceptabel.",
  },
  {
    num: 4,
    title: "Veiligheidsparameters",
    desc: 'Endotoxine- en bioburden resultaten. "Conform" betekent dat waarden binnen de limieten van de Europese Farmacopee vallen.',
  },
]

export default function KwaliteitPage() {
  return (
    <>
      {/* ① Hero */}
      <HideDefaultNavbar />
      <KwaliteitHero />

      {/* ② Stats Bar */}
      <StatsBar />

      {/* ③ Process Timeline */}
      <KwaliteitProcessTimeline />

      {/* ④ Deep Dive: Methods + Certifications */}
      <section className="border-t border-border bg-white">
        <div className="section-y mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Onze Standaard
            </p>
            <h2 className="mt-2 text-xl font-bold text-navy-500 sm:text-2xl">
              Analysemethoden & Certificeringen
            </h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-12 sm:mt-12 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <MethodCards />
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <CertWall />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ⑤ Educational: How to Read a CoA */}
      <section className="border-t border-border bg-surface-secondary">
        <div className="section-y mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Kennisbank
            </p>
            <h2 className="mt-2 text-xl font-bold text-navy-500 sm:text-2xl">
              Hoe leest u een Certificaat van Analyse?
            </h2>
          </ScrollReveal>

          <div className="mt-8 grid items-start gap-10 sm:mt-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <ScrollReveal>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:mb-7">
                Elk Inovix-product wordt geleverd met een Certificaat van
                Analyse (CoA). Dit document bevat de volledige testresultaten
                van uw specifieke batch. Hier leest u waar u op moet letten:
              </p>
              <div className="flex flex-col">
                {eduSteps.map((step, i) => (
                  <div
                    key={step.num}
                    className={`grid grid-cols-[32px_1fr] gap-3.5 py-4 ${
                      i < eduSteps.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="mt-0.5 flex size-7 items-center justify-center border border-mauve-500 text-xs font-bold text-mauve-500">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-navy-500">
                        {step.title}
                      </h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <CoaPreview />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ⑥ Research Disclaimer (matches homepage pattern) */}
      <section className="border-y border-mauve-200 bg-mauve-50">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 px-4 py-8 text-center sm:py-10">
          <FlaskConical className="size-5 shrink-0 text-mauve-400" />
          <p className="text-sm leading-relaxed text-mauve-500">
            Alle producten van Inovix zijn uitsluitend bestemd voor
            wetenschappelijk onderzoek en laboratoriumtoepassingen. Niet bestemd
            voor menselijke consumptie.
          </p>
        </div>
      </section>

      {/* ⑦ CTA */}
      <section className="relative overflow-hidden bg-navy-500 text-center">
        <div className="relative mx-auto max-w-[600px] px-4 py-14 sm:px-6 sm:py-20">
          <QualitySeal />
          <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
            Overtuigd van onze kwaliteit?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
            Elk product in onze catalogus wordt geleverd met een volledig
            Certificaat van Analyse. Uw onderzoek verdient de hoogste
            zuiverheid.
          </p>
          <Link href="/products" className="mt-8 inline-block">
            <Button variant="primaryOnDark" size="lg">
              Bekijk Catalogus
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
