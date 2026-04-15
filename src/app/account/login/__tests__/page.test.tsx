import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { useAuth } from "@/lib/context/auth-context"
import LoginPage from "../page"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockLogin = vi.fn()
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/account/login",
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock("@/lib/context/auth-context", () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function defaultAuth(overrides: Record<string, unknown> = {}) {
  return {
    customer: null,
    isLoading: false,
    isAuthenticated: false,
    login: mockLogin,
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    refreshCustomer: vi.fn(),
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(useAuth).mockReturnValue(defaultAuth() as ReturnType<typeof useAuth>)
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LoginPage", () => {
  it("redirects to /account when already authenticated", () => {
    vi.mocked(useAuth).mockReturnValue(
      defaultAuth({ isAuthenticated: true, customer: { id: "cus_1" } }) as ReturnType<typeof useAuth>
    )

    render(<LoginPage />)

    expect(mockPush).toHaveBeenCalledWith("/account")
  })

  it("renders login form with email and password inputs", () => {
    render(<LoginPage />)

    expect(screen.getByRole("heading", { name: /inloggen/i })).toBeInTheDocument()
    expect(screen.getByLabelText("E-mailadres")).toBeInTheDocument()
    expect(screen.getByLabelText("Wachtwoord")).toBeInTheDocument()
  })

  it("shows error when submitting with empty email", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const submitButton = screen.getByRole("button", { name: /inloggen/i })
    await user.click(submitButton)

    expect(screen.getByText("E-mailadres is verplicht")).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it("shows error when submitting with empty password", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const emailInput = screen.getByLabelText("E-mailadres")
    await user.type(emailInput, "test@example.com")

    const submitButton = screen.getByRole("button", { name: /inloggen/i })
    await user.click(submitButton)

    expect(screen.getByText("Wachtwoord is verplicht")).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it("calls login with email and password on valid submit", async () => {
    mockLogin.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "test@example.com")
    await user.type(screen.getByLabelText("Wachtwoord"), "secret123")
    await user.click(screen.getByRole("button", { name: /inloggen/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "secret123")
    })
  })

  it("redirects to /account on successful login", async () => {
    mockLogin.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "test@example.com")
    await user.type(screen.getByLabelText("Wachtwoord"), "secret123")
    await user.click(screen.getByRole("button", { name: /inloggen/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/account")
    })
  })

  it("shows error message on login failure", async () => {
    mockLogin.mockRejectedValue(new Error("Invalid credentials"))
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "test@example.com")
    await user.type(screen.getByLabelText("Wachtwoord"), "wrongpassword")
    await user.click(screen.getByRole("button", { name: /inloggen/i }))

    await waitFor(() => {
      expect(
        screen.getByText(
          "Ongeldige inloggegevens. Controleer uw e-mailadres en wachtwoord."
        )
      ).toBeInTheDocument()
    })
  })

  it("has link to /account/wachtwoord-vergeten", () => {
    render(<LoginPage />)

    const link = screen.getByRole("link", { name: /wachtwoord vergeten/i })
    expect(link).toHaveAttribute("href", "/account/wachtwoord-vergeten")
  })

  it("has link to /account/registratie", () => {
    render(<LoginPage />)

    const link = screen.getByRole("link", { name: /registreren/i })
    expect(link).toHaveAttribute("href", "/account/registratie")
  })

  it("shows loading state while auth isLoading", () => {
    vi.mocked(useAuth).mockReturnValue(
      defaultAuth({ isLoading: true }) as ReturnType<typeof useAuth>
    )

    render(<LoginPage />)

    // When loading, the form should not be rendered
    expect(screen.queryByLabelText("E-mailadres")).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: /inloggen/i })).not.toBeInTheDocument()
  })

  it("trims email whitespace before submitting", async () => {
    mockLogin.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "  test@example.com  ")
    await user.type(screen.getByLabelText("Wachtwoord"), "secret123")
    await user.click(screen.getByRole("button", { name: /inloggen/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "secret123")
    })
  })
})
