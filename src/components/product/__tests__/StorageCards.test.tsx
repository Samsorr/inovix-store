import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { StorageCards } from "@/components/product/StorageCards"

describe("StorageCards", () => {
  it("renders storage temperature card when provided", () => {
    render(<StorageCards storageTemp="-20°C" />)

    expect(screen.getByText("-20°C")).toBeInTheDocument()
    expect(screen.getByText("Bewaartemperatuur")).toBeInTheDocument()
  })

  it("renders shelf life card when provided", () => {
    render(<StorageCards shelfLife="24 maanden" />)

    expect(screen.getByText("24 maanden")).toBeInTheDocument()
    expect(screen.getByText("Houdbaarheid")).toBeInTheDocument()
  })

  it("renders solubility card when provided", () => {
    render(<StorageCards solubility="Water, DMSO" />)

    expect(screen.getByText("Water, DMSO")).toBeInTheDocument()
    expect(screen.getByText("Oplosbaarheid")).toBeInTheDocument()
  })

  it("returns null when all props are empty", () => {
    const { container } = render(<StorageCards />)
    expect(container.innerHTML).toBe("")
  })

  it("renders handling notes when provided", () => {
    render(<StorageCards handlingNotes="Bewaar gedroogd bij lage temperatuur." />)

    expect(
      screen.getByText("Bewaar gedroogd bij lage temperatuur.")
    ).toBeInTheDocument()
  })

  it("renders multiple cards at once", () => {
    render(
      <StorageCards
        storageTemp="-20°C"
        shelfLife="24 maanden"
        solubility="Water"
      />
    )

    expect(screen.getByText("-20°C")).toBeInTheDocument()
    expect(screen.getByText("24 maanden")).toBeInTheDocument()
    expect(screen.getByText("Water")).toBeInTheDocument()
  })

  it("renders handling notes alongside cards", () => {
    render(
      <StorageCards
        storageTemp="-20°C"
        handlingNotes="Vermijd direct zonlicht."
      />
    )

    expect(screen.getByText("-20°C")).toBeInTheDocument()
    expect(screen.getByText("Vermijd direct zonlicht.")).toBeInTheDocument()
  })

  it("renders only handling notes when no card values are provided", () => {
    render(<StorageCards handlingNotes="Alleen met handschoenen hanteren." />)

    expect(
      screen.getByText("Alleen met handschoenen hanteren.")
    ).toBeInTheDocument()
    // Card labels should not be present
    expect(screen.queryByText("Bewaartemperatuur")).not.toBeInTheDocument()
    expect(screen.queryByText("Houdbaarheid")).not.toBeInTheDocument()
    expect(screen.queryByText("Oplosbaarheid")).not.toBeInTheDocument()
  })
})
