import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "@/app/api/postcode-lookup/route"

function makeRequest(query: Record<string, string>) {
  const url = new URL("http://localhost/api/postcode-lookup")
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v)
  return new Request(url)
}

function pdokResponse(doc: Record<string, unknown> | null) {
  const body = doc ? { response: { docs: [doc] } } : { response: { docs: [] } }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

describe("GET /api/postcode-lookup (PDOK)", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("returns 400 when country is not nl", async () => {
    const res = await GET(makeRequest({ country: "be", postcode: "1000", number: "1" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when postcode is invalid", async () => {
    const res = await GET(makeRequest({ country: "nl", postcode: "abcd", number: "1" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when number exceeds length cap", async () => {
    const res = await GET(makeRequest({ country: "nl", postcode: "1012LG", number: "1234567" }))
    expect(res.status).toBe(400)
  })

  it("proxies PDOK and returns normalized result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        pdokResponse({
          straatnaam: "Damrak",
          woonplaatsnaam: "Amsterdam",
          postcode: "1012LG",
          huisnummer: 1,
        })
      )
    )
    const res = await GET(makeRequest({ country: "nl", postcode: "1012LG", number: "1" }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ street: "Damrak", city: "Amsterdam", postcode: "1012LG" })
  })

  it("returns 404 when PDOK returns zero docs", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(pdokResponse(null)))
    const res = await GET(makeRequest({ country: "nl", postcode: "9999XX", number: "999" }))
    expect(res.status).toBe(404)
  })

  it("forwards 429 from upstream", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 429 })))
    const res = await GET(makeRequest({ country: "nl", postcode: "1011AB", number: "2" }))
    expect(res.status).toBe(429)
  })

  it("returns 502 when upstream throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ENOTFOUND")))
    const res = await GET(makeRequest({ country: "nl", postcode: "1015JB", number: "3" }))
    expect(res.status).toBe(502)
  })
})
