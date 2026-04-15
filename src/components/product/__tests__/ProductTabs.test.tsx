import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"

import { ProductTabs } from "@/components/product/ProductTabs"

const tabs = [
  { id: "desc", label: "Beschrijving", content: <p>Product beschrijving tekst</p> },
  { id: "specs", label: "Specificaties", content: <p>Specificatie details</p> },
  { id: "storage", label: "Opslag", content: <p>Opslaginstructies</p> },
]

describe("ProductTabs", () => {
  it("renders all tab labels", () => {
    render(<ProductTabs tabs={tabs} />)

    expect(screen.getByText("Beschrijving")).toBeInTheDocument()
    expect(screen.getByText("Specificaties")).toBeInTheDocument()
    expect(screen.getByText("Opslag")).toBeInTheDocument()
  })

  it("shows the first tab content by default", () => {
    render(<ProductTabs tabs={tabs} />)

    expect(screen.getByText("Product beschrijving tekst")).toBeInTheDocument()
    expect(screen.queryByText("Specificatie details")).not.toBeInTheDocument()
    expect(screen.queryByText("Opslaginstructies")).not.toBeInTheDocument()
  })

  it("switches content when a different tab is clicked", async () => {
    const user = userEvent.setup()
    render(<ProductTabs tabs={tabs} />)

    await user.click(screen.getByText("Specificaties"))

    expect(screen.getByText("Specificatie details")).toBeInTheDocument()
    expect(
      screen.queryByText("Product beschrijving tekst")
    ).not.toBeInTheDocument()
  })

  it("filters out tabs with null or undefined content", () => {
    const tabsWithNulls = [
      { id: "desc", label: "Beschrijving", content: <p>Tekst</p> },
      { id: "empty", label: "Leeg", content: null as unknown as React.ReactNode },
      { id: "undef", label: "Ongedefinieerd", content: undefined as unknown as React.ReactNode },
      { id: "falsy", label: "Vals", content: false as unknown as React.ReactNode },
    ]

    render(<ProductTabs tabs={tabsWithNulls} />)

    expect(screen.getByText("Beschrijving")).toBeInTheDocument()
    expect(screen.queryByText("Leeg")).not.toBeInTheDocument()
    expect(screen.queryByText("Ongedefinieerd")).not.toBeInTheDocument()
    expect(screen.queryByText("Vals")).not.toBeInTheDocument()
  })

  it("returns null when all tabs have no content", () => {
    const emptyTabs = [
      { id: "a", label: "A", content: null as unknown as React.ReactNode },
      { id: "b", label: "B", content: undefined as unknown as React.ReactNode },
    ]

    const { container } = render(<ProductTabs tabs={emptyTabs} />)
    expect(container.innerHTML).toBe("")
  })

  it("has correct ARIA attributes for tablist and tabs", () => {
    render(<ProductTabs tabs={tabs} />)

    expect(screen.getByRole("tablist")).toBeInTheDocument()

    const tabElements = screen.getAllByRole("tab")
    expect(tabElements).toHaveLength(3)

    // First tab should be selected
    expect(tabElements[0]).toHaveAttribute("aria-selected", "true")
    expect(tabElements[1]).toHaveAttribute("aria-selected", "false")
    expect(tabElements[2]).toHaveAttribute("aria-selected", "false")
  })

  it("updates aria-selected when tabs are clicked", async () => {
    const user = userEvent.setup()
    render(<ProductTabs tabs={tabs} />)

    const tabElements = screen.getAllByRole("tab")

    await user.click(tabElements[1])

    expect(tabElements[0]).toHaveAttribute("aria-selected", "false")
    expect(tabElements[1]).toHaveAttribute("aria-selected", "true")
  })

  it("renders tabpanel with correct aria-labelledby", () => {
    render(<ProductTabs tabs={tabs} />)

    const panel = screen.getByRole("tabpanel")
    expect(panel).toHaveAttribute("aria-labelledby", "tab-desc")
    expect(panel).toHaveAttribute("id", "panel-desc")
  })
})
