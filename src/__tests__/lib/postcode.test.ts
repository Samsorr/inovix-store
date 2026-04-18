import { describe, it, expect } from "vitest"
import { isValidPostcode, normalizePostcode } from "@/lib/postcode"

describe("isValidPostcode", () => {
  it("accepts NL format with and without space", () => {
    expect(isValidPostcode("1234AB", "nl")).toBe(true)
    expect(isValidPostcode("1234 AB", "nl")).toBe(true)
    expect(isValidPostcode("1234ab", "nl")).toBe(true)
  })

  it("rejects malformed NL postcodes", () => {
    expect(isValidPostcode("1234", "nl")).toBe(false)
    expect(isValidPostcode("12345", "nl")).toBe(false)
    expect(isValidPostcode("ABCD12", "nl")).toBe(false)
  })

  it("accepts BE 4-digit postcode", () => {
    expect(isValidPostcode("1000", "be")).toBe(true)
    expect(isValidPostcode("9999", "be")).toBe(true)
  })

  it("rejects malformed BE postcodes", () => {
    expect(isValidPostcode("100", "be")).toBe(false)
    expect(isValidPostcode("AB12", "be")).toBe(false)
  })

  it("returns false for unsupported countries", () => {
    expect(isValidPostcode("12345", "de")).toBe(false)
  })
})

describe("normalizePostcode", () => {
  it("uppercases and inserts space for NL", () => {
    expect(normalizePostcode("1234ab", "nl")).toBe("1234 AB")
    expect(normalizePostcode("1234 ab", "nl")).toBe("1234 AB")
  })

  it("returns BE postcode unchanged", () => {
    expect(normalizePostcode("1000", "be")).toBe("1000")
  })
})
