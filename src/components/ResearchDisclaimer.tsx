import { AlertTriangle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ResearchDisclaimerProps {
  compact?: boolean
  variant?: "default" | "warning"
  text?: string
  className?: string
}

const defaultText =
  "Alle producten zijn uitsluitend bestemd voor laboratoriumonderzoek. Niet voor menselijke of veterinaire consumptie."

export function ResearchDisclaimer({
  compact = false,
  variant = "default",
  text = defaultText,
  className,
}: ResearchDisclaimerProps) {
  const isWarning = variant === "warning"

  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 border-l-2",
        isWarning
          ? "border-l-amber-500 bg-amber-50"
          : "border-l-navy-500 bg-surface-secondary",
        compact ? "px-3 py-2" : "px-4 py-3",
        className
      )}
    >
      {isWarning ? (
        <AlertTriangle
          className={cn(
            "shrink-0 text-amber-600",
            compact ? "mt-0.5 size-3.5" : "mt-0.5 size-4"
          )}
        />
      ) : (
        <Info
          className={cn(
            "shrink-0 text-navy-300",
            compact ? "mt-0.5 size-3.5" : "mt-0.5 size-4"
          )}
        />
      )}
      <p
        className={cn(
          isWarning ? "text-amber-800" : "text-navy-300",
          compact ? "text-xs" : "text-sm"
        )}
      >
        {text}
      </p>
    </div>
  )
}
