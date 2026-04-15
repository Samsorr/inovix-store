import { describe, it, expect } from "vitest"
import { formatPrice, centsToEuros } from "@/lib/price"

// Intl.NumberFormat with nl-NL locale uses a non-breaking space (\u00a0)
// between the currency symbol and the number.
const NBSP = "\u00a0"

describe("formatPrice", () => {
  it("formats 0 cents as zero euros", () => {
    const result = formatPrice(0)
    expect(result).toBe(`\u20AC${NBSP}0,00`)
  })

  it("formats 4999 cents as EUR 49,99", () => {
    const result = formatPrice(4999)
    expect(result).toBe(`\u20AC${NBSP}49,99`)
  })

  it("formats negative amounts with a minus sign", () => {
    const result = formatPrice(-1500)
    expect(result).toContain("15,00")
    expect(result).toContain("\u20AC")
  })

  it("formats non-EUR currency (USD)", () => {
    const result = formatPrice(4999, "USD")
    expect(result).toContain("49,99")
    expect(result).toContain("US$")
  })

  it("formats large amounts correctly", () => {
    const result = formatPrice(1_000_000)
    expect(result).toBe(`\u20AC${NBSP}10.000,00`)
  })

  it("formats 1 cent correctly", () => {
    const result = formatPrice(1)
    expect(result).toBe(`\u20AC${NBSP}0,01`)
  })

  it("defaults to EUR when no currency is provided", () => {
    const result = formatPrice(100)
    expect(result).toContain("\u20AC")
  })
})

describe("centsToEuros", () => {
  it("converts 0 cents to 0 euros", () => {
    expect(centsToEuros(0)).toBe(0)
  })

  it("converts 4999 cents to 49.99 euros", () => {
    expect(centsToEuros(4999)).toBe(49.99)
  })

  it("converts negative cents to negative euros", () => {
    expect(centsToEuros(-500)).toBe(-5)
  })

  it("converts 1 cent to 0.01 euros", () => {
    expect(centsToEuros(1)).toBe(0.01)
  })

  it("converts large amounts correctly", () => {
    expect(centsToEuros(1_000_000)).toBe(10_000)
  })
})
