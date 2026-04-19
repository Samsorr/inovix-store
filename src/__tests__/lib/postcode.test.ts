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

  it("returns false for unsupported countries", () => {
    expect(isValidPostcode("12345", "de")).toBe(false)
    expect(isValidPostcode("1000", "be")).toBe(false)
  })
})

describe("normalizePostcode", () => {
  it("uppercases and inserts space for NL", () => {
    expect(normalizePostcode("1234ab", "nl")).toBe("1234 AB")
    expect(normalizePostcode("1234 ab", "nl")).toBe("1234 AB")
  })

  it("returns non-NL postcodes unchanged", () => {
    expect(normalizePostcode("10115", "de")).toBe("10115")
  })
})
