"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import medusa from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Customer = HttpTypes.StoreCustomer

interface AuthContextValue {
  customer: Customer | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    first_name: string
    last_name: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: {
    first_name?: string
    last_name?: string
  }) => Promise<void>
  refreshCustomer: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    let cancelled = false

    medusa.store.customer
      .retrieve()
      .then(({ customer: c }) => {
        if (!cancelled) setCustomer(c)
      })
      .catch(() => {
        // Not logged in
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await medusa.auth.login("customer", "emailpass", { email, password })
    const { customer: c } = await medusa.store.customer.retrieve()
    setCustomer(c)
  }, [])

  const register = useCallback(
    async (data: {
      first_name: string
      last_name: string
      email: string
      password: string
    }) => {
      // Step 1: Register auth identity
      try {
        await medusa.auth.register("customer", "emailpass", {
          email: data.email,
          password: data.password,
        })
      } catch (error: unknown) {
        const fetchError = error as { statusText?: string; message?: string }
        if (
          fetchError.statusText === "Unauthorized" &&
          fetchError.message === "Identity with email already exists"
        ) {
          await medusa.auth.login("customer", "emailpass", {
            email: data.email,
            password: data.password,
          })
        } else {
          throw error
        }
      }

      // Step 2: Create customer record
      const { customer: c } = await medusa.store.customer.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      })
      setCustomer(c)
    },
    []
  )

  const logout = useCallback(async () => {
    await medusa.auth.logout()
    setCustomer(null)
  }, [])

  const updateProfile = useCallback(
    async (data: { first_name?: string; last_name?: string }) => {
      const { customer: c } = await medusa.store.customer.update(data)
      setCustomer(c)
    },
    []
  )

  const refreshCustomer = useCallback(async () => {
    try {
      const { customer: c } = await medusa.store.customer.retrieve()
      setCustomer(c)
    } catch {
      setCustomer(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      isLoading,
      isAuthenticated: !!customer,
      login,
      register,
      logout,
      updateProfile,
      refreshCustomer,
    }),
    [
      customer,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      refreshCustomer,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>")
  }
  return ctx
}
