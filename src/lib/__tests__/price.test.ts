import { describe, it, expect } from "vitest"
import { formatPrice, centsToEuros } from "@/lib/price"

// Intl.NumberFormat with nl-NL locale uses a non-breaking space (\u00a0)
// between the currency symbol and the number.
const NBSP = "\u00a0"

describe("formatPrice", () => {
  it("formats 0 as zero euros", () => {
    const result = formatPrice(0)
    expect(result).toBe(`\u20AC${NBSP}0,00`)
  })

  it("formats 49.99 as EUR 49,99", () => {
    const result = formatPrice(49.99)
    expect(result).toBe(`\u20AC${NBSP}49,99`)
  })

  it("formats negative amounts with a minus sign", () => {
    const result = formatPrice(-15)
    expect(result).toContain("15,00")
    expect(result).toContain("\u20AC")
  })

  it("formats non-EUR currency (USD)", () => {
    const result = formatPrice(49.99, "USD")
    expect(result).toContain("49,99")
    expect(result).toContain("US$")
  })

  it("formats large amounts correctly", () => {
    const result = formatPrice(10_000)
    expect(result).toBe(`\u20AC${NBSP}10.000,00`)
  })

  it("formats 0.01 correctly", () => {
    const result = formatPrice(0.01)
    expect(result).toBe(`\u20AC${NBSP}0,01`)
  })

  it("defaults to EUR when no currency is provided", () => {
    const result = formatPrice(1)
    expect(result).toContain("\u20AC")
  })
})

describe("centsToEuros", () => {
  it("returns 0 unchanged", () => {
    expect(centsToEuros(0)).toBe(0)
  })

  it("returns positive amounts unchanged", () => {
    expect(centsToEuros(49.99)).toBe(49.99)
  })

  it("returns negative amounts unchanged", () => {
    expect(centsToEuros(-5)).toBe(-5)
  })

  it("returns small amounts unchanged", () => {
    expect(centsToEuros(0.01)).toBe(0.01)
  })

  it("returns large amounts unchanged", () => {
    expect(centsToEuros(10_000)).toBe(10_000)
  })
})
