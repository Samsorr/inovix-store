"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/price"

interface StickyCartBarProps {
  productTitle: string
  thumbnail: string | null
  selectedVariantId: string | null
  selectedVariantTitle: string | null
  selectedPrice: number | null
  ctaRef: React.RefObject<HTMLDivElement | null>
}

export function StickyCartBar({
  productTitle,
  thumbnail,
  selectedVariantId,
  selectedVariantTitle,
  selectedPrice,
  ctaRef,
}: StickyCartBarProps) {
  const { addItem, isUpdating } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const target = ctaRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [ctaRef])

  const handleAdd = async () => {
    if (!selectedVariantId) return
    await addItem(selectedVariantId, 1)
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Left side: thumbnail + product info (hidden on mobile) */}
        <div className="hidden items-center gap-3 sm:flex">
          {thumbnail && (
            <div className="relative h-9 w-9 flex-shrink-0 bg-surface-tertiary">
              <Image
                src={thumbnail}
                alt={productTitle}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy-500">
              {productTitle}
            </p>
            {selectedVariantTitle && (
              <p className="truncate text-[11px] text-muted-foreground">
                {selectedVariantTitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side: price + add button */}
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
          {selectedPrice !== null && (
            <span className="text-lg font-bold text-navy-500">
              {formatPrice(selectedPrice)}
            </span>
          )}
          <button
            onClick={handleAdd}
            disabled={!selectedVariantId || isUpdating}
            className={cn(
              "px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white transition-opacity",
              "bg-teal-400",
              (!selectedVariantId || isUpdating) &&
                "cursor-not-allowed opacity-50"
            )}
          >
            {isUpdating ? "..." : "Toevoegen"}
          </button>
        </div>
      </div>
    </div>
  )
}
