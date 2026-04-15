import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { mockCustomer } from "@/__tests__/helpers/mock-medusa"

// ---------------------------------------------------------------------------
// vi.hoisted runs BEFORE vi.mock hoisting, so these are available in the
// factory function.
// ---------------------------------------------------------------------------
const {
  mockLogin,
  mockRegister,
  mockLogout,
  mockRetrieve,
  mockCreate,
  mockUpdate,
} = vi.hoisted(() => ({
  mockLogin: vi.fn().mockResolvedValue({ token: "mock-jwt-token" }),
  mockRegister: vi.fn().mockResolvedValue({ token: "mock-jwt-token" }),
  mockLogout: vi.fn().mockResolvedValue(undefined),
  mockRetrieve: vi.fn().mockRejectedValue(new Error("Not authenticated")),
  mockCreate: vi.fn().mockResolvedValue({ customer: {} }),
  mockUpdate: vi.fn().mockResolvedValue({ customer: {} }),
}))

vi.mock("@/lib/medusa", () => ({
  default: {
    auth: {
      login: mockLogin,
      register: mockRegister,
      logout: mockLogout,
    },
    store: {
      customer: {
        retrieve: mockRetrieve,
        create: mockCreate,
        update: mockUpdate,
      },
    },
  },
}))

import { AuthProvider, useAuth } from "@/lib/context/auth-context"

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

beforeEach(() => {
  vi.clearAllMocks()
  // Default: no session (retrieve rejects)
  mockRetrieve.mockRejectedValue(new Error("Not authenticated"))
  mockCreate.mockResolvedValue({ customer: mockCustomer() })
  mockUpdate.mockResolvedValue({ customer: mockCustomer() })
})

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow("useAuth must be used within an <AuthProvider>")

    spy.mockRestore()
  })
})

describe("AuthProvider", () => {
  it("starts with isLoading true and customer null", () => {
    // Use a promise that never resolves so we can check initial state
    mockRetrieve.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.customer).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it("retrieves the customer on mount when a session exists", async () => {
    const customer = mockCustomer()
    mockRetrieve.mockResolvedValue({ customer })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.customer).toEqual(customer)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it("sets customer to null and isLoading to false when no session exists", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.customer).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  describe("login", () => {
    it("sets customer on successful login", async () => {
      const customer = mockCustomer({ email: "logged-in@example.com" })
      mockLogin.mockResolvedValue({ token: "tok" })
      mockRetrieve
        // First call: mount (no session)
        .mockRejectedValueOnce(new Error("Not authenticated"))
        // Second call: after login
        .mockResolvedValueOnce({ customer })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login("logged-in@example.com", "password123")
      })

      expect(mockLogin).toHaveBeenCalledWith("customer", "emailpass", {
        email: "logged-in@example.com",
        password: "password123",
      })
      expect(result.current.customer?.email).toBe("logged-in@example.com")
      expect(result.current.isAuthenticated).toBe(true)
    })

    it("propagates errors on login failure", async () => {
      mockLogin.mockRejectedValue(new Error("Invalid credentials"))

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await expect(
        act(async () => {
          await result.current.login("bad@example.com", "wrong")
        })
      ).rejects.toThrow("Invalid credentials")
    })
  })

  describe("register", () => {
    it("creates auth identity then customer record", async () => {
      const customer = mockCustomer({
        first_name: "Piet",
        last_name: "Bakker",
        email: "piet@example.com",
      })
      mockRegister.mockResolvedValue({ token: "tok" })
      mockCreate.mockResolvedValue({ customer })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.register({
          first_name: "Piet",
          last_name: "Bakker",
          email: "piet@example.com",
          password: "secret123",
        })
      })

      expect(mockRegister).toHaveBeenCalledWith("customer", "emailpass", {
        email: "piet@example.com",
        password: "secret123",
      })
      expect(mockCreate).toHaveBeenCalledWith({
        first_name: "Piet",
        last_name: "Bakker",
        email: "piet@example.com",
      })
      expect(result.current.customer?.first_name).toBe("Piet")
    })

    it("falls back to login when identity already exists, then creates customer", async () => {
      const customer = mockCustomer({ email: "existing@example.com" })

      mockRegister.mockRejectedValue({
        statusText: "Unauthorized",
        message: "Identity with email already exists",
      })
      mockLogin.mockResolvedValue({ token: "tok" })
      mockCreate.mockResolvedValue({ customer })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.register({
          first_name: "Jan",
          last_name: "de Vries",
          email: "existing@example.com",
          password: "secret123",
        })
      })

      expect(mockLogin).toHaveBeenCalledWith("customer", "emailpass", {
        email: "existing@example.com",
        password: "secret123",
      })
      expect(mockCreate).toHaveBeenCalled()
      expect(result.current.customer).toEqual(customer)
    })
  })

  describe("logout", () => {
    it("nulls customer after logout", async () => {
      const customer = mockCustomer()
      mockRetrieve.mockResolvedValue({ customer })
      mockLogout.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.customer).toEqual(customer)
      })

      await act(async () => {
        await result.current.logout()
      })

      expect(mockLogout).toHaveBeenCalled()
      expect(result.current.customer).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe("updateProfile", () => {
    it("updates the customer state with new data", async () => {
      const customer = mockCustomer()
      const updatedCustomer = mockCustomer({ first_name: "Updated" })

      mockRetrieve.mockResolvedValue({ customer })
      mockUpdate.mockResolvedValue({ customer: updatedCustomer })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.customer).toEqual(customer)
      })

      await act(async () => {
        await result.current.updateProfile({ first_name: "Updated" })
      })

      expect(mockUpdate).toHaveBeenCalledWith({ first_name: "Updated" })
      expect(result.current.customer?.first_name).toBe("Updated")
    })
  })

  describe("isAuthenticated", () => {
    it("is true when customer exists", async () => {
      const customer = mockCustomer()
      mockRetrieve.mockResolvedValue({ customer })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
      })
    })

    it("is false when customer is null", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(false)
    })
  })
})
