"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import medusa from "@/lib/medusa"
import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import * as Sentry from "@sentry/nextjs"

// Viva eventId codes documented at
// https://developer.viva.com/integration-reference/response-codes/ — map a
// handful of common ones to storefront query reasons so we show a specific
// Dutch message rather than the generic "cancelled".
const VIVA_EVENT_ID_MAP: Record<string, string> = {
  // Issuer declines
  "10005": "declined",
  "10051": "insufficient_funds",
  "10014": "invalid_card",
  "10041": "lost_card",
  "10043": "stolen_card",
  "10054": "expired_card",
  // 3DS failures
  "2001": "sca_failed",
  "2002": "sca_failed",
  "2003": "sca_failed",
  // Timeout / customer cancel
  "10019": "timeout",
}

function mapVivaEventIdToReason(eventId: string | null): string | undefined {
  if (!eventId) return undefined
  return VIVA_EVENT_ID_MAP[eventId]
}

type PendingCart = {
  cartId: string
  email?: string
  items?: Array<{
    title: string
    variantTitle?: string
    quantity: number
    unitPrice: number
  }>
  shippingAddress?: Record<string, unknown>
  total: number
  subtotal: number
  shippingTotal: number
  taxTotal: number
  currency?: string
}

export default function VivaReturnPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetCart } = useCart()
  const { customer } = useAuth()

  const [message, setMessage] = useState("Uw betaling wordt gecontroleerd...")
  const processedRef = useRef(false)

  useEffect(() => {
    if (processedRef.current) return
    processedRef.current = true

    const transactionId = searchParams.get("t")
    const orderCode = searchParams.get("s")
    const eventId = searchParams.get("eventId")

    // No transaction id -> customer cancelled or navigated here directly.
    if (!transactionId) {
      const reason = mapVivaEventIdToReason(eventId) ?? "cancelled"
      router.replace(`/checkout?viva=${reason}`)
      return
    }

    let pending: PendingCart | null = null
    try {
      const raw = sessionStorage.getItem("inovix_pending_viva_cart")
      if (raw) pending = JSON.parse(raw) as PendingCart
    } catch {
      pending = null
    }

    if (!pending?.cartId) {
      router.replace("/checkout?viva=missing_cart")
      return
    }

    const cartId = pending.cartId

    async function finalise() {
      try {
        try {
          await medusa.client.fetch("/store/viva-wallet/authorize", {
            method: "POST",
            body: {
              cart_id: cartId,
              transaction_id: transactionId,
              order_code: orderCode,
            },
          })
        } catch {
          router.replace("/checkout?viva=auth_failed")
          return
        }

        setMessage("Bestelling wordt afgerond...")

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await medusa.store.cart.complete(cartId)

        if (result.type !== "order") {
          router.replace("/checkout?viva=not_authorized")
          return
        }

        const order = result.order
        sessionStorage.setItem(
          "inovix_last_order",
          JSON.stringify({
            id: order.id,
            displayId: order.display_id,
            items: order.items?.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (item: any) => ({
                title: item.title,
                variantTitle: item.variant?.title,
                quantity: item.quantity,
                unitPrice: item.unit_price,
              })
            ) ??
              pending!.items ??
              [],
            shippingAddress: order.shipping_address ?? pending!.shippingAddress,
            email: order.email ?? pending!.email,
            total: order.total ?? pending!.total,
            subtotal: order.subtotal ?? pending!.subtotal,
            shippingTotal: order.shipping_total ?? pending!.shippingTotal,
            taxTotal: order.tax_total ?? pending!.taxTotal,
            currency: order.currency_code ?? pending!.currency,
          })
        )

        sessionStorage.removeItem("inovix_pending_viva_cart")

        // Autosave the shipping address for first-time customers (zero saved addresses).
        if (customer && pending?.shippingAddress) {
          try {
            const sa = pending.shippingAddress
            const { addresses } = await medusa.store.customer.listAddress({ limit: 1, offset: 0 })
            if ((addresses ?? []).length === 0) {
              await medusa.store.customer.createAddress({
                first_name: (sa.first_name as string) ?? "",
                last_name: (sa.last_name as string) ?? "",
                company: (sa.company as string) ?? undefined,
                address_1: (sa.address_1 as string) ?? "",
                postal_code: (sa.postal_code as string) ?? "",
                city: (sa.city as string) ?? "",
                country_code: (sa.country_code as string) ?? "nl",
                phone: (sa.phone as string) ?? undefined,
                is_default_shipping: true,
                is_default_billing: true,
              })
              sessionStorage.setItem("inovix_first_address_saved", "1")
            }
          } catch (err) {
            console.error("Failed to autosave from Viva return:", err)
            Sentry.captureException(err, { tags: { feature: "viva-return-autosave" } })
          }
        }

        resetCart()
        router.replace("/checkout/bevestiging")
      } catch {
        router.replace("/checkout?viva=error")
      }
    }

    void finalise()
  }, [router, searchParams, resetCart])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Loader2 className="size-5 animate-spin text-navy-500" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
