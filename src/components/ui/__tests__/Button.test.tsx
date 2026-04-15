import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders with children text", () => {
    render(<Button>Klik hier</Button>)

    expect(
      screen.getByRole("button", { name: "Klik hier" })
    ).toBeInTheDocument()
  })

  it("applies primary variant classes by default", () => {
    render(<Button>Primair</Button>)

    const button = screen.getByRole("button", { name: "Primair" })
    expect(button).toHaveClass("bg-teal-400")
    expect(button).toHaveClass("text-white")
  })

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>)

    const button = screen.getByRole("button", { name: "Outline" })
    expect(button).toHaveClass("border")
    expect(button).toHaveClass("border-teal-400")
    expect(button).toHaveClass("text-teal-400")
  })

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>)

    const button = screen.getByRole("button", { name: "Ghost" })
    expect(button).toHaveClass("text-navy-500")
    expect(button).toHaveClass("bg-transparent")
  })

  it("applies primaryOnDark variant classes", () => {
    render(<Button variant="primaryOnDark">On Dark</Button>)

    const button = screen.getByRole("button", { name: "On Dark" })
    expect(button).toHaveClass("text-navy-500")
    expect(button).toHaveClass("bg-white")
  })

  it("applies ghostOnDark variant classes", () => {
    render(<Button variant="ghostOnDark">Ghost Dark</Button>)

    const button = screen.getByRole("button", { name: "Ghost Dark" })
    expect(button).toHaveClass("border-white/30")
    expect(button).toHaveClass("text-white")
  })

  it("applies small size classes", () => {
    render(<Button size="sm">Klein</Button>)

    const button = screen.getByRole("button", { name: "Klein" })
    expect(button).toHaveClass("h-8")
    expect(button).toHaveClass("px-3")
  })

  it("applies medium size classes by default", () => {
    render(<Button>Medium</Button>)

    const button = screen.getByRole("button", { name: "Medium" })
    expect(button).toHaveClass("h-10")
    expect(button).toHaveClass("px-5")
  })

  it("applies large size classes", () => {
    render(<Button size="lg">Groot</Button>)

    const button = screen.getByRole("button", { name: "Groot" })
    expect(button).toHaveClass("h-12")
    expect(button).toHaveClass("px-7")
  })

  it("renders as disabled when disabled prop is set", () => {
    render(<Button disabled>Uitgeschakeld</Button>)

    const button = screen.getByRole("button", { name: "Uitgeschakeld" })
    expect(button).toBeDisabled()
    expect(button).toHaveClass("disabled:opacity-50")
  })

  it("applies fullWidth class when fullWidth prop is true", () => {
    render(<Button fullWidth>Volledig</Button>)

    const button = screen.getByRole("button", { name: "Volledig" })
    expect(button).toHaveClass("w-full")
  })

  it("does not apply fullWidth class by default", () => {
    render(<Button>Normaal</Button>)

    const button = screen.getByRole("button", { name: "Normaal" })
    expect(button).not.toHaveClass("w-full")
  })
})
