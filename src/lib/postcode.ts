export type SupportedCountry = "nl"

const NL_POSTCODE = /^(\d{4})\s?([A-Za-z]{2})$/

export function isValidPostcode(postcode: string, country: string): boolean {
  const trimmed = postcode.trim()
  if (country === "nl") return NL_POSTCODE.test(trimmed)
  return false
}

export function normalizePostcode(postcode: string, country: string): string {
  const trimmed = postcode.trim()
  if (country === "nl") {
    const match = trimmed.match(NL_POSTCODE)
    if (!match) return trimmed
    return `${match[1]} ${match[2].toUpperCase()}`
  }
  return trimmed
}

export function isValidHouseNumber(value: string): boolean {
  return /^\d+$/.test(value.trim())
}

export type PostcodeLookupResult =
  | { ok: true; street: string; city: string; postcode: string }
  | { ok: false; error: "invalid" | "not_found" | "rate_limited" | "network" }

export async function lookupPostcode(params: {
  country: SupportedCountry
  postcode: string
  houseNumber: string
  addition?: string
  signal?: AbortSignal
}): Promise<PostcodeLookupResult> {
  if (!isValidPostcode(params.postcode, params.country)) {
    return { ok: false, error: "invalid" }
  }
  if (!isValidHouseNumber(params.houseNumber)) {
    return { ok: false, error: "invalid" }
  }

  const search = new URLSearchParams({
    country: params.country,
    postcode: normalizePostcode(params.postcode, params.country).replace(" ", ""),
    number: params.houseNumber.trim(),
  })
  if (params.addition) search.set("addition", params.addition.trim())

  try {
    const res = await fetch(`/api/postcode-lookup?${search.toString()}`, { signal: params.signal })
    if (res.status === 404) return { ok: false, error: "not_found" }
    if (res.status === 429) return { ok: false, error: "rate_limited" }
    if (!res.ok) return { ok: false, error: "network" }
    const data = (await res.json()) as { street: string; city: string; postcode: string }
    return { ok: true, ...data }
  } catch (err) {
    console.error("[postcode] client fetch failed", err)
    return { ok: false, error: "network" }
  }
}
