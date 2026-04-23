import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { TrustBadges } from "@/components/product/TrustBadges"

describe("TrustBadges", () => {
  it("shows purity badge when purity is greater than 0", () => {
    render(<TrustBadges purity={98} />)

    expect(screen.getByText(/98% ZUIVERHEID/)).toBeInTheDocument()
  })

  it("hides purity badge when purity is 0", () => {
    const { container } = render(<TrustBadges purity={0} />)

    expect(screen.queryByText(/ZUIVERHEID/)).not.toBeInTheDocument()
    expect(container.firstChild).toBeNull()
  })

  it("renders nothing when no purity and no badges provided", () => {
    const { container } = render(<TrustBadges />)

    expect(container.firstChild).toBeNull()
  })

  it("renders only requested badges from the badges prop", () => {
    render(<TrustBadges badges={["hplc_tested"]} />)

    expect(screen.getByText("HPLC GETEST")).toBeInTheDocument()
    expect(screen.queryByText("3RD-PARTY VERIFIED")).not.toBeInTheDocument()
    expect(screen.queryByText("EU VERZENDING")).not.toBeInTheDocument()
  })

  it("renders all configured badges when all keys are passed", () => {
    render(
      <TrustBadges
        badges={["hplc_tested", "third_party_verified", "eu_shipping"]}
      />
    )

    expect(screen.getByText("HPLC GETEST")).toBeInTheDocument()
    expect(screen.getByText("3RD-PARTY VERIFIED")).toBeInTheDocument()
    expect(screen.getByText("EU VERZENDING")).toBeInTheDocument()
  })

  it("ignores unknown badge keys", () => {
    const { container } = render(
      // @ts-expect-error intentional invalid key for robustness test
      <TrustBadges badges={["nonexistent"]} />
    )

    expect(container.firstChild).toBeNull()
  })

  it("shows purity together with selected badges", () => {
    const { container } = render(
      <TrustBadges
        purity={99}
        badges={["hplc_tested", "third_party_verified", "eu_shipping"]}
      />
    )

    const badges = container.querySelectorAll("span.flex.items-center")
    expect(badges.length).toBe(4)
  })

  it("applies custom className", () => {
    const { container } = render(
      <TrustBadges purity={99} className="mt-4" />
    )

    expect(container.firstElementChild).toHaveClass("mt-4")
  })
})
