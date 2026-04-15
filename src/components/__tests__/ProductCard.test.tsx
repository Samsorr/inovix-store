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

// Mock Badge to render as a simple span with a data attribute for variant
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

import { ProductCard } from "@/components/ProductCard"

const defaultProps = {
  name: "BPC-157",
  description: "Research peptide for laboratory use",
  price: 49.99,
  currency: "€",
  dosage: "5mg",
  purity: 98,
  status: "in-stock" as const,
  image: "/images/bpc-157.png",
  productId: "prod_test123",
  variants: [{ id: "var_5mg" }],
}

describe("ProductCard", () => {
  beforeEach(() => {
    mockAddItem.mockClear()
    mockRouterPush.mockClear()
  })

  it("renders product name and price", () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByText("BPC-157")).toBeInTheDocument()
    // nl-NL format: 49,99
    expect(screen.getByText(/49,99/)).toBeInTheDocument()
  })

  it("shows bestSeller badge when bestSeller is true", () => {
    render(<ProductCard {...defaultProps} bestSeller />)

    expect(screen.getByText("Best Seller")).toBeInTheDocument()
  })

  it("hides bestSeller badge when bestSeller is false", () => {
    render(<ProductCard {...defaultProps} bestSeller={false} />)

    expect(screen.queryByText("Best Seller")).not.toBeInTheDocument()
  })

  it("shows correct status badge for in-stock", () => {
    render(<ProductCard {...defaultProps} status="in-stock" />)

    const badge = screen.getByText("In Stock")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute("data-variant", "inStock")
  })

  it("shows correct status badge for out-of-stock", () => {
    render(<ProductCard {...defaultProps} status="out-of-stock" />)

    const badge = screen.getByText("Out of Stock")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute("data-variant", "outOfStock")
  })

  it("shows correct status badge for low-stock", () => {
    render(<ProductCard {...defaultProps} status="low-stock" />)

    const badge = screen.getByText("Low Stock")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute("data-variant", "lowStock")
  })

  it("single variant: add to cart button calls addItem", async () => {
    const user = userEvent.setup()

    render(
      <ProductCard
        {...defaultProps}
        variants={[{ id: "var_only" }]}
      />
    )

    const addButton = screen.getByLabelText("BPC-157 toevoegen aan winkelwagen")
    await user.click(addButton)

    expect(mockAddItem).toHaveBeenCalledWith("var_only", 1)
  })

  it("multiple variants: button navigates to product page", async () => {
    const user = userEvent.setup()

    render(
      <ProductCard
        {...defaultProps}
        href="/products/bpc-157"
        variants={[{ id: "var_5mg" }, { id: "var_10mg" }]}
      />
    )

    const button = screen.getByLabelText("BPC-157 toevoegen aan winkelwagen")
    await user.click(button)

    expect(mockRouterPush).toHaveBeenCalledWith("/products/prod_test123")
    expect(mockAddItem).not.toHaveBeenCalled()
  })

  it("shows purity and dosage specs", () => {
    render(<ProductCard {...defaultProps} purity={98} dosage="5mg" />)

    expect(screen.getByText("98%")).toBeInTheDocument()
    expect(screen.getByText("5mg")).toBeInTheDocument()
  })

  it("renders product image", () => {
    render(<ProductCard {...defaultProps} />)

    const img = screen.getByAltText("BPC-157")
    expect(img).toHaveAttribute("src", "/images/bpc-157.png")
  })

  it("wraps content in a link when href is provided", () => {
    render(<ProductCard {...defaultProps} href="/products/bpc-157" />)

    const link = screen.getByText("BPC-157").closest("a")
    expect(link).toHaveAttribute("href", "/products/bpc-157")
  })

  it("disables button when out of stock", () => {
    render(<ProductCard {...defaultProps} status="out-of-stock" />)

    const button = screen.getByLabelText("BPC-157 toevoegen aan winkelwagen")
    expect(button).toBeDisabled()
  })

  it("shows 'Niet beschikbaar' text when out of stock", () => {
    render(<ProductCard {...defaultProps} status="out-of-stock" />)

    expect(screen.getByText("Niet beschikbaar")).toBeInTheDocument()
  })

  it("shows 'Kies variant' text for multiple variants", () => {
    render(
      <ProductCard
        {...defaultProps}
        variants={[{ id: "var_5mg" }, { id: "var_10mg" }]}
      />
    )

    expect(screen.getByText("Kies variant")).toBeInTheDocument()
  })

  it("shows 'Toevoegen' text for single variant in stock", () => {
    render(
      <ProductCard
        {...defaultProps}
        status="in-stock"
        variants={[{ id: "var_5mg" }]}
      />
    )

    expect(screen.getByText("Toevoegen")).toBeInTheDocument()
  })

  it("renders description text", () => {
    render(<ProductCard {...defaultProps} />)

    expect(
      screen.getByText("Research peptide for laboratory use")
    ).toBeInTheDocument()
  })
})
