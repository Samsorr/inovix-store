import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { TrustBadges } from "@/components/product/TrustBadges"

describe("TrustBadges", () => {
  it("shows purity badge when purity is greater than 0", () => {
    render(<TrustBadges purity={98} />)

    expect(screen.getByText(/98% ZUIVERHEID/)).toBeInTheDocument()
  })

  it("hides purity badge when purity is 0", () => {
    render(<TrustBadges purity={0} />)

    expect(screen.queryByText(/ZUIVERHEID/)).not.toBeInTheDocument()
  })

  it("hides purity badge when purity is undefined", () => {
    render(<TrustBadges />)

    expect(screen.queryByText(/ZUIVERHEID/)).not.toBeInTheDocument()
  })

  it("always shows HPLC tested badge", () => {
    render(<TrustBadges />)

    expect(screen.getByText("HPLC GETEST")).toBeInTheDocument()
  })

  it("always shows 3rd-party verified badge", () => {
    render(<TrustBadges />)

    expect(screen.getByText("3RD-PARTY VERIFIED")).toBeInTheDocument()
  })

  it("always shows EU shipping badge", () => {
    render(<TrustBadges />)

    expect(screen.getByText("EU VERZENDING")).toBeInTheDocument()
  })

  it("shows all four badges when purity is provided", () => {
    const { container } = render(<TrustBadges purity={99} />)

    // 4 badge spans total
    const badges = container.querySelectorAll("span.flex.items-center")
    expect(badges.length).toBe(4)
  })

  it("shows three badges when purity is not provided", () => {
    const { container } = render(<TrustBadges />)

    const badges = container.querySelectorAll("span.flex.items-center")
    expect(badges.length).toBe(3)
  })

  it("applies custom className", () => {
    const { container } = render(
      <TrustBadges className="mt-4" />
    )

    expect(container.firstElementChild).toHaveClass("mt-4")
  })
})
