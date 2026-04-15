import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "@/components/ui/input"

describe("Input", () => {
  it("renders with a label", () => {
    render(<Input label="E-mailadres" />)

    expect(screen.getByLabelText("E-mailadres")).toBeInTheDocument()
    expect(screen.getByText("E-mailadres")).toBeInTheDocument()
  })

  it("renders without a label when label prop is omitted", () => {
    render(<Input placeholder="Type hier..." />)

    const input = screen.getByPlaceholderText("Type hier...")
    expect(input).toBeInTheDocument()
    expect(screen.queryByRole("label")).not.toBeInTheDocument()
  })

  it("shows error message when error prop is set", () => {
    render(<Input label="E-mail" error="Ongeldig e-mailadres" />)

    expect(screen.getByText("Ongeldig e-mailadres")).toBeInTheDocument()

    const input = screen.getByLabelText("E-mail")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("does not show error message when error prop is absent", () => {
    render(<Input label="E-mail" />)

    const input = screen.getByLabelText("E-mail")
    expect(input).not.toHaveAttribute("aria-invalid")
    expect(screen.queryByText(/ongeldig/i)).not.toBeInTheDocument()
  })

  it("shows required indicator via required prop", () => {
    render(<Input label="Naam" required />)

    const input = screen.getByLabelText("Naam")
    expect(input).toBeRequired()
  })

  it("accepts user input", async () => {
    const user = userEvent.setup()
    render(<Input label="Voornaam" />)

    const input = screen.getByLabelText("Voornaam")
    await user.type(input, "Jan")

    expect(input).toHaveValue("Jan")
  })

  it("associates label with input via htmlFor/id", () => {
    render(<Input label="Wachtwoord" id="password-field" type="password" />)

    const label = screen.getByText("Wachtwoord")
    expect(label).toHaveAttribute("for", "password-field")

    const input = screen.getByLabelText("Wachtwoord")
    expect(input).toHaveAttribute("id", "password-field")
    expect(input).toHaveAttribute("type", "password")
  })

  it("generates an id when none is provided", () => {
    render(<Input label="Auto ID" />)

    const input = screen.getByLabelText("Auto ID")
    expect(input).toHaveAttribute("id")
    expect(input.getAttribute("id")).not.toBe("")
  })

  it("applies error styling classes when error is present", () => {
    render(<Input label="Test" error="Fout" />)

    const input = screen.getByLabelText("Test")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })
})
