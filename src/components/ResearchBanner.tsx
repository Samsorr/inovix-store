import { FlaskConical } from "lucide-react"

export function ResearchBanner() {
  return (
    <div className="bg-amber-500 px-4 py-2">
      <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-white">
        <FlaskConical className="size-3 shrink-0" />
        Alle producten zijn uitsluitend bestemd voor wetenschappelijk
        laboratoriumonderzoek. Niet voor menselijk gebruik.
      </p>
    </div>
  )
}
