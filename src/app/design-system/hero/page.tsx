"use client"

import { Beaker, ArrowRight, FlaskConical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

/* ═══════════════════════════════════════════════════
   VARIANT A — Gradient alleen rechts (splitscreen)
   Stitch layout links, klant-gradient rechts
═══════════════════════════════════════════════════ */

function HeroSplitscreen() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-2">
        {/* Text — wit */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:py-24 lg:pr-16">
          <span className="text-xs font-medium uppercase tracking-widest text-teal-400">
            Premium Research Grade
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-navy-500 md:text-5xl">
            De Toekomst
            <br />
            van <span className="text-teal-400">Peptide</span>
            <br />
            Onderzoek
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Hoogwaardige verbindingen met een zuiverheid van meer dan 99%,
            gevalideerd door onafhankelijke laboratoria voor precisie-onderzoek.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="secondary" size="md">
              Bekijk Catalogus
            </Button>
            <span className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-teal-400">
              Onze Kwaliteitsstandaard
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>

        {/* Image — gradient achtergrond */}
        <div className="relative gradient-brand-subtle flex min-h-[320px] items-center justify-center lg:min-h-0">
          <Beaker className="size-24 text-white/15" />
          {/* Floating badge */}
          <div className="absolute bottom-6 left-6 rounded-md border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wider text-white/60">
              Gevalideerde zuiverheid
            </p>
            <p className="text-lg font-bold text-white">99.8%</p>
            <p className="text-[10px] text-white/40">
              Geverifieerd via HPLC analyse
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   VARIANT B — Volle gradient, Stitch layout behouden
   Klant design feel, maar met twee-kolom Stitch structuur
═══════════════════════════════════════════════════ */

function HeroFullGradient() {
  return (
    <section className="gradient-brand-subtle overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-12 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-teal-200">
              Premium Research Grade
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              De Toekomst
              <br />
              van <span className="text-teal-300">Peptide</span>
              <br />
              Onderzoek
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              Hoogwaardige verbindingen met een zuiverheid van meer dan 99%,
              gevalideerd door onafhankelijke laboratoria voor precisie-onderzoek.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="primaryOnDark" size="md">
                Bekijk Catalogus
              </Button>
              <Button variant="ghostOnDark" size="md">
                Onze Kwaliteitsstandaard
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="flex h-[360px] items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Beaker className="size-20 text-white/15" />
            </div>
            <div className="absolute -bottom-4 left-8 rounded-md border border-white/15 bg-navy-600/80 px-4 py-3 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Gevalideerde zuiverheid
              </p>
              <p className="text-xl font-bold text-teal-300">99.8%</p>
              <p className="text-[10px] text-white/40">
                Geverifieerd via HPLC analyse
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   VARIANT C — Gradient fade-out naar wit
   Gradient bovenaan, vervaagt naar wit richting trust badges
═══════════════════════════════════════════════════ */

function HeroGradientFade() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background that fades to white */}
      <div className="absolute inset-0 gradient-brand-subtle" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-12 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-teal-200">
              Premium Research Grade
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              De Toekomst
              <br />
              van <span className="text-teal-300">Peptide</span>
              <br />
              Onderzoek
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              Hoogwaardige verbindingen met een zuiverheid van meer dan 99%,
              gevalideerd door onafhankelijke laboratoria voor precisie-onderzoek.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="primaryOnDark" size="md">
                Bekijk Catalogus
              </Button>
              <Button variant="ghostOnDark" size="md">
                Onze Kwaliteitsstandaard
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="flex h-[360px] items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Beaker className="size-20 text-white/15" />
            </div>
            <div className="absolute -bottom-4 left-8 rounded-md border border-white/15 bg-navy-600/80 px-4 py-3 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Gevalideerde zuiverheid
              </p>
              <p className="text-xl font-bold text-teal-300">99.8%</p>
              <p className="text-[10px] text-white/40">
                Geverifieerd via HPLC analyse
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   VARIANT D — Witte hero, gradient accent bar
   Clean Stitch layout + dunne gradient strip bovenaan
═══════════════════════════════════════════════════ */

function HeroAccentBar() {
  return (
    <section className="bg-white">
      {/* Gradient accent bar */}
      <div className="gradient-brand h-1" />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-12 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-teal-400">
              Premium Research Grade
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-navy-500 md:text-5xl">
              De Toekomst
              <br />
              van <span className="text-teal-400">Peptide</span>
              <br />
              Onderzoek
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Hoogwaardige verbindingen met een zuiverheid van meer dan 99%,
              gevalideerd door onafhankelijke laboratoria voor precisie-onderzoek.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="secondary" size="md">
                Bekijk Catalogus
              </Button>
              <span className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-teal-400">
                Onze Kwaliteitsstandaard
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="flex h-[360px] items-center justify-center rounded-lg bg-surface-secondary">
              <Beaker className="size-20 text-muted-foreground/15" />
            </div>
            <div className="absolute -bottom-4 left-8 rounded-md border border-border bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider text-teal-400">
                Gevalideerde zuiverheid
              </p>
              <p className="text-xl font-bold text-navy-500">99.8%</p>
              <p className="text-[10px] text-muted-foreground">
                Geverifieerd via HPLC analyse
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   VARIANT E — Gradient image container
   Witte hero, maar de afbeelding zit in een gradient container
═══════════════════════════════════════════════════ */

function HeroGradientImage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-12 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-teal-400">
              Premium Research Grade
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-navy-500 md:text-5xl">
              De Toekomst
              <br />
              van <span className="text-teal-400">Peptide</span>
              <br />
              Onderzoek
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Hoogwaardige verbindingen met een zuiverheid van meer dan 99%,
              gevalideerd door onafhankelijke laboratoria voor precisie-onderzoek.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="secondary" size="md">
                Bekijk Catalogus
              </Button>
              <span className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-teal-400">
                Onze Kwaliteitsstandaard
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
          <div className="relative hidden lg:block">
            {/* Gradient container voor de afbeelding */}
            <div className="gradient-brand flex h-[380px] items-center justify-center rounded-xl">
              <div className="flex h-[320px] w-[90%] items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <FlaskConical className="size-20 text-white/20" />
              </div>
            </div>
            <div className="absolute -bottom-4 left-8 rounded-md border border-border bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider text-teal-400">
                Gevalideerde zuiverheid
              </p>
              <p className="text-xl font-bold text-navy-500">99.8%</p>
              <p className="text-[10px] text-muted-foreground">
                Geverifieerd via HPLC analyse
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */

export default function HeroShowcasePage() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="border-b border-border bg-white px-6 py-8 sm:px-12">
        <h1 className="text-3xl font-bold text-navy-500">Hero Varianten</h1>
        <p className="mt-2 text-muted-foreground">
          Hoe passen we de gradient in zonder de Stitch layout te verliezen?
        </p>
      </div>

      <div className="space-y-16 py-12">
        {/* A */}
        <div>
          <div className="mx-auto max-w-7xl px-6 pb-4 sm:px-12">
            <h2 className="text-sm font-semibold text-navy-300">
              A — Splitscreen (wit links, gradient rechts)
            </h2>
            <p className="text-sm text-muted-foreground">
              Clean tekst op wit. Gradient alleen als achtergrond van de
              afbeelding. Stitch layout intact, klant-identiteit zichtbaar.
            </p>
          </div>
          <HeroSplitscreen />
        </div>

        <Separator />

        {/* B */}
        <div>
          <div className="mx-auto max-w-7xl px-6 pb-4 sm:px-12">
            <h2 className="text-sm font-semibold text-navy-300">
              B — Volle gradient (klant design feel)
            </h2>
            <p className="text-sm text-muted-foreground">
              Dichter bij het originele klant design. Volle gradient achtergrond,
              witte tekst, on-dark buttons. Sterkste merkherkenning.
            </p>
          </div>
          <HeroFullGradient />
        </div>

        <Separator />

        {/* C */}
        <div>
          <div className="mx-auto max-w-7xl px-6 pb-4 sm:px-12">
            <h2 className="text-sm font-semibold text-navy-300">
              C — Gradient fade-out naar wit
            </h2>
            <p className="text-sm text-muted-foreground">
              Begint met gradient bovenaan, vervaagt naar wit. Soepele overgang
              naar de trust badges sectie. Elegante middenweg.
            </p>
          </div>
          <HeroGradientFade />
        </div>

        <Separator />

        {/* D */}
        <div>
          <div className="mx-auto max-w-7xl px-6 pb-4 sm:px-12">
            <h2 className="text-sm font-semibold text-navy-300">
              D — Accent bar (gradient strip bovenaan)
            </h2>
            <p className="text-sm text-muted-foreground">
              Witte hero met een 4px gradient balk bovenaan. Minimaal maar
              herkenbaar. Stitch layout 100% intact.
            </p>
          </div>
          <HeroAccentBar />
        </div>

        <Separator />

        {/* E */}
        <div>
          <div className="mx-auto max-w-7xl px-6 pb-4 sm:px-12">
            <h2 className="text-sm font-semibold text-navy-300">
              E — Gradient image container
            </h2>
            <p className="text-sm text-muted-foreground">
              Witte hero, maar het productbeeld zit in een gradient-rounded
              container. Gradient als &quot;frame&quot; voor het product. Combineert
              Stitch cleanliness met klant-identiteit.
            </p>
          </div>
          <HeroGradientImage />
        </div>
      </div>
    </div>
  )
}
