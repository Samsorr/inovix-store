import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AddressCard, type SavedAddress } from "@/components/account/AddressCard"

const baseAddress: SavedAddress = {
  id: "addr_1",
  first_name: "Jan",
  last_name: "de Vries",
  address_1: "Damrak 1",
  postal_code: "1012 LG",
  city: "Amsterdam",
  country_code: "nl",
  is_default_shipping: false,
}

describe("AddressCard", () => {
  it("renders address fields", () => {
    render(<AddressCard address={baseAddress} onEdit={() => {}} onDelete={() => {}} onMakeDefault={() => {}} />)
    expect(screen.getByText(/Jan de Vries/)).toBeInTheDocument()
    expect(screen.getByText(/Damrak 1/)).toBeInTheDocument()
  })

  it("shows Standaard badge when default", () => {
    render(<AddressCard address={{ ...baseAddress, is_default_shipping: true }} onEdit={() => {}} onDelete={() => {}} onMakeDefault={() => {}} />)
    expect(screen.getByText(/Standaard/)).toBeInTheDocument()
  })

  it("hides Maak standaard button when already default", () => {
    render(<AddressCard address={{ ...baseAddress, is_default_shipping: true }} onEdit={() => {}} onDelete={() => {}} onMakeDefault={() => {}} />)
    expect(screen.queryByText(/Maak standaard/)).not.toBeInTheDocument()
  })

  it("calls onEdit when Bewerken clicked", async () => {
    const onEdit = vi.fn()
    render(<AddressCard address={baseAddress} onEdit={onEdit} onDelete={() => {}} onMakeDefault={() => {}} />)
    await userEvent.click(screen.getByText(/Bewerken/))
    expect(onEdit).toHaveBeenCalled()
  })
})
