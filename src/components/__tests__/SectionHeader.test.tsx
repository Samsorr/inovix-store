import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { SectionHeader } from "@/components/SectionHeader"

describe("SectionHeader", () => {
  it("renders title", () => {
    render(<SectionHeader title="Populaire Peptiden" />)

    expect(
      screen.getByRole("heading", { name: "Populaire Peptiden" })
    ).toBeInTheDocument()
  })

  it("renders subtitle when provided", () => {
    render(
      <SectionHeader
        title="Onze Producten"
        subtitle="Bekijk ons aanbod van premium peptiden"
      />
    )

    expect(
      screen.getByText("Bekijk ons aanbod van premium peptiden")
    ).toBeInTheDocument()
  })

  it("does not render subtitle when not provided", () => {
    const { container } = render(<SectionHeader title="Onze Producten" />)

    // The subtitle is a <p> tag inside the header section.
    // When no subtitle is provided, there should be no <p> inside the title div.
    const paragraphs = container.querySelectorAll("p")
    expect(paragraphs.length).toBe(0)
  })

  it("renders action link when provided", () => {
    render(
      <SectionHeader
        title="Producten"
        action={{ label: "Bekijk alles", href: "/products" }}
      />
    )

    const link = screen.getByText("Bekijk alles")
    expect(link).toBeInTheDocument()
    expect(link.closest("a")).toHaveAttribute("href", "/products")
  })

  it("does not render action link when not provided", () => {
    render(<SectionHeader title="Producten" />)

    const links = screen.queryAllByRole("link")
    expect(links.length).toBe(0)
  })

  it("centers text when centered prop is true", () => {
    const { container } = render(
      <SectionHeader title="Gecentreerd" centered />
    )

    const wrapper = container.firstElementChild
    expect(wrapper).toHaveClass("items-center")
    expect(wrapper).toHaveClass("text-center")
  })

  it("does not center text by default", () => {
    const { container } = render(<SectionHeader title="Niet Gecentreerd" />)

    const wrapper = container.firstElementChild
    expect(wrapper).not.toHaveClass("items-center")
    expect(wrapper).not.toHaveClass("text-center")
  })
})
