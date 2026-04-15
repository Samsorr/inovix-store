import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"

// ---------------------------------------------------------------------------
// Mock the Sheet UI primitives so they render inline (no portal / dialog)
// ---------------------------------------------------------------------------
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({
    open,
    children,
  }: {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
  }) => (open ? <div data-testid="sheet">{children}</div> : null),
  SheetContent: ({
    children,
  }: {
    children: React.ReactNode
    side?: string
    className?: string
  }) => <div data-testid="sheet-content">{children}</div>,
  SheetHeader: ({
    children,
  }: {
    children: React.ReactNode
    className?: string
  }) => <div data-testid="sheet-header">{children}</div>,
  SheetTitle: ({
    children,
  }: {
    children: React.ReactNode
    className?: string
  }) => <h2>{children}</h2>,
  SheetFooter: ({
    children,
  }: {
    children: React.ReactNode
    className?: string
  }) => <div data-testid="sheet-footer">{children}</div>,
}))

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr />,
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string
    size?: string
    fullWidth?: boolean
  }) => {
    const { variant, size, fullWidth, ...rest } = props as Record<string, unknown>
    return <button {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
  },
}))

// ---------------------------------------------------------------------------
// Mock cart context
// ---------------------------------------------------------------------------
const mockRemoveItem = vi.fn()
const mockUpdateQuantity = vi.fn()
const mockCloseCart = vi.fn()

const mockUseCart = vi.fn()

vi.mock("@/lib/context/cart-context", () => ({
  useCart: (...args: unknown[]) => mockUseCart(...args),
  CartProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------
import { CartSheet } from "@/components/CartSheet"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function cartItem(overrides: Record<string, unknown> = {}) {
  return {
    id: "li_1",
    title: "BPC-157",
    quantity: 2,
    unit_price: 4999,
    thumbnail: "/images/product-peptide.png",
    variant: { id: "var_5mg", title: "5mg" },
    ...overrides,
  }
}

function setupCart(overrides: Record<string, unknown> = {}) {
  const items = (overrides.items as unknown[]) ?? []
  const total = (overrides.cartTotal as number) ?? 0

  mockUseCart.mockReturnValue({
    cart: { id: "cart_test", items, total, subtotal: total },
    isLoading: false,
    isUpdating: false,
    error: null,
    isCartOpen: true,
    closeCart: mockCloseCart,
    removeItem: mockRemoveItem,
    updateQuantity: mockUpdateQuantity,
    cartCount: (items as Array<{ quantity: number }>).reduce(
      (sum, i) => sum + i.quantity,
      0
    ),
    cartTotal: total,
    ...overrides,
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("CartSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("does not render when isCartOpen is false", () => {
    setupCart({ isCartOpen: false })
    const { container } = render(<CartSheet />)
    expect(container.innerHTML).toBe("")
  })

  it("renders items when cart has items and isCartOpen is true", () => {
    const items = [cartItem(), cartItem({ id: "li_2", title: "TB-500" })]
    setupCart({ items, cartTotal: 9998 })

    render(<CartSheet />)

    expect(screen.getByText("BPC-157")).toBeInTheDocument()
    expect(screen.getByText("TB-500")).toBeInTheDocument()
  })

  it("shows item title and variant title", () => {
    setupCart({ items: [cartItem()], cartTotal: 9998 })

    render(<CartSheet />)

    expect(screen.getByText("BPC-157")).toBeInTheDocument()
    expect(screen.getByText("5mg")).toBeInTheDocument()
  })

  it("shows quantity for each item", () => {
    setupCart({ items: [cartItem({ quantity: 3 })], cartTotal: 14997 })

    render(<CartSheet />)

    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("shows formatted price for each item", () => {
    // unit_price 4999 * quantity 2 = 9998 cents => formatPrice => "€ 99,98"
    setupCart({ items: [cartItem()], cartTotal: 9998 })

    render(<CartSheet />)

    // Price is formatted via formatPrice: (4999 * 2) / 100 = 99.98
    // Both the item price and subtotal show the same amount, so use getAllByText
    const priceElements = screen.getAllByText(/99,98/)
    expect(priceElements.length).toBeGreaterThanOrEqual(1)
  })

  it("remove button calls removeItem with correct line item ID", async () => {
    const user = userEvent.setup()
    setupCart({ items: [cartItem({ id: "li_abc" })], cartTotal: 9998 })

    render(<CartSheet />)

    const removeBtn = screen.getByText("Verwijder")
    await user.click(removeBtn)

    expect(mockRemoveItem).toHaveBeenCalledWith("li_abc")
  })

  it("increment button calls updateQuantity with quantity + 1", async () => {
    const user = userEvent.setup()
    setupCart({ items: [cartItem({ id: "li_inc", quantity: 2 })], cartTotal: 9998 })

    render(<CartSheet />)

    const incrementBtn = screen.getByLabelText("Verhoog hoeveelheid")
    await user.click(incrementBtn)

    expect(mockUpdateQuantity).toHaveBeenCalledWith("li_inc", 3)
  })

  it("decrement button calls updateQuantity with quantity - 1 when quantity > 1", async () => {
    const user = userEvent.setup()
    setupCart({ items: [cartItem({ id: "li_dec", quantity: 3 })], cartTotal: 14997 })

    render(<CartSheet />)

    const decrementBtn = screen.getByLabelText("Verminder hoeveelheid")
    await user.click(decrementBtn)

    expect(mockUpdateQuantity).toHaveBeenCalledWith("li_dec", 2)
  })

  it("decrement button calls removeItem when quantity is 1", async () => {
    const user = userEvent.setup()
    setupCart({ items: [cartItem({ id: "li_rem", quantity: 1 })], cartTotal: 4999 })

    render(<CartSheet />)

    const decrementBtn = screen.getByLabelText("Verminder hoeveelheid")
    await user.click(decrementBtn)

    expect(mockRemoveItem).toHaveBeenCalledWith("li_rem")
    expect(mockUpdateQuantity).not.toHaveBeenCalled()
  })

  it("shows empty state message when cart has no items", () => {
    setupCart({ items: [], cartTotal: 0 })

    render(<CartSheet />)

    expect(screen.getByText("Uw winkelwagen is leeg")).toBeInTheDocument()
    expect(screen.getByText("Bekijk onze producten")).toBeInTheDocument()
  })

  it("shows subtotal in footer", () => {
    // cartTotal = 9998 cents => formatPrice => "€ 99,98"
    setupCart({ items: [cartItem()], cartTotal: 9998 })

    render(<CartSheet />)

    const footer = screen.getByTestId("sheet-footer")
    expect(within(footer).getByText("Subtotaal")).toBeInTheDocument()
    expect(within(footer).getByText(/99,98/)).toBeInTheDocument()
  })

  it("has checkout link pointing to /checkout", () => {
    setupCart({ items: [cartItem()], cartTotal: 9998 })

    render(<CartSheet />)

    const checkoutLink = screen.getByText("Naar checkout").closest("a")
    expect(checkoutLink).toHaveAttribute("href", "/checkout")
  })

  it("shows research disclaimer", () => {
    setupCart({ items: [cartItem()], cartTotal: 9998 })

    render(<CartSheet />)

    expect(
      screen.getByText("Uitsluitend voor laboratoriumonderzoek")
    ).toBeInTheDocument()
  })
})
