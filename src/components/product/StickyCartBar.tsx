"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/price"
import {
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_EVENT,
} from "@/lib/cookie-consent"

interface StickyCartBarProps {
  productTitle: string
  thumbnail: string | null
  selectedVariantId: string | null
  selectedVariantTitle: string | null
  selectedPrice: number | null
  ctaRef: React.RefObject<HTMLDivElement | null>
}

function subscribeToConsent(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const onStorage = (e: StorageEvent) => {
    if (e.key === COOKIE_CONSENT_KEY) callback()
  }
  window.addEventListener(COOKIE_CONSENT_EVENT, callback)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, callback)
    window.removeEventListener("storage", onStorage)
  }
}

function getClientConsentRaw(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(COOKIE_CONSENT_KEY)
}

function getServerConsentRaw(): string | null {
  return null
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
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  const rawConsent = useSyncExternalStore(
    subscribeToConsent,
    getClientConsentRaw,
    getServerConsentRaw
  )
  const consentPending = rawConsent === null

  useEffect(() => {
    setMounted(true)
    const mql = window.matchMedia("(max-width: 639px)")
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

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

  // Hide on mobile while cookie banner is up so it doesn't cover the Add-to-Cart action.
  if (mounted && consentPending && isMobile) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
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
              "px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-opacity",
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
