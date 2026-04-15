import { describe, it, expect, vi, beforeEach } from "vitest"

// We must reset modules before each test because region.ts caches the region ID
// at module scope. A fresh import is needed for each test to get a clean cache.
beforeEach(() => {
  vi.resetModules()
})

async function importRegion() {
  // Each call gets a fresh module with its own cachedRegionId = null
  const mod = await import("@/lib/region")
  return mod.getDefaultRegionId
}

describe("getDefaultRegionId", () => {
  it("returns the first region ID from the API", async () => {
    vi.doMock("@/lib/medusa", () => ({
      default: {
        store: {
          region: {
            list: vi.fn().mockResolvedValue({
              regions: [{ id: "reg_eu" }, { id: "reg_us" }],
            }),
          },
        },
      },
    }))

    const getDefaultRegionId = await importRegion()
    const result = await getDefaultRegionId()

    expect(result).toBe("reg_eu")
  })

  it("throws when the API returns an empty regions array", async () => {
    vi.doMock("@/lib/medusa", () => ({
      default: {
        store: {
          region: {
            list: vi.fn().mockResolvedValue({ regions: [] }),
          },
        },
      },
    }))

    const getDefaultRegionId = await importRegion()

    await expect(getDefaultRegionId()).rejects.toThrow(
      "No regions configured in Medusa"
    )
  })

  it("caches the result and does not call the API again on second call", async () => {
    const listFn = vi.fn().mockResolvedValue({
      regions: [{ id: "reg_cached" }],
    })

    vi.doMock("@/lib/medusa", () => ({
      default: {
        store: {
          region: {
            list: listFn,
          },
        },
      },
    }))

    const getDefaultRegionId = await importRegion()

    const first = await getDefaultRegionId()
    const second = await getDefaultRegionId()

    expect(first).toBe("reg_cached")
    expect(second).toBe("reg_cached")
    expect(listFn).toHaveBeenCalledTimes(1)
  })

  it("propagates API errors to the caller", async () => {
    vi.doMock("@/lib/medusa", () => ({
      default: {
        store: {
          region: {
            list: vi.fn().mockRejectedValue(new Error("Network error")),
          },
        },
      },
    }))

    const getDefaultRegionId = await importRegion()

    await expect(getDefaultRegionId()).rejects.toThrow("Network error")
  })
})
