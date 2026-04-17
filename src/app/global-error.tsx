"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

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
        <section className="gradient-brand-subtle overflow-hidden">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 md:py-28 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-32">
            <div className="flex flex-1 flex-col">
              <span className="text-xs font-medium uppercase tracking-widest text-teal-200">
                Onverwachte fout
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                Er ging iets <span className="text-teal-300">mis</span>.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
                Een onverwachte fout heeft de pagina verstoord. Ons team is
                automatisch geïnformeerd. Probeer het opnieuw of keer terug
                naar de homepagina.
              </p>

              {error.digest && (
                <p className="mt-4 font-mono text-xs text-white/40">
                  Referentie: {error.digest}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-12 items-center justify-center border border-white/30 bg-white px-7 py-3 text-base font-medium text-navy-500 transition-all duration-200 hover:-translate-y-px hover:bg-mauve-500 hover:text-white hover:shadow-[0_4px_14px_-3px_rgba(142,90,128,0.35)] active:translate-y-0"
                >
                  Probeer opnieuw
                </button>
                {/* global-error replaces the root layout, so Next/Link can retrigger the broken context — use raw anchor */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href="/"
                  className="inline-flex h-12 items-center justify-center border border-white/30 bg-transparent px-7 py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-px hover:border-white/50 hover:bg-white/10 active:translate-y-0"
                >
                  Terug naar home
                </a>
              </div>
            </div>

            <div className="relative flex-1 lg:flex lg:justify-end">
              <div
                aria-hidden="true"
                className="relative flex h-[220px] w-full max-w-md items-center justify-center overflow-hidden border border-white/10 sm:h-[280px] lg:h-[340px]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(55,120,140,0.35),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(172,110,155,0.25),transparent_55%)]" />
                <p className="relative font-mono text-[140px] font-bold leading-none tracking-tighter text-white/90 sm:text-[180px] lg:text-[220px]">
                  500
                </p>
                <div className="absolute bottom-4 left-4 border border-white/15 bg-navy-900/60 px-3 py-2 backdrop-blur-md">
                  <p className="text-[10px] uppercase tracking-wider text-white/50">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-teal-300">
                    Systeemfout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  )
}
