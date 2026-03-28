import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: { label: string; href: string }
  centered?: boolean
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  action,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">{title}</h2>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:mt-2 sm:text-base">{subtitle}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex items-center gap-1 text-sm font-medium text-teal-400 transition-colors hover:text-teal-500",
            centered && "mt-2"
          )}
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
