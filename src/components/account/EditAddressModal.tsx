"use client"

import { useState, useEffect } from "react"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddressForm, type AddressFormValue } from "@/components/checkout/AddressForm"
import medusa from "@/lib/medusa"
import type { SavedAddress } from "@/components/account/AddressCard"

export interface EditAddressModalProps {
  address: SavedAddress
  onClose: () => void
  onSaved: () => void
}

function fromSaved(addr: SavedAddress): AddressFormValue {
  return {
    firstName: addr.first_name ?? "",
    lastName: addr.last_name ?? "",
    company: addr.company ?? "",
    address1: addr.address_1 ?? "",
    postalCode: addr.postal_code ?? "",
    city: addr.city ?? "",
    countryCode: addr.country_code ?? "nl",
    phone: addr.phone ?? "",
  }
}

export function EditAddressModal({ address, onClose, onSaved }: EditAddressModalProps) {
  const [value, setValue] = useState<AddressFormValue>(() => fromSaved(address))
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormValue, string>>>({})
  const [saving, setSaving] = useState(false)
  const [globalError, setGlobalError] = useState("")

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    return () => {
      previouslyFocused?.focus()
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  async function handleSave() {
    const e: typeof errors = {}
    if (!value.firstName.trim()) e.firstName = "Voornaam is verplicht"
    if (!value.lastName.trim()) e.lastName = "Achternaam is verplicht"
    if (!value.address1.trim()) e.address1 = "Adres is verplicht"
    if (!value.postalCode.trim()) e.postalCode = "Postcode is verplicht"
    if (!value.city.trim()) e.city = "Stad is verplicht"
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }

    setSaving(true)
    setGlobalError("")
    try {
      await medusa.store.customer.updateAddress(address.id, {
        first_name: value.firstName.trim(),
        last_name: value.lastName.trim(),
        company: value.company.trim() || undefined,
        address_1: value.address1.trim(),
        postal_code: value.postalCode.trim(),
        city: value.city.trim(),
        country_code: value.countryCode,
        phone: value.phone.trim() || undefined,
      })
      onSaved()
    } catch {
      setGlobalError("Kon adres niet opslaan. Probeer het opnieuw.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-address-title"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="edit-address-title" className="text-[13px] font-semibold uppercase tracking-[0.08em] text-navy-500">
            Adres bewerken
          </h2>
          <button onClick={onClose} aria-label="Sluiten">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {globalError && (
          <div className="mt-4 border-l-2 border-red-500 bg-white py-2 pl-4 text-sm text-red-700">
            {globalError}
          </div>
        )}

        <div className="mt-5">
          <AddressForm
            value={value}
            errors={errors}
            onChange={(next) => {
              setValue(next)
              if (Object.keys(errors).length > 0) setErrors({})
            }}
            autocompleteSection="edit"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose} disabled={saving}>
            Annuleren
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Opslaan
          </Button>
        </div>
      </div>
    </div>
  )
}
