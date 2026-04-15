import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"

import WachtwoordVergetenPage from "../page"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/medusa", () => ({
  default: {
    auth: {
      resetPassword: vi.fn().mockResolvedValue(undefined),
    },
  },
}))

// We need the reference to assert on it
import medusa from "@/lib/medusa"

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("WachtwoordVergetenPage", () => {
  it("renders form with email input", () => {
    render(<WachtwoordVergetenPage />)

    expect(screen.getByText("Wachtwoord vergeten")).toBeInTheDocument()
    expect(screen.getByLabelText("E-mailadres")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /herstelmail verzenden/i })
    ).toBeInTheDocument()
  })

  it("shows error when submitting empty email", async () => {
    const user = userEvent.setup()
    render(<WachtwoordVergetenPage />)

    await user.click(
      screen.getByRole("button", { name: /herstelmail verzenden/i })
    )

    expect(screen.getByText("E-mailadres is verplicht")).toBeInTheDocument()
    expect(medusa.auth.resetPassword).not.toHaveBeenCalled()
  })

  it("calls medusa.auth.resetPassword on submit", async () => {
    const user = userEvent.setup()
    render(<WachtwoordVergetenPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "test@example.com")
    await user.click(
      screen.getByRole("button", { name: /herstelmail verzenden/i })
    )

    await waitFor(() => {
      expect(medusa.auth.resetPassword).toHaveBeenCalledWith(
        "customer",
        "emailpass",
        { identifier: "test@example.com" }
      )
    })
  })

  it("always shows success message even on API failure (anti-enumeration)", async () => {
    vi.mocked(medusa.auth.resetPassword).mockRejectedValue(
      new Error("Not found")
    )
    const user = userEvent.setup()
    render(<WachtwoordVergetenPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "nonexistent@example.com")
    await user.click(
      screen.getByRole("button", { name: /herstelmail verzenden/i })
    )

    await waitFor(() => {
      expect(screen.getByText("E-mail verzonden")).toBeInTheDocument()
    })
  })

  it("shows submitted state with correct email", async () => {
    const user = userEvent.setup()
    render(<WachtwoordVergetenPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "test@example.com")
    await user.click(
      screen.getByRole("button", { name: /herstelmail verzenden/i })
    )

    await waitFor(() => {
      expect(screen.getByText("E-mail verzonden")).toBeInTheDocument()
      expect(screen.getByText("test@example.com")).toBeInTheDocument()
    })
  })

  it("shows success message on successful API call", async () => {
    vi.mocked(medusa.auth.resetPassword).mockResolvedValue(undefined as never)
    const user = userEvent.setup()
    render(<WachtwoordVergetenPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "test@example.com")
    await user.click(
      screen.getByRole("button", { name: /herstelmail verzenden/i })
    )

    await waitFor(() => {
      expect(screen.getByText("E-mail verzonden")).toBeInTheDocument()
    })
  })

  it("has link back to login on initial form", () => {
    render(<WachtwoordVergetenPage />)

    const link = screen.getByRole("link", { name: /terug naar inloggen/i })
    expect(link).toHaveAttribute("href", "/account/login")
  })

  it("has link back to login on submitted state", async () => {
    const user = userEvent.setup()
    render(<WachtwoordVergetenPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "test@example.com")
    await user.click(
      screen.getByRole("button", { name: /herstelmail verzenden/i })
    )

    await waitFor(() => {
      expect(screen.getByText("E-mail verzonden")).toBeInTheDocument()
    })

    const link = screen.getByRole("link", { name: /terug naar inloggen/i })
    expect(link).toHaveAttribute("href", "/account/login")
  })

  it("trims email whitespace before submitting", async () => {
    const user = userEvent.setup()
    render(<WachtwoordVergetenPage />)

    await user.type(screen.getByLabelText("E-mailadres"), "  test@example.com  ")
    await user.click(
      screen.getByRole("button", { name: /herstelmail verzenden/i })
    )

    await waitFor(() => {
      expect(medusa.auth.resetPassword).toHaveBeenCalledWith(
        "customer",
        "emailpass",
        { identifier: "test@example.com" }
      )
    })
  })
})
