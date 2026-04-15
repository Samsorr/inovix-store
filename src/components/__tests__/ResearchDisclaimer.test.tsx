import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { ResearchDisclaimer } from "@/components/ResearchDisclaimer"

describe("ResearchDisclaimer", () => {
  it("renders default variant with Info icon and default text", () => {
    render(<ResearchDisclaimer />)

    const note = screen.getByRole("note")
    expect(note).toBeInTheDocument()
    expect(note).toHaveClass("bg-surface-secondary")
    expect(note).toHaveClass("border-l-navy-500")

    expect(
      screen.getByText(
        "Alle producten zijn uitsluitend bestemd voor laboratoriumonderzoek. Niet voor menselijke of veterinaire consumptie."
      )
    ).toBeInTheDocument()
  })

  it("renders warning variant with amber background", () => {
    render(<ResearchDisclaimer variant="warning" />)

    const note = screen.getByRole("note")
    expect(note).toHaveClass("bg-amber-50")
    expect(note).toHaveClass("border-l-amber-500")
  })

  it("renders custom text when provided", () => {
    const customText = "Dit is een aangepaste disclaimer."
    render(<ResearchDisclaimer text={customText} />)

    expect(screen.getByText(customText)).toBeInTheDocument()
    expect(
      screen.queryByText(
        "Alle producten zijn uitsluitend bestemd voor laboratoriumonderzoek. Niet voor menselijke of veterinaire consumptie."
      )
    ).not.toBeInTheDocument()
  })

  it("renders compact mode with smaller padding and text", () => {
    render(<ResearchDisclaimer compact />)

    const note = screen.getByRole("note")
    expect(note).toHaveClass("px-3")
    expect(note).toHaveClass("py-2")

    const text = screen.getByText(
      "Alle producten zijn uitsluitend bestemd voor laboratoriumonderzoek. Niet voor menselijke of veterinaire consumptie."
    )
    expect(text).toHaveClass("text-xs")
  })

  it("renders non-compact mode with larger padding and text by default", () => {
    render(<ResearchDisclaimer />)

    const note = screen.getByRole("note")
    expect(note).toHaveClass("px-4")
    expect(note).toHaveClass("py-3")

    const text = screen.getByText(
      "Alle producten zijn uitsluitend bestemd voor laboratoriumonderzoek. Niet voor menselijke of veterinaire consumptie."
    )
    expect(text).toHaveClass("text-sm")
  })

  it("applies custom className", () => {
    render(<ResearchDisclaimer className="my-custom-class" />)

    const note = screen.getByRole("note")
    expect(note).toHaveClass("my-custom-class")
  })
})
