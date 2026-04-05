"use client"

import { Button } from "@/components/ui/button"

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-navy-500">
        Producten konden niet geladen worden
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        De productcatalogus is tijdelijk niet beschikbaar. Probeer het later opnieuw.
      </p>
      <Button variant="secondary" size="md" onClick={reset} className="mt-6">
        Opnieuw proberen
      </Button>
    </main>
  )
}
