"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import medusa from "@/lib/medusa"
import { getDefaultRegionId } from "@/lib/region"
import type { HttpTypes } from "@medusajs/types"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Cart = HttpTypes.StoreCart

interface CartContextValue {
  /** The full Medusa cart object, or null while loading / before creation. */
  cart: Cart | null
  /** True during the initial cart load (retrieve or create). */
  isLoading: boolean
  /** True while a mutation (add / remove / update) is in-flight. */
  isUpdating: boolean
  /** User-facing error message, or null. Auto-clears after 5 s. */
  error: string | null
  /** Whether the cart slide-over sheet is open. */
  isCartOpen: boolean

  // Mutations
  addItem: (variantId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  openCart: () => void
  closeCart: () => void

  // Checkout helpers
  /** Directly update the cart state (used by checkout after SDK calls). */
  updateCartState: (cart: Cart) => void
  /** Clear the cart after order completion and create a fresh one. */
  resetCart: () => void

  // Computed
  /** Total number of items in the cart. */
  cartCount: number
  /** Cart total in the smallest currency unit (cents). */
  cartTotal: number
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CART_ID_KEY = "inovix_cart_id"
const ERROR_CLEAR_MS = 5_000

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CartContext = createContext<CartContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Ref to hold the error-clear timeout so we can cancel on unmount.
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ------- helpers -------

  const setErrorWithAutoClear = useCallback((message: string) => {
    setError(message)
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    errorTimerRef.current = setTimeout(() => setError(null), ERROR_CLEAR_MS)
  }, [])

  // Clean up error timer on unmount.
  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    }
  }, [])

  // ------- initial load -------

  useEffect(() => {
    let cancelled = false

    async function createNewCart(): Promise<Cart> {
      const regionId = await getDefaultRegionId()
      const { cart: newCart } = await medusa.store.cart.create({
        region_id: regionId,
      })
      localStorage.setItem(CART_ID_KEY, newCart.id)
      return newCart
    }

    async function init() {
      try {
        const storedId = localStorage.getItem(CART_ID_KEY)

        let loadedCart: Cart

        if (storedId) {
          try {
            const { cart: existing } =
              await medusa.store.cart.retrieve(storedId)
            loadedCart = existing
          } catch {
            // Cart expired / invalid -- remove and create fresh.
            localStorage.removeItem(CART_ID_KEY)
            loadedCart = await createNewCart()
          }
        } else {
          loadedCart = await createNewCart()
        }

        if (!cancelled) setCart(loadedCart)
      } catch {
        if (!cancelled) {
          setErrorWithAutoClear(
            "Kon winkelwagen niet laden. Ververs de pagina."
          )
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [setErrorWithAutoClear])

  // ------- mutations -------

  const addItem = useCallback(
    async (variantId: string, quantity: number) => {
      if (!cart) return
      setIsUpdating(true)
      try {
        const { cart: updated } = await medusa.store.cart.createLineItem(
          cart.id,
          { variant_id: variantId, quantity }
        )
        setCart(updated)
        setIsCartOpen(true)
      } catch {
        setErrorWithAutoClear(
          "Kon item niet toevoegen. Probeer het opnieuw."
        )
      } finally {
        setIsUpdating(false)
      }
    },
    [cart, setErrorWithAutoClear]
  )

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cart) return
      setIsUpdating(true)
      try {
        // deleteLineItem returns { deleted, parent?: StoreCart }
        const { parent } = await medusa.store.cart.deleteLineItem(
          cart.id,
          lineItemId
        )
        if (parent) {
          setCart(parent)
        }
      } catch {
        setErrorWithAutoClear(
          "Kon item niet verwijderen. Probeer het opnieuw."
        )
      } finally {
        setIsUpdating(false)
      }
    },
    [cart, setErrorWithAutoClear]
  )

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return
      setIsUpdating(true)
      try {
        const { cart: updated } = await medusa.store.cart.updateLineItem(
          cart.id,
          lineItemId,
          { quantity }
        )
        setCart(updated)
      } catch {
        setErrorWithAutoClear(
          "Kon hoeveelheid niet bijwerken. Probeer het opnieuw."
        )
      } finally {
        setIsUpdating(false)
      }
    },
    [cart, setErrorWithAutoClear]
  )

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const updateCartState = useCallback((updated: Cart) => {
    setCart(updated)
  }, [])

  const resetCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY)
    setCart(null)
    // Create a fresh cart asynchronously
    ;(async () => {
      try {
        const regionId = await getDefaultRegionId()
        const { cart: newCart } = await medusa.store.cart.create({
          region_id: regionId,
        })
        localStorage.setItem(CART_ID_KEY, newCart.id)
        setCart(newCart)
      } catch {
        // Silent — next page load will create a new cart
      }
    })()
  }, [])

  // ------- computed -------

  const cartCount = useMemo(
    () =>
      cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [cart?.items]
  )

  const cartTotal = useMemo(() => cart?.total ?? 0, [cart?.total])

  // ------- context value (stable reference) -------

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isLoading,
      isUpdating,
      error,
      isCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      openCart,
      closeCart,
      updateCartState,
      resetCart,
      cartCount,
      cartTotal,
    }),
    [
      cart,
      isLoading,
      isUpdating,
      error,
      isCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      openCart,
      closeCart,
      updateCartState,
      resetCart,
      cartCount,
      cartTotal,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>")
  }
  return ctx
}
