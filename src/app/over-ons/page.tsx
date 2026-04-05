import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Shield,
  FlaskConical,
  FileCheck,
  Snowflake,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { GradientSection } from "@/components/GradientSection"
import { SectionHeader } from "@/components/SectionHeader"
import { ScrollReveal } from "@/components/ScrollReveal"
import { ProcessTimeline } from "@/components/ProcessTimeline"
import { Navbar } from "@/components/Navbar"
import { HideDefaultNavbar } from "@/components/HideDefaultNavbar"

export const metadata: Metadata = {
  title: "Over Ons | Inovix",
  description:
    "Inovix levert hoogzuivere peptiden voor wetenschappelijk onderzoek aan laboratoria in heel Europa. Ontdek onze missie, kwaliteitsstandaarden en werkwijze.",
}

/* ─── Quality card (horizontal icon-left layout) ─── */

function QualityCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex h-full items-start gap-4 border border-border bg-white p-5 sm:p-6">
      <div className="flex size-10 shrink-0 items-center justify-center border border-border">
        <Icon className="size-5 text-teal-400" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-navy-500">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

/* ─── Page ─── */

export default function OverOnsPage() {
  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — gradient with integrated navbar
      ══════════════════════════════════════════ */}
      <HideDefaultNavbar />
      <section className="gradient-brand-subtle">
        <Navbar transparent />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:py-32 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <span className="text-xs font-medium uppercase tracking-widest text-teal-200">
                Over Inovix
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Wetenschap verdient precisie.{" "}
                <br className="hidden sm:block" />
                In elke stap.
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg md:mt-8">
                Inovix voorziet Europese onderzoekslaboratoria van hoogzuivere
                peptiden: gesynthetiseerd, gezuiverd en geverifieerd volgens de
                strengste kwaliteitsnormen.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ONS VERHAAL — text + image with floating badge
      ══════════════════════════════════════════ */}
      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <ScrollReveal>
              <div>
                <SectionHeader
                  title="Waarom Inovix bestaat"
                  subtitle="De brug tussen synthese en laboratorium"
                />
                <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground sm:mt-8 sm:text-base">
                  <p>
                    Europese onderzoekers verdienen toegang tot peptiden waarvan
                    de kwaliteit niet ter discussie staat. Toch is de markt
                    gefragmenteerd: lange levertijden, ondoorzichtige herkomst
                    en inconsistente zuiverheid zijn eerder regel dan
                    uitzondering.
                  </p>
                  <p>
                    Inovix is opgericht om dat te veranderen. Wij werken
                    uitsluitend met GMP-gecertificeerde synthesefaciliteiten,
                    voeren op elke batch onafhankelijke HPLC-analyse uit en
                    leveren de bijbehorende Certificate of Analysis standaard
                    mee. Geen meerprijs, geen extra aanvraag.
                  </p>
                  <p>
                    Het resultaat: verbindingen die u met vertrouwen kunt
                    inzetten in uw onderzoek, geleverd via een gekoelde keten
                    die de integriteit van synthese tot aan uw laboratoriumbank
                    waarborgt.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="relative">
                <div className="relative h-[300px] overflow-hidden border border-border sm:h-[380px] lg:h-[420px]">
                  <Image
                    src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800&q=80"
                    alt="Onderzoeker werkzaam in laboratorium"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-4 left-4 border border-border bg-white px-4 py-3 shadow-sm sm:left-8">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Kwaliteitsstandaard
                  </p>
                  <p className="text-xl font-bold tabular-nums text-teal-400">
                    ≥98%
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    HPLC-geverifieerde zuiverheid
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          KWALITEIT — asymmetric: text left, 2×2 cards right
      ══════════════════════════════════════════ */}
      <section className="border-y border-border bg-surface-secondary">
        <div className="section-y mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-20">
              <ScrollReveal className="lg:col-span-2">
                <SectionHeader title="Onze kwaliteitsstandaard" />
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base">
                  Kwaliteit is geen marketingterm, het is een meetbare
                  standaard. Elke verbinding die ons magazijn verlaat is
                  traceerbaar, onafhankelijk geverifieerd en gedocumenteerd tot
                  op batchniveau.
                </p>
              </ScrollReveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
                <ScrollReveal delay={0.05}>
                  <QualityCard
                    icon={Shield}
                    title="GMP-gecertificeerd"
                    description="Productie in faciliteiten die voldoen aan Good Manufacturing Practice richtlijnen."
                  />
                </ScrollReveal>
                <ScrollReveal delay={0.1}>
                  <QualityCard
                    icon={FlaskConical}
                    title="HPLC-verificatie"
                    description="Reverse-phase analyse op elke batch garandeert een zuiverheid van ≥98%."
                  />
                </ScrollReveal>
                <ScrollReveal delay={0.15}>
                  <QualityCard
                    icon={FileCheck}
                    title="Certificate of Analysis"
                    description="Batchspecifiek CoA met volledige analytische data bij elke bestelling."
                  />
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <QualityCard
                    icon={Snowflake}
                    title="Cold-chain logistiek"
                    description="Temperatuurgecontroleerde opslag en verzending waarborgen de integriteit."
                  />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

      {/* ══════════════════════════════════════════
          PROCES — timeline with numbered circles
      ══════════════════════════════════════════ */}
      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeader
              title="Van synthese tot levering"
              subtitle="Elk peptide doorloopt een gecontroleerd traject van vier stappen."
              centered
            />
          </ScrollReveal>
          <div className="mt-12 lg:mt-16">
            <ProcessTimeline
              steps={[
                {
                  step: "01",
                  title: "Synthese",
                  description:
                    "Solid-phase peptide synthese (SPPS) in GMP-gecertificeerde faciliteiten met gevalideerde protocollen en hoogwaardige aminozuren.",
                },
                {
                  step: "02",
                  title: "Zuivering",
                  description:
                    "Preparatieve HPLC-zuivering verwijdert onzuiverheden en bereikt de gewenste zuiverheidsgraad van ≥98%.",
                },
                {
                  step: "03",
                  title: "Verificatie",
                  description:
                    "Onafhankelijke laboratoriumanalyse met massa-spectrometrie en analytische HPLC. Generatie van batchspecifiek CoA.",
                },
                {
                  step: "04",
                  title: "Verzending",
                  description:
                    "Gelyofiliseerd product, vacuüm verpakt en verzonden via temperatuurgecontroleerd transport binnen de EU.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA + CIJFERS — combined in gradient
      ══════════════════════════════════════════ */}
      <GradientSection>
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 md:py-24 lg:py-28">
          {/* Stats row */}
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/15">
              {(
                [
                  { value: "≥98%", label: "Zuiverheid" },
                  { value: "CoA", label: "Per batch" },
                  { value: "EU-breed", label: "Levering" },
                  { value: "2–8°C", label: "Transport" },
                ] as const
              ).map(({ value, label }) => (
                <div
                  key={value}
                  className="flex flex-col items-center gap-1.5 text-center md:px-6"
                >
                  <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
                    {value}
                  </span>
                  <span className="text-xs text-white/50 sm:text-sm">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="mx-auto my-10 h-px max-w-xs bg-white/15 sm:my-14" />

          {/* CTA */}
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
                Klaar om samen te werken?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:mt-5 md:text-base">
                Ontdek ons assortiment van hoogzuivere peptiden voor uw
                onderzoeksproject, of neem contact met ons op voor advies op
                maat.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    variant="primaryOnDark"
                    size="lg"
                    fullWidth
                    className="sm:w-auto"
                  >
                    Bekijk Catalogus
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button
                    variant="ghostOnDark"
                    size="lg"
                    fullWidth
                    className="sm:w-auto"
                  >
                    Neem Contact Op
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </Link>
              </div>
              <p className="mt-10 flex items-center justify-center gap-1.5 text-xs text-white/40">
                <FlaskConical className="size-3 shrink-0" />
                Alle producten zijn uitsluitend bestemd voor
                laboratoriumonderzoek. Niet voor menselijke of veterinaire
                consumptie.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </GradientSection>
    </>
  )
}
