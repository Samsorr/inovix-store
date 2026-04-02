"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <div className={cn(isHome && "gradient-brand-subtle")}>
      {children}
    </div>
  )
}
