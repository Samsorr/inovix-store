"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"

import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/price"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Variant = {
  id: string
  title?: string | null
  sku?: string | null
  calculated_price?: {
    calculated_amount?: number | null
  }
}

interface ProductActionsProps {
  variants: Variant[]
}

export function ProductActions({ variants }: ProductActionsProps) {
  const { addItem, isUpdating } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length === 1 ? variants[0].id : null
  )

  async function handleAddToCart() {
    if (!selectedVariantId) return
    await addItem(selectedVariantId, 1)
  }

  return (
    <div className="space-y-4">
      {/* Variant selection — only if multiple variants */}
      {variants.length > 1 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Varianten
          </h2>
          <div className="space-y-2">
            {variants.map((variant) => {
              const price = variant.calculated_price?.calculated_amount
              const isSelected = variant.id === selectedVariantId
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border p-3 text-sm transition-colors",
                    isSelected
                      ? "border-teal-400 bg-teal-50 ring-1 ring-teal-400"
                      : "border-border hover:border-teal-200"
                  )}
                >
                  <div>
                    <span className="font-medium text-navy-500">
                      {variant.title}
                    </span>
                    {variant.sku && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        SKU: {variant.sku}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-navy-500">
                    {price != null ? formatPrice(price) : "—"}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Single variant — just show price */}
      {variants.length === 1 && (
        <div className="text-xl font-bold text-navy-500">
          {variants[0].calculated_price?.calculated_amount != null
            ? formatPrice(variants[0].calculated_price.calculated_amount)
            : "Prijs op aanvraag"}
        </div>
      )}

      {/* Add to cart button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!selectedVariantId || isUpdating}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="size-4" />
        {isUpdating
          ? "Toevoegen..."
          : !selectedVariantId
            ? "Selecteer een variant"
            : "Toevoegen aan winkelwagen"}
      </Button>
    </div>
  )
}
