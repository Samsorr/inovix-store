"use client"

import { useState } from "react"
import {
  FlaskConical,
  ShoppingCart,
  Plus,
  Check,
  ArrowRight,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

/* ─── Shared demo data ─── */

const demo = {
  name: "BPC-157",
  description:
    "Onderzoek naar weefselherstel en angiogenese processen.",
  price: "42,50",
  currency: "€",
  dosage: "5mg Lyophilized",
  purity: 99.8,
}

const demo2 = {
  name: "TB-500",
  description:
    "Synthetische versie van Thymosin Beta-4 voor regeneratief onderzoek.",
  price: "38,00",
  currency: "€",
  dosage: "2mg Lyophilized",
  purity: 98.7,
  bestSeller: true,
}

const demo3 = {
  name: "Semaglutide",
  description:
    "GLP-1 receptor agonist voor metabolisch onderzoek en glucoseregulatie.",
  price: "89,00",
  currency: "€",
  dosage: "10mg",
  purity: 99.2,
}

/* ═══════════════════════════════════════════════════
   VARIANT A — Minimal
═══════════════════════════════════════════════════ */

function CardMinimal() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-[200px] items-center justify-center bg-surface-secondary">
        <FlaskConical className="size-14 text-muted-foreground/25" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="inStock" size="sm" className="mb-3 self-start">
          In Stock
        </Badge>
        <h3 className="text-lg font-semibold tracking-tight text-navy-500">
          {demo.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{demo.dosage}</p>
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <span className="text-xl font-bold tracking-tight text-navy-500">
          {demo.currency}{demo.price}
        </span>
        <Button variant="primary" size="icon-sm" aria-label="Toevoegen">
          <ShoppingCart className="size-4" />
        </Button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   VARIANT B — Image Hero
═══════════════════════════════════════════════════ */

function CardImageHero() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex h-[260px] items-center justify-center bg-surface-secondary">
        <FlaskConical className="size-16 text-muted-foreground/25" />
        <div className="absolute left-4 top-4">
          <Badge variant="bestSeller" size="sm">Best Seller</Badge>
        </div>
        <div className="absolute bottom-4 right-4">
          <Badge variant="purity" size="sm">{demo.purity}%</Badge>
        </div>
      </div>
      <div className="flex items-center justify-between p-5">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-navy-500">
            {demo.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{demo.dosage}</p>
        </div>
        <span className="text-lg font-bold text-navy-500">
          {demo.currency}{demo.price}
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   VARIANT C — Catalog (key-value)
═══════════════════════════════════════════════════ */

function CardCatalog() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-1.5 px-5 pt-5">
        <Badge variant="inStock" size="sm">In Stock</Badge>
      </div>
      <div className="mx-5 mt-3 flex h-[160px] items-center justify-center overflow-hidden rounded-md bg-surface-secondary">
        <FlaskConical className="size-12 text-muted-foreground/30" />
      </div>
      <div className="flex flex-1 flex-col px-5 pt-4">
        <h3 className="text-lg font-semibold tracking-tight text-navy-500">
          {demo.name}
        </h3>
        <p className="mt-1 min-h-[2.75rem] line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {demo.description}
        </p>
      </div>
      <div className="mx-5 mt-4 border-t border-border">
        <div className="flex items-center justify-between border-b border-dashed border-border py-2.5">
          <span className="text-xs text-muted-foreground">Zuiverheid</span>
          <span className="text-sm font-medium text-teal-400">{demo.purity}%</span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-xs text-muted-foreground">Formaat</span>
          <span className="text-sm font-medium text-navy-500">{demo.dosage}</span>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between px-5 pb-5 pt-4">
        <span className="text-xl font-bold tracking-tight text-navy-500">
          {demo.currency}{demo.price}
        </span>
        <Button variant="primary" size="icon-sm" aria-label="Toevoegen">
          <ShoppingCart className="size-4" />
        </Button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   VARIANT D — Hover Reveal
═══════════════════════════════════════════════════ */

function CardHoverReveal() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-200 hover:shadow-md">
      <div className="relative flex h-[280px] items-center justify-center bg-surface-secondary">
        <FlaskConical className="size-16 text-muted-foreground/25" />
        <div className="absolute left-4 top-4">
          <Badge variant="inStock" size="sm">In Stock</Badge>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-navy-500">
            {demo.name}
          </h3>
          <p className="text-sm text-muted-foreground">{demo.dosage}</p>
        </div>
        <span className="text-lg font-bold text-navy-500">
          {demo.currency}{demo.price}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
        <div className="flex flex-col gap-3 rounded-t-xl border-t border-border bg-card px-5 pb-5 pt-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-navy-500">{demo.name}</h3>
            <span className="text-lg font-bold text-navy-500">
              {demo.currency}{demo.price}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {demo.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Zuiverheid: <span className="font-medium text-teal-400">{demo.purity}%</span></span>
            <span>{demo.dosage}</span>
          </div>
          <Button variant="primary" size="sm" fullWidth>
            <ShoppingCart className="size-4" />
            Toevoegen aan winkelwagen
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   VARIANT E — Hover Expand Button
═══════════════════════════════════════════════════ */

function CardHoverExpand() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex h-[200px] items-center justify-center bg-surface-secondary">
        <FlaskConical className="size-14 text-muted-foreground/25" />
        <div className="absolute left-4 top-4 flex items-center gap-1.5">
          <Badge variant="bestSeller" size="sm">Best Seller</Badge>
          <Badge variant="inStock" size="sm">In Stock</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold tracking-tight text-navy-500">
          {demo2.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {demo2.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-navy-500">
            {demo2.currency}{demo2.price}
          </span>
          <div className="relative">
            <div className="transition-opacity duration-200 group-hover:opacity-0">
              <Button variant="primary" size="icon-sm" aria-label="Toevoegen">
                <ShoppingCart className="size-4" />
              </Button>
            </div>
            <div className="absolute right-0 top-0 opacity-0 transition-all duration-200 group-hover:opacity-100">
              <Button variant="primary" size="sm" className="whitespace-nowrap">
                <ShoppingCart className="size-4" />
                Bestellen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   VARIANT F — Hover Full-Width CTA
═══════════════════════════════════════════════════ */

function CardHoverFullCTA() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-md">
      <div className="flex h-[200px] items-center justify-center bg-surface-secondary">
        <FlaskConical className="size-14 text-muted-foreground/25" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="purity" size="sm" className="mb-2 self-start">
          {demo3.purity}% zuiverheid
        </Badge>
        <h3 className="text-lg font-semibold tracking-tight text-navy-500">
          {demo3.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {demo3.description}
        </p>
        <span className="mt-3 text-xl font-bold tracking-tight text-navy-500">
          {demo3.currency}{demo3.price}
        </span>
      </div>
      <div className="grid max-h-0 overflow-hidden transition-all duration-300 ease-out group-hover:max-h-16">
        <div className="border-t border-border px-5 py-3">
          <Button variant="primary" size="sm" fullWidth>
            <ShoppingCart className="size-4" />
            Toevoegen aan winkelwagen
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CART BUTTON VARIANTS
═══════════════════════════════════════════════════ */

function CartButtonSquare() {
  return (
    <Button variant="primary" size="icon-sm" aria-label="Toevoegen">
      <ShoppingCart className="size-4" />
    </Button>
  )
}

function CartButtonText() {
  return (
    <Button variant="primary" size="sm">
      Bestellen
    </Button>
  )
}

function CartButtonFull() {
  return (
    <Button variant="primary" size="sm" fullWidth>
      <ShoppingCart className="size-4" />
      Toevoegen aan winkelwagen
    </Button>
  )
}

function CartButtonPlus() {
  const [added, setAdded] = useState(false)

  return (
    <motion.button
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
        added
          ? "bg-emerald-600 text-white"
          : "bg-teal-400 text-white hover:bg-teal-500"
      )}
      onClick={() => {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="check"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <Check className="size-4" />
            Toegevoegd
          </motion.span>
        ) : (
          <motion.span
            key="add"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <Plus className="size-4" />
            Toevoegen
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function CartButtonArrow() {
  return (
    <motion.button
      className="group/btn inline-flex h-8 items-center gap-1.5 overflow-hidden rounded-md bg-navy-500 px-3 text-sm font-medium text-white transition-colors hover:bg-navy-400"
      whileTap={{ scale: 0.97 }}
    >
      Bestellen
      <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
    </motion.button>
  )
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */

export default function CardShowcasePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-border bg-surface-secondary px-6 py-8 sm:px-12">
        <h1 className="text-3xl font-bold text-navy-500">
          ProductCard Varianten
        </h1>
        <p className="mt-2 text-muted-foreground">
          Overzicht voor klantpresentatie — verschillende stijlen en
          interacties.
        </p>
      </div>

      <div className="mx-auto max-w-7xl space-y-16 px-6 py-12 sm:px-12">
        {/* ─── Card Variants ─── */}
        <section>
          <h2 className="text-xl font-bold text-navy-500">Card Varianten</h2>
          <Separator className="mt-2 mb-6" />

          <div className="space-y-12">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-navy-300">A — Minimal</h3>
                <p className="text-sm text-muted-foreground">
                  Alleen essentie: afbeelding, naam, dosering, prijs. Schoon en snel scanbaar.
                </p>
              </div>
              <div className="grid max-w-sm gap-6">
                <CardMinimal />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-navy-300">B — Image Hero</h3>
                <p className="text-sm text-muted-foreground">
                  Grote afbeelding domineert. Badges op de foto. Geschikt als de productfoto&apos;s sterk zijn.
                </p>
              </div>
              <div className="grid max-w-sm gap-6">
                <CardImageHero />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-navy-300">C — Catalog (huidig)</h3>
                <p className="text-sm text-muted-foreground">
                  Wetenschappelijke stijl met key-value specs. Vertrouwenwekkend voor researchers.
                </p>
              </div>
              <div className="grid max-w-sm gap-6">
                <CardCatalog />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-navy-300">D — Hover Reveal</h3>
                <p className="text-sm text-muted-foreground">
                  Afbeelding-first. Hover: info-paneel schuift omhoog met beschrijving, specs en full-width CTA.
                </p>
              </div>
              <div className="grid max-w-sm gap-6">
                <CardHoverReveal />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-navy-300">E — Hover Expand Button</h3>
                <p className="text-sm text-muted-foreground">
                  Cart-icoon verandert naar tekst-knop &quot;Bestellen&quot; bij hover. Subtiel maar effectief.
                </p>
              </div>
              <div className="grid max-w-sm gap-6">
                <CardHoverExpand />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-navy-300">F — Hover Full-Width CTA</h3>
                <p className="text-sm text-muted-foreground">
                  Geen zichtbare button. Full-width &quot;Toevoegen&quot; bar schuift in bij hover.
                </p>
              </div>
              <div className="grid max-w-sm gap-6">
                <CardHoverFullCTA />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Cart Button Variants ─── */}
        <section>
          <h2 className="text-xl font-bold text-navy-500">Cart Button Varianten</h2>
          <Separator className="mt-2 mb-6" />
          <p className="mb-6 max-w-xl text-sm text-muted-foreground">
            Psychologisch: grotere knoppen met tekst converteren beter dan
            icon-only. Bevestigingsanimatie vermindert twijfel. Pijl suggereert vooruitgang.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-navy-300">1. Vierkant icoon (huidig)</span>
              <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border">
                <CartButtonSquare />
              </div>
              <p className="text-xs text-muted-foreground">
                Compact, maar laag contrast als CTA.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-navy-300">2. Tekst &quot;Bestellen&quot;</span>
              <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border">
                <CartButtonText />
              </div>
              <p className="text-xs text-muted-foreground">
                Duidelijk en direct. Minder vrijblijvend.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-navy-300">3. Full-width met icoon</span>
              <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border px-4">
                <CartButtonFull />
              </div>
              <p className="text-xs text-muted-foreground">
                Grootste klikoppervlak. Beste conversie.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-navy-300">4. Toevoegen → Toegevoegd</span>
              <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border">
                <CartButtonPlus />
              </div>
              <p className="text-xs text-muted-foreground">
                Klik voor demo. Bevestigingsanimatie geeft zekerheid.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-navy-300">5. Bestellen met pijl</span>
              <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border">
                <CartButtonArrow />
              </div>
              <p className="text-xs text-muted-foreground">
                Pijl suggereert progressie. Premium gevoel.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Side by side ─── */}
        <section>
          <h2 className="text-xl font-bold text-navy-500">Naast elkaar — vergelijking in grid</h2>
          <Separator className="mt-2 mb-6" />

          <h3 className="mb-4 text-sm font-semibold text-navy-300">
            Drie favorieten naast elkaar
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CardHoverExpand />
            <CardHoverFullCTA />
            <CardMinimal />
          </div>
        </section>
      </div>
    </div>
  )
}
