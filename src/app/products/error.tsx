"use client"

import Link from "next/link"
import { FlaskConical, Home, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-28 md:pt-32 md:pb-32">
        <div className="relative text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none mx-auto flex size-[140px] items-center justify-center border border-border bg-surface-secondary sm:size-[180px] md:size-[220px]"
          >
            <FlaskConical className="size-16 text-mauve-200 sm:size-20 md:size-24" />
          </div>

          <div className="relative mt-10">
            <span className="inline-flex items-center gap-2 border border-border bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-mauve-500">
              <span className="size-1.5 rounded-full bg-mauve-400" />
              Catalogus niet beschikbaar
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              Producten konden niet{" "}
              <span className="text-mauve-400">geladen worden</span>.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-600">
              De productcatalogus is tijdelijk niet beschikbaar. Dit is meestal
              van korte duur. Probeer het opnieuw of keer terug naar de
              homepagina.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="sm:w-auto"
                onClick={reset}
              >
                <RotateCcw className="size-4" />
                Opnieuw proberen
              </Button>
              <Link href="/">
                <Button variant="ghost" size="lg" fullWidth className="sm:w-auto">
                  <Home className="size-4" />
                  Terug naar home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
