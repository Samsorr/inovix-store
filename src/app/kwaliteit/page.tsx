import type { Metadata } from "next"
import Link from "next/link"
import { FlaskConical, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Kwaliteit & Analyse — Inovix",
  description:
    "Ontdek de kwaliteitsstandaarden en analysemethoden van Inovix. HPLC-analyse, LC-MS verificatie en onafhankelijke Europese laboratoriumcontrole.",
}

export default function KwaliteitPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center border border-border bg-surface-50">
        <FlaskConical className="size-8 text-teal-400" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-navy-500">
        Kwaliteit & Analyse
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Deze pagina is momenteel in ontwikkeling. Binnenkort vindt u hier
        uitgebreide informatie over onze analysemethoden, kwaliteitsstandaarden
        en certificaten.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-1.5 size-4" />
          Terug naar home
        </Button>
      </Link>
    </div>
  )
}
