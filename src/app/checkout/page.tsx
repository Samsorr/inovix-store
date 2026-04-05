"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Loader2 } from "lucide-react"

import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import medusa from "@/lib/medusa"
import { formatPrice } from "@/lib/price"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"


// ---------------------------------------------------------------------------
// EU Countries
// ---------------------------------------------------------------------------

const EU_COUNTRIES = [
  { code: "nl", name: "Nederland" },
  { code: "be", name: "België" },
  { code: "de", name: "Duitsland" },
  { code: "fr", name: "Frankrijk" },
  { code: "at", name: "Oostenrijk" },
  { code: "it", name: "Italië" },
  { code: "es", name: "Spanje" },
  { code: "pt", name: "Portugal" },
  { code: "ie", name: "Ierland" },
  { code: "lu", name: "Luxemburg" },
  { code: "fi", name: "Finland" },
  { code: "se", name: "Zweden" },
  { code: "dk", name: "Denemarken" },
  { code: "pl", name: "Polen" },
  { code: "cz", name: "Tsjechië" },
  { code: "sk", name: "Slowakije" },
  { code: "hu", name: "Hongarije" },
  { code: "ro", name: "Roemenië" },
  { code: "bg", name: "Bulgarije" },
  { code: "hr", name: "Kroatië" },
  { code: "si", name: "Slovenië" },
  { code: "ee", name: "Estland" },
  { code: "lv", name: "Letland" },
  { code: "lt", name: "Litouwen" },
  { code: "mt", name: "Malta" },
  { code: "cy", name: "Cyprus" },
  { code: "gr", name: "Griekenland" },
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AddressForm {
  firstName: string
  lastName: string
  company: string
  address1: string
  postalCode: string
  city: string
  countryCode: string
  phone: string
}

const INITIAL_ADDRESS: AddressForm = {
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  postalCode: "",
  city: "",
  countryCode: "nl",
  phone: "",
}

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
      {isActive && <div className="mt-6">{children}</div>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Order Summary — typographic, no decoration
// ---------------------------------------------------------------------------

function OrderSummary({
  cart,
  shippingSelected,
}: {
  cart: NonNullable<ReturnType<typeof useCart>["cart"]>
  shippingSelected: boolean
}) {
  const items = cart.items ?? []

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

      {/* Totals */}
      <div className="mt-6 border-t border-border pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotaal</span>
            <span className="tabular-nums text-navy-500">
              {formatPrice(cart.subtotal ?? 0)}
            </span>
          </div>
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
          {(cart.tax_total ?? 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">BTW</span>
              <span className="tabular-nums text-navy-500">
                {formatPrice(cart.tax_total ?? 0)}
              </span>
            </div>
          )}
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

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, isLoading, closeCart, updateCartState, resetCart, cartCount } =
    useCart()
  const { customer } = useAuth()

  // Step management
  const [activeStep, setActiveStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Step 1: Email
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  // Step 2: Address
  const [address, setAddress] = useState<AddressForm>(INITIAL_ADDRESS)
  const [addressErrors, setAddressErrors] = useState<
    Partial<Record<keyof AddressForm, string>>
  >({})

  // Step 3: Shipping
  const [shippingOptions, setShippingOptions] = useState<
    Array<{ id: string; name: string; amount: number; price_type: string }>
  >([])
  const [selectedShipping, setSelectedShipping] = useState("")
  const [loadingShipping, setLoadingShipping] = useState(false)

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
  // Close cart sheet on mount
  useEffect(() => {
    closeCart()
  }, [closeCart])

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

  // Pre-fill email from customer account
  useEffect(() => {
    if (customer?.email) {
      setEmail(customer.email)
    }
  }, [customer?.email])

  // Pre-fill address from customer's saved address
  useEffect(() => {
    if (!customer || cart?.shipping_address?.first_name) return
    let cancelled = false
    medusa.store.customer
      .listAddress({ limit: 1, offset: 0 })
      .then(({ addresses }) => {
        if (cancelled) return
        const addr = addresses?.[0]
        if (addr && !address.firstName) {
          setAddress({
            firstName: addr.first_name ?? "",
            lastName: addr.last_name ?? "",
            company: addr.company ?? "",
            address1: addr.address_1 ?? "",
            postalCode: addr.postal_code ?? "",
            city: addr.city ?? "",
            countryCode: addr.country_code ?? "nl",
            phone: addr.phone ?? "",
          })
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer])

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

  function updateAddress<K extends keyof AddressForm>(
    field: K,
    value: AddressForm[K]
  ) {
    setAddress((prev) => ({ ...prev, [field]: value }))
    if (addressErrors[field]) {
      setAddressErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

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
    const errors: Partial<Record<keyof AddressForm, string>> = {}

    if (!address.firstName.trim()) errors.firstName = "Voornaam is verplicht"
    if (!address.lastName.trim()) errors.lastName = "Achternaam is verplicht"
    if (!address.address1.trim()) errors.address1 = "Adres is verplicht"
    if (!address.postalCode.trim()) errors.postalCode = "Postcode is verplicht"
    if (!address.city.trim()) errors.city = "Stad is verplicht"

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors)
      return
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
      const { cart: updated } = await medusa.store.cart.update(cart.id, {
        shipping_address: shippingAddr,
        billing_address: shippingAddr,
      })
      updateCartState(updated)
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options = (shipping_options ?? []).map((opt: any) => ({
        id: opt.id as string,
        name: (opt.name ?? "Standaard verzending") as string,
        amount: (opt.amount ?? 0) as number,
        price_type: (opt.price_type ?? "flat") as string,
      }))

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const providers = (payment_providers ?? []).map((p: any) => ({
        id: p.id as string,
      }))

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

    setIsProcessing(true)
    setGlobalError("")
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await medusa.store.cart.complete(cart.id)

      if (result.type === "order") {
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
            ),
            shippingAddress: order.shipping_address,
            email: order.email,
            total: order.total,
            subtotal: order.subtotal,
            shippingTotal: order.shipping_total,
            taxTotal: order.tax_total,
            currency: order.currency_code,
          })
        )

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
      <div className="lg:grid lg:grid-cols-12 lg:gap-16">
        {/* Left column — Form */}
        <div className="lg:col-span-7">
          <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
            Checkout
          </h1>

          {/* Progress bar */}
          <div className="mt-5 flex items-center gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-0.5 flex-1 transition-all duration-500",
                  completedSteps.has(step)
                    ? "bg-teal-400"
                    : activeStep === step
                      ? "bg-teal-400/40"
                      : "bg-border"
                )}
              />
            ))}
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Voornaam"
                      placeholder="Jan"
                      value={address.firstName}
                      onChange={(e) =>
                        updateAddress("firstName", e.target.value)
                      }
                      error={addressErrors.firstName}
                      autoFocus
                    />
                    <Input
                      label="Achternaam"
                      placeholder="de Vries"
                      value={address.lastName}
                      onChange={(e) =>
                        updateAddress("lastName", e.target.value)
                      }
                      error={addressErrors.lastName}
                    />
                  </div>

                  <Input
                    label="Bedrijfsnaam (optioneel)"
                    placeholder="Uw laboratorium of bedrijf"
                    value={address.company}
                    onChange={(e) => updateAddress("company", e.target.value)}
                  />

                  <Input
                    label="Adres"
                    placeholder="Straatnaam 123"
                    value={address.address1}
                    onChange={(e) => updateAddress("address1", e.target.value)}
                    error={addressErrors.address1}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Postcode"
                      placeholder="1234 AB"
                      value={address.postalCode}
                      onChange={(e) =>
                        updateAddress("postalCode", e.target.value)
                      }
                      error={addressErrors.postalCode}
                    />
                    <Input
                      label="Stad"
                      placeholder="Amsterdam"
                      value={address.city}
                      onChange={(e) => updateAddress("city", e.target.value)}
                      error={addressErrors.city}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="country"
                      className="text-sm font-medium text-navy-500"
                    >
                      Land
                    </label>
                    <select
                      id="country"
                      value={address.countryCode}
                      onChange={(e) =>
                        updateAddress("countryCode", e.target.value)
                      }
                      className="h-11 w-full border border-border bg-transparent px-3 py-2.5 text-base transition-colors outline-none focus:border-navy-500 focus:ring-1 focus:ring-navy-500/20 md:text-sm"
                    >
                      {EU_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    type="tel"
                    label="Telefoonnummer (optioneel)"
                    placeholder="+31 6 12345678"
                    value={address.phone}
                    onChange={(e) => updateAddress("phone", e.target.value)}
                  />
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
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between border px-4 py-3 transition-colors",
                        selectedShipping === option.id
                          ? "border-navy-500 bg-navy-500/[0.02]"
                          : "border-border hover:border-navy-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-4 items-center justify-center border",
                            selectedShipping === option.id
                              ? "border-navy-500"
                              : "border-border"
                          )}
                        >
                          {selectedShipping === option.id && (
                            <div className="size-2 bg-navy-500" />
                          )}
                        </div>
                        <span className="text-sm text-navy-500">
                          {option.name}
                        </span>
                      </div>
                      <span className="text-sm tabular-nums text-navy-500">
                        {option.amount
                          ? formatPrice(option.amount)
                          : "Gratis"}
                      </span>
                    </label>
                  ))}
                </div>
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
                        "flex cursor-pointer items-center border px-4 py-3 transition-colors",
                        selectedPayment === provider.id
                          ? "border-navy-500 bg-navy-500/[0.02]"
                          : "border-border hover:border-navy-200"
                      )}
                    >
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
                    </label>
                  ))}
                </div>
              )}

              {/* Research confirmation + Place Order */}
              {selectedPayment && (
                <div className="mt-8 space-y-5">
                  <label className="flex cursor-pointer items-center gap-3 border border-amber-300 bg-amber-50/50 px-4 py-3 transition-colors hover:border-amber-400">
                    <div
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center border transition-colors",
                        researchConfirmed
                          ? "border-amber-600 bg-amber-600"
                          : "border-amber-300"
                      )}
                    >
                      {researchConfirmed && (
                        <Check className="size-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm text-amber-900">
                      Ik bevestig dat alle producten uitsluitend worden
                      gebruikt voor in-vitro laboratoriumonderzoek en niet
                      voor menselijke of veterinaire consumptie.
                    </span>
                  </label>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !researchConfirmed}
                    className="text-sm font-semibold uppercase tracking-wider"
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
        </div>

        {/* Right column — Order Summary */}
        <div className="mt-10 lg:col-span-5 lg:mt-0">
          <div className="lg:sticky lg:top-8">
            <OrderSummary
              cart={cart}
              shippingSelected={completedSteps.has(3)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
