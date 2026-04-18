import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SavedAddressPicker, type SavedAddress } from "@/components/checkout/SavedAddressPicker"

const addresses: SavedAddress[] = [
  {
    id: "addr_1",
    first_name: "Jan",
    last_name: "de Vries",
    address_1: "Damrak 1",
    postal_code: "1012 LG",
    city: "Amsterdam",
    country_code: "nl",
    is_default_shipping: true,
  },
  {
    id: "addr_2",
    first_name: "Marieke",
    last_name: "Bakker",
    address_1: "Coolsingel 50",
    postal_code: "3012 AD",
    city: "Rotterdam",
    country_code: "nl",
    is_default_shipping: false,
  },
]

describe("SavedAddressPicker", () => {
  it("renders all saved addresses", () => {
    render(
      <SavedAddressPicker
        addresses={addresses}
        selectedId="addr_1"
        onSelect={() => {}}
        onChooseNew={() => {}}
      />
    )
    expect(screen.getByText(/Jan de Vries/)).toBeInTheDocument()
    expect(screen.getByText(/Marieke Bakker/)).toBeInTheDocument()
    expect(screen.getByText(/Standaard/)).toBeInTheDocument()
  })

  it("calls onSelect when a card is clicked", async () => {
    const onSelect = vi.fn()
    render(
      <SavedAddressPicker
        addresses={addresses}
        selectedId="addr_1"
        onSelect={onSelect}
        onChooseNew={() => {}}
      />
    )
    await userEvent.click(screen.getByText(/Marieke Bakker/))
    expect(onSelect).toHaveBeenCalledWith("addr_2")
  })

  it("calls onChooseNew when Nieuw adres is clicked", async () => {
    const onChooseNew = vi.fn()
    render(
      <SavedAddressPicker
        addresses={addresses}
        selectedId="addr_1"
        onSelect={() => {}}
        onChooseNew={onChooseNew}
      />
    )
    await userEvent.click(screen.getByText(/Nieuw adres/))
    expect(onChooseNew).toHaveBeenCalled()
  })

  it("Standaard badge only renders on the default address", () => {
    render(
      <SavedAddressPicker
        addresses={addresses}
        selectedId={null}
        onSelect={() => {}}
        onChooseNew={() => {}}
      />
    )
    // Only one address is is_default_shipping in the fixture
    expect(screen.getAllByText(/Standaard/)).toHaveLength(1)
  })

  it("renders nothing dangerous when addresses array is empty", () => {
    render(
      <SavedAddressPicker
        addresses={[]}
        selectedId={null}
        onSelect={() => {}}
        onChooseNew={() => {}}
      />
    )
    // Just the "Nieuw adres" tile remains
    expect(screen.getByText(/Nieuw adres/)).toBeInTheDocument()
    expect(screen.queryByText(/Standaard/)).not.toBeInTheDocument()
  })

  it("exposes radiogroup semantics", () => {
    render(
      <SavedAddressPicker
        addresses={addresses}
        selectedId="addr_1"
        onSelect={() => {}}
        onChooseNew={() => {}}
      />
    )
    const group = screen.getByRole("radiogroup")
    expect(group).toBeInTheDocument()
    const radios = screen.getAllByRole("radio")
    expect(radios).toHaveLength(3) // 2 saved + 1 new
    // The selected one should be aria-checked
    const checked = radios.filter((r) => r.getAttribute("aria-checked") === "true")
    expect(checked).toHaveLength(1)
  })
})
