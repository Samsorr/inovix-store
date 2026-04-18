import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import CheckoutPage from "../page"

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
  usePathname: () => "/checkout",
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock("@/lib/context/cart-context", () => ({
  useCart: vi.fn(),
  CartProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("@/lib/context/auth-context", () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("@/lib/medusa", async () => ({
  default: (await import("@/__tests__/helpers/mock-medusa")).default,
}))

vi.mock("@/lib/price", () => ({
  formatPrice: (amount: number, currency = "EUR") =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency }).format(
      amount
    ),
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function cartWithItems() {
  return {
    id: "cart_test123",
    region_id: "reg_eu",
    email: "",
    items: [
      {
        id: "li_1",
        title: "BPC-157",
        quantity: 1,
        unit_price: 4999,
        thumbnail: "/images/product-peptide.png",
        variant: { id: "var_1", title: "5mg" },
      },
    ],
    total: 4999,
    subtotal: 4999,
    tax_total: 0,
    shipping_total: 0,
    shipping_address: null,
  }
}

function emptyCart() {
  return {
    id: "cart_test123",
    region_id: "reg_eu",
    email: "",
    items: [],
    total: 0,
    subtotal: 0,
    tax_total: 0,
    shipping_total: 0,
    shipping_address: null,
  }
}

// ---------------------------------------------------------------------------
// Default mock returns
// ---------------------------------------------------------------------------

function defaultCartContext(overrides: Record<string, unknown> = {}) {
  return {
    cart: cartWithItems(),
    isLoading: false,
    isUpdating: false,
    error: null,
    isCartOpen: false,
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    openCart: vi.fn(),
    closeCart: vi.fn(),
    updateCartState: vi.fn(),
    resetCart: vi.fn(),
    cartCount: 1,
    cartTotal: 4999,
    ...overrides,
  }
}

function defaultAuthContext(overrides: Record<string, unknown> = {}) {
  return {
    customer: null,
    isLoading: false,
    isAuthenticated: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    refreshCustomer: vi.fn(),
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(useCart).mockReturnValue(
    defaultCartContext() as unknown as ReturnType<typeof useCart>
  )
  vi.mocked(useAuth).mockReturnValue(
    defaultAuthContext() as ReturnType<typeof useAuth>
  )
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CheckoutPage", () => {
  it("shows loading state when cart isLoading", () => {
    vi.mocked(useCart).mockReturnValue(
      defaultCartContext({ isLoading: true, cart: null }) as unknown as ReturnType<typeof useCart>
    )

    render(<CheckoutPage />)

    // The form should not be rendered; a spinner should show
    expect(screen.queryByText("Checkout")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("E-mailadres")).not.toBeInTheDocument()
  })

  it("shows empty cart message when cart has no items", () => {
    vi.mocked(useCart).mockReturnValue(
      defaultCartContext({ cart: emptyCart(), cartCount: 0 }) as unknown as ReturnType<typeof useCart>
    )

    render(<CheckoutPage />)

    expect(
      screen.getByText("Uw winkelwagen is leeg.")
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /bekijk producten/i })
    ).toBeInTheDocument()
  })

  it("redirects to /products when clicking button on empty cart", async () => {
    vi.mocked(useCart).mockReturnValue(
      defaultCartContext({ cart: emptyCart(), cartCount: 0 }) as unknown as ReturnType<typeof useCart>
    )
    const user = userEvent.setup()

    render(<CheckoutPage />)

    await user.click(
      screen.getByRole("button", { name: /bekijk producten/i })
    )

    expect(mockPush).toHaveBeenCalledWith("/products")
  })

  it("shows email step as first active step", () => {
    render(<CheckoutPage />)

    expect(screen.getByText("Checkout")).toBeInTheDocument()
    // Step 1 title "E-mailadres" is visible as the active step heading
    expect(screen.getByText("E-mailadres")).toBeInTheDocument()
    // The email input should be present
    expect(screen.getByPlaceholderText("uw@email.nl")).toBeInTheDocument()
  })

  it("validates empty email", async () => {
    const user = userEvent.setup()
    render(<CheckoutPage />)

    // Submit with empty email
    const submitButtons = screen.getAllByRole("button", { name: /doorgaan/i })
    await user.click(submitButtons[0])

    await waitFor(() => {
      expect(
        screen.getByText("E-mailadres is verplicht")
      ).toBeInTheDocument()
    })
  })

  it("validates invalid email format", async () => {
    const user = userEvent.setup()
    render(<CheckoutPage />)

    await user.type(screen.getByPlaceholderText("uw@email.nl"), "not-an-email")
    const submitButtons = screen.getAllByRole("button", { name: /doorgaan/i })
    await user.click(submitButtons[0])

    await waitFor(() => {
      expect(
        screen.getByText("Voer een geldig e-mailadres in")
      ).toBeInTheDocument()
    })
  })

  it("pre-fills email from customer account", () => {
    vi.mocked(useAuth).mockReturnValue(
      defaultAuthContext({
        customer: { id: "cus_1", email: "customer@example.com" },
        isAuthenticated: true,
      }) as ReturnType<typeof useAuth>
    )

    render(<CheckoutPage />)

    const emailInput = screen.getByPlaceholderText("uw@email.nl")
    expect(emailInput).toHaveValue("customer@example.com")
  })

  it("shows address step after email completion", async () => {
    const mockUpdateCartState = vi.fn()
    const medusa = (await import("@/lib/medusa")).default
    vi.mocked(medusa.store.cart.update).mockResolvedValue({
      cart: { ...cartWithItems(), email: "test@example.com" },
    } as never)

    vi.mocked(useCart).mockReturnValue(
      defaultCartContext({
        updateCartState: mockUpdateCartState,
      }) as unknown as ReturnType<typeof useCart>
    )

    const user = userEvent.setup()
    render(<CheckoutPage />)

    await user.type(screen.getByPlaceholderText("uw@email.nl"), "test@example.com")
    const submitButtons = screen.getAllByRole("button", { name: /doorgaan/i })
    await user.click(submitButtons[0])

    await waitFor(() => {
      // Step 2 should now be active, showing address fields
      expect(screen.getByText("Verzendgegevens")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Jan")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("de Vries")).toBeInTheDocument()
    })
  })

  it("validates required address fields", async () => {
    const medusa = (await import("@/lib/medusa")).default
    vi.mocked(medusa.store.cart.update).mockResolvedValue({
      cart: { ...cartWithItems(), email: "test@example.com" },
    } as never)

    const user = userEvent.setup()
    render(<CheckoutPage />)

    // Complete step 1 first
    await user.type(screen.getByPlaceholderText("uw@email.nl"), "test@example.com")
    const step1Buttons = screen.getAllByRole("button", { name: /doorgaan/i })
    await user.click(step1Buttons[0])

    // Wait for step 2 to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Jan")).toBeInTheDocument()
    })

    // Submit address form without filling fields
    const step2Buttons = screen.getAllByRole("button", { name: /doorgaan/i })
    await user.click(step2Buttons[0])

    await waitFor(() => {
      expect(screen.getByText("Voornaam is verplicht")).toBeInTheDocument()
      expect(screen.getByText("Achternaam is verplicht")).toBeInTheDocument()
      expect(screen.getByText("Adres is verplicht")).toBeInTheDocument()
      expect(screen.getByText("Postcode is verplicht")).toBeInTheDocument()
      expect(screen.getByText("Stad is verplicht")).toBeInTheDocument()
    })
  })

  it("shows research confirmation checkbox requirement", async () => {
    const medusa = (await import("@/lib/medusa")).default

    // Step 1: email update
    vi.mocked(medusa.store.cart.update)
      .mockResolvedValueOnce({
        cart: { ...cartWithItems(), email: "test@example.com" },
      } as never)
      // Step 2: address update
      .mockResolvedValueOnce({
        cart: {
          ...cartWithItems(),
          email: "test@example.com",
          shipping_address: {
            first_name: "Jan",
            last_name: "de Vries",
            address_1: "Keizersgracht 123",
            postal_code: "1015 CJ",
            city: "Amsterdam",
            country_code: "nl",
          },
        },
      } as never)

    // Step 3: shipping
    vi.mocked(medusa.store.fulfillment.listCartOptions).mockResolvedValue({
      shipping_options: [
        { id: "so_1", name: "Standaard", amount: 0, price_type: "flat" },
      ],
    } as never)
    vi.mocked(medusa.store.cart.addShippingMethod).mockResolvedValue({
      cart: { ...cartWithItems(), shipping_total: 0 },
    } as never)

    // Step 4: payment
    vi.mocked(medusa.store.payment.listPaymentProviders).mockResolvedValue({
      payment_providers: [{ id: "pp_viva" }],
    } as never)
    vi.mocked(medusa.store.payment.initiatePaymentSession).mockResolvedValue(
      {} as never
    )
    vi.mocked(medusa.store.cart.retrieve).mockResolvedValue({
      cart: cartWithItems(),
    } as never)

    const user = userEvent.setup()
    render(<CheckoutPage />)

    // Step 1: email
    await user.type(screen.getByPlaceholderText("uw@email.nl"), "test@example.com")
    await user.click(screen.getAllByRole("button", { name: /doorgaan/i })[0])

    // Step 2: address
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Jan")).toBeInTheDocument()
    })
    await user.type(screen.getByPlaceholderText("Jan"), "Jan")
    await user.type(screen.getByPlaceholderText("de Vries"), "de Vries")
    await user.type(screen.getByPlaceholderText("Straatnaam 123"), "Keizersgracht 123")
    await user.type(screen.getByPlaceholderText("1234 AB"), "1015 CJ")
    await user.type(screen.getByPlaceholderText("Amsterdam"), "Amsterdam")
    await user.click(screen.getAllByRole("button", { name: /doorgaan/i })[0])

    // Steps 3 + 4 auto-complete (single shipping option, single payment provider)
    // Wait for step 4 content to appear
    await waitFor(() => {
      expect(
        screen.getByText(/uitsluitend worden gebruikt voor in-vitro laboratoriumonderzoek/)
      ).toBeInTheDocument()
    })

    // The "Bestelling plaatsen" button should be disabled when research not confirmed
    const placeOrderButton = screen.getByRole("button", {
      name: /bestelling plaatsen/i,
    })
    expect(placeOrderButton).toBeDisabled()
  })

  it("disables place order when research not confirmed", async () => {
    const medusa = (await import("@/lib/medusa")).default

    vi.mocked(medusa.store.cart.update)
      .mockResolvedValueOnce({
        cart: { ...cartWithItems(), email: "test@example.com" },
      } as never)
      .mockResolvedValueOnce({
        cart: {
          ...cartWithItems(),
          email: "test@example.com",
          shipping_address: {
            first_name: "Jan",
            last_name: "de Vries",
            address_1: "Keizersgracht 123",
            postal_code: "1015 CJ",
            city: "Amsterdam",
            country_code: "nl",
          },
        },
      } as never)

    vi.mocked(medusa.store.fulfillment.listCartOptions).mockResolvedValue({
      shipping_options: [
        { id: "so_1", name: "Standaard", amount: 0, price_type: "flat" },
      ],
    } as never)
    vi.mocked(medusa.store.cart.addShippingMethod).mockResolvedValue({
      cart: { ...cartWithItems(), shipping_total: 0 },
    } as never)

    vi.mocked(medusa.store.payment.listPaymentProviders).mockResolvedValue({
      payment_providers: [{ id: "pp_viva" }],
    } as never)
    vi.mocked(medusa.store.payment.initiatePaymentSession).mockResolvedValue(
      {} as never
    )
    vi.mocked(medusa.store.cart.retrieve).mockResolvedValue({
      cart: cartWithItems(),
    } as never)

    const user = userEvent.setup()
    render(<CheckoutPage />)

    // Navigate through steps 1-3
    await user.type(screen.getByPlaceholderText("uw@email.nl"), "test@example.com")
    await user.click(screen.getAllByRole("button", { name: /doorgaan/i })[0])

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Jan")).toBeInTheDocument()
    })
    await user.type(screen.getByPlaceholderText("Jan"), "Jan")
    await user.type(screen.getByPlaceholderText("de Vries"), "de Vries")
    await user.type(screen.getByPlaceholderText("Straatnaam 123"), "Keizersgracht 123")
    await user.type(screen.getByPlaceholderText("1234 AB"), "1015 CJ")
    await user.type(screen.getByPlaceholderText("Amsterdam"), "Amsterdam")
    await user.click(screen.getAllByRole("button", { name: /doorgaan/i })[0])

    // Wait for step 4
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /bestelling plaatsen/i })
      ).toBeInTheDocument()
    })

    // Button should be disabled (research not confirmed)
    expect(
      screen.getByRole("button", { name: /bestelling plaatsen/i })
    ).toBeDisabled()
  })

  it("shows cart with null as empty state", () => {
    vi.mocked(useCart).mockReturnValue(
      defaultCartContext({ cart: null, cartCount: 0 }) as unknown as ReturnType<typeof useCart>
    )

    render(<CheckoutPage />)

    expect(
      screen.getByText("Uw winkelwagen is leeg.")
    ).toBeInTheDocument()
  })

  it("closes cart sheet on mount", () => {
    const mockCloseCart = vi.fn()
    vi.mocked(useCart).mockReturnValue(
      defaultCartContext({ closeCart: mockCloseCart }) as unknown as ReturnType<typeof useCart>
    )

    render(<CheckoutPage />)

    expect(mockCloseCart).toHaveBeenCalled()
  })
})
