"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  isValidHouseNumber,
  isValidPostcode,
  lookupPostcode,
  normalizePostcode,
  type SupportedCountry,
} from "@/lib/postcode"

export interface PostcodeLookupResolved {
  address1: string
  city: string
  postcode: string
}

export interface PostcodeLookupProps {
  country: SupportedCountry
  onResolved: (value: PostcodeLookupResolved) => void
  className?: string
}

export function PostcodeLookup({ country, onResolved, className }: PostcodeLookupProps) {
  const [postcode, setPostcode] = useState("")
  const [houseNumber, setHouseNumber] = useState("")
  const [addition, setAddition] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  const onResolvedRef = useRef(onResolved)
  useEffect(() => {
    onResolvedRef.current = onResolved
  })

  useEffect(() => {
    if (!isValidPostcode(postcode, country)) return
    if (!isValidHouseNumber(houseNumber)) return

    setError(null)
    const t = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      const result = await lookupPostcode({
        country,
        postcode,
        houseNumber,
        addition: addition || undefined,
        signal: controller.signal,
      })
      setLoading(false)
      if (result.ok) {
        const trimmedAddition = addition.trim()
        const address1 = trimmedAddition
          ? `${result.street} ${houseNumber}${trimmedAddition}`
          : `${result.street} ${houseNumber}`
        // onResolved is read from a ref to avoid re-firing the lookup on every parent render
        onResolvedRef.current({ address1, city: result.city, postcode: result.postcode })
      } else if (result.error === "not_found") {
        setError("Adres niet gevonden, vul handmatig in.")
      } else if (result.error === "rate_limited") {
        setError("Te veel verzoeken, probeer het zo opnieuw of vul handmatig in.")
      } else if (result.error === "network") {
        setError("Netwerkfout, vul handmatig in.")
      }
    }, 400)
    return () => {
      clearTimeout(t)
      abortRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postcode, houseNumber, addition, country])

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Input
          label="Postcode"
          placeholder={country === "nl" ? "1234AB" : "1000"}
          value={postcode}
          onChange={(e) => setPostcode(country === "nl" ? normalizePostcode(e.target.value, "nl") : e.target.value)}
          name="lookup-postcode"
          autoComplete="off"
        />
        <Input
          label="Huisnummer"
          placeholder="1"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          name="lookup-housenumber"
          autoComplete="off"
        />
        <Input
          label="Toevoeging"
          placeholder="A"
          value={addition}
          onChange={(e) => setAddition(e.target.value)}
          name="lookup-addition"
          autoComplete="off"
        />
      </div>
      <div className="mt-2 flex h-5 items-center gap-2 text-xs text-muted-foreground">
        {loading && (
          <>
            <Loader2 className="size-3 animate-spin" />
            <span>Adres ophalen...</span>
          </>
        )}
        {!loading && error && <span className="text-red-700">{error}</span>}
      </div>
    </div>
  )
}
