"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"

import { formatPrice } from "@/lib/price"
import { Button } from "@/components/ui/button"
import { SavedAddressToast } from "@/components/checkout/SavedAddressToast"
import { useAuth } from "@/lib/context/auth-context"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrderItem {
  title: string
  variantTitle?: string
  quantity: number
  unitPrice: number
}

interface OrderData {
  id: string
  displayId?: number
  items: OrderItem[]
  shippingAddress: {
    first_name?: string
    last_name?: string
    address_1?: string
    postal_code?: string
    city?: string
    country_code?: string
  }
  email: string
  total: number
  subtotal: number
  shippingTotal: number
  taxTotal: number
  currency?: string
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BevestigingPage() {
  const router = useRouter()
  const { customer } = useAuth()
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("inovix_last_order")
      if (raw) {
        setOrder(JSON.parse(raw))
        sessionStorage.removeItem("inovix_last_order")
      } else {
        router.push("/")
      }
    } catch {
      router.push("/")
    }
  }, [router])

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-5 animate-spin border border-navy-500 border-t-transparent" />
      </div>
    )
  }

  const orderNumber = order.displayId
    ? `#${order.displayId}`
    : order.id.slice(0, 8).toUpperCase()

  const addr = order.shippingAddress
  const cur = order.currency ?? "EUR"

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <SavedAddressToast />

      {/* Success indicator */}
      <div className="flex items-center gap-3">
        <div className="flex size-6 items-center justify-center bg-navy-500">
          <Check className="size-3.5 text-white" strokeWidth={3} />
        </div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-navy-500">
          Bestelling geplaatst
        </p>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-navy-500">
        Bedankt voor uw bestelling.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Bestelling {orderNumber} is succesvol ontvangen. U ontvangt een
        bevestiging op{" "}
        <span className="font-medium text-navy-500">{order.email}</span>.
      </p>

      {/* Order details */}
      <div className="mt-10 border-t border-border">
        {/* Items */}
        <div className="py-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Producten
          </h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-navy-500">{item.title}</p>
                  {item.variantTitle && (
                    <p className="text-xs text-muted-foreground">
                      {item.variantTitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} &times; {formatPrice(item.unitPrice, cur)}
                  </p>
                </div>
                <p className="text-sm tabular-nums text-navy-500">
                  {formatPrice(item.unitPrice * item.quantity, cur)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-border py-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotaal</span>
              <span className="tabular-nums text-navy-500">
                {formatPrice(order.subtotal, cur)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verzending</span>
              <span className="tabular-nums text-navy-500">
                {order.shippingTotal
                  ? formatPrice(order.shippingTotal, cur)
                  : "Gratis"}
              </span>
            </div>
            {order.taxTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">BTW</span>
                <span className="tabular-nums text-navy-500">
                  {formatPrice(order.taxTotal, cur)}
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm font-semibold text-navy-500">Totaal</span>
            <span className="text-lg font-bold tabular-nums text-navy-500">
              {formatPrice(order.total, cur)}
            </span>
          </div>
        </div>

        {/* Shipping address */}
        {addr && (
          <div className="border-t border-border py-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Verzendadres
            </h2>
            <div className="mt-3 text-sm leading-relaxed text-navy-500">
              <p>
                {addr.first_name} {addr.last_name}
              </p>
              <p>{addr.address_1}</p>
              <p>
                {addr.postal_code} {addr.city}
              </p>
              {addr.country_code && (
                <p className="uppercase">{addr.country_code}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Research disclaimer */}
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Alle producten zijn uitsluitend bestemd voor laboratoriumonderzoek.
        Niet voor menselijke of veterinaire consumptie.
      </p>

      {/* Guest account CTA */}
      {!customer && order && (
        <div className="mt-8 border border-border p-5">
          <p className="text-sm font-semibold text-navy-500">
            Maak een account aan en volg uw bestellingen
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We hebben uw e-mailadres en bezorgadres alvast voor u klaargezet.
          </p>
          <div className="mt-4">
            <Link
              href="/account/registratie?prefill=true"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem(
                    "inovix_signup_prefill",
                    JSON.stringify({
                      email: order.email ?? "",
                      first_name: order.shippingAddress?.first_name ?? "",
                      last_name: order.shippingAddress?.last_name ?? "",
                    })
                  )
                }
              }}
              className="inline-block border border-navy-500 bg-white px-5 py-2.5 text-sm font-medium text-navy-500 hover:bg-navy-500 hover:text-white"
            >
              Account aanmaken
            </Link>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-10">
        <Button
          variant="secondary"
          size="lg"
          className="text-sm font-semibold uppercase tracking-wider"
          onClick={() => router.push("/")}
        >
          Terug naar homepage
        </Button>
      </div>
    </div>
  )
}
