import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import {
  mockCart,
  mockCartWithItems,
  mockLineItem,
} from "@/__tests__/helpers/mock-medusa"

// ---------------------------------------------------------------------------
// vi.hoisted runs BEFORE vi.mock hoisting, so these are available in the
// factory function.
// ---------------------------------------------------------------------------
const {
  mockCartCreate,
  mockCartRetrieve,
  mockCartUpdate,
  mockCreateLineItem,
  mockUpdateLineItem,
  mockDeleteLineItem,
} = vi.hoisted(() => ({
  mockCartCreate: vi.fn(),
  mockCartRetrieve: vi.fn(),
  mockCartUpdate: vi.fn(),
  mockCreateLineItem: vi.fn(),
  mockUpdateLineItem: vi.fn(),
  mockDeleteLineItem: vi.fn(),
}))

vi.mock("@/lib/medusa", () => ({
  default: {
    store: {
      cart: {
        create: mockCartCreate,
        retrieve: mockCartRetrieve,
        update: mockCartUpdate,
        createLineItem: mockCreateLineItem,
        updateLineItem: mockUpdateLineItem,
        deleteLineItem: mockDeleteLineItem,
      },
    },
  },
}))

vi.mock("@/lib/region", () => ({
  getDefaultRegionId: vi.fn().mockResolvedValue("reg_eu"),
}))

import { CartProvider, useCart } from "@/lib/context/cart-context"

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()

  // Defaults
  mockCartCreate.mockResolvedValue({ cart: mockCart({ id: "cart_new" }) })
  mockCartRetrieve.mockResolvedValue({ cart: mockCart({ id: "cart_stored" }) })
  mockCartUpdate.mockResolvedValue({ cart: mockCart() })
  mockCreateLineItem.mockResolvedValue({ cart: mockCart() })
  mockUpdateLineItem.mockResolvedValue({ cart: mockCart() })
  mockDeleteLineItem.mockResolvedValue({ deleted: true, parent: mockCart() })
})

afterEach(() => {
  vi.useRealTimers()
})

describe("useCart", () => {
  it("throws when used outside CartProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      renderHook(() => useCart())
    }).toThrow("useCart must be used within a <CartProvider>")

    spy.mockRestore()
  })
})

describe("CartProvider", () => {
  describe("initial load", () => {
    it("creates a new cart when no ID is stored in localStorage", async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockCartCreate).toHaveBeenCalledWith({ region_id: "reg_eu" })
      expect(result.current.cart?.id).toBe("cart_new")
    })

    it("retrieves an existing cart when a valid ID is in localStorage", async () => {
      localStorage.setItem("inovix_cart_id", "cart_stored")

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockCartRetrieve).toHaveBeenCalledWith("cart_stored")
      expect(result.current.cart?.id).toBe("cart_stored")
    })

    it("creates a new cart when the stored cart is expired or invalid", async () => {
      localStorage.setItem("inovix_cart_id", "cart_expired")
      mockCartRetrieve.mockRejectedValue(new Error("Cart not found"))

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockCartCreate).toHaveBeenCalled()
      expect(result.current.cart?.id).toBe("cart_new")
    })
  })

  describe("addItem", () => {
    it("calls createLineItem and opens the cart", async () => {
      const updatedCart = mockCartWithItems(1)
      mockCreateLineItem.mockResolvedValue({ cart: updatedCart })

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.addItem("var_test", 2)
      })

      expect(mockCreateLineItem).toHaveBeenCalledWith(
        "cart_new",
        { variant_id: "var_test", quantity: 2 }
      )
      expect(result.current.isCartOpen).toBe(true)
    })

    it("sets an error when the API call fails", async () => {
      mockCreateLineItem.mockRejectedValue(new Error("Server error"))

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.addItem("var_test", 1)
      })

      expect(result.current.error).toBe(
        "Kon item niet toevoegen. Probeer het opnieuw."
      )
    })
  })

  describe("removeItem", () => {
    it("calls deleteLineItem and updates the cart", async () => {
      const cartWithItem = mockCartWithItems(1)
      const emptyCart = mockCart()

      mockCartCreate.mockResolvedValue({ cart: cartWithItem })
      mockDeleteLineItem.mockResolvedValue({ deleted: true, parent: emptyCart })

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.removeItem("item_0")
      })

      expect(mockDeleteLineItem).toHaveBeenCalledWith(cartWithItem.id, "item_0")
    })
  })

  describe("updateQuantity", () => {
    it("calls updateLineItem with the new quantity", async () => {
      const updatedCart = mockCartWithItems(1)
      mockUpdateLineItem.mockResolvedValue({ cart: updatedCart })

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateQuantity("li_test123", 3)
      })

      expect(mockUpdateLineItem).toHaveBeenCalledWith(
        "cart_new",
        "li_test123",
        { quantity: 3 }
      )
    })
  })

  describe("openCart / closeCart", () => {
    it("toggles isCartOpen", async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isCartOpen).toBe(false)

      act(() => {
        result.current.openCart()
      })
      expect(result.current.isCartOpen).toBe(true)

      act(() => {
        result.current.closeCart()
      })
      expect(result.current.isCartOpen).toBe(false)
    })
  })

  describe("resetCart", () => {
    it("removes the stored cart ID and creates a fresh cart", async () => {
      localStorage.setItem("inovix_cart_id", "cart_old")

      mockCartRetrieve.mockResolvedValue({ cart: mockCart({ id: "cart_old" }) })

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Override create for the resetCart call
      const freshCart = mockCart({ id: "cart_fresh" })
      mockCartCreate.mockResolvedValue({ cart: freshCart })

      act(() => {
        result.current.resetCart()
      })

      expect(localStorage.removeItem).toHaveBeenCalledWith("inovix_cart_id")

      // Wait for the async fresh cart creation
      await waitFor(() => {
        expect(result.current.cart?.id).toBe("cart_fresh")
      })
    })
  })

  describe("cartCount", () => {
    it("returns 0 for an empty cart", async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.cartCount).toBe(0)
    })

    it("returns the sum of item quantities", async () => {
      const items = [
        mockLineItem({ id: "li_1", quantity: 2 }),
        mockLineItem({ id: "li_2", quantity: 3 }),
      ]
      mockCartCreate.mockResolvedValue({ cart: mockCart({ items }) })

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.cartCount).toBe(5)
    })
  })

  describe("cartTotal", () => {
    it("reflects the cart total value", async () => {
      mockCartCreate.mockResolvedValue({ cart: mockCart({ total: 9998 }) })

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.cartTotal).toBe(9998)
    })
  })

  describe("error auto-clear", () => {
    it("clears the error after 5 seconds", async () => {
      // shouldAdvanceTime lets promises/microtasks resolve while faking timers
      vi.useFakeTimers({ shouldAdvanceTime: true })

      mockCreateLineItem.mockRejectedValue(new Error("fail"))

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.addItem("var_test", 1)
      })

      expect(result.current.error).toBe(
        "Kon item niet toevoegen. Probeer het opnieuw."
      )

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe("localStorage persistence", () => {
    it("saves the cart ID to localStorage when a new cart is created", async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "inovix_cart_id",
        "cart_new"
      )
    })
  })
})
