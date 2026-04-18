"use client"

import { Pencil, Trash2, Star } from "lucide-react"
import { countryName } from "@/lib/countries"
import { cn } from "@/lib/utils"

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

export interface AddressCardProps {
  address: SavedAddress
  onEdit: () => void
  onDelete: () => void
  onMakeDefault: () => void
  busy?: boolean
  className?: string
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onMakeDefault,
  busy = false,
  className,
}: AddressCardProps) {
  return (
    <div className={cn("border border-border p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm">
          <p className="font-medium text-navy-500">
            {address.first_name} {address.last_name}
            {address.is_default_shipping && (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-teal-500">
                <Star className="size-3" /> Standaard
              </span>
            )}
          </p>
          {address.company && <p className="text-muted-foreground">{address.company}</p>}
          <p className="text-muted-foreground">
            {address.address_1}, {address.postal_code} {address.city}
          </p>
          <p className="text-muted-foreground">
            {countryName(address.country_code ?? "")}
          </p>
          {address.phone && <p className="text-muted-foreground">{address.phone}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            disabled={busy}
            className="text-muted-foreground transition-colors hover:text-navy-500"
            aria-label="Bewerken"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="text-muted-foreground transition-colors hover:text-red-600"
            aria-label="Verwijderen"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 flex gap-3 text-[12px]">
        <button
          type="button"
          onClick={onEdit}
          disabled={busy}
          className="font-medium text-navy-500 underline underline-offset-4 decoration-border hover:decoration-navy-500"
        >
          Bewerken
        </button>
        {!address.is_default_shipping && (
          <button
            type="button"
            onClick={onMakeDefault}
            disabled={busy}
            className="font-medium text-navy-500 underline underline-offset-4 decoration-border hover:decoration-navy-500"
          >
            Maak standaard
          </button>
        )}
      </div>
    </div>
  )
}
