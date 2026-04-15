import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { useAuth } from "@/lib/context/auth-context"
import RegistratiePage from "../page"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRegister = vi.fn()
const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/account/registratie",
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
    login: vi.fn(),
    register: mockRegister,
    logout: vi.fn(),
    updateProfile: vi.fn(),
    refreshCustomer: vi.fn(),
    ...overrides,
  }
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Voornaam"), "Jan")
  await user.type(screen.getByLabelText("Achternaam"), "de Vries")
  await user.type(screen.getByLabelText("E-mailadres"), "jan@example.com")
  await user.type(screen.getByLabelText("Wachtwoord"), "veiligwachtwoord")
  // Click the research confirmation checkbox
  await user.click(
    screen.getByLabelText("Ik bevestig dat ik een onderzoeksprofessional ben")
  )
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

describe("RegistratiePage", () => {
  it("redirects to /account when already authenticated", () => {
    vi.mocked(useAuth).mockReturnValue(
      defaultAuth({ isAuthenticated: true, customer: { id: "cus_1" } }) as ReturnType<typeof useAuth>
    )

    render(<RegistratiePage />)

    expect(mockPush).toHaveBeenCalledWith("/account")
  })

  it("renders registration form with all fields", () => {
    render(<RegistratiePage />)

    expect(screen.getByRole("heading", { name: /account aanmaken/i })).toBeInTheDocument()
    expect(screen.getByLabelText("Voornaam")).toBeInTheDocument()
    expect(screen.getByLabelText("Achternaam")).toBeInTheDocument()
    expect(screen.getByLabelText("E-mailadres")).toBeInTheDocument()
    expect(screen.getByLabelText("Wachtwoord")).toBeInTheDocument()
    expect(
      screen.getByLabelText("Ik bevestig dat ik een onderzoeksprofessional ben")
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /account aanmaken/i })
    ).toBeInTheDocument()
  })

  it("shows error for empty first name", async () => {
    const user = userEvent.setup()
    render(<RegistratiePage />)

    await user.click(screen.getByRole("button", { name: /account aanmaken/i }))

    expect(screen.getByText("Voornaam is verplicht")).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it("shows error for empty last name", async () => {
    const user = userEvent.setup()
    render(<RegistratiePage />)

    await user.type(screen.getByLabelText("Voornaam"), "Jan")
    await user.click(screen.getByRole("button", { name: /account aanmaken/i }))

    expect(screen.getByText("Achternaam is verplicht")).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it("shows error for empty email", async () => {
    const user = userEvent.setup()
    render(<RegistratiePage />)

    await user.type(screen.getByLabelText("Voornaam"), "Jan")
    await user.type(screen.getByLabelText("Achternaam"), "de Vries")
    await user.click(screen.getByRole("button", { name: /account aanmaken/i }))

    expect(screen.getByText("E-mailadres is verplicht")).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it("shows error for short password (< 8 chars)", async () => {
    const user = userEvent.setup()
    render(<RegistratiePage />)

    await user.type(screen.getByLabelText("Voornaam"), "Jan")
    await user.type(screen.getByLabelText("Achternaam"), "de Vries")
    await user.type(screen.getByLabelText("E-mailadres"), "jan@example.com")
    await user.type(screen.getByLabelText("Wachtwoord"), "kort")
    await user.click(screen.getByRole("button", { name: /account aanmaken/i }))

    expect(
      screen.getByText("Wachtwoord moet minimaal 8 tekens bevatten")
    ).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it("shows error when research checkbox not confirmed", async () => {
    const user = userEvent.setup()
    render(<RegistratiePage />)

    await user.type(screen.getByLabelText("Voornaam"), "Jan")
    await user.type(screen.getByLabelText("Achternaam"), "de Vries")
    await user.type(screen.getByLabelText("E-mailadres"), "jan@example.com")
    await user.type(screen.getByLabelText("Wachtwoord"), "veiligwachtwoord")
    // Do not check the research checkbox
    await user.click(screen.getByRole("button", { name: /account aanmaken/i }))

    expect(
      screen.getByText("Bevestig dat u een onderzoeksprofessional bent")
    ).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it("calls register with correct data on valid submit", async () => {
    mockRegister.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<RegistratiePage />)

    await fillValidForm(user)
    await user.click(screen.getByRole("button", { name: /account aanmaken/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        first_name: "Jan",
        last_name: "de Vries",
        email: "jan@example.com",
        password: "veiligwachtwoord",
      })
    })
  })

  it("redirects to /account on success", async () => {
    mockRegister.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<RegistratiePage />)

    await fillValidForm(user)
    await user.click(screen.getByRole("button", { name: /account aanmaken/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/account")
    })
  })

  it("shows error on registration failure", async () => {
    mockRegister.mockRejectedValue(new Error("Registration failed"))
    const user = userEvent.setup()
    render(<RegistratiePage />)

    await fillValidForm(user)
    await user.click(screen.getByRole("button", { name: /account aanmaken/i }))

    await waitFor(() => {
      expect(
        screen.getByText(
          "Registratie mislukt. Mogelijk bestaat er al een account met dit e-mailadres."
        )
      ).toBeInTheDocument()
    })
  })

  it("shows loading state while auth isLoading", () => {
    vi.mocked(useAuth).mockReturnValue(
      defaultAuth({ isLoading: true }) as ReturnType<typeof useAuth>
    )

    render(<RegistratiePage />)

    // When loading, the form fields should not be rendered
    expect(screen.queryByLabelText("Voornaam")).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: /account aanmaken/i })).not.toBeInTheDocument()
  })

  it("has link to login page", () => {
    render(<RegistratiePage />)

    const link = screen.getByRole("link", { name: /inloggen/i })
    expect(link).toHaveAttribute("href", "/account/login")
  })
})
