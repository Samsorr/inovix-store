import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"

const { mockAddItem, mockRouterPush } = vi.hoisted(() => ({
  mockAddItem: vi.fn(),
  mockRouterPush: vi.fn(),
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

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Badge to render as a simple span
vi.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode
    variant?: string
    size?: string
  }) => <span data-variant={variant}>{children}</span>,
  badgeVariants: vi.fn(),
}))

// Mock Button to render as a plain button
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string
    size?: string
    fullWidth?: boolean
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={(rest as Record<string, unknown>)["aria-label"] as string}
    >
      {children}
    </button>
  ),
}))

import { CatalogCard } from "@/components/product/CatalogCard"

const defaultProps = {
  name: "BPC-157",
  description: "Research peptide for laboratory use",
  price: 49.99,
  currency: "€",
  dosage: "5mg",
  purity: 98,
  category: "Peptides",
  status: "in-stock" as const,
  image: "/images/bpc-157.png",
  productId: "prod_test123",
  variants: [{ id: "var_5mg" }],
}

describe("CatalogCard", () => {
  beforeEach(() => {
    mockAddItem.mockClear()
    mockRouterPush.mockClear()
  })

  it("renders product name and price", () => {
    render(<CatalogCard {...defaultProps} />)

    expect(screen.getByText("BPC-157")).toBeInTheDocument()
    // Price formatted nl-NL: 49,99
    expect(screen.getByText(/49,99/)).toBeInTheDocument()
  })

  it("shows correct status indicator for in-stock", () => {
    render(<CatalogCard {...defaultProps} status="in-stock" />)

    expect(screen.getByText("Op voorraad")).toBeInTheDocument()
  })

  it("shows correct status indicator for out-of-stock", () => {
    render(<CatalogCard {...defaultProps} status="out-of-stock" />)

    // "Uitverkocht" appears in both the status dot label and the button text.
    const matches = screen.getAllByText("Uitverkocht")
    expect(matches.length).toBe(2)

    // The status indicator has a specific class for the label
    const statusLabel = matches.find((el) =>
      el.classList.contains("tracking-wider")
    )
    expect(statusLabel).toBeDefined()
  })

  it("shows correct status indicator for low-stock", () => {
    render(<CatalogCard {...defaultProps} status="low-stock" />)

    expect(screen.getByText("Beperkt")).toBeInTheDocument()
  })

  it("shows category text", () => {
    render(<CatalogCard {...defaultProps} category="Peptides" />)

    expect(screen.getByText("Peptides")).toBeInTheDocument()
  })

  it("shows purity spec", () => {
    render(<CatalogCard {...defaultProps} purity={98} />)

    // CatalogCard shows purity as ">=98%"
    expect(screen.getByText(/98%/)).toBeInTheDocument()
  })

  it("shows dosage spec", () => {
    render(<CatalogCard {...defaultProps} dosage="5mg" />)

    expect(screen.getByText("5mg")).toBeInTheDocument()
  })

  it("add to cart button calls addItem for single variant products", async () => {
    const user = userEvent.setup()

    render(
      <CatalogCard
        {...defaultProps}
        variants={[{ id: "var_single" }]}
      />
    )

    const addButton = screen.getByLabelText("BPC-157 toevoegen aan winkelwagen")
    await user.click(addButton)

    expect(mockAddItem).toHaveBeenCalledWith("var_single", 1)
  })

  it("navigates to product page for multiple variant products", async () => {
    const user = userEvent.setup()

    render(
      <CatalogCard
        {...defaultProps}
        variants={[{ id: "var_5mg" }, { id: "var_10mg" }]}
      />
    )

    const button = screen.getByLabelText("BPC-157 toevoegen aan winkelwagen")
    await user.click(button)

    expect(mockRouterPush).toHaveBeenCalledWith("/products/prod_test123")
    expect(mockAddItem).not.toHaveBeenCalled()
  })

  it("disables button when out of stock", () => {
    render(<CatalogCard {...defaultProps} status="out-of-stock" />)

    const button = screen.getByLabelText("BPC-157 toevoegen aan winkelwagen")
    expect(button).toBeDisabled()
  })

  it("renders product image", () => {
    render(<CatalogCard {...defaultProps} />)

    const img = screen.getByAltText("BPC-157")
    expect(img).toHaveAttribute("src", "/images/bpc-157.png")
  })

  it("wraps content in a link when href is provided", () => {
    render(<CatalogCard {...defaultProps} href="/products/bpc-157" />)

    const link = screen.getByText("BPC-157").closest("a")
    expect(link).toHaveAttribute("href", "/products/bpc-157")
  })
})
