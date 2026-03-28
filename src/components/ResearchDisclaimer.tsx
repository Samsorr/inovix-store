import { Info } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ResearchDisclaimerProps {
  compact?: boolean
  text?: string
  className?: string
}

const defaultText =
  "Alle producten zijn uitsluitend bestemd voor laboratoriumonderzoek. Niet voor menselijke of veterinaire consumptie."

export function ResearchDisclaimer({
  compact = false,
  text = defaultText,
  className,
}: ResearchDisclaimerProps) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-lg border-l-[3px] border-l-teal-400 bg-surface-secondary",
        compact ? "px-3 py-2" : "px-4 py-3",
        className
      )}
    >
      <Info
        className={cn(
          "shrink-0 text-teal-400",
          compact ? "mt-0.5 size-3.5" : "mt-0.5 size-4"
        )}
      />
      <p
        className={cn(
          "text-navy-300",
          compact ? "text-xs" : "text-sm"
        )}
      >
        {text}
      </p>
    </div>
  )
}
