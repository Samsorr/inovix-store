import type { Metadata } from "next"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Contact — Inovix",
  description:
    "Neem contact op met Inovix voor vragen over onze onderzoekspeptiden, bestellingen of samenwerkingen.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center border border-border bg-surface-50">
        <Mail className="size-8 text-teal-400" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-navy-500">Contact</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Deze pagina is momenteel in ontwikkeling. Binnenkort kunt u hier
        rechtstreeks contact met ons opnemen voor vragen over producten,
        bestellingen of samenwerkingen.
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
