"use client"

import { Input } from "@/components/ui/input"
import { EU_COUNTRIES } from "@/lib/countries"
import { cn } from "@/lib/utils"
import { PostcodeLookup } from "@/components/checkout/PostcodeLookup"
import type { SupportedCountry } from "@/lib/postcode"

export interface AddressFormValue {
  firstName: string
  lastName: string
  company: string
  address1: string
  postalCode: string
  city: string
  countryCode: string
  phone: string
}

export const EMPTY_ADDRESS: AddressFormValue = {
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  postalCode: "",
  city: "",
  countryCode: "nl",
  phone: "",
}

export interface AddressFormProps {
  value: AddressFormValue
  errors?: Partial<Record<keyof AddressFormValue, string>>
  onChange: (next: AddressFormValue) => void
  /** Suffix appended to autocomplete tokens to differentiate forms (e.g., "shipping" vs "billing"). */
  autocompleteSection?: string
  /** Set true on the first field for shipping; false for billing. */
  autoFocusFirstField?: boolean
  className?: string
}

export function AddressForm({
  value,
  errors = {},
  onChange,
  autocompleteSection,
  autoFocusFirstField = false,
  className,
}: AddressFormProps) {
  const update = <K extends keyof AddressFormValue>(field: K, v: AddressFormValue[K]) => {
    onChange({ ...value, [field]: v })
  }

  const ac = (token: string) => (autocompleteSection ? `${autocompleteSection} ${token}` : token)

  const supportsLookup = value.countryCode === "nl" || value.countryCode === "be"

  return (
    <div className={cn("space-y-4", className)}>
      {supportsLookup && (
        <div className="border border-border bg-surface-secondary/40 p-4">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Snelle invoer
          </p>
          <PostcodeLookup
            country={value.countryCode as SupportedCountry}
            onResolved={({ address1, city, postcode }) => {
              onChange({
                ...value,
                address1,
                city,
                postalCode: postcode,
              })
            }}
          />
          <p className="mt-3 text-[11px] text-muted-foreground">
            Velden hieronder worden automatisch ingevuld. U kunt ze altijd aanpassen.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Voornaam"
          placeholder="Jan"
          value={value.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          error={errors.firstName}
          autoFocus={autoFocusFirstField}
          autoComplete={ac("given-name")}
          name="given-name"
        />
        <Input
          label="Achternaam"
          placeholder="de Vries"
          value={value.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          error={errors.lastName}
          autoComplete={ac("family-name")}
          name="family-name"
        />
      </div>

      <Input
        label="Bedrijfsnaam (optioneel)"
        placeholder="Uw laboratorium of bedrijf"
        value={value.company}
        onChange={(e) => update("company", e.target.value)}
        autoComplete={ac("organization")}
        name="organization"
      />

      <Input
        label="Adres"
        placeholder="Straatnaam 123"
        value={value.address1}
        onChange={(e) => update("address1", e.target.value)}
        error={errors.address1}
        autoComplete={ac("street-address")}
        name="street-address"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Input
            label="Postcode"
            placeholder="1234 AB"
            value={value.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            error={errors.postalCode}
            autoComplete={ac("postal-code")}
            inputMode="text"
            name="postal-code"
          />
          {value.countryCode === "nl" && value.postalCode && (
            <p className="mt-1 text-[11px] text-muted-foreground">Format: 1234 AB</p>
          )}
        </div>
        <Input
          label="Stad"
          placeholder="Amsterdam"
          value={value.city}
          onChange={(e) => update("city", e.target.value)}
          error={errors.city}
          autoComplete={ac("address-level2")}
          name="address-level2"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`country-${autocompleteSection ?? "default"}`} className="text-sm font-medium text-navy-500">
          Land
        </label>
        <select
          id={`country-${autocompleteSection ?? "default"}`}
          value={value.countryCode}
          onChange={(e) => update("countryCode", e.target.value)}
          autoComplete={ac("country")}
          name="country"
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
        placeholder={value.countryCode === "be" ? "+32 4 7012 3456" : "+31 6 12345678"}
        value={value.phone}
        onChange={(e) => update("phone", e.target.value)}
        autoComplete={ac("tel")}
        inputMode="tel"
        name="tel"
      />
    </div>
  )
}
