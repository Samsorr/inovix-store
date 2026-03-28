import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface TrustBadgeProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function TrustBadge({
  icon: Icon,
  title,
  description,
  className,
}: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-teal-50">
        <Icon className="size-6 text-teal-400" />
      </div>
      <h3 className="text-sm font-semibold text-navy-500">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
