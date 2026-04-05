import { cn } from "@/lib/utils"

interface TrustBadgesProps {
  purity?: number
  className?: string
}

export function TrustBadges({ purity, className }: TrustBadgesProps) {
  const badgeClass =
    "flex items-center gap-1.5 border border-border bg-surface-secondary px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-navy-500"

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {purity != null && purity > 0 && (
        <span className={badgeClass}>
          <span className="block h-1.5 w-1.5 bg-teal-400" aria-hidden="true" />
          &ge;{purity}% ZUIVERHEID
        </span>
      )}

      <span className={badgeClass}>
        <span className="block h-1.5 w-1.5 bg-teal-400" aria-hidden="true" />
        HPLC GETEST
      </span>

      <span className={badgeClass}>
        <span className="block h-1.5 w-1.5 bg-mauve-500" aria-hidden="true" />
        3RD-PARTY VERIFIED
      </span>

      <span className={badgeClass}>
        <span className="block h-1.5 w-1.5 bg-mauve-500" aria-hidden="true" />
        EU VERZENDING
      </span>
    </div>
  )
}
