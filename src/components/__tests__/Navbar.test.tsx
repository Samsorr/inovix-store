import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"

import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"

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

vi.mock("@/lib/context/auth-context", () => ({
  useAuth: vi.fn().mockReturnValue({
    customer: null,
    isLoading: false,
    isAuthenticated: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    refreshCustomer: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

// Mock motion/react to render children directly without animations
vi.mock("motion/react", () => ({
  motion: {
    div: React.forwardRef(
      (
        { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
        ref: React.Ref<HTMLDivElement>
      ) => {
        const safeProps = { ...props }
        delete safeProps.initial
        delete safeProps.animate
        delete safeProps.exit
        delete safeProps.transition
        return (
          <div ref={ref} {...safeProps}>
            {children}
          </div>
        )
      }
    ),
    span: React.forwardRef(
      (
        { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
        ref: React.Ref<HTMLSpanElement>
      ) => {
        const safeProps = { ...props }
        delete safeProps.initial
        delete safeProps.animate
        delete safeProps.exit
        delete safeProps.transition
        return (
          <span ref={ref} {...safeProps}>
            {children}
          </span>
        )
      }
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

import { Navbar } from "@/components/Navbar"

describe("Navbar", () => {
  it("renders cart count badge with correct count", () => {
    vi.mocked(useCart).mockReturnValue({
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
      cartCount: 3,
      cartTotal: 0,
    })

    render(<Navbar />)

    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("does not show cart count badge when count is 0", () => {
    vi.mocked(useCart).mockReturnValue({
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
    })

    render(<Navbar />)

    // The badge span should not be present
    expect(screen.queryByText("0")).not.toBeInTheDocument()
  })

  it("shows 'Inloggen' link when not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      customer: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      refreshCustomer: vi.fn(),
    })

    render(<Navbar />)

    // Desktop "Inloggen" link
    const loginLinks = screen.getAllByText("Inloggen")
    expect(loginLinks.length).toBeGreaterThan(0)

    // The desktop link should point to /account/login
    const desktopLink = loginLinks.find(
      (el) => el.closest("a")?.getAttribute("href") === "/account/login"
    )
    expect(desktopLink).toBeTruthy()
  })

  it("shows user icon link when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      customer: { first_name: "Jan", last_name: "de Vries" } as any,
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      refreshCustomer: vi.fn(),
    })

    render(<Navbar />)

    // When authenticated, we should have a link to /account (not /account/login)
    const accountLinks = screen.getAllByRole("link").filter(
      (link) => link.getAttribute("href") === "/account"
    )
    expect(accountLinks.length).toBeGreaterThan(0)

    // "Inloggen" should not appear in desktop nav (mobile overlay might still show the name)
    const loginDesktop = screen.getAllByRole("link").filter(
      (link) =>
        link.getAttribute("href") === "/account/login" &&
        link.textContent === "Inloggen"
    )
    // The desktop "Inloggen" should not be present when authenticated
    // (the desktop version shows User icon instead)
    // The mobile overlay shows customer name, not "Inloggen"
    expect(loginDesktop).toHaveLength(0)
  })

  it("logo links to home page", () => {
    render(<Navbar />)

    const logo = screen.getByRole("link", { name: /inovix home/i })
    expect(logo).toHaveAttribute("href", "/")
  })
})
