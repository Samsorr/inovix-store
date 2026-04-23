import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"

const { mockAddItem } = vi.hoisted(() => ({
  mockAddItem: vi.fn(),
}))

vi.mock("@/lib/context/cart-context", () => ({
  useCart: vi.fn().mockReturnValue({
    cart: null,
    isLoading: false,
    isUpdating: false,
    error: null,
    isCartOpen: false,
    addItem: mockAddItem,
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    openCart: vi.fn(),
    closeCart: vi.fn(),
    updateCartState: vi.fn(),
    resetCart: vi.fn(),
    cartCount: 0,
    cartTotal: 0,
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

// Mock IntersectionObserver for StickyCartBar
beforeEach(() => {
  mockAddItem.mockClear()

  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
  window.IntersectionObserver = mockIntersectionObserver
})

import { ProductActions } from "@/components/product/ProductActions"

const singleVariant = [
  {
    id: "var_5mg",
    title: "5mg",
    sku: "BPC-5MG",
    calculated_price: { calculated_amount: 4999 },
  },
]

const multipleVariants = [
  {
    id: "var_5mg",
    title: "5mg",
    sku: "BPC-5MG",
    calculated_price: { calculated_amount: 4999 },
  },
  {
    id: "var_10mg",
    title: "10mg",
    sku: "BPC-10MG",
    calculated_price: { calculated_amount: 8999 },
  },
]

describe("ProductActions", () => {
  it("renders price from variant", () => {
    render(
      <ProductActions
        variants={singleVariant}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    // 4999 cents = 49,99 EUR (nl-NL format)
    // Price appears in both the main display and the StickyCartBar
    const priceElements = screen.getAllByText(/49,99/)
    expect(priceElements.length).toBeGreaterThanOrEqual(1)
  })

  it("shows variant selector with multiple variants", () => {
    render(
      <ProductActions
        variants={multipleVariants}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    expect(screen.getByRole("button", { name: "5mg" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "10mg" })).toBeInTheDocument()
    expect(screen.getByText("Hoeveelheid")).toBeInTheDocument()
  })

  it("hides variant selector with single variant", () => {
    render(
      <ProductActions
        variants={singleVariant}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    expect(screen.queryByText("Hoeveelheid")).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "5mg" })
    ).not.toBeInTheDocument()
  })

  it("quantity starts at 1 and increment/decrement work", async () => {
    const user = userEvent.setup()
    render(
      <ProductActions
        variants={singleVariant}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    // Quantity starts at 1
    expect(screen.getByText("1")).toBeInTheDocument()

    // Increment
    await user.click(screen.getByLabelText("Verhoog aantal"))
    expect(screen.getByText("2")).toBeInTheDocument()

    // Decrement
    await user.click(screen.getByLabelText("Verminder aantal"))
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("quantity cannot go below 1", async () => {
    const user = userEvent.setup()
    render(
      <ProductActions
        variants={singleVariant}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    // Try to decrement below 1
    await user.click(screen.getByLabelText("Verminder aantal"))
    await user.click(screen.getByLabelText("Verminder aantal"))

    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("add to cart calls addItem with correct variant and quantity", async () => {
    const user = userEvent.setup()
    render(
      <ProductActions
        variants={singleVariant}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    // Increment quantity to 3
    await user.click(screen.getByLabelText("Verhoog aantal"))
    await user.click(screen.getByLabelText("Verhoog aantal"))

    await user.click(
      screen.getByRole("button", { name: /TOEVOEGEN AAN WINKELWAGEN/ })
    )

    expect(mockAddItem).toHaveBeenCalledWith("var_5mg", 3)
  })

  it("renders CoA link when coaUrl is provided", () => {
    render(
      <ProductActions
        variants={singleVariant}
        coaUrl="/docs/bpc-157-coa.pdf"
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    const coaLink = screen.getByText(
      "Download Certificaat van Analyse (CoA)"
    )
    expect(coaLink).toBeInTheDocument()
    expect(coaLink.closest("a")).toHaveAttribute(
      "href",
      "/docs/bpc-157-coa.pdf"
    )
    expect(coaLink.closest("a")).toHaveAttribute("target", "_blank")
  })

  it("hides CoA link when no coaUrl is provided", () => {
    render(
      <ProductActions
        variants={singleVariant}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    expect(
      screen.queryByText("Download Certificaat van Analyse (CoA)")
    ).not.toBeInTheDocument()
  })

  it("shows research warning text", () => {
    render(
      <ProductActions
        variants={singleVariant}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    expect(
      screen.getByText(
        /Door dit product te bestellen bevestigt u dat u een gekwalificeerde onderzoeker bent/
      )
    ).toBeInTheDocument()
  })

  it("shows 'SELECTEER EEN VARIANT' when no variant is selected with multiple variants", () => {
    render(
      <ProductActions
        variants={multipleVariants}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    expect(
      screen.getByRole("button", { name: /SELECTEER EEN VARIANT/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /SELECTEER EEN VARIANT/ })
    ).toBeDisabled()
  })

  it("updates price when a different variant is selected", async () => {
    const user = userEvent.setup()
    render(
      <ProductActions
        variants={multipleVariants}
        productId="prod_test"
        productTitle="BPC-157"
        thumbnail={null}
      />
    )

    // Initially shows "Prijs op aanvraag" because no variant is selected
    expect(screen.getByText("Prijs op aanvraag")).toBeInTheDocument()

    // Select first variant
    await user.click(screen.getByRole("button", { name: "5mg" }))
    // Price appears in both main display and StickyCartBar
    expect(screen.getAllByText(/49,99/).length).toBeGreaterThanOrEqual(1)

    // Select second variant
    await user.click(screen.getByRole("button", { name: "10mg" }))
    expect(screen.getAllByText(/89,99/).length).toBeGreaterThanOrEqual(1)
  })
})
