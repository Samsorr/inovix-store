import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { ResearchBanner } from "@/components/ResearchBanner"

describe("ResearchBanner", () => {
  it("renders the disclaimer text", () => {
    render(<ResearchBanner />)

    expect(
      screen.getByText(
        /Alle producten zijn uitsluitend bestemd voor wetenschappelijk laboratoriumonderzoek/
      )
    ).toBeInTheDocument()

    expect(screen.getByText(/Niet voor menselijk gebruik/)).toBeInTheDocument()
  })

  it("contains a flask icon inside an amber background container", () => {
    const { container } = render(<ResearchBanner />)

    const wrapper = container.firstElementChild
    expect(wrapper).toHaveClass("bg-amber-500")

    // FlaskConical renders as an SVG
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})
