"use client"

import { Truck, ShieldCheck } from "lucide-react"
import { formatPrice } from "@/lib/price"
import { cn } from "@/lib/utils"

export interface ShippingOptionData {
  id: string
  name: string
  amount: number
  carrier?: string
  deliveryEstimate?: string
  tracked?: boolean
  insured?: boolean
}

export interface ShippingOptionCardProps {
  option: ShippingOptionData
  selected: boolean
  disabled: boolean
  onSelect: (id: string) => void
}

export function ShippingOptionCard({
  option,
  selected,
  disabled,
  onSelect,
}: ShippingOptionCardProps) {
  const hasMeta = option.carrier || option.deliveryEstimate
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect(option.id)}
      className={cn(
        "flex w-full items-start justify-between border px-4 py-4 text-left transition-colors",
        selected
          ? "border-l-2 border-l-teal-400 border-navy-500 bg-navy-500/[0.02]"
          : "border-border hover:border-navy-200",
        disabled && "pointer-events-none opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-1 flex size-4 items-center justify-center border",
            selected ? "border-navy-500" : "border-border"
          )}
        >
          {selected && <span className="size-2 bg-navy-500" />}
        </span>
        <div className="text-sm">
          <p className="font-semibold text-navy-500">{option.name}</p>
          {hasMeta && (
            <p className="mt-1 text-xs text-muted-foreground">
              {[option.carrier, option.deliveryEstimate].filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
            {option.tracked && (
              <span className="inline-flex items-center gap-1 text-teal-500">
                <Truck className="size-3" />
                Track &amp; Trace
              </span>
            )}
            {option.insured && (
              <span className="inline-flex items-center gap-1 text-teal-500">
                <ShieldCheck className="size-3" />
                Verzekerd
              </span>
            )}
          </div>
        </div>
      </div>
      <span className="text-sm font-medium tabular-nums text-navy-500">
        {option.amount ? formatPrice(option.amount) : "Gratis"}
      </span>
    </button>
  )
}
