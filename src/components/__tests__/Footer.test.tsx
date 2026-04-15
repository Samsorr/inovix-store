import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { Footer } from "@/components/Footer"

describe("Footer", () => {
  it("renders Inovix brand name", () => {
    render(<Footer />)

    expect(screen.getByText("INOVIX")).toBeInTheDocument()
  })

  it("renders footer link group titles", () => {
    render(<Footer />)

    expect(screen.getByText("Producten")).toBeInTheDocument()
    expect(screen.getByText("Onderzoek")).toBeInTheDocument()
    expect(screen.getByText("Juridisch")).toBeInTheDocument()
  })

  it("renders product links with correct href values", () => {
    render(<Footer />)

    const peptidenLink = screen.getByText("Peptiden").closest("a")
    expect(peptidenLink).toHaveAttribute("href", "/products")

    const glp1Link = screen.getByText("GLP-1").closest("a")
    expect(glp1Link).toHaveAttribute("href", "/products?category=glp-1")

    const labLink = screen.getByText("Lab Supplies").closest("a")
    expect(labLink).toHaveAttribute("href", "/lab-supplies")
  })

  it("renders research links with correct href values", () => {
    render(<Footer />)

    const kennisbankLink = screen.getByText("Kennisbank").closest("a")
    expect(kennisbankLink).toHaveAttribute("href", "/kennisbank")

    const protocollenLink = screen.getByText("Protocollen").closest("a")
    expect(protocollenLink).toHaveAttribute("href", "/protocollen")

    const coaLink = screen.getByText("Certificaten (CoA)").closest("a")
    expect(coaLink).toHaveAttribute("href", "/coa")
  })

  it("renders legal links with correct href values", () => {
    render(<Footer />)

    const privacyLink = screen.getByText("Privacy Policy").closest("a")
    expect(privacyLink).toHaveAttribute("href", "/privacy")

    const termsLink = screen.getByText("Algemene Voorwaarden").closest("a")
    expect(termsLink).toHaveAttribute("href", "/voorwaarden")

    const complianceLink = screen.getByText("Compliance").closest("a")
    expect(complianceLink).toHaveAttribute("href", "/compliance")
  })

  it("renders the brand description", () => {
    render(<Footer />)

    expect(
      screen.getByText(
        /Premium peptiden voor wetenschappelijk laboratoriumonderzoek/
      )
    ).toBeInTheDocument()
  })

  it("renders the research-use disclaimer", () => {
    render(<Footer />)

    expect(
      screen.getByText(
        /Alle producten zijn uitsluitend bestemd voor in-vitro laboratoriumonderzoek/
      )
    ).toBeInTheDocument()
  })

  it("renders the copyright notice with the current year", () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear().toString()
    expect(
      screen.getByText(new RegExp(`${currentYear} Inovix`))
    ).toBeInTheDocument()
  })
})
