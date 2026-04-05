"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-navy-500">
        Er is iets misgegaan
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        We konden de pagina niet laden. Probeer het opnieuw of kom later terug.
      </p>
      <Button variant="secondary" size="md" onClick={reset} className="mt-6">
        Opnieuw proberen
      </Button>
    </main>
  )
}
