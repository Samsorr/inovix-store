import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"

import BevestigingPage from "../page"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/checkout/bevestiging",
  useSearchParams: () => new URLSearchParams(),
}))

// formatPrice needs to work for assertions
vi.mock("@/lib/price", () => ({
  formatPrice: (amount: number, currency = "EUR") =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency }).format(
      amount / 100
    ),
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function mockOrderData(overrides: Record<string, unknown> = {}) {
  return {
    id: "order_test123",
    displayId: 1001,
    items: [
      {
        title: "BPC-157",
        variantTitle: "5mg",
        quantity: 1,
        unitPrice: 4999,
      },
      {
        title: "TB-500",
        variantTitle: "10mg",
        quantity: 2,
        unitPrice: 3499,
      },
    ],
    shippingAddress: {
      first_name: "Jan",
      last_name: "de Vries",
      address_1: "Keizersgracht 123",
      postal_code: "1015 CJ",
      city: "Amsterdam",
      country_code: "nl",
    },
    email: "test@example.com",
    total: 11997,
    subtotal: 11997,
    shippingTotal: 0,
    taxTotal: 0,
    currency: "EUR",
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(sessionStorage.getItem).mockReturnValue(
    JSON.stringify(mockOrderData())
  )
  vi.mocked(sessionStorage.removeItem).mockImplementation(() => {})
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("BevestigingPage", () => {
  it("redirects to / when no order in sessionStorage", async () => {
    vi.mocked(sessionStorage.getItem).mockReturnValue(null)

    render(<BevestigingPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/")
    })
  })

  it("renders order details when order exists in sessionStorage", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(screen.getByText("Bestelling geplaatst")).toBeInTheDocument()
      expect(
        screen.getByText("Bedankt voor uw bestelling.")
      ).toBeInTheDocument()
    })
  })

  it("removes order from sessionStorage after reading", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(
        "inovix_last_order"
      )
    })
  })

  it("shows order number using displayId", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(screen.getByText(/Bestelling #1001/)).toBeInTheDocument()
    })
  })

  it("shows order number using id fallback when displayId is absent", async () => {
    vi.mocked(sessionStorage.getItem).mockReturnValue(
      JSON.stringify(mockOrderData({ displayId: undefined }))
    )

    render(<BevestigingPage />)

    await waitFor(() => {
      // id is "order_test123", first 8 chars uppercased = "ORDER_TE"
      expect(screen.getByText(/ORDER_TE/)).toBeInTheDocument()
    })
  })

  it("shows items with quantities and prices", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(screen.getByText("BPC-157")).toBeInTheDocument()
      expect(screen.getByText("TB-500")).toBeInTheDocument()
      expect(screen.getByText("5mg")).toBeInTheDocument()
      expect(screen.getByText("10mg")).toBeInTheDocument()
    })
  })

  it("shows totals (subtotal, shipping, total)", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(screen.getByText("Subtotaal")).toBeInTheDocument()
      expect(screen.getByText("Verzending")).toBeInTheDocument()
      expect(screen.getByText("Totaal")).toBeInTheDocument()
    })
  })

  it("shows free shipping when shippingTotal is 0", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(screen.getByText("Gratis")).toBeInTheDocument()
    })
  })

  it("shows BTW when taxTotal > 0", async () => {
    vi.mocked(sessionStorage.getItem).mockReturnValue(
      JSON.stringify(mockOrderData({ taxTotal: 1050 }))
    )

    render(<BevestigingPage />)

    await waitFor(() => {
      expect(screen.getByText("BTW")).toBeInTheDocument()
    })
  })

  it("shows shipping address", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(screen.getByText("Verzendadres")).toBeInTheDocument()
      expect(screen.getByText(/Jan de Vries/)).toBeInTheDocument()
      expect(screen.getByText("Keizersgracht 123")).toBeInTheDocument()
      expect(screen.getByText(/1015 CJ/)).toBeInTheDocument()
      expect(screen.getByText(/Amsterdam/)).toBeInTheDocument()
    })
  })

  it("shows research disclaimer text", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(
        screen.getByText(
          /uitsluitend bestemd voor laboratoriumonderzoek/
        )
      ).toBeInTheDocument()
    })
  })

  it("shows 'Terug naar homepage' button", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /terug naar homepage/i })
      ).toBeInTheDocument()
    })
  })

  it("navigates to / when clicking 'Terug naar homepage'", async () => {
    const user = userEvent.setup()
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /terug naar homepage/i })
      ).toBeInTheDocument()
    })

    await user.click(
      screen.getByRole("button", { name: /terug naar homepage/i })
    )

    expect(mockPush).toHaveBeenCalledWith("/")
  })

  it("handles malformed JSON by redirecting to /", async () => {
    vi.mocked(sessionStorage.getItem).mockReturnValue("not valid json{{{")

    render(<BevestigingPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/")
    })
  })

  it("shows confirmation email address", async () => {
    render(<BevestigingPage />)

    await waitFor(() => {
      expect(screen.getByText("test@example.com")).toBeInTheDocument()
    })
  })
})
