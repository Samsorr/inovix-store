import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  FlaskConical,
  CheckCircle,
  Snowflake,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GradientSection } from "@/components/GradientSection"
import { SectionHeader } from "@/components/SectionHeader"
import { ProductCard } from "@/components/ProductCard"
import { Navbar } from "@/components/Navbar"
import { HideDefaultNavbar } from "@/components/HideDefaultNavbar"

/* ─── Trust badge inline (matching Stitch: icon + title + description, separated by lines) ─── */

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-teal-50">
        <Icon className="size-5 text-teal-400" />
      </div>
      <h3 className="text-sm font-semibold text-navy-500">{title}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/* ─── Page ─── */

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════
          NAVBAR + HERO — samen in de gradient
      ══════════════════════════════════════════ */}
      <HideDefaultNavbar />
      <Navbar transparent />
      <section className="gradient-brand-subtle -mt-14 overflow-hidden pt-14">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-24 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Text column */}
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-teal-200">
                Premium Research Grade
              </span>
              <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-5xl">
                De Toekomst{" "}
                <br className="hidden md:block" />
                van{" "}
                <span className="text-teal-300">Peptide</span>
                <br />
                Onderzoek
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
                Hoogwaardige verbindingen met een zuiverheid van meer dan 99%,
                gevalideerd door onafhankelijke laboratoria voor
                precisie-onderzoek.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="primaryOnDark" size="lg" fullWidth className="sm:w-auto">
                    Bekijk Catalogus
                  </Button>
                </Link>
                <Link href="/kwaliteit" className="w-full sm:w-auto">
                  <Button variant="ghostOnDark" size="lg" fullWidth className="sm:w-auto">
                    Onze Kwaliteitsstandaard
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image column */}
            <div className="relative">
              <div className="relative h-[200px] overflow-hidden rounded-lg border border-white/10 sm:h-[280px] lg:h-[360px]">
                <Image
                  src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80"
                  alt="Laboratorium onderzoek"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-navy-500/20" />
              </div>
              {/* Floating purity badge */}
              <div className="absolute -bottom-4 left-4 rounded-md border border-white/15 bg-navy-600/80 px-3 py-2 backdrop-blur-md sm:left-8 sm:px-4 sm:py-3">
                <p className="text-[10px] uppercase tracking-wider text-white/50">
                  Gevalideerde zuiverheid
                </p>
                <p className="text-lg font-bold text-teal-300 sm:text-xl">99.8%</p>
                <p className="text-[10px] text-white/40">
                  Geverifieerd via HPLC analyse
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST BADGES — 4 in row, separated by lines
      ══════════════════════════════════════════ */}
      <section className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:gap-6 sm:px-6 sm:py-10 md:grid-cols-4 md:gap-0 md:divide-x md:divide-border lg:px-8">
          <div className="md:px-8">
            <TrustItem
              icon={Shield}
              title="GMP-gecertificeerd"
              description="Geproduceerd volgens de strengste normen"
            />
          </div>
          <div className="md:px-8">
            <TrustItem
              icon={FlaskConical}
              title="HPLC getest"
              description="Individuele batch rapporten beschikbaar"
            />
          </div>
          <div className="md:px-8">
            <TrustItem
              icon={CheckCircle}
              title="EU-conform"
              description="Volledig in overeenstemming met EU-wetgeving"
            />
          </div>
          <div className="md:px-8">
            <TrustItem
              icon={Snowflake}
              title="Cold-chain verzending"
              description="Behoud van integriteit tijdens transport"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-24 lg:px-8">
        <SectionHeader
          title="Populaire Onderzoeksproducten"
          subtitle="Onze meest gevraagde verbindingen voor gespecialiseerde laboratoriumtoepassingen"
          action={{ label: "Toon alle peptiden", href: "/products" }}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            name="BPC-157"
            description="Onderzoek naar weefselherstel en angiogenese processen."
            price={42.5}
            dosage="5mg Lyophilized"
            purity={99.4}
            status="in-stock"
            image="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80"
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
            image="https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80"
            href="/products/tb-500"
          />
          <ProductCard
            name="GHK-Cu"
            description="Koper-peptide complex bestudeerd voor dermatologisch onderzoek."
            price={55}
            dosage="50mg Powder"
            purity={99.1}
            status="in-stock"
            image="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80"
            href="/products/ghk-cu"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ONDERZOEK & KENNISBANK — horizontal article cards
      ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16 md:pb-24 lg:px-8">
        <SectionHeader
          title="Onderzoek & Kennisbank"
          subtitle="Wetenschappelijke inzichten en klinische updates over de toepassingen van peptide verbindingen in de moderne biologie."
          centered
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* Article 1 */}
          <Link
            href="/publicaties/bpc-157-inflammatoire-darmziekten"
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-start"
          >
            <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-auto sm:w-28 sm:self-stretch sm:rounded-l-xl">
              <Image
                src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=400&q=80"
                alt="BPC-157 onderzoek"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Badge variant="category" size="sm">
                  Publicatie
                </Badge>
                <span className="text-xs text-muted-foreground">
                  12 Min Leestijd
                </span>
              </div>
              <h3 className="mt-2.5 text-base font-semibold leading-snug text-navy-500">
                De impact van BPC-157 op inflammatoire darmziekten in
                muismodellen.
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                Een overzicht van recente Europese studies naar de
                herstellende werking van stabiele gastrische peptiden.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-400 transition-colors group-hover:text-teal-500">
                Lees meer
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          {/* Article 2 */}
          <Link
            href="/publicaties/opslag-gelyofiliseerde-peptiden"
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-start"
          >
            <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-auto sm:w-28 sm:self-stretch sm:rounded-l-xl">
              <Image
                src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80"
                alt="Peptide opslag protocol"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Badge variant="purity" size="sm">
                  Protocol
                </Badge>
                <span className="text-xs text-muted-foreground">
                  8 Min Leestijd
                </span>
              </div>
              <h3 className="mt-2.5 text-base font-semibold leading-snug text-navy-500">
                Optimale opslagcondities voor gelyofiliseerde peptiden.
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                Het belang van temperatuurregeling en lichtexpositie voor het
                behoud van peptide-integriteit.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-400 transition-colors group-hover:text-teal-500">
                Lees meer
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWSLETTER CTA — gradient
      ══════════════════════════════════════════ */}
      <GradientSection>
        <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6 sm:py-16 md:py-20">
          <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
            Blijf op de hoogte
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70 md:text-base">
            Ontvang exclusieve updates over nieuwe compounds, publicaties en
            wetenschappelijke doorbraken direct in uw inbox.
          </p>
          <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:mt-8 sm:flex-row">
            <Input
              type="email"
              placeholder="Uw zakelijke e-mailadres"
              className="h-12 flex-1 border-white/25 bg-white/15 text-white backdrop-blur-sm placeholder:text-white/50 focus:border-teal-300/60 focus:ring-teal-300/20"
            />
            <Button variant="primaryOnDark" size="lg" className="w-full sm:w-auto">
              Aanmelden
            </Button>
          </div>
          <p className="mt-4 text-xs text-white/40">
            Door aan te melden gaat u akkoord met onze Privacy Policy en
            ontvangt u uitsluitend onderzoeksgerelateerde content.
          </p>
        </div>
      </GradientSection>
    </>
  )
}
