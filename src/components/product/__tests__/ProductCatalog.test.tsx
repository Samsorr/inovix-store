import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"

import type { ProductCardProps } from "@/components/ProductCard"

// Mock cart context used by CatalogCard
vi.mock("@/lib/context/cart-context", () => ({
  useCart: vi.fn().mockReturnValue({
    cart: null,
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
    cartCount: 0,
    cartTotal: 0,
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

import { ProductCatalog } from "@/components/product/ProductCatalog"

const makeProduct = (
  overrides: Partial<ProductCardProps> = {}
): ProductCardProps => ({
  name: "BPC-157",
  description: "Research peptide",
  price: 49.99,
  dosage: "5mg",
  purity: 98,
  category: "Peptiden",
  status: "in-stock",
  productId: "prod_1",
  variants: [{ id: "var_1" }],
  ...overrides,
})

const products: ProductCardProps[] = [
  makeProduct({
    name: "BPC-157",
    price: 49.99,
    category: "Peptiden",
    productId: "prod_1",
  }),
  makeProduct({
    name: "TB-500",
    price: 39.99,
    category: "Peptiden",
    productId: "prod_2",
  }),
  makeProduct({
    name: "GHK-Cu",
    price: 59.99,
    category: "Koper Peptiden",
    productId: "prod_3",
  }),
]

const categories = ["Peptiden", "Koper Peptiden"]

describe("ProductCatalog", () => {
  it("renders all products when no filter is applied", () => {
    render(<ProductCatalog products={products} categories={categories} />)

    expect(screen.getByText("BPC-157")).toBeInTheDocument()
    expect(screen.getByText("TB-500")).toBeInTheDocument()
    expect(screen.getByText("GHK-Cu")).toBeInTheDocument()
  })

  it("filters by category when a category pill is clicked", async () => {
    const user = userEvent.setup()
    render(<ProductCatalog products={products} categories={categories} />)

    await user.click(screen.getByRole("button", { name: "Koper Peptiden" }))

    expect(screen.getByText("GHK-Cu")).toBeInTheDocument()
    expect(screen.queryByText("BPC-157")).not.toBeInTheDocument()
    expect(screen.queryByText("TB-500")).not.toBeInTheDocument()
  })

  it("filters by search text matching name", async () => {
    const user = userEvent.setup()
    render(<ProductCatalog products={products} categories={categories} />)

    const searchInput = screen.getByPlaceholderText("Zoek peptiden...")
    await user.type(searchInput, "GHK")

    expect(screen.getByText("GHK-Cu")).toBeInTheDocument()
    expect(screen.queryByText("BPC-157")).not.toBeInTheDocument()
    expect(screen.queryByText("TB-500")).not.toBeInTheDocument()
  })

  it("sorts by price ascending", async () => {
    const user = userEvent.setup()
    render(<ProductCatalog products={products} categories={categories} />)

    const select = screen.getByRole("combobox")
    await user.selectOptions(select, "price-asc")

    const articles = screen.getAllByRole("article")
    expect(articles).toHaveLength(3)

    // TB-500 (39.99) should come first, then BPC-157 (49.99), then GHK-Cu (59.99)
    expect(articles[0]).toHaveTextContent("TB-500")
    expect(articles[1]).toHaveTextContent("BPC-157")
    expect(articles[2]).toHaveTextContent("GHK-Cu")
  })

  it("sorts by price descending", async () => {
    const user = userEvent.setup()
    render(<ProductCatalog products={products} categories={categories} />)

    const select = screen.getByRole("combobox")
    await user.selectOptions(select, "price-desc")

    const articles = screen.getAllByRole("article")
    expect(articles).toHaveLength(3)

    // GHK-Cu (59.99) should come first, then BPC-157 (49.99), then TB-500 (39.99)
    expect(articles[0]).toHaveTextContent("GHK-Cu")
    expect(articles[1]).toHaveTextContent("BPC-157")
    expect(articles[2]).toHaveTextContent("TB-500")
  })

  it("shows empty state when no products match filter", async () => {
    const user = userEvent.setup()
    render(<ProductCatalog products={products} categories={categories} />)

    const searchInput = screen.getByPlaceholderText("Zoek peptiden...")
    await user.type(searchInput, "XXXXXXXXX")

    expect(screen.getByText(/Geen producten gevonden/)).toBeInTheDocument()
    expect(screen.getByText("Filters wissen")).toBeInTheDocument()
  })

  it("shows all products when 'Alle' category is clicked after filtering", async () => {
    const user = userEvent.setup()
    render(<ProductCatalog products={products} categories={categories} />)

    // Filter by category first
    await user.click(screen.getByRole("button", { name: "Koper Peptiden" }))
    expect(screen.queryByText("BPC-157")).not.toBeInTheDocument()

    // Click "Alle" to reset
    await user.click(screen.getByRole("button", { name: "Alle" }))

    expect(screen.getByText("BPC-157")).toBeInTheDocument()
    expect(screen.getByText("TB-500")).toBeInTheDocument()
    expect(screen.getByText("GHK-Cu")).toBeInTheDocument()
  })
})
