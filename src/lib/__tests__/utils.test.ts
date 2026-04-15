import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("")
  })

  it("returns a single class unchanged", () => {
    expect(cn("text-red-500")).toBe("text-red-500")
  })

  it("merges multiple classes together", () => {
    const result = cn("text-red-500", "bg-blue-200")
    expect(result).toBe("text-red-500 bg-blue-200")
  })

  it("resolves conflicting Tailwind classes, keeping the last one", () => {
    const result = cn("p-4", "p-2")
    expect(result).toBe("p-2")
  })

  it("resolves conflicting text color classes", () => {
    const result = cn("text-red-500", "text-blue-500")
    expect(result).toBe("text-blue-500")
  })

  it("filters out false values", () => {
    const result = cn("block", false && "hidden")
    expect(result).toBe("block")
  })

  it("filters out undefined values", () => {
    const result = cn("block", undefined)
    expect(result).toBe("block")
  })

  it("filters out null values", () => {
    const result = cn("block", null)
    expect(result).toBe("block")
  })

  it("handles conditional object syntax", () => {
    // "hidden" and "block" are both display utilities, so hidden wins.
    // Use non-conflicting classes to verify object syntax works.
    const result = cn("px-4", { "mt-2": true, "mb-4": false })
    expect(result).toBe("px-4 mt-2")
  })

  it("handles arrays of classes", () => {
    const result = cn(["px-2", "py-1"])
    expect(result).toBe("px-2 py-1")
  })
})
