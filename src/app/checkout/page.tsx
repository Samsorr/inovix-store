"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Check, CreditCard, Loader2, Mail, MapPin, Truck } from "lucide-react"
import { motion } from "motion/react"

import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import medusa from "@/lib/medusa"
import { formatPrice } from "@/lib/price"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"
import * as Sentry from "@sentry/nextjs"

import { CheckoutStepper } from "./CheckoutStepper"
import { PromoCodeInput } from "./PromoCodeInput"
import { AddressForm, EMPTY_ADDRESS, type AddressFormValue } from "@/components/checkout/AddressForm"
import { SavedAddressPicker, type SavedAddress } from "@/components/checkout/SavedAddressPicker"
import { ShippingOptionCard, type ShippingOptionData } from "@/components/checkout/ShippingOptionCard"
import { StickyOrderSummary } from "@/components/checkout/StickyOrderSummary"
import { TrustBlock } from "@/components/checkout/TrustBlock"
import { LoginGuestFork } from "@/components/checkout/LoginGuestFork"

// ---------------------------------------------------------------------------
// Step Section — clean, editorial accordion
// ---------------------------------------------------------------------------

function StepSection({
  step,
  title,
  isActive,
  isCompleted,
  isReachable,
  summary,
  onEdit,
  children,
}: {
  step: number
  title: string
  isActive: boolean
  isCompleted: boolean
  isReachable: boolean
  summary?: string
  onEdit: () => void
  children: React.ReactNode
}) {
  const stepNum = String(step).padStart(2, "0")

  return (
    <div
      className={cn(
        "border-b border-border py-6 last:border-b-0 transition-all duration-300",
        isActive && "border-l-2 border-l-teal-400 pl-5",
        !isReachable && !isCompleted && !isActive && "opacity-30"
      )}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-4">
          <span
            className={cn(
              "text-[11px] font-medium tracking-widest tabular-nums transition-colors",
              isActive ? "text-teal-400" : "text-muted-foreground"
            )}
          >
            {stepNum}
          </span>
          <h3
            className={cn(
              "text-[13px] font-semibold uppercase tracking-[0.08em]",
              isActive || isCompleted
                ? "text-navy-500"
                : "text-muted-foreground"
            )}
          >
            {title}
          </h3>
          {isCompleted && !isActive && (
            <Check className="size-3.5 text-teal-400" strokeWidth={2.5} />
          )}
        </div>
        {isCompleted && !isActive && (
          <button
            type="button"
            onClick={onEdit}
            className="text-[12px] font-medium text-navy-500 underline underline-offset-4 decoration-border transition-colors hover:decoration-navy-500"
          >
            Wijzigen
          </button>
        )}
      </div>

      {/* Summary for completed steps */}
      {isCompleted && !isActive && summary && (
        <p className="mt-2 pl-[calc(11px+1rem+4px)] text-sm text-muted-foreground">
          {summary}
        </p>
      )}

      {/* Form content for active step */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-6"
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Order Summary — typographic, no decoration
// ---------------------------------------------------------------------------

function OrderSummary({
  cart,
  shippingSelected,
  onCartUpdated,
}: {
  cart: NonNullable<ReturnType<typeof useCart>["cart"]>
  shippingSelected: boolean
  onCartUpdated: (cart: NonNullable<ReturnType<typeof useCart>["cart"]>) => void
}) {
  const items = cart.items ?? []
  const discountTotal = cart.discount_total ?? 0

  return (
    <div className="border border-border bg-surface-secondary/60 p-6 backdrop-blur-sm">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-navy-500">
        Bestelling
        <span className="ml-2 font-normal text-muted-foreground">
          ({items.reduce((sum, i) => sum + i.quantity, 0)})
        </span>
      </h2>

      {/* Items */}
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden border border-border bg-surface-secondary">
              <Image
                src={item.thumbnail || "/images/product-peptide.png"}
                alt={item.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-navy-500">
                  {item.title}
                </p>
                {item.variant?.title && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.variant.title}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.quantity} &times;{" "}
                  {formatPrice(item.unit_price ?? 0)}
                </p>
              </div>
              <p className="shrink-0 text-sm tabular-nums text-navy-500">
                {formatPrice((item.unit_price ?? 0) * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Promo code */}
      <div className="mt-6 border-t border-border pt-4">
        <PromoCodeInput cart={cart} onCartUpdated={onCartUpdated} />
      </div>

      {/* Totals */}
      <div className="mt-4 border-t border-border pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotaal</span>
            <span className="tabular-nums text-navy-500">
              {formatPrice(cart.subtotal ?? 0)}
            </span>
          </div>
          {discountTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Korting</span>
              <span className="tabular-nums text-teal-500">
                -{formatPrice(discountTotal)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Verzending</span>
            <span className="tabular-nums text-navy-500">
              {shippingSelected
                ? cart.shipping_total
                  ? formatPrice(cart.shipping_total)
                  : "Gratis"
                : "Wordt berekend"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              BTW {(cart.tax_total ?? 0) > 0 ? "" : "(0%)"}
            </span>
            <span className="tabular-nums text-navy-500">
              {formatPrice(cart.tax_total ?? 0)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold text-navy-500">Totaal</span>
          <span className="text-lg font-bold tabular-nums text-navy-500">
            {formatPrice(cart.total ?? 0)}
          </span>
        </div>
      </div>

      {/* Trust — text only, no badges */}
      <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <div className="size-1.5 bg-teal-400" />
        GMP kwaliteit &middot; HPLC getest &middot; EU-conform
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Checkout Page
// ---------------------------------------------------------------------------

const VIVA_ERROR_MESSAGES: Record<string, string> = {
  cancelled: "De betaling is geannuleerd. U kunt het opnieuw proberen.",
  missing_cart:
    "We konden uw winkelwagen niet terugvinden na de betaling. Probeer het opnieuw.",
  auth_failed:
    "We konden uw betaling niet bevestigen. Probeer het opnieuw of neem contact op met support.",
  not_authorized:
    "De betaling werd niet geautoriseerd. Probeer het opnieuw met een andere betaalmethode.",
  error:
    "Er ging iets mis bij het afronden van uw bestelling. Probeer het opnieuw.",
  declined:
    "Uw bank heeft de betaling geweigerd. Probeer een andere kaart of neem contact op met uw bank.",
  insufficient_funds:
    "Onvoldoende saldo op uw kaart. Probeer een andere betaalmethode.",
  invalid_card:
    "De kaartgegevens zijn ongeldig. Controleer uw kaartnummer, vervaldatum en CVV.",
  lost_card:
    "Deze kaart is als verloren of gestolen gemeld. Gebruik een andere kaart.",
  stolen_card:
    "Deze kaart is als verloren of gestolen gemeld. Gebruik een andere kaart.",
  expired_card:
    "Deze kaart is verlopen. Gebruik een andere kaart.",
  sca_failed:
    "De beveiligingsverificatie (3D Secure) is niet voltooid. Probeer het opnieuw en bevestig de betaling in uw bank-app.",
  timeout:
    "De betaling is verlopen. Start de bestelling opnieuw.",
}

// Defense-in-depth: only redirect to known Viva Smart Checkout hosts. The URL
// comes from our backend, but if that's compromised this prevents an open
// redirect to an attacker-controlled domain.
const ALLOWED_VIVA_HOSTS = new Set([
  "www.vivapayments.com",
  "demo.vivapayments.com",
])

function isAllowedVivaCheckoutUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" && ALLOWED_VIVA_HOSTS.has(parsed.hostname)
  } catch {
    return false
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cart, isLoading, closeCart, updateCartState, resetCart, cartCount } =
    useCart()
  const { customer } = useAuth()

  // Step management
  const [activeStep, setActiveStep] = useState(1)
  const [guestChoiceMade, setGuestChoiceMade] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Step 1: Email
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  // Step 2: Address
  const [address, setAddress] = useState<AddressFormValue>(EMPTY_ADDRESS)
  const [addressErrors, setAddressErrors] = useState<
    Partial<Record<keyof AddressFormValue, string>>
  >({})
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(null)
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(true)

  // Step 2: Billing address (optional separate)
  const [useDifferentBilling, setUseDifferentBilling] = useState(false)
  const [billingAddress, setBillingAddress] = useState<AddressFormValue>(EMPTY_ADDRESS)
  const [billingErrors, setBillingErrors] = useState<Partial<Record<keyof AddressFormValue, string>>>({})
  const [billingSelectedId, setBillingSelectedId] = useState<string | null>(null)

  // Step 3: Shipping
  const [shippingOptions, setShippingOptions] = useState<ShippingOptionData[]>([])
  const [selectedShipping, setSelectedShipping] = useState("")
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [orderNotes, setOrderNotes] = useState("")

  // Step 4: Payment
  const [paymentProviders, setPaymentProviders] = useState<
    Array<{ id: string }>
  >([])
  const [selectedPayment, setSelectedPayment] = useState("")
  const [loadingPayment, setLoadingPayment] = useState(false)

  // Global UI state
  const [isProcessing, setIsProcessing] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const [researchConfirmed, setResearchConfirmed] = useState(false)

  // Run the logged-in auto-advance at most once per mount so going back
  // via "Wijzigen" doesn't kick the user forward again.
  const autoAdvancedRef = useRef(false)

  // Synchronous guard against double-submitting Place Order: React state
  // updates are asynchronous, so a fast double-click can fire the handler
  // twice before `isProcessing` re-renders. This ref blocks the second call.
  const placingOrderRef = useRef(false)

  // Close cart sheet on mount
  useEffect(() => {
    closeCart()
  }, [closeCart])

  // Surface Viva return errors (customer cancelled or authorisation failed)
  useEffect(() => {
    const viva = searchParams.get("viva")
    if (viva && VIVA_ERROR_MESSAGES[viva]) {
      setGlobalError(VIVA_ERROR_MESSAGES[viva])
      router.replace("/checkout")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pre-fill email from cart
  useEffect(() => {
    if (cart?.email && !email) setEmail(cart.email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.email])

  // Pre-fill address from cart
  useEffect(() => {
    const sa = cart?.shipping_address
    if (sa && !address.firstName) {
      setAddress({
        firstName: sa.first_name ?? "",
        lastName: sa.last_name ?? "",
        company: sa.company ?? "",
        address1: sa.address_1 ?? "",
        postalCode: sa.postal_code ?? "",
        city: sa.city ?? "",
        countryCode: sa.country_code ?? "nl",
        phone: sa.phone ?? "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.shipping_address])

  // Auto-advance for logged-in customers: skip the email step, and skip the
  // address step if a default saved address is available and complete.
  useEffect(() => {
    if (autoAdvancedRef.current) return
    if (!customer || !cart) return
    if (cart.email || completedSteps.has(1)) {
      // User already typed an email or advanced manually — don't override.
      return
    }
    autoAdvancedRef.current = true

    let cancelled = false

    async function advance() {
      if (!customer || !cart) return
      const email = customer.email
      if (!email) return
      try {
        setEmail(email)
        const { cart: afterEmail } = await medusa.store.cart.update(cart.id, {
          email,
        })
        if (cancelled) return
        updateCartState(afterEmail)
        setCompletedSteps((prev) => new Set([...prev, 1]))

        // Fetch saved addresses. Prefer default shipping, else first.
        const { addresses } = await medusa.store.customer.listAddress({
          limit: 20,
          offset: 0,
        })
        const addr =
          addresses?.find((a) => a.is_default_shipping) ??
          addresses?.[0] ??
          undefined
        if (!cancelled) {
          setSavedAddresses(addresses ?? [])
          setSelectedSavedAddressId(addr?.id ?? null)
        }
        if (!addr) {
          if (!cancelled) {
            setAddress({
              ...EMPTY_ADDRESS,
              firstName: customer.first_name ?? "",
              lastName: customer.last_name ?? "",
              phone: customer.phone ?? "",
            })
            setActiveStep(2)
          }
          return
        }
        if (cancelled) {
          setActiveStep(2)
          return
        }

        const nextAddress: AddressFormValue = {
          firstName: addr.first_name ?? "",
          lastName: addr.last_name ?? "",
          company: addr.company ?? "",
          address1: addr.address_1 ?? "",
          postalCode: addr.postal_code ?? "",
          city: addr.city ?? "",
          countryCode: addr.country_code ?? "nl",
          phone: addr.phone ?? "",
        }
        setAddress(nextAddress)

        const isComplete =
          !!nextAddress.firstName &&
          !!nextAddress.lastName &&
          !!nextAddress.address1 &&
          !!nextAddress.postalCode &&
          !!nextAddress.city

        if (!isComplete) {
          setActiveStep(2)
          return
        }

        const shippingAddr = {
          first_name: nextAddress.firstName,
          last_name: nextAddress.lastName,
          company: nextAddress.company || undefined,
          address_1: nextAddress.address1,
          postal_code: nextAddress.postalCode,
          city: nextAddress.city,
          country_code: nextAddress.countryCode,
          phone: nextAddress.phone || undefined,
        }
        const { cart: afterAddress } = await medusa.store.cart.update(cart.id, {
          shipping_address: shippingAddr,
          billing_address: shippingAddr,
        })
        if (cancelled) return
        updateCartState(afterAddress)
        setCompletedSteps((prev) => new Set([...prev, 1, 2]))
        setActiveStep(3)
        fetchShippingOptions()
      } catch {
        // Auto-advance is a nice-to-have; on failure fall back to the
        // default first step without surfacing a hard error.
      }
    }

    void advance()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, cart?.id])

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  const completeStep = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]))
    setActiveStep(step + 1)
  }, [])

  const editStep = useCallback((step: number) => {
    setActiveStep(step)
  }, [])

  // -----------------------------------------------------------------------
  // Step 1: Email
  // -----------------------------------------------------------------------

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cart) return
    setEmailError("")

    const trimmed = email.trim()
    if (!trimmed) {
      setEmailError("E-mailadres is verplicht")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Voer een geldig e-mailadres in")
      return
    }

    setIsProcessing(true)
    try {
      const { cart: updated } = await medusa.store.cart.update(cart.id, {
        email: trimmed,
      })
      updateCartState(updated)
      completeStep(1)
    } catch {
      setEmailError("Kon e-mailadres niet opslaan. Probeer het opnieuw.")
    } finally {
      setIsProcessing(false)
    }
  }

  // -----------------------------------------------------------------------
  // Step 2: Address
  // -----------------------------------------------------------------------

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cart) return
    const errors: Partial<Record<keyof AddressFormValue, string>> = {}

    if (!address.firstName.trim()) errors.firstName = "Voornaam is verplicht"
    if (!address.lastName.trim()) errors.lastName = "Achternaam is verplicht"
    if (!address.address1.trim()) errors.address1 = "Adres is verplicht"
    if (!address.postalCode.trim()) errors.postalCode = "Postcode is verplicht"
    if (!address.city.trim()) errors.city = "Stad is verplicht"

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors)
      return
    }

    if (useDifferentBilling) {
      const bErrors: Partial<Record<keyof AddressFormValue, string>> = {}
      if (!billingAddress.firstName.trim()) bErrors.firstName = "Voornaam is verplicht"
      if (!billingAddress.lastName.trim()) bErrors.lastName = "Achternaam is verplicht"
      if (!billingAddress.address1.trim()) bErrors.address1 = "Adres is verplicht"
      if (!billingAddress.postalCode.trim()) bErrors.postalCode = "Postcode is verplicht"
      if (!billingAddress.city.trim()) bErrors.city = "Stad is verplicht"
      if (Object.keys(bErrors).length > 0) {
        setBillingErrors(bErrors)
        return
      }
    }

    setIsProcessing(true)
    try {
      const shippingAddr = {
        first_name: address.firstName.trim(),
        last_name: address.lastName.trim(),
        company: address.company.trim() || undefined,
        address_1: address.address1.trim(),
        postal_code: address.postalCode.trim(),
        city: address.city.trim(),
        country_code: address.countryCode,
        phone: address.phone.trim() || undefined,
      }

      const billingAddr = useDifferentBilling
        ? {
            first_name: billingAddress.firstName.trim(),
            last_name: billingAddress.lastName.trim(),
            company: billingAddress.company.trim() || undefined,
            address_1: billingAddress.address1.trim(),
            postal_code: billingAddress.postalCode.trim(),
            city: billingAddress.city.trim(),
            country_code: billingAddress.countryCode,
            phone: billingAddress.phone.trim() || undefined,
          }
        : shippingAddr

      const { cart: updated } = await medusa.store.cart.update(cart.id, {
        shipping_address: shippingAddr,
        billing_address: billingAddr,
      })
      updateCartState(updated)

      if (customer && selectedSavedAddressId === null && saveAddressToAccount) {
        try {
          await medusa.store.customer.createAddress({
            first_name: address.firstName.trim(),
            last_name: address.lastName.trim(),
            company: address.company.trim() || undefined,
            address_1: address.address1.trim(),
            postal_code: address.postalCode.trim(),
            city: address.city.trim(),
            country_code: address.countryCode,
            phone: address.phone.trim() || undefined,
          })
          const { addresses: refreshed } = await medusa.store.customer.listAddress({ limit: 20, offset: 0 })
          setSavedAddresses(refreshed ?? [])
        } catch (err) {
          console.error("Failed to save address to account:", err)
        }
      }

      completeStep(2)
      fetchShippingOptions()
    } catch (err) {
      console.error("Address save error:", err)
      setGlobalError("Kon adres niet opslaan. Probeer het opnieuw.")
    } finally {
      setIsProcessing(false)
    }
  }

  // -----------------------------------------------------------------------
  // Step 3: Shipping
  // -----------------------------------------------------------------------

  async function fetchShippingOptions() {
    if (!cart) return
    setLoadingShipping(true)
    setGlobalError("")
    try {
      const { shipping_options } =
        await medusa.store.fulfillment.listCartOptions({
          cart_id: cart.id,
        })

      const options: ShippingOptionData[] = (shipping_options ?? []).map((opt) => {
        const meta = ((opt as unknown as { metadata?: Record<string, unknown> }).metadata ?? {})
        return {
          id: opt.id,
          name: opt.name ?? "Standaard verzending",
          amount: opt.amount ?? 0,
          carrier: typeof meta.carrier === "string" ? meta.carrier : undefined,
          deliveryEstimate: typeof meta.delivery_estimate === "string" ? meta.delivery_estimate : undefined,
          tracked: meta.tracked === true,
          insured: meta.insured === true,
        }
      })

      setShippingOptions(options)

      if (options.length === 1) {
        await selectShippingOption(options[0].id)
      }
    } catch {
      setGlobalError("Kon verzendopties niet laden. Probeer het opnieuw.")
    } finally {
      setLoadingShipping(false)
    }
  }

  async function selectShippingOption(optionId: string) {
    if (!cart) return
    setSelectedShipping(optionId)
    setIsProcessing(true)
    setGlobalError("")
    try {
      const { cart: updated } = await medusa.store.cart.addShippingMethod(
        cart.id,
        { option_id: optionId }
      )
      updateCartState(updated)
      if (orderNotes.trim()) {
        await medusa.store.cart.update(cart.id, {
          metadata: { ...((cart.metadata as Record<string, unknown>) ?? {}), delivery_notes: orderNotes.trim() },
        })
      }
      completeStep(3)
      fetchPaymentProviders()
    } catch {
      setGlobalError(
        "Kon verzendmethode niet selecteren. Probeer het opnieuw."
      )
    } finally {
      setIsProcessing(false)
    }
  }

  // -----------------------------------------------------------------------
  // Step 4: Payment
  // -----------------------------------------------------------------------

  async function fetchPaymentProviders() {
    if (!cart) return
    setLoadingPayment(true)
    setGlobalError("")
    try {
      const { payment_providers } =
        await medusa.store.payment.listPaymentProviders({
          region_id: cart.region_id ?? "",
        })

      const providers = (payment_providers ?? []).map((p) => ({ id: p.id }))

      setPaymentProviders(providers)

      if (providers.length === 1) {
        setSelectedPayment(providers[0].id)
        await initiatePaymentSession(providers[0].id)
      }
    } catch {
      setGlobalError("Kon betaalopties niet laden. Probeer het opnieuw.")
    } finally {
      setLoadingPayment(false)
    }
  }

  async function initiatePaymentSession(providerId: string) {
    if (!cart) return
    try {
      await medusa.store.payment.initiatePaymentSession(cart, {
        provider_id: providerId,
      })
      const { cart: updated } = await medusa.store.cart.retrieve(cart.id)
      updateCartState(updated)
    } catch {
      setGlobalError("Kon betaalsessie niet starten. Probeer het opnieuw.")
    }
  }

  async function handlePaymentSelect(providerId: string) {
    setSelectedPayment(providerId)
    setIsProcessing(true)
    setGlobalError("")
    try {
      await initiatePaymentSession(providerId)
    } finally {
      setIsProcessing(false)
    }
  }

  // -----------------------------------------------------------------------
  // Place Order
  // -----------------------------------------------------------------------

  async function handlePlaceOrder() {
    if (!cart) return
    if (placingOrderRef.current) return
    if (!selectedPayment) {
      setGlobalError("Selecteer een betaalmethode.")
      return
    }
    if (!researchConfirmed) {
      setGlobalError(
        "Bevestig dat de producten uitsluitend voor onderzoek worden gebruikt."
      )
      return
    }

    placingOrderRef.current = true
    setIsProcessing(true)
    setGlobalError("")

    // Persist any latest order notes that may have been typed after shipping was picked
    if (orderNotes.trim() && cart) {
      try {
        const { cart: withNotes } = await medusa.store.cart.update(cart.id, {
          metadata: { ...((cart.metadata as Record<string, unknown> | null) ?? {}), delivery_notes: orderNotes.trim() },
        })
        updateCartState(withNotes)
      } catch (err) {
        console.error("Failed to persist order notes:", err)
        // Don't block order placement on notes failure
      }
    }

    // Viva Wallet: redirect to Smart Checkout instead of completing locally.
    if (selectedPayment === "pp_viva-wallet_viva") {
      const sessions = cart.payment_collection?.payment_sessions
      const vivaSession = sessions?.find(
        (s) => s.provider_id === "pp_viva-wallet_viva"
      )
      const checkoutUrl = vivaSession?.data?.checkoutUrl as string | undefined

      if (!checkoutUrl || !isAllowedVivaCheckoutUrl(checkoutUrl)) {
        setGlobalError(
          "Kon de Viva-betaling niet starten. Probeer het opnieuw."
        )
        setIsProcessing(false)
        placingOrderRef.current = false
        return
      }

      // Stash enough data to render the confirmation page after the return
      // redirect, since the cart will be emptied once the order is created.
      try {
        sessionStorage.setItem(
          "inovix_pending_viva_cart",
          JSON.stringify({
            cartId: cart.id,
            email: cart.email ?? email,
            items: cart.items?.map((item) => ({
              title: item.title,
              variantTitle: item.variant?.title,
              quantity: item.quantity,
              unitPrice: item.unit_price ?? 0,
            })),
            shippingAddress: cart.shipping_address,
            total: cart.total ?? 0,
            subtotal: cart.subtotal ?? 0,
            shippingTotal: cart.shipping_total ?? 0,
            taxTotal: cart.tax_total ?? 0,
            currency: cart.currency_code,
          })
        )
      } catch {
        // sessionStorage may be unavailable; fall through, confirmation will
        // gracefully handle missing data.
      }

      window.location.href = checkoutUrl
      return
    }

    try {
      const result = await medusa.store.cart.complete(cart.id)

      if (result.type === "order") {
        const order = result.order
        sessionStorage.setItem(
          "inovix_last_order",
          JSON.stringify({
            id: order.id,
            displayId: order.display_id,
            items: order.items?.map((item) => ({
              title: item.title,
              variantTitle: item.variant?.title,
              quantity: item.quantity,
              unitPrice: item.unit_price,
            })),
            shippingAddress: order.shipping_address,
            email: order.email,
            total: order.total,
            subtotal: order.subtotal,
            shippingTotal: order.shipping_total,
            taxTotal: order.tax_total,
            currency: order.currency_code,
          })
        )

        if (customer) {
          try {
            const { addresses: existing } = await medusa.store.customer.listAddress({ limit: 1, offset: 0 })
            if ((existing ?? []).length === 0) {
              await medusa.store.customer.createAddress({
                first_name: address.firstName.trim(),
                last_name: address.lastName.trim(),
                company: address.company.trim() || undefined,
                address_1: address.address1.trim(),
                postal_code: address.postalCode.trim(),
                city: address.city.trim(),
                country_code: address.countryCode,
                phone: address.phone.trim() || undefined,
                is_default_shipping: true,
                is_default_billing: true,
              })
              sessionStorage.setItem("inovix_first_address_saved", "1")
            }
          } catch (err) {
            console.error("Failed to autosave first address:", err)
            Sentry.captureException(err, { tags: { feature: "checkout-autosave" } })
          }
        }

        resetCart()
        router.push("/checkout/bevestiging")
      } else {
        setGlobalError(
          result.error?.message ||
            "Bestelling kon niet worden afgerond. Probeer het opnieuw."
        )
      }
    } catch {
      setGlobalError(
        "Er is een fout opgetreden bij het plaatsen van de bestelling. Probeer het opnieuw."
      )
    } finally {
      setIsProcessing(false)
      placingOrderRef.current = false
    }
  }

  // -----------------------------------------------------------------------
  // Step summaries
  // -----------------------------------------------------------------------

  const emailSummary = email || undefined
  const addressSummary =
    address.firstName && address.city
      ? `${address.firstName} ${address.lastName}, ${address.postalCode} ${address.city}`
      : undefined
  const selectedShippingOption = shippingOptions.find(
    (o) => o.id === selectedShipping
  )
  const shippingSummary = selectedShippingOption
    ? `${selectedShippingOption.name} · ${
        selectedShippingOption.amount
          ? formatPrice(selectedShippingOption.amount)
          : "Gratis"
      }`
    : undefined

  const paymentProviderLabel = (id: string) => {
    if (id.includes("manual")) return "Handmatige betaling"
    if (id.includes("system")) return "Systeembetaling"
    if (id.includes("stripe")) return "Creditcard (Stripe)"
    if (id.includes("viva")) return "Viva Wallet"
    if (id.includes("paypal")) return "PayPal"
    return id.charAt(0).toUpperCase() + id.slice(1).replace(/[_-]/g, " ")
  }

  // -----------------------------------------------------------------------
  // Loading / empty states
  // -----------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-5 animate-spin border border-navy-500 border-t-transparent" />
      </div>
    )
  }

  if (!cart || !cart.items?.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <p className="text-sm text-muted-foreground">
          Uw winkelwagen is leeg.
        </p>
        <Button
          variant="secondary"
          size="md"

          onClick={() => router.push("/products")}
        >
          Bekijk producten
        </Button>
      </div>
    )
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <StickyOrderSummary total={cart.total ?? 0} itemCount={cartCount}>
        <OrderSummary
          cart={cart}
          shippingSelected={completedSteps.has(3)}
          onCartUpdated={updateCartState}
        />
      </StickyOrderSummary>

      <div className="lg:grid lg:grid-cols-12 lg:gap-16">
        {/* Left column — Form */}
        <div className="lg:col-span-7">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
              Checkout
            </h1>
            {customer && (
              <p className="text-[12px] text-muted-foreground">
                Ingelogd als{" "}
                <span className="font-medium text-navy-500">
                  {customer.email}
                </span>
              </p>
            )}
          </div>

          {!customer && !guestChoiceMade && !cart.email && (
            <div className="mt-8">
              <LoginGuestFork
                onContinueAsGuest={() => setGuestChoiceMade(true)}
              />
            </div>
          )}

          {(customer || guestChoiceMade || cart.email) && (
            <>
              {/* Progress stepper */}
              <div className="mt-6">
                <CheckoutStepper
                  steps={[
                    { num: 1, label: "E-mail", icon: Mail },
                    { num: 2, label: "Adres", icon: MapPin },
                    { num: 3, label: "Verzending", icon: Truck },
                    { num: 4, label: "Betaling", icon: CreditCard },
                  ]}
                  activeStep={activeStep}
                  completedSteps={completedSteps}
                  onEdit={editStep}
                />
              </div>

              {/* Global error */}
              {globalError && (
                <div className="mt-6 border-l-2 border-red-500 bg-white py-2 pl-4 text-sm text-red-700">
                  {globalError}
                </div>
              )}

              <div className="mt-8 border-t border-border">
            {/* ── Step 1: Email ── */}
            <StepSection
              step={1}
              title="E-mailadres"
              isActive={activeStep === 1}
              isCompleted={completedSteps.has(1)}
              isReachable={true}
              summary={emailSummary}
              onEdit={() => editStep(1)}
            >
              <form onSubmit={handleEmailSubmit}>
                <p className="mb-5 text-sm text-muted-foreground">
                  We gebruiken uw e-mailadres voor de orderbevestiging.
                </p>
                <Input
                  type="email"
                  label="E-mailadres"
                  placeholder="uw@email.nl"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError("")
                  }}
                  error={emailError}
                  autoFocus
                  autoComplete="email"
                  inputMode="email"
                  name="email"
                />
                <div className="mt-5">
                  <Button
                    type="submit"
                    variant="ghost"
                    size="md"
                    disabled={isProcessing}
                    className="border border-navy-500 text-navy-500 hover:bg-navy-500 hover:text-white"
                  >
                    {isProcessing && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    Doorgaan
                  </Button>
                </div>
              </form>
            </StepSection>

            {/* ── Step 2: Shipping Address ── */}
            <StepSection
              step={2}
              title="Verzendgegevens"
              isActive={activeStep === 2}
              isCompleted={completedSteps.has(2)}
              isReachable={completedSteps.has(1)}
              summary={addressSummary}
              onEdit={() => editStep(2)}
            >
              <form onSubmit={handleAddressSubmit}>
                {customer && savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-3 text-sm text-muted-foreground">
                      Kies een opgeslagen adres of voer een nieuw adres in.
                    </p>
                    <SavedAddressPicker
                      addresses={savedAddresses}
                      selectedId={selectedSavedAddressId}
                      onSelect={(id) => {
                        setSelectedSavedAddressId(id)
                        const sel = savedAddresses.find((a) => a.id === id)
                        if (sel) {
                          setAddress({
                            firstName: sel.first_name ?? "",
                            lastName: sel.last_name ?? "",
                            company: sel.company ?? "",
                            address1: sel.address_1 ?? "",
                            postalCode: sel.postal_code ?? "",
                            city: sel.city ?? "",
                            countryCode: sel.country_code ?? "nl",
                            phone: sel.phone ?? "",
                          })
                          setAddressErrors({})
                        }
                      }}
                      onChooseNew={() => {
                        setSelectedSavedAddressId(null)
                        setAddress(EMPTY_ADDRESS)
                      }}
                    />
                  </div>
                )}

                {(!customer || savedAddresses.length === 0 || selectedSavedAddressId === null) && (
                  <>
                    <AddressForm
                      value={address}
                      errors={addressErrors}
                      onChange={(next) => {
                        setAddress(next)
                        if (Object.keys(addressErrors).length > 0) setAddressErrors({})
                      }}
                      autoFocusFirstField
                      autocompleteSection="shipping"
                    />

                    {customer && (
                      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-navy-500">
                        <input
                          type="checkbox"
                          checked={saveAddressToAccount}
                          onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                          className="size-4 border-border"
                        />
                        Opslaan in mijn account
                      </label>
                    )}
                  </>
                )}

                <div className="mt-6 border-t border-border pt-6">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-navy-500">
                    <input
                      type="checkbox"
                      checked={useDifferentBilling}
                      onChange={(e) => setUseDifferentBilling(e.target.checked)}
                      className="size-4 border-border"
                    />
                    Factuuradres wijkt af van verzendadres
                  </label>

                  {useDifferentBilling && (
                    <div className="mt-5">
                      <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                        Factuuradres
                      </p>

                      {customer && savedAddresses.length > 0 && (
                        <div className="mb-4">
                          <SavedAddressPicker
                            addresses={savedAddresses}
                            selectedId={billingSelectedId}
                            onSelect={(id) => {
                              setBillingSelectedId(id)
                              const sel = savedAddresses.find((a) => a.id === id)
                              if (sel) {
                                setBillingAddress({
                                  firstName: sel.first_name ?? "",
                                  lastName: sel.last_name ?? "",
                                  company: sel.company ?? "",
                                  address1: sel.address_1 ?? "",
                                  postalCode: sel.postal_code ?? "",
                                  city: sel.city ?? "",
                                  countryCode: sel.country_code ?? "nl",
                                  phone: sel.phone ?? "",
                                })
                                setBillingErrors({})
                              }
                            }}
                            onChooseNew={() => {
                              setBillingSelectedId(null)
                              setBillingAddress(EMPTY_ADDRESS)
                            }}
                          />
                        </div>
                      )}

                      {(!customer || savedAddresses.length === 0 || billingSelectedId === null) && (
                        <AddressForm
                          value={billingAddress}
                          errors={billingErrors}
                          onChange={(next) => {
                            setBillingAddress(next)
                            if (Object.keys(billingErrors).length > 0) setBillingErrors({})
                          }}
                          autocompleteSection="billing"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <Button
                    type="submit"
                    variant="ghost"
                    size="md"
                    disabled={isProcessing}
                    className="border border-navy-500 text-navy-500 hover:bg-navy-500 hover:text-white"
                  >
                    {isProcessing && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    Doorgaan
                  </Button>
                </div>
              </form>
            </StepSection>

            {/* ── Step 3: Shipping Method ── */}
            <StepSection
              step={3}
              title="Verzendmethode"
              isActive={activeStep === 3}
              isCompleted={completedSteps.has(3)}
              isReachable={completedSteps.has(2)}
              summary={shippingSummary}
              onEdit={() => {
                editStep(3)
                if (shippingOptions.length === 0) fetchShippingOptions()
              }}
            >
              {loadingShipping ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="size-4 animate-spin border border-navy-500 border-t-transparent" />
                  <span className="text-sm text-muted-foreground">
                    Verzendopties laden...
                  </span>
                </div>
              ) : shippingOptions.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  Geen verzendopties beschikbaar voor dit adres.
                </p>
              ) : (
                <>
                  <div className="space-y-2" role="radiogroup" aria-label="Verzendmethode">
                    {shippingOptions.map((option) => (
                      <ShippingOptionCard
                        key={option.id}
                        option={option}
                        selected={selectedShipping === option.id}
                        disabled={isProcessing}
                        onSelect={selectShippingOption}
                      />
                    ))}
                  </div>
                  <div className="mt-6">
                    <label htmlFor="order-notes" className="mb-1.5 block text-sm font-medium text-navy-500">
                      Opmerkingen voor bezorger (optioneel)
                    </label>
                    <textarea
                      id="order-notes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={3}
                      className="w-full border border-border bg-transparent px-3 py-2.5 text-sm transition-colors outline-none focus:border-navy-500 focus:ring-1 focus:ring-navy-500/20"
                      placeholder="Bijv. afgeven bij buren op nummer 12"
                    />
                  </div>
                </>
              )}
            </StepSection>

            {/* ── Step 4: Payment ── */}
            <StepSection
              step={4}
              title="Betaling"
              isActive={activeStep === 4}
              isCompleted={completedSteps.has(4)}
              isReachable={completedSteps.has(3)}
              summary={
                selectedPayment
                  ? paymentProviderLabel(selectedPayment)
                  : undefined
              }
              onEdit={() => {
                editStep(4)
                if (paymentProviders.length === 0) fetchPaymentProviders()
              }}
            >
              {loadingPayment ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="size-4 animate-spin border border-navy-500 border-t-transparent" />
                  <span className="text-sm text-muted-foreground">
                    Betaalopties laden...
                  </span>
                </div>
              ) : paymentProviders.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  Geen betaalopties beschikbaar.
                </p>
              ) : (
                <div className="space-y-2">
                  {paymentProviders.map((provider) => (
                    <label
                      key={provider.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between border px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-1 focus-within:ring-navy-500/20",
                        selectedPayment === provider.id
                          ? "border-navy-500 bg-navy-500/[0.02]"
                          : "border-border hover:border-navy-200",
                        isProcessing && "pointer-events-none opacity-60"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment_provider"
                        value={provider.id}
                        checked={selectedPayment === provider.id}
                        onChange={() => handlePaymentSelect(provider.id)}
                        disabled={isProcessing}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-4 items-center justify-center border",
                            selectedPayment === provider.id
                              ? "border-navy-500"
                              : "border-border"
                          )}
                        >
                          {selectedPayment === provider.id && (
                            <div className="size-2 bg-navy-500" />
                          )}
                        </div>
                        <span className="text-sm text-navy-500">
                          {paymentProviderLabel(provider.id)}
                        </span>
                      </div>
                      {provider.id.includes("viva") && (
                        <Image
                          src="/images/payment-viva.svg"
                          alt="viva.com"
                          width={64}
                          height={20}
                          className="h-5 w-auto"
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}

              {/* Research confirmation + Place Order */}
              {selectedPayment && (
                <div className="mt-8 space-y-5">
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-teal-200 bg-teal-50/40 px-4 py-3 transition-all duration-300 hover:border-teal-300 hover:bg-teal-50/60 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-400/30 min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={researchConfirmed}
                      onChange={(e) => setResearchConfirmed(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-300",
                        researchConfirmed
                          ? "border-teal-500 bg-teal-500"
                          : "border-teal-300 bg-white"
                      )}
                    >
                      {researchConfirmed && (
                        <Check className="size-3.5 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm text-navy-900">
                      Ik bevestig dat alle producten uitsluitend worden
                      gebruikt voor in-vitro laboratoriumonderzoek en niet
                      voor menselijke of veterinaire consumptie.
                    </span>
                  </label>

                  <TrustBlock />

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !researchConfirmed}
                    className="gradient-brand border-0 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:-translate-y-px hover:shadow-md disabled:opacity-60"
                  >
                    {isProcessing && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    Bestelling plaatsen
                  </Button>
                </div>
              )}
            </StepSection>
              </div>
            </>
          )}
        </div>

        {/* Right column — Order Summary */}
        <div className="mt-10 lg:col-span-5 lg:mt-0">
          <div className="lg:sticky lg:top-8">
            <OrderSummary
              cart={cart}
              shippingSelected={completedSteps.has(3)}
              onCartUpdated={updateCartState}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
