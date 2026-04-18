import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { EditAddressModal } from "@/components/account/EditAddressModal"
import type { SavedAddress } from "@/components/account/AddressCard"

vi.mock("@/lib/medusa", () => ({
  default: {
    store: {
      customer: {
        updateAddress: vi.fn().mockResolvedValue({ customer: {} }),
      },
    },
  },
}))

const baseAddress: SavedAddress = {
  id: "addr_1",
  first_name: "Jan",
  last_name: "de Vries",
  address_1: "Damrak 1",
  postal_code: "1012 LG",
  city: "Amsterdam",
  country_code: "nl",
  phone: "",
  is_default_shipping: false,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("EditAddressModal", () => {
  it("calls onSaved after successful updateAddress", async () => {
    const onSaved = vi.fn()
    const onClose = vi.fn()
    render(<EditAddressModal address={baseAddress} onClose={onClose} onSaved={onSaved} />)

    await userEvent.click(screen.getByText("Opslaan"))

    await waitFor(() => expect(onSaved).toHaveBeenCalled(), { timeout: 2000 })
  })

  it("closes on Escape key", async () => {
    const onClose = vi.fn()
    render(<EditAddressModal address={baseAddress} onClose={onClose} onSaved={() => {}} />)
    await userEvent.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalled()
  })
})
