import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { SpecsTable } from "@/components/product/SpecsTable"

describe("SpecsTable", () => {
  it("renders all specs when all values are provided", () => {
    render(
      <SpecsTable
        sequence="GEPPPGKPADDAGLV"
        molecularFormula="C62H98N16O22"
        molecularWeight="1419.53"
        casNumber="137525-51-0"
        purity={98}
        physicalState="Lyophilized powder"
        solubility="Water, DMSO"
        shelfLife="24 months"
      />
    )

    expect(screen.getByText("Sequentie")).toBeInTheDocument()
    expect(screen.getByText("GEPPPGKPADDAGLV")).toBeInTheDocument()
    expect(screen.getByText("Molecuulformule")).toBeInTheDocument()
    expect(screen.getByText("C62H98N16O22")).toBeInTheDocument()
    expect(screen.getByText("Molecuulgewicht")).toBeInTheDocument()
    expect(screen.getByText("1419.53")).toBeInTheDocument()
    expect(screen.getByText("CAS-nummer")).toBeInTheDocument()
    expect(screen.getByText("137525-51-0")).toBeInTheDocument()
    expect(screen.getByText("Zuiverheid")).toBeInTheDocument()
    expect(screen.getByText("Fysieke staat")).toBeInTheDocument()
    expect(screen.getByText("Lyophilized powder")).toBeInTheDocument()
    expect(screen.getByText("Oplosbaarheid")).toBeInTheDocument()
    expect(screen.getByText("Water, DMSO")).toBeInTheDocument()
    expect(screen.getByText("Houdbaarheid")).toBeInTheDocument()
    expect(screen.getByText("24 months")).toBeInTheDocument()
  })

  it("skips rows for undefined values", () => {
    render(<SpecsTable casNumber="137525-51-0" />)

    expect(screen.getByText("CAS-nummer")).toBeInTheDocument()
    expect(screen.getByText("137525-51-0")).toBeInTheDocument()

    // These should not appear
    expect(screen.queryByText("Sequentie")).not.toBeInTheDocument()
    expect(screen.queryByText("Molecuulformule")).not.toBeInTheDocument()
    expect(screen.queryByText("Molecuulgewicht")).not.toBeInTheDocument()
    expect(screen.queryByText("Zuiverheid")).not.toBeInTheDocument()
    expect(screen.queryByText("Fysieke staat")).not.toBeInTheDocument()
    expect(screen.queryByText("Oplosbaarheid")).not.toBeInTheDocument()
    expect(screen.queryByText("Houdbaarheid")).not.toBeInTheDocument()
  })

  it("always shows the RUO application row", () => {
    render(<SpecsTable />)

    expect(screen.getByText("Toepassing")).toBeInTheDocument()
    expect(
      screen.getByText("Uitsluitend voor in-vitro onderzoek (RUO)")
    ).toBeInTheDocument()
  })

  it("formats purity correctly as >=X% (HPLC)", () => {
    render(<SpecsTable purity={98} />)

    expect(screen.getByText("≥98% (HPLC)")).toBeInTheDocument()
  })

  it("renders sequence in monospace font", () => {
    render(<SpecsTable sequence="GEPPPGKPADDAGLV" />)

    const sequenceEl = screen.getByText("GEPPPGKPADDAGLV")
    expect(sequenceEl).toHaveClass("font-mono")
  })

  it("renders purity value in semibold font", () => {
    render(<SpecsTable purity={99} />)

    const purityEl = screen.getByText("≥99% (HPLC)")
    expect(purityEl).toHaveClass("font-semibold")
  })
})
