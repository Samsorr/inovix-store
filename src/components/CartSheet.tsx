"use client"

import Image from "next/image"
import Link from "next/link"
import { FlaskConical, Minus, Plus } from "lucide-react"

import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/price"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"

export function CartSheet() {
  const {
    cart,
    isUpdating,
    error,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    cartCount,
    cartTotal,
  } = useCart()

  const items = cart?.items ?? []

  function handleDecrease(itemId: string, currentQty: number) {
    if (currentQty <= 1) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, currentQty - 1)
    }
  }

  function handleIncrease(itemId: string, currentQty: number) {
    updateQuantity(itemId, currentQty + 1)
  }

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(open) => {
        if (!open) closeCart()
      }}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:w-[420px] sm:max-w-[420px]"
      >
        {/* ---- Header ---- */}
        <SheetHeader>
          <SheetTitle className="text-sm font-semibold uppercase tracking-widest text-navy-500">
            Winkelwagen{cartCount > 0 ? ` (${cartCount})` : ""}
          </SheetTitle>
        </SheetHeader>

        {/* ---- Error banner ---- */}
        {error && (
          <div className="mx-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ---- Items list (scrollable) ---- */}
        {items.length > 0 ? (
          <ul className="flex-1 divide-y overflow-y-auto px-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4">
                {/* Thumbnail */}
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-secondary">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <FlaskConical className="size-6 text-navy-500/40" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy-500">
                        {item.title}
                      </p>
                      {item.variant?.title && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant.title}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-medium text-navy-500">
                      {formatPrice(item.total ?? 0)}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        className="flex size-7 items-center justify-center rounded-md border border-border text-navy-500 transition-colors hover:bg-surface-secondary disabled:opacity-50"
                        aria-label="Verminder hoeveelheid"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums text-navy-500">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleIncrease(item.id, item.quantity)}
                        className="flex size-7 items-center justify-center rounded-md border border-border text-navy-500 transition-colors hover:bg-surface-secondary disabled:opacity-50"
                        aria-label="Verhoog hoeveelheid"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    {/* Remove link */}
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-red-600 hover:underline disabled:opacity-50"
                    >
                      Verwijder
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          /* ---- Empty state ---- */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
            <FlaskConical className="size-12 text-navy-500/20" />
            <p className="text-sm font-medium text-navy-500">
              Uw winkelwagen is leeg
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="text-sm text-teal-400 underline-offset-2 hover:underline"
            >
              Bekijk onze producten
            </Link>
          </div>
        )}

        {/* ---- Sticky footer (only with items) ---- */}
        {items.length > 0 && (
          <SheetFooter className="border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotaal</span>
              <span className="text-base font-semibold text-navy-500">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <Button variant="primary" size="lg" fullWidth disabled>
              Naar checkout
            </Button>

            <button
              type="button"
              onClick={closeCart}
              className="text-sm text-muted-foreground underline-offset-2 hover:underline"
            >
              Verder winkelen
            </button>

            <Separator />

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FlaskConical className="size-3.5 shrink-0" />
              <span>Uitsluitend voor laboratoriumonderzoek</span>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
