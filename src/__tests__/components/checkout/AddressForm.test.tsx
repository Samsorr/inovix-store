import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AddressForm, EMPTY_ADDRESS, type AddressFormValue } from "@/components/checkout/AddressForm"

function setup(overrides?: Partial<AddressFormValue>) {
  const onChange = vi.fn()
  const value: AddressFormValue = { ...EMPTY_ADDRESS, ...overrides }
  render(<AddressForm value={value} onChange={onChange} />)
  return { onChange }
}

describe("AddressForm", () => {
  it("renders all required Dutch labels", () => {
    setup()
    expect(screen.getByLabelText(/Voornaam/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Achternaam/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Adres/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Postcode/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Stad/)).toBeInTheDocument()
  })

  it("calls onChange when typing into firstName", async () => {
    const { onChange } = setup()
    await userEvent.type(screen.getByLabelText(/Voornaam/), "J")
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ firstName: "J" }))
  })

  it("renders error text when provided", () => {
    const onChange = vi.fn()
    render(
      <AddressForm
        value={EMPTY_ADDRESS}
        onChange={onChange}
        errors={{ firstName: "Voornaam is verplicht" }}
      />
    )
    expect(screen.getByText("Voornaam is verplicht")).toBeInTheDocument()
  })
})
