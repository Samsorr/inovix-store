import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ShippingOptionCard } from "@/components/checkout/ShippingOptionCard"

vi.mock("@/lib/price", () => ({
  formatPrice: (amountInCents: number, currency = "EUR") =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency }).format(
      amountInCents / 100
    ),
}))

describe("ShippingOptionCard", () => {
  it("renders name + price", () => {
    render(
      <ShippingOptionCard
        option={{ id: "so_1", name: "Standaard", amount: 495 }}
        selected={false}
        disabled={false}
        onSelect={() => {}}
      />
    )
    expect(screen.getByText("Standaard")).toBeInTheDocument()
    expect(screen.getByText(/4,95/)).toBeInTheDocument()
  })

  it("renders Gratis when amount is 0", () => {
    render(
      <ShippingOptionCard
        option={{ id: "so_1", name: "Gratis verzending", amount: 0 }}
        selected={false}
        disabled={false}
        onSelect={() => {}}
      />
    )
    expect(screen.getByText("Gratis")).toBeInTheDocument()
  })

  it("renders carrier + ETA when provided", () => {
    render(
      <ShippingOptionCard
        option={{
          id: "so_1",
          name: "Standaard",
          amount: 495,
          carrier: "PostNL",
          deliveryEstimate: "1 tot 2 werkdagen",
          tracked: true,
        }}
        selected={false}
        disabled={false}
        onSelect={() => {}}
      />
    )
    expect(screen.getByText(/PostNL/)).toBeInTheDocument()
    expect(screen.getByText(/1 tot 2 werkdagen/)).toBeInTheDocument()
    expect(screen.getByText(/Track & Trace/)).toBeInTheDocument()
  })

  it("calls onSelect on click", async () => {
    const onSelect = vi.fn()
    render(
      <ShippingOptionCard
        option={{ id: "so_1", name: "Standaard", amount: 495 }}
        selected={false}
        disabled={false}
        onSelect={onSelect}
      />
    )
    await userEvent.click(screen.getByText("Standaard"))
    expect(onSelect).toHaveBeenCalledWith("so_1")
  })
})
