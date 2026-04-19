import { NextResponse } from "next/server"
import { isValidHouseNumber, isValidPostcode, normalizePostcode } from "@/lib/postcode"

const PDOK_BASE = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free"

const cache = new Map<string, { at: number; payload: unknown }>()
const CACHE_TTL_MS = 60 * 60 * 1000

export const runtime = "nodejs"

type PdokDoc = {
  straatnaam?: string
  woonplaatsnaam?: string
  postcode?: string
  huisnummer?: number | string
  huis_nlt?: string
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const country = url.searchParams.get("country") ?? ""
  const postcode = url.searchParams.get("postcode") ?? ""
  const number = url.searchParams.get("number") ?? ""

  if (country !== "nl") {
    return NextResponse.json({ error: "unsupported_country" }, { status: 400 })
  }
  if (postcode.length > 7) {
    return NextResponse.json({ error: "invalid_postcode" }, { status: 400 })
  }
  if (!isValidPostcode(postcode, "nl")) {
    return NextResponse.json({ error: "invalid_postcode" }, { status: 400 })
  }
  if (number.length > 6) {
    return NextResponse.json({ error: "invalid_number" }, { status: 400 })
  }
  if (!isValidHouseNumber(number)) {
    return NextResponse.json({ error: "invalid_number" }, { status: 400 })
  }

  const normalizedPostcode = normalizePostcode(postcode, "nl").replace(" ", "")
  const cacheKey = `nl:${normalizedPostcode}:${number}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json(cached.payload)
  }

  const query = `${normalizedPostcode} ${number}`
  const upstreamUrl = `${PDOK_BASE}?q=${encodeURIComponent(query)}&fq=type:adres&rows=1`

  try {
    const res = await fetch(upstreamUrl, {
      headers: { Accept: "application/json" },
    })
    if (res.status === 429) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 })
    }
    if (!res.ok) {
      console.error("[postcode-lookup] upstream non-ok", res.status)
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    const data = (await res.json()) as { response?: { docs?: PdokDoc[] } }
    const doc = data.response?.docs?.[0]
    if (!doc || !doc.straatnaam || !doc.woonplaatsnaam || !doc.postcode) {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }
    const payload = {
      street: doc.straatnaam,
      city: doc.woonplaatsnaam,
      postcode: doc.postcode,
    }
    const now = Date.now()
    for (const [k, v] of cache) {
      if (now - v.at >= CACHE_TTL_MS) cache.delete(k)
    }
    cache.set(cacheKey, { at: now, payload })
    return NextResponse.json(payload)
  } catch (err) {
    console.error("[postcode-lookup] upstream fetch failed", err)
    return NextResponse.json({ error: "network" }, { status: 502 })
  }
}
