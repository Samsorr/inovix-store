import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { Badge } from "@/components/ui/badge"

describe("Badge", () => {
  it("renders text content", () => {
    render(<Badge>Test Badge</Badge>)

    expect(screen.getByText("Test Badge")).toBeInTheDocument()
  })

  it("applies bestSeller variant classes", () => {
    render(<Badge variant="bestSeller">Best Seller</Badge>)

    const badge = screen.getByText("Best Seller")
    expect(badge).toHaveClass("bg-navy-500")
    expect(badge).toHaveClass("text-white")
  })

  it("applies inStock variant classes", () => {
    render(<Badge variant="inStock">Op voorraad</Badge>)

    const badge = screen.getByText("Op voorraad")
    expect(badge).toHaveClass("bg-emerald-50/60")
    expect(badge).toHaveClass("text-emerald-700")
  })

  it("applies outOfStock variant classes", () => {
    render(<Badge variant="outOfStock">Uitverkocht</Badge>)

    const badge = screen.getByText("Uitverkocht")
    expect(badge).toHaveClass("bg-red-50/60")
    expect(badge).toHaveClass("text-red-600")
  })

  it("applies lowStock variant classes", () => {
    render(<Badge variant="lowStock">Beperkt</Badge>)

    const badge = screen.getByText("Beperkt")
    expect(badge).toHaveClass("bg-amber-50/60")
    expect(badge).toHaveClass("text-amber-700")
  })

  it("applies category variant classes by default", () => {
    render(<Badge>Peptiden</Badge>)

    const badge = screen.getByText("Peptiden")
    expect(badge).toHaveClass("bg-navy-50/60")
    expect(badge).toHaveClass("text-navy-400")
  })

  it("applies purity variant classes", () => {
    render(<Badge variant="purity">98%</Badge>)

    const badge = screen.getByText("98%")
    expect(badge).toHaveClass("bg-teal-50/60")
    expect(badge).toHaveClass("text-teal-600")
  })

  it("applies dosage variant classes", () => {
    render(<Badge variant="dosage">5mg</Badge>)

    const badge = screen.getByText("5mg")
    expect(badge).toHaveClass("bg-teal-50/60")
    expect(badge).toHaveClass("text-teal-600")
  })

  it("renders as a span element by default", () => {
    render(<Badge>Span Badge</Badge>)

    const badge = screen.getByText("Span Badge")
    expect(badge.tagName).toBe("SPAN")
  })
})
