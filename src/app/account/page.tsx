"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Check,
  Loader2,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react"

import { useAuth } from "@/lib/context/auth-context"
import medusa from "@/lib/medusa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/price"

// ---------------------------------------------------------------------------
// Constants
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

const ORDER_STATUS: Record<string, string> = {
  pending: "In behandeling",
  completed: "Afgerond",
  archived: "Gearchiveerd",
  canceled: "Geannuleerd",
  requires_action: "Actie vereist",
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString))
}

function countryName(code: string) {
  return EU_COUNTRIES.find((c) => c.code === code)?.name ?? code.toUpperCase()
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: React.ElementType
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-border py-8 last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="size-4 text-teal-400" />
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-navy-500">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function AccountPage() {
  const router = useRouter()
  const { customer, isLoading, isAuthenticated, logout, updateProfile } =
    useAuth()

  // ── Orders ──
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  // ── Addresses ──
  const [addresses, setAddresses] = useState<any[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    company: "",
    postal_code: "",
    city: "",
    country_code: "nl",
    phone: "",
  })
  const [savingAddress, setSavingAddress] = useState(false)
  const [deletingAddress, setDeletingAddress] = useState<string | null>(null)

  // ── Profile editing ──
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)

  // ── Error ──
  const [error, setError] = useState("")

  // ── Auth guard ──
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/account/login")
    }
  }, [isLoading, isAuthenticated, router])

  // ── Fetch orders ──
  useEffect(() => {
    if (!customer) return
    medusa.store.order
      .list()
      .then(({ orders: o }) => setOrders(o ?? []))
      .catch(() => {})
      .finally(() => setLoadingOrders(false))
  }, [customer])

  // ── Fetch addresses ──
  const fetchAddresses = useCallback(() => {
    if (!customer) return
    medusa.store.customer
      .listAddress({ limit: 20, offset: 0 })
      .then(({ addresses: a }) => setAddresses(a ?? []))
      .catch(() => {})
      .finally(() => setLoadingAddresses(false))
  }, [customer])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  // ── Handlers ──

  function startEditProfile() {
    setEditFirstName(customer?.first_name ?? "")
    setEditLastName(customer?.last_name ?? "")
    setIsEditingProfile(true)
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    setError("")
    try {
      await updateProfile({
        first_name: editFirstName.trim(),
        last_name: editLastName.trim(),
      })
      setIsEditingProfile(false)
    } catch {
      setError("Kon gegevens niet opslaan. Probeer het opnieuw.")
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault()
    setSavingAddress(true)
    setError("")
    try {
      await medusa.store.customer.createAddress({
        first_name: newAddress.first_name.trim(),
        last_name: newAddress.last_name.trim(),
        address_1: newAddress.address_1.trim(),
        company: newAddress.company.trim() || undefined,
        postal_code: newAddress.postal_code.trim(),
        city: newAddress.city.trim(),
        country_code: newAddress.country_code,
        phone: newAddress.phone.trim() || undefined,
      })
      setNewAddress({
        first_name: "",
        last_name: "",
        address_1: "",
        company: "",
        postal_code: "",
        city: "",
        country_code: "nl",
        phone: "",
      })
      setShowAddAddress(false)
      fetchAddresses()
    } catch {
      setError("Kon adres niet opslaan. Probeer het opnieuw.")
    } finally {
      setSavingAddress(false)
    }
  }

  async function handleDeleteAddress(addressId: string) {
    setDeletingAddress(addressId)
    setError("")
    try {
      await medusa.store.customer.deleteAddress(addressId)
      setAddresses((prev) => prev.filter((a) => a.id !== addressId))
    } catch {
      setError("Kon adres niet verwijderen. Probeer het opnieuw.")
    } finally {
      setDeletingAddress(null)
    }
  }

  async function handleLogout() {
    try {
      await logout()
      router.push("/")
    } catch {
      // Force redirect even if logout API fails
      router.push("/")
    }
  }

  // ── Loading / auth guard ──

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-5 animate-spin border border-navy-500 border-t-transparent" />
      </div>
    )
  }

  // ── Render ──

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
            Mijn account
          </h1>
          <p className="mt-1 text-lg font-medium text-navy-500">
            Welkom, {customer?.first_name ?? "gebruiker"}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="size-3.5" />
          Uitloggen
        </Button>
      </div>

      {/* Global error */}
      {error && (
        <div className="mt-6 border-l-2 border-red-500 bg-white py-2 pl-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 border-t border-border">
        {/* ── Orders ── */}
        <Section icon={Package} title="Bestellingen">
          {loadingOrders ? (
            <div className="flex items-center gap-3">
              <div className="size-4 animate-spin border border-navy-500 border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                Bestellingen laden...
              </span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              <p>U heeft nog geen bestellingen geplaatst.</p>
              <Link
                href="/products"
                className="mt-2 inline-block font-medium text-teal-400 underline-offset-4 hover:underline"
              >
                Bekijk producten
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-border">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                      <span className="font-medium tabular-nums text-navy-500">
                        #{order.display_id}
                      </span>
                      <span className="text-muted-foreground">
                        {formatDate(order.created_at)}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium uppercase tracking-wider",
                          order.status === "completed"
                            ? "text-teal-400"
                            : order.status === "canceled"
                              ? "text-red-500"
                              : "text-navy-300"
                        )}
                      >
                        {ORDER_STATUS[order.status] ?? order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium tabular-nums text-navy-500">
                        {formatPrice(order.total ?? 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id
                          )
                        }
                        className="text-[12px] font-medium text-navy-500 underline underline-offset-4 decoration-border transition-colors hover:decoration-navy-500"
                      >
                        {expandedOrder === order.id
                          ? "Sluiten"
                          : "Bekijk details"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded order details */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-border bg-surface-secondary/40 px-4 py-3">
                      <div className="space-y-2">
                        {(order.items ?? []).map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {item.quantity}&times; {item.title}
                              {item.variant?.title
                                ? ` · ${item.variant.title}`
                                : ""}
                            </span>
                            <span className="tabular-nums text-navy-500">
                              {formatPrice(
                                (item.unit_price ?? 0) * item.quantity
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm">
                        <span className="font-medium text-navy-500">
                          Totaal
                        </span>
                        <span className="font-medium tabular-nums text-navy-500">
                          {formatPrice(order.total ?? 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ── Profile ── */}
        <Section
          icon={User}
          title="Persoonlijke gegevens"
          action={
            !isEditingProfile ? (
              <button
                type="button"
                onClick={startEditProfile}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-navy-500 underline underline-offset-4 decoration-border transition-colors hover:decoration-navy-500"
              >
                <Pencil className="size-3" />
                Wijzigen
              </button>
            ) : undefined
          }
        >
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Voornaam"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  autoFocus
                />
                <Input
                  label="Achternaam"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-navy-500">
                  E-mailadres
                </label>
                <p className="text-sm text-muted-foreground">
                  {customer?.email}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={savingProfile}
                >
                  {savingProfile && (
                    <Loader2 className="size-3.5 animate-spin" />
                  )}
                  Opslaan
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Annuleren
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="w-24 text-muted-foreground">Naam</span>
                <span className="text-navy-500">
                  {customer?.first_name} {customer?.last_name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 text-muted-foreground">E-mail</span>
                <span className="text-navy-500">{customer?.email}</span>
              </div>
            </div>
          )}
        </Section>

        {/* ── Addresses ── */}
        <Section
          icon={MapPin}
          title="Adressen"
          action={
            !showAddAddress ? (
              <button
                type="button"
                onClick={() => setShowAddAddress(true)}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-navy-500 underline underline-offset-4 decoration-border transition-colors hover:decoration-navy-500"
              >
                <Plus className="size-3" />
                Toevoegen
              </button>
            ) : undefined
          }
        >
          {loadingAddresses ? (
            <div className="flex items-center gap-3">
              <div className="size-4 animate-spin border border-navy-500 border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                Adressen laden...
              </span>
            </div>
          ) : (
            <>
              {addresses.length === 0 && !showAddAddress && (
                <p className="text-sm text-muted-foreground">
                  Nog geen opgeslagen adressen.
                </p>
              )}

              {/* Address list */}
              {addresses.length > 0 && (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="flex items-start justify-between border border-border px-4 py-3"
                    >
                      <div className="text-sm">
                        <p className="font-medium text-navy-500">
                          {addr.first_name} {addr.last_name}
                        </p>
                        {addr.company && (
                          <p className="text-muted-foreground">
                            {addr.company}
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          {addr.address_1}
                        </p>
                        <p className="text-muted-foreground">
                          {addr.postal_code} {addr.city},{" "}
                          {countryName(addr.country_code)}
                        </p>
                        {addr.phone && (
                          <p className="text-muted-foreground">{addr.phone}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        disabled={deletingAddress === addr.id}
                        className="p-1 text-muted-foreground transition-colors hover:text-red-500"
                        aria-label="Adres verwijderen"
                      >
                        {deletingAddress === addr.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add address form */}
              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className={cn(
                    "space-y-4 border border-border p-4",
                    addresses.length > 0 && "mt-4"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-navy-500">
                      Nieuw adres
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="p-1 text-muted-foreground hover:text-navy-500"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Voornaam"
                      placeholder="Jan"
                      value={newAddress.first_name}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          first_name: e.target.value,
                        }))
                      }
                      autoFocus
                    />
                    <Input
                      label="Achternaam"
                      placeholder="de Vries"
                      value={newAddress.last_name}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          last_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Input
                    label="Bedrijfsnaam (optioneel)"
                    placeholder="Uw laboratorium of bedrijf"
                    value={newAddress.company}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, company: e.target.value }))
                    }
                  />
                  <Input
                    label="Adres"
                    placeholder="Straatnaam 123"
                    value={newAddress.address_1}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        address_1: e.target.value,
                      }))
                    }
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Postcode"
                      placeholder="1234 AB"
                      value={newAddress.postal_code}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          postal_code: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Stad"
                      placeholder="Amsterdam"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, city: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-navy-500">
                      Land
                    </label>
                    <select
                      value={newAddress.country_code}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          country_code: e.target.value,
                        }))
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
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={savingAddress}
                    >
                      {savingAddress && (
                        <Loader2 className="size-3.5 animate-spin" />
                      )}
                      Adres opslaan
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddAddress(false)}
                    >
                      Annuleren
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </Section>
      </div>
    </div>
  )
}
