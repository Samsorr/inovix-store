import { NextResponse } from "next/server"
import { isValidPostcode, isValidHouseNumber, type SupportedCountry } from "@/lib/postcode"

const POSTCODE_TECH_BASE = "https://api.postcode.tech/v1/postcode"
const POSTCODE_TECH_KEY = process.env.POSTCODE_TECH_KEY ?? ""

const cache = new Map<string, { at: number; payload: unknown }>()
const CACHE_TTL_MS = 60 * 60 * 1000

export const runtime = "nodejs"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const country = url.searchParams.get("country") ?? ""
  const postcode = url.searchParams.get("postcode") ?? ""
  const number = url.searchParams.get("number") ?? ""

  if (country !== "nl" && country !== "be") {
    return NextResponse.json({ error: "unsupported_country" }, { status: 400 })
  }
  if (postcode.length > 7) {
    return NextResponse.json({ error: "invalid_postcode" }, { status: 400 })
  }
  if (!isValidPostcode(postcode, country as SupportedCountry)) {
    return NextResponse.json({ error: "invalid_postcode" }, { status: 400 })
  }
  if (number.length > 6) {
    return NextResponse.json({ error: "invalid_number" }, { status: 400 })
  }
  if (!isValidHouseNumber(number)) {
    return NextResponse.json({ error: "invalid_number" }, { status: 400 })
  }

  const cacheKey = `${country}:${postcode}:${number}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json(cached.payload)
  }

  const upstreamUrl = `${POSTCODE_TECH_BASE}?postcode=${encodeURIComponent(postcode)}&number=${encodeURIComponent(number)}`

  try {
    const res = await fetch(upstreamUrl, {
      headers: POSTCODE_TECH_KEY ? { Authorization: `Bearer ${POSTCODE_TECH_KEY}` } : {},
    })
    if (res.status === 404) {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }
    if (res.status === 429) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 })
    }
    if (!res.ok) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    const data = (await res.json()) as { street?: string; city?: string; postcode?: string }
    if (!data.street || !data.city || !data.postcode) {
      return NextResponse.json({ error: "malformed_upstream" }, { status: 502 })
    }
    const payload = { street: data.street, city: data.city, postcode: data.postcode }
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
