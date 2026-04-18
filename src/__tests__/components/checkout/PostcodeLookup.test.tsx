import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PostcodeLookup } from "@/components/checkout/PostcodeLookup"

beforeEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe("PostcodeLookup", () => {
  it("renders postcode + huisnummer + toevoeging inputs", () => {
    render(<PostcodeLookup country="nl" onResolved={() => {}} />)
    expect(screen.getByLabelText(/Postcode/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Huisnummer/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Toevoeging/)).toBeInTheDocument()
  })

  it("calls onResolved with address1 + city after successful lookup", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ street: "Damrak", city: "Amsterdam", postcode: "1012LG" }),
          { status: 200, headers: { "content-type": "application/json" } }
        )
      )
    )
    const onResolved = vi.fn()
    render(<PostcodeLookup country="nl" onResolved={onResolved} />)

    await userEvent.type(screen.getByLabelText(/Postcode/), "1012LG")
    await userEvent.type(screen.getByLabelText(/Huisnummer/), "1")

    await waitFor(
      () => expect(onResolved).toHaveBeenCalledWith({
        address1: "Damrak 1",
        city: "Amsterdam",
        postcode: "1012LG",
      }),
      { timeout: 2000 }
    )
  })

  it("emits new address1 when huisnummer changes after first resolve", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({ street: "Damrak", city: "Amsterdam", postcode: "1012LG" }),
            { status: 200, headers: { "content-type": "application/json" } }
          )
        )
      )
    )
    const onResolved = vi.fn()
    render(<PostcodeLookup country="nl" onResolved={onResolved} />)

    await userEvent.type(screen.getByLabelText(/Postcode/), "1012LG")
    await userEvent.type(screen.getByLabelText(/Huisnummer/), "5")
    await waitFor(() => expect(onResolved).toHaveBeenLastCalledWith(
      expect.objectContaining({ address1: "Damrak 5" })
    ), { timeout: 2000 })

    // Now change huisnummer | should re-resolve with new address1
    const huisnummer = screen.getByLabelText(/Huisnummer/) as HTMLInputElement
    await userEvent.clear(huisnummer)
    await userEvent.type(huisnummer, "7")
    await waitFor(() => expect(onResolved).toHaveBeenLastCalledWith(
      expect.objectContaining({ address1: "Damrak 7" })
    ), { timeout: 2000 })
  })

  it("shows error message when lookup returns 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })))
    render(<PostcodeLookup country="nl" onResolved={() => {}} />)

    await userEvent.type(screen.getByLabelText(/Postcode/), "9999XX")
    await userEvent.type(screen.getByLabelText(/Huisnummer/), "999")

    await waitFor(
      () => expect(screen.getByText(/Adres niet gevonden/)).toBeInTheDocument(),
      { timeout: 2000 }
    )
  })
})
