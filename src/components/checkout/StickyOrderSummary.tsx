"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { formatPrice } from "@/lib/price"
import { cn } from "@/lib/utils"

export interface StickyOrderSummaryProps {
  total: number
  itemCount: number
  children: React.ReactNode
}

export function StickyOrderSummary({ total, itemCount, children }: StickyOrderSummaryProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="lg:hidden sticky top-0 z-20 -mx-4 mb-6 bg-white sm:-mx-6 border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 sm:px-6"
      >
        <span className="text-sm text-muted-foreground">
          Totaal <span className="text-navy-500">({itemCount})</span>
        </span>
        <span className="flex items-center gap-2 text-sm font-semibold text-navy-500">
          {formatPrice(total)}
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </span>
      </button>
      {open && <div className="px-4 pb-4 sm:px-6">{children}</div>}
    </div>
  )
}
