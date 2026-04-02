"use client"

import { usePathname } from "next/navigation"
import { FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"

export function ResearchBanner() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <div className={cn("px-4 py-2", isHome ? "bg-transparent" : "bg-navy-500")}>
      <p className={cn(
        "flex items-center justify-center gap-1.5 text-center text-xs font-medium",
        isHome ? "text-white/60" : "text-white/80"
      )}>
        <FlaskConical className="size-3 shrink-0" />
        Alle producten zijn uitsluitend bestemd voor wetenschappelijk
        laboratoriumonderzoek. Niet voor menselijk gebruik.
      </p>
    </div>
  )
}
