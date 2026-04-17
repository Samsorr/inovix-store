"use client"

import Link from "next/link"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-28 md:pt-32 md:pb-32">
        <div className="relative text-center">
          <p
            aria-hidden="true"
            className="pointer-events-none select-none font-bold leading-[0.9] tracking-tighter text-mauve-100 text-[160px] sm:text-[220px] md:text-[260px]"
          >
            500
          </p>

          <div className="relative -mt-10 sm:-mt-16 md:-mt-24">
            <span className="inline-flex items-center gap-2 border border-border bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-mauve-500">
              <AlertTriangle className="size-3 text-mauve-400" />
              Onverwachte fout
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              Er is iets <span className="text-mauve-400">misgegaan</span>.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-600">
              We konden deze pagina niet laden. Probeer het opnieuw of keer
              terug naar de homepagina. Ons team is automatisch geïnformeerd.
            </p>

            {error.digest && (
              <p className="mt-4 font-mono text-xs text-navy-400">
                Referentie: {error.digest}
              </p>
            )}

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
