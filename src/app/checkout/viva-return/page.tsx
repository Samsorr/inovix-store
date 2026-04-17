"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import medusa from "@/lib/medusa"
import { useCart } from "@/lib/context/cart-context"

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

  const [message, setMessage] = useState("Uw betaling wordt gecontroleerd...")
  const processedRef = useRef(false)

  useEffect(() => {
    if (processedRef.current) return
    processedRef.current = true

    const transactionId = searchParams.get("t")
    const orderCode = searchParams.get("s")

    // No transaction id -> customer cancelled or navigated here directly.
    if (!transactionId) {
      router.replace("/checkout?viva=cancelled")
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
