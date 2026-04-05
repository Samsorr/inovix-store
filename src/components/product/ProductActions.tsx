"use client"

import { useRef, useState } from "react"
import { AlertTriangle, Download, Minus, Plus, ShoppingCart } from "lucide-react"

import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/price"
import { cn } from "@/lib/utils"
import { StickyCartBar } from "./StickyCartBar"

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
  coaUrl?: string | null
  productTitle: string
  thumbnail: string | null
}

export function ProductActions({
  variants,
  coaUrl,
  productTitle,
  thumbnail,
}: ProductActionsProps) {
  const { addItem, isUpdating } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length === 1 ? variants[0].id : null
  )
  const [quantity, setQuantity] = useState(1)
  const ctaRef = useRef<HTMLDivElement>(null)

  const selectedVariant = variants.find((v) => v.id === selectedVariantId)
  const price = selectedVariant?.calculated_price?.calculated_amount

  async function handleAddToCart() {
    if (!selectedVariantId) return
    await addItem(selectedVariantId, quantity)
  }

  return (
    <>
      <div className="space-y-5">
        {/* Price */}
        <div>
          <div className="text-[28px] font-bold leading-none text-navy-500">
            {price != null ? formatPrice(price) : "Prijs op aanvraag"}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Incl. BTW · Gratis verzending vanaf €100
          </p>
        </div>

        {/* Variant selector — only if multiple variants */}
        {variants.length > 1 && (
          <div>
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Hoeveelheid
            </h2>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => {
                const isSelected = variant.id === selectedVariantId
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={cn(
                      "px-5 py-2.5 text-xs font-semibold transition-colors",
                      isSelected
                        ? "border-2 border-navy-500 bg-navy-500/[0.02] text-navy-500"
                        : "border border-border text-muted-foreground hover:border-navy-200"
                    )}
                  >
                    {variant.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div ref={ctaRef} className="flex gap-3">
          {/* Quantity selector */}
          <div className="flex items-center border border-border">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2.5 text-muted-foreground transition-colors hover:text-navy-500"
              aria-label="Verminder aantal"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold text-navy-500">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2.5 text-muted-foreground transition-colors hover:text-navy-500"
              aria-label="Verhoog aantal"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {/* CTA Button */}
          <button
            disabled={!selectedVariantId || isUpdating}
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-2 bg-teal-400 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="size-4" />
            {isUpdating
              ? "TOEVOEGEN..."
              : !selectedVariantId
                ? "SELECTEER EEN VARIANT"
                : "TOEVOEGEN AAN WINKELWAGEN"}
          </button>
        </div>

        {/* CoA Download */}
        {coaUrl && (
          <a
            href={coaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-mauve-500 transition-colors hover:text-mauve-400"
          >
            <Download className="size-3.5" />
            Download Certificaat van Analyse (CoA)
          </a>
        )}

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Research confirmation — amber warning */}
        <div className="border border-amber-200 bg-amber-50 px-3 py-2.5">
          <p className="flex items-start gap-2 text-[10px] leading-relaxed text-amber-800">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
            Door dit product te bestellen bevestigt u dat u een gekwalificeerde
            onderzoeker bent en het uitsluitend voor laboratoriumonderzoek zult
            gebruiken.
          </p>
        </div>
      </div>

      {/* Sticky Cart Bar */}
      <StickyCartBar
        productTitle={productTitle}
        thumbnail={thumbnail}
        selectedVariantId={selectedVariantId}
        selectedVariantTitle={selectedVariant?.title ?? null}
        selectedPrice={price ?? null}
        ctaRef={ctaRef}
      />
    </>
  )
}
