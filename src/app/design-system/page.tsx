import type { Metadata } from "next"
import {
  Shield,
  FlaskConical,
  CheckCircle,
  Snowflake,
  ArrowRight,
  ShoppingCart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/ProductCard"
import { TrustBadge } from "@/components/TrustBadge"
import { SectionHeader } from "@/components/SectionHeader"
import { ResearchDisclaimer } from "@/components/ResearchDisclaimer"
import { GradientSection } from "@/components/GradientSection"

export const metadata: Metadata = {
  title: "Inovix Design System — Interne Referentie",
  robots: "noindex, nofollow",
}

/* ─── Color swatch helper ─── */

function Swatch({
  name,
  className,
  textDark = false,
}: {
  name: string
  className: string
  textDark?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`h-14 w-14 rounded-lg border border-border ${className}`}
      />
      <span
        className={`text-[10px] font-medium ${textDark ? "text-navy-500" : "text-muted-foreground"}`}
      >
        {name}
      </span>
    </div>
  )
}

function GradientSwatch({
  name,
  className,
}: {
  name: string
  className: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`h-14 w-full rounded-lg border border-border ${className}`}
      />
      <span className="text-[10px] font-medium text-muted-foreground">
        {name}
      </span>
    </div>
  )
}

/* ─── Section wrapper ─── */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-500">{title}</h2>
        <Separator className="mt-2" />
      </div>
      {children}
    </section>
  )
}

