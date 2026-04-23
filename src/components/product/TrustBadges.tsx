import { cn } from "@/lib/utils"

export type TrustBadgeKey =
  | "hplc_tested"
  | "third_party_verified"
  | "eu_shipping"

const BADGE_CONFIG: Record<
  TrustBadgeKey,
  { label: string; dotColor: string }
> = {
  hplc_tested: { label: "HPLC GETEST", dotColor: "bg-teal-400" },
  third_party_verified: {
    label: "3RD-PARTY VERIFIED",
    dotColor: "bg-mauve-500",
  },
  eu_shipping: { label: "EU VERZENDING", dotColor: "bg-mauve-500" },
}

interface TrustBadgesProps {
  purity?: number
  badges?: TrustBadgeKey[]
  className?: string
}

export function TrustBadges({ purity, badges = [], className }: TrustBadgesProps) {
  const hasPurity = purity != null && purity > 0
  const validBadges = badges.filter((key) => key in BADGE_CONFIG)

  if (!hasPurity && validBadges.length === 0) {
    return null
  }

  const badgeClass =
    "flex items-center gap-1.5 border border-border bg-surface-secondary px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-navy-500"

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {hasPurity && (
        <span className={badgeClass}>
          <span className="block h-1.5 w-1.5 bg-teal-400" aria-hidden="true" />
          &ge;{purity}% ZUIVERHEID
        </span>
      )}

      {validBadges.map((key) => {
        const { label, dotColor } = BADGE_CONFIG[key]
        return (
          <span key={key} className={badgeClass}>
            <span
              className={cn("block h-1.5 w-1.5", dotColor)}
              aria-hidden="true"
            />
            {label}
          </span>
        )
      })}
    </div>
  )
}
