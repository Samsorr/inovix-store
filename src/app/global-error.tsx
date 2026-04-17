"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { Home } from "lucide-react"

import { Button } from "@/components/ui/button"

import "./globals.css"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="nl">
      <body className="min-h-screen bg-white font-sans antialiased">
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
                  <span className="size-1.5 rounded-full bg-mauve-400" />
                  Systeemfout
                </span>
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
                  Er ging iets <span className="text-mauve-400">mis</span>.
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-600">
                  Een onverwachte fout heeft de pagina verstoord. Ons team is
                  automatisch geïnformeerd. Probeer het opnieuw of keer terug
                  naar de homepagina.
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
                    Probeer opnieuw
                  </Button>
                  {/* global-error replaces the root layout, so Next/Link can retrigger the broken context — use raw anchor wrapping Button */}
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a href="/">
                    <Button variant="ghost" size="lg" fullWidth className="sm:w-auto">
                      <Home className="size-4" />
                      Terug naar home
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  )
}