/* ─── Page ─── */

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="border-b border-border bg-surface-secondary px-6 py-8 sm:px-12">
        <h1 className="text-3xl font-bold text-navy-500">
          Inovix Design System
        </h1>
        <p className="mt-2 text-muted-foreground">
          Interne referentie — alle componenten, kleuren en typografie op
          &eacute;&eacute;n plek.
        </p>
      </div>

      <div className="mx-auto max-w-7xl space-y-16 px-6 py-12 sm:px-12">
        {/* ═══════════════════════════════════════════
            KLEUREN
        ═══════════════════════════════════════════ */}
        <Section title="Kleuren">
          {/* Navy */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">Navy</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch name="50" className="bg-navy-50" textDark />
              <Swatch name="100" className="bg-navy-100" textDark />
              <Swatch name="200" className="bg-navy-200" />
              <Swatch name="300" className="bg-navy-300" />
              <Swatch name="400" className="bg-navy-400" />
              <Swatch name="500" className="bg-navy-500" />
              <Swatch name="600" className="bg-navy-600" />
              <Swatch name="700" className="bg-navy-700" />
              <Swatch name="800" className="bg-navy-800" />
              <Swatch name="900" className="bg-navy-900" />
            </div>
          </div>

          {/* Teal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">Teal</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch name="50" className="bg-teal-50" textDark />
              <Swatch name="100" className="bg-teal-100" textDark />
              <Swatch name="200" className="bg-teal-200" />
              <Swatch name="300" className="bg-teal-300" />
              <Swatch name="400" className="bg-teal-400" />
              <Swatch name="500" className="bg-teal-500" />
              <Swatch name="600" className="bg-teal-600" />
              <Swatch name="700" className="bg-teal-700" />
              <Swatch name="800" className="bg-teal-800" />
            </div>
          </div>

          {/* Mauve */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">Mauve</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch name="50" className="bg-mauve-50" textDark />
              <Swatch name="100" className="bg-mauve-100" textDark />
              <Swatch name="200" className="bg-mauve-200" />
              <Swatch name="300" className="bg-mauve-300" />
              <Swatch name="400" className="bg-mauve-400" />
              <Swatch name="500" className="bg-mauve-500" />
              <Swatch name="600" className="bg-mauve-600" />
              <Swatch name="700" className="bg-mauve-700" />
              <Swatch name="800" className="bg-mauve-800" />
            </div>
          </div>

          {/* Surfaces */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              Surfaces
            </h3>
            <div className="flex flex-wrap gap-3">
              <Swatch name="White" className="bg-surface" textDark />
              <Swatch
                name="Secondary"
                className="bg-surface-secondary"
                textDark
              />
              <Swatch
                name="Tertiary"
                className="bg-surface-tertiary"
                textDark
              />
            </div>
          </div>

          {/* Gradients */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              Gradients
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <GradientSwatch name="gradient-brand" className="gradient-brand" />
              <GradientSwatch
                name="gradient-brand-subtle"
                className="gradient-brand-subtle"
              />
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            TYPOGRAFIE
        ═══════════════════════════════════════════ */}
        <Section title="Typografie">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-muted-foreground">
                h1 — text-3xl font-bold
              </span>
              <h1 className="text-3xl font-bold text-navy-500">
                De Toekomst van Peptide Onderzoek
              </h1>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                h2 — text-2xl font-bold
              </span>
              <h2 className="text-2xl font-bold text-navy-500">
                Populaire Onderzoeksproducten
              </h2>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                h3 — text-xl font-semibold
              </span>
              <h3 className="text-xl font-semibold text-navy-500">
                Onderzoek &amp; Kennisbank
              </h3>
            </div>
            <Separator />
            <div>
              <span className="text-xs text-muted-foreground">
                Body — text-base
              </span>
              <p className="text-base text-navy-500">
                Hoogwaardige verbindingen met een zuiverheid van meer dan 99%,
                gevalideerd door onafhankelijke laboratoria voor
                precisie-onderzoek.
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                Small — text-sm
              </span>
              <p className="text-sm text-muted-foreground">
                Individuele batch rapporten beschikbaar. Alle producten zijn
                uitsluitend bestemd voor laboratoriumonderzoek.
              </p>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            BUTTONS
        ═══════════════════════════════════════════ */}
        <Section title="Buttons">
          {/* All variants at md size */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              Varianten (md)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* On-dark variants */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              On-Dark varianten (voor gradient achtergronden)
            </h3>
            <div className="flex flex-wrap items-center gap-3 rounded-lg gradient-brand-subtle p-6">
              <Button variant="primaryOnDark">Primary on Dark</Button>
              <Button variant="ghostOnDark">Ghost on Dark</Button>
            </div>
          </div>

          {/* Size comparison per variant */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              Sizes — sm / md / lg
            </h3>
            <div className="space-y-3">
              {(
                [
                  "primary",
                  "secondary",
                  "outline",
                  "ghost",
                  "danger",
                ] as const
              ).map((v) => (
                <div key={v} className="flex flex-wrap items-center gap-3">
                  <span className="w-20 text-xs text-muted-foreground">
                    {v}
                  </span>
                  <Button variant={v} size="sm">
                    Small
                  </Button>
                  <Button variant={v} size="md">
                    Medium
                  </Button>
                  <Button variant={v} size="lg">
                    Large
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Disabled */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              Disabled
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" disabled>
                Disabled Primary
              </Button>
              <Button variant="outline" disabled>
                Disabled Outline
              </Button>
            </div>
          </div>

          {/* Icon buttons */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              Icon Buttons (cart)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="icon-sm">
                <ShoppingCart className="size-4" />
              </Button>
              <Button variant="primary" size="icon">
                <ShoppingCart className="size-4" />
              </Button>
              <Button variant="secondary" size="icon-sm">
                <ShoppingCart className="size-4" />
              </Button>
              <Button variant="outline" size="icon-sm">
                <ShoppingCart className="size-4" />
              </Button>
            </div>
          </div>

          {/* Full width */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              Full Width
            </h3>
            <div className="max-w-md">
              <Button variant="primary" fullWidth>
                Bestellen — Full Width
              </Button>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            BADGES
        ═══════════════════════════════════════════ */}
        <Section title="Badges">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              Varianten — sm
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="dosage" size="sm">5mg</Badge>
              <Badge variant="inStock" size="sm">Op voorraad</Badge>
              <Badge variant="outOfStock" size="sm">Uitverkocht</Badge>
              <Badge variant="lowStock" size="sm">Beperkte voorraad</Badge>
              <Badge variant="bestSeller" size="sm">Best Seller</Badge>
              <Badge variant="category" size="sm">GLP-1</Badge>
              <Badge variant="purity" size="sm">99.8%</Badge>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-navy-300">
              Varianten — md
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="dosage" size="md">5mg</Badge>
              <Badge variant="inStock" size="md">Op voorraad</Badge>
              <Badge variant="outOfStock" size="md">Uitverkocht</Badge>
              <Badge variant="lowStock" size="md">Beperkte voorraad</Badge>
              <Badge variant="bestSeller" size="md">Best Seller</Badge>
              <Badge variant="category" size="md">GLP-1</Badge>
              <Badge variant="purity" size="md">99.8%</Badge>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            INPUT
        ═══════════════════════════════════════════ */}
        <Section title="Input">
          <div className="grid max-w-lg gap-6">
            <Input label="E-mailadres" placeholder="uw@email.nl" />
            <Input placeholder="Zonder label — alleen placeholder" />
            <Input
              label="Wachtwoord"
              type="password"
              error="Wachtwoord moet minimaal 8 tekens bevatten"
              defaultValue="kort"
            />
            <Input
              label="Zoek producten"
              placeholder="Bijv. BPC-157, Semaglutide..."
            />
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            PRODUCT CARDS
        ═══════════════════════════════════════════ */}
        <Section title="ProductCard">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ProductCard
              name="BPC-157"
              description="Onderzoek naar weefselherstel en angiogenese processen."
              price={42.5}
              dosage="5mg Lyophilized"
              purity={99.8}
              status="in-stock"
              href="/products/bpc-157"
            />
            <ProductCard
              name="TB-500"
              description="Synthetische versie van Thymosin Beta-4 voor regeneratief onderzoek."
              price={38}
              dosage="2mg Lyophilized"
              purity={98.7}
              status="in-stock"
              bestSeller
            />
            <ProductCard
              name="Semaglutide"
              description="GLP-1 receptor agonist voor metabolisch onderzoek en glucoseregulatie."
              price={89}
              dosage="10mg"
              purity={99.2}
              status="out-of-stock"
            />
            <ProductCard
              name="GHK-Cu"
              description="Koper-peptide complex betrokken voor dermatologisch onderzoek."
              price={55}
              dosage="50mg Powder"
              purity={99.1}
              status="low-stock"
            />
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            TRUST BADGES
        ═══════════════════════════════════════════ */}
        <Section title="TrustBadges">
          <div className="flex flex-wrap items-start justify-center gap-8 sm:justify-between">
            <TrustBadge
              icon={Shield}
              title="GMP-gecertificeerd"
              description="Geproduceerd volgens de strengste normen"
            />
            <TrustBadge
              icon={FlaskConical}
              title="HPLC getest"
              description="Individuele batch rapporten beschikbaar"
            />
            <TrustBadge
              icon={CheckCircle}
              title="EU-conform"
              description="Volledig in overeenstemming met EU-wetgeving"
            />
            <TrustBadge
              icon={Snowflake}
              title="Cold-chain verzending"
              description="Behoud van integriteit tijdens transport"
            />
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION HEADERS
        ═══════════════════════════════════════════ */}
        <Section title="SectionHeader">
          <div className="space-y-8 rounded-xl border border-border p-6">
            <SectionHeader
              title="Populaire Onderzoeksproducten"
              subtitle="Onze meest gevraagde verbindingen voor gespecialiseerde laboratoriumtoepassingen"
              action={{ label: "Toon alle peptiden", href: "/products" }}
            />
            <Separator />
            <SectionHeader
              title="Onderzoek & Kennisbank"
              subtitle="Wetenschappelijke inzichten en klinische updates over de toepassingen van peptide verbindingen in de moderne biologie."
              centered
            />
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            RESEARCH DISCLAIMER
        ═══════════════════════════════════════════ */}
        <Section title="ResearchDisclaimer">
          <div className="space-y-4">
            <div>
              <span className="mb-2 block text-xs text-muted-foreground">
                Default variant
              </span>
              <ResearchDisclaimer />
            </div>
            <div>
              <span className="mb-2 block text-xs text-muted-foreground">
                Compact variant
              </span>
              <ResearchDisclaimer compact />
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            GRADIENT SECTION
        ═══════════════════════════════════════════ */}
        <Section title="GradientSection">
          <div className="space-y-4 overflow-hidden rounded-xl">
            <div>
              <span className="mb-2 block text-xs text-muted-foreground">
                gradient-brand (volle gradient)
              </span>
              <GradientSection className="rounded-xl px-8 py-12">
                <h2 className="text-center text-2xl font-bold">
                  Blijf op de hoogte
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-center text-white/80">
                  Ontvang exclusieve updates over nieuwe compounds, publicaties
                  en wetenschappelijke doorbraken direct in uw inbox.
                </p>
                <div className="mx-auto mt-6 flex max-w-md gap-3">
                  <input
                    className="h-10 flex-1 rounded-md border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Uw zakelijke e-mailadres"
                  />
                  <Button variant="primaryOnDark" size="md">
                    Aanmelden
                  </Button>
                </div>
              </GradientSection>
            </div>
            <div>
              <span className="mb-2 block text-xs text-muted-foreground">
                gradient-brand-subtle
              </span>
              <GradientSection subtle className="rounded-xl px-8 py-12">
                <h2 className="text-center text-2xl font-bold">
                  Premium Research Grade
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-center text-white/80">
                  De subtiele gradient variant — geschikt voor hero secties en
                  banners waar de gradient minder prominent hoeft te zijn.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button variant="primaryOnDark" size="lg">
                    Bekijk Catalogus
                  </Button>
                  <Button variant="ghostOnDark" size="lg">
                    Onze Kwaliteitsstandaard
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </div>
              </GradientSection>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
