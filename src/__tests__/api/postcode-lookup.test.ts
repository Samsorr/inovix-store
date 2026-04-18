import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "@/app/api/postcode-lookup/route"

function makeRequest(query: Record<string, string>) {
  const url = new URL("http://localhost/api/postcode-lookup")
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v)
  return new Request(url)
}

describe("GET /api/postcode-lookup", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("returns 400 when country is unsupported", async () => {
    const res = await GET(makeRequest({ country: "de", postcode: "12345", number: "1" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when postcode is invalid", async () => {
    const res = await GET(makeRequest({ country: "nl", postcode: "abcd", number: "1" }))
    expect(res.status).toBe(400)
  })

  it("proxies postcode.tech and returns normalized result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ street: "Damrak", city: "Amsterdam", postcode: "1012LG" }),
          { status: 200, headers: { "content-type": "application/json" } }
        )
      )
    )
    const res = await GET(makeRequest({ country: "nl", postcode: "1012LG", number: "1" }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ street: "Damrak", city: "Amsterdam", postcode: "1012LG" })
  })

  it("forwards 404 from upstream", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })))
    const res = await GET(makeRequest({ country: "nl", postcode: "9999XX", number: "999" }))
    expect(res.status).toBe(404)
  })

  it("returns 400 when number exceeds length cap", async () => {
    const res = await GET(makeRequest({ country: "nl", postcode: "1012LG", number: "1234567" }))
    expect(res.status).toBe(400)
  })

  it("forwards 429 from upstream", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 429 })))
    const res = await GET(makeRequest({ country: "nl", postcode: "1011AB", number: "2" }))
    expect(res.status).toBe(429)
  })
})
