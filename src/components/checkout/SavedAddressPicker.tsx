"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { countryName } from "@/lib/countries"

export interface SavedAddress {
  id: string
  first_name?: string | null
  last_name?: string | null
  company?: string | null
  address_1?: string | null
  postal_code?: string | null
  city?: string | null
  country_code?: string | null
  phone?: string | null
  is_default_shipping?: boolean | null
}

export interface SavedAddressPickerProps {
  addresses: SavedAddress[]
  selectedId: string | null
  onSelect: (id: string) => void
  onChooseNew: () => void
  className?: string
}

export function SavedAddressPicker({
  addresses,
  selectedId,
  onSelect,
  onChooseNew,
  className,
}: SavedAddressPickerProps) {
  const isNewSelected = selectedId === null

  return (
    <div className={cn("space-y-2", className)} role="radiogroup" aria-label="Opgeslagen adressen">
      {addresses.map((addr) => {
        const checked = addr.id === selectedId
        return (
          <button
            key={addr.id}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onSelect(addr.id)}
            className={cn(
              "flex w-full items-start justify-between border px-4 py-3 text-left transition-colors",
              checked ? "border-navy-500 bg-navy-500/[0.02]" : "border-border hover:border-navy-200"
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-1 flex size-4 items-center justify-center border",
                  checked ? "border-navy-500" : "border-border"
                )}
              >
                {checked && <span className="size-2 bg-navy-500" />}
              </span>
              <div className="text-sm">
                <p className="font-medium text-navy-500">
                  {addr.first_name} {addr.last_name}
                  {addr.is_default_shipping && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-teal-500">
                      Standaard
                    </span>
                  )}
                </p>
                {addr.company && (
                  <p className="text-muted-foreground">{addr.company}</p>
                )}
                <p className="text-muted-foreground">
                  {addr.address_1}, {addr.postal_code} {addr.city}
                </p>
                <p className="text-muted-foreground">
                  {countryName(addr.country_code ?? "")}
                </p>
              </div>
            </div>
          </button>
        )
      })}

      <button
        type="button"
        role="radio"
        aria-checked={isNewSelected}
        onClick={onChooseNew}
        className={cn(
          "flex w-full items-center gap-3 border px-4 py-3 text-left text-sm transition-colors",
          isNewSelected ? "border-navy-500 bg-navy-500/[0.02]" : "border-dashed border-border hover:border-navy-200"
        )}
      >
        <Plus className="size-4 text-navy-500" />
        <span className="text-navy-500">Nieuw adres invoeren</span>
      </button>
    </div>
  )
}
